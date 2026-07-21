import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { query as dbQuery } from '../config/database';
import { prisma } from '../config/prisma';
import { uploadImageDetailed } from '../config/cloudinary';
import { buildCloudinaryFolder } from '../utils/cloudinaryFolder';
import { obtenerItemizadoMandanteActivo } from '../services/configuracionCamposRegistro.service';
import { calcularCamposRegistroTerreno, CalcRegistroResult, TramoHolgura } from '../utils/calculosRegistroTerreno';
import { getTramosHolguraObra } from '../services/factorHolgura.service';
import { validarTipoRegistroPermitidoPorObra } from '../helpers/tiposRegistro';

const DEV = process.env.NODE_ENV !== 'production';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function normalize(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[°ºª]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cellStr(value: ExcelJS.CellValue): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    const obj = value as unknown as Record<string, unknown>;
    if ('error' in obj) return null;
    if ('richText' in obj) {
      return (obj.richText as { text: string }[]).map(r => r.text).join('').trim() || null;
    }
    if ('formula' in obj || 'sharedFormula' in obj) {
      return obj.result != null ? String(obj.result).trim() || null : null;
    }
    if ('hyperlink' in obj) {
      return obj.text != null ? String(obj.text).trim() || null : null;
    }
  }
  return String(value).trim() || null;
}

function getCell(row: Record<string, unknown>, ...candidates: string[]): string | null {
  const targets = candidates.map(normalize);
  for (const key of Object.keys(row)) {
    if (targets.includes(normalize(key))) {
      const v = row[key];
      if (v !== null && v !== undefined) {
        const s = String(v).trim();
        if (s) return s;
      }
    }
  }
  return null;
}

/** Trunca un string para que quepa en una columna VarChar(N). */
function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str;
}

/** Convierte un valor a entero seguro (0 si NaN). */
function toInt(value: number): number {
  return Number.isFinite(value) ? Math.trunc(value) : 0;
}

/** Convierte un valor a float seguro (null si NaN/null). */
function toFloatOrNull(value: number | null): number | null {
  return value !== null && Number.isFinite(value) ? value : null;
}

/**
 * Parsea valores decimales con formatos comunes en español:
 *   "12,78"     → 12.78
 *   "2,15"      → 2.15
 *   "1.234,56"  → 1234.56     (punto = miles, coma = decimal)
 *   "1,234.56"  → 1234.56     (coma = miles, punto = decimal)
 *   "1234.56"   → 1234.56
 *   ""/null     → null
 */
function parseDecimal(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const str = String(value).trim();
  if (!str) return null;

  const hasDot = str.includes('.');
  const hasComma = str.includes(',');

  let normalized: string;
  if (hasDot && hasComma) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      normalized = str.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = str.replace(/,/g, '');
    }
  } else if (hasComma) {
    normalized = str.replace(',', '.');
  } else {
    normalized = str;
  }

  normalized = normalized.replace(/\s/g, '');
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Normaliza un valor de "Eje Numérico" para guardarlo como texto.
 * Acepta enteros ("8"), rangos ("8-9", "10-11") y guiones en
 * cualquier variante tipográfica. Devuelve "0" si el valor está vacío.
 */
function parseEjeNumericoTexto(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '0';
  return raw
    .replace(/\s+/g, '')
    .replace(/[–—]/g, '-');
}

const NA_VALUE_RE = /^(no\s+aplica|n\/?a|-+)$/i;
function nullIfNA(v: string | null): string | null {
  return v !== null && NA_VALUE_RE.test(v.trim()) ? null : v;
}

/**
 * Parsea una fecha proveniente de una celda Excel (ya convertida a string
 * por `cellStr`). Acepta ISO ("2025-09-15T00:00:00.000Z"), "DD-MM-YYYY"
 * y "DD/MM/YYYY". Se ancla al mediodía UTC para evitar off-by-one al
 * persistir en columnas `@db.Date`.
 */
function parseFecha(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) {
    return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12));
  }

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
  if (dmy) {
    return new Date(Date.UTC(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]), 12));
  }

  return null;
}

const KNOWN_HEADER_KEYS = [
  'itemizado',
  'recinto',
  'piso',
  'eje',
  'sello',
  'sellador',
  'descripcion',
  'longitud',
  'cantidad',
  'obra',
];

/**
 * Busca el nombre de la obra en cualquier celda con patrón "Obra: <nombre>"
 * dentro de las primeras `maxRow` filas de la hoja.
 */
function extractObraFromHeader(worksheet: ExcelJS.Worksheet, maxRow: number): string | null {
  const lastRowNum = worksheet.lastRow?.number ?? 1;
  const limit = Math.min(maxRow, lastRowNum);
  for (let r = 1; r <= limit; r++) {
    const row = worksheet.getRow(r);
    let found: string | null = null;
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (found) return;
      const text = cellStr(cell.value);
      if (!text) return;
      const m = text.match(/obra\s*:\s*(.+)/i);
      if (m) {
        const candidate = m[1].trim();
        if (candidate) found = candidate;
      }
    });
    if (found) return found;
  }
  return null;
}

/**
 * Detecta la fila de encabezados de columna buscando ≥3 nombres conocidos.
 * Ignora celdas que contengan ":" (probablemente banners tipo "Obra: X").
 * Si no encuentra, retorna 1 para mantener el comportamiento previo.
 */
function findHeaderRow(worksheet: ExcelJS.Worksheet, maxScan: number): number {
  const lastRowNum = worksheet.lastRow?.number ?? 1;
  const limit = Math.min(maxScan, lastRowNum);
  for (let r = 1; r <= limit; r++) {
    const row = worksheet.getRow(r);
    const matched = new Set<string>();
    row.eachCell({ includeEmpty: false }, (cell) => {
      const text = cellStr(cell.value);
      if (!text) return;
      if (text.includes(':')) return;
      const norm = normalize(text);
      for (const key of KNOWN_HEADER_KEYS) {
        if (norm === key || norm.includes(key)) {
          matched.add(key);
        }
      }
    });
    if (matched.size >= 3) return r;
  }
  return 1;
}

/**
 * POST /api/registros/importar
 * Importa registros desde un archivo Excel con hojas:
 *   - "SELLOS CORTAFUEGOS" → tipo sello_cortafuego
 *   - "Junta Lineal ESPUMA" → tipo junta_lineal_espuma
 * Las imágenes embebidas en cada fila se suben a Cloudinary.
 */
export const importarRegistrosExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      res.status(500).json({ success: false, error: 'Cloudinary no configurado' });
      return;
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: 'Debe subir un archivo Excel (.xlsx)' });
      return;
    }

    if (DEV) console.log('[importar] archivo:', file.originalname, `(${file.size} bytes)`);

    const usuario_id = req.userId;
    if (!usuario_id) {
      res.status(400).json({ error: 'Usuario no identificado' });
      return;
    }

    const userCheck = await dbQuery<{ id: string }>('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (userCheck.rows.length === 0) {
      res.status(400).json({ error: 'Usuario importador no encontrado' });
      return;
    }

    const obrasRes = await dbQuery<{ id: string; nombre: string; codigo: string | null }>('SELECT id, nombre, codigo FROM obras');
    const obrasByName = new Map<string, { id: string; codigo: string | null }>();
    const obrasById = new Map<string, { id: string; codigo: string | null }>();
    for (const o of obrasRes.rows) {
      const obraRef = { id: o.id, codigo: o.codigo };
      obrasByName.set(normalize(o.nombre), obraRef);
      obrasById.set(o.id, obraRef);
    }
    const resolveObraIdByName = (nombre: string): string | null =>
      obrasByName.get(normalize(nombre))?.id ?? null;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer as unknown as ArrayBuffer);

    if (DEV) console.log('[importar] hojas detectadas:', workbook.worksheets.map(w => w.name));

    const resultados: { hoja: string; insertados: number; duplicadosOmitidos: number; errores: string[]; advertencias: string[] }[] = [];
    let totalInsertados = 0;
    let totalDuplicados = 0;

    for (const worksheet of workbook.worksheets) {
      const sheetName = worksheet.name;
      const sheetNorm = normalize(sheetName);

      let tipoRegistro: 'sello_cortafuego' | 'junta_lineal_espuma' | null = null;
      if (sheetNorm.includes('sellos') && (sheetNorm.includes('cortafuego') || sheetNorm.includes('cortafuegos'))) {
        tipoRegistro = 'sello_cortafuego';
      } else if (sheetNorm.includes('junta') || sheetNorm.includes('espuma')) {
        tipoRegistro = 'junta_lineal_espuma';
      }
      if (!tipoRegistro) continue;

      const sheetObraNombre = extractObraFromHeader(worksheet, 10);
      let sheetObraId: string | null = null;
      if (sheetObraNombre) {
        sheetObraId = resolveObraIdByName(sheetObraNombre);
        if (!sheetObraId) {
          res.status(400).json({
            success: false,
            error: `No existe la obra '${sheetObraNombre}'. Debe crearla antes de importar.`,
          });
          return;
        }
        if (DEV) console.log(`[importar] hoja "${sheetName}": obra "${sheetObraNombre}" → ${sheetObraId}`);
      }

      const headerRowNum = findHeaderRow(worksheet, 15);
      if (DEV) console.log(`[importar] hoja "${sheetName}": fila de encabezados = ${headerRowNum}`);

      const headerRow = worksheet.getRow(headerRowNum);
      const headers: string[] = [];
      headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        headers[colNumber - 1] = cellStr(cell.value) ?? '';
      });

      const hasObraColumn = headers.some(h => normalize(h) === 'obra');

      if (!sheetObraId && !hasObraColumn) {
        res.status(400).json({
          success: false,
          error: "No se detectó obra en el Excel. Agregue una celda con 'Obra: Nombre de obra'.",
        });
        return;
      }

      const sheetImages = worksheet.getImages();
      if (DEV) console.log(`[importar] hoja "${sheetName}": ${sheetImages.length} imagen(es) detectadas`);

      const imagesByNativeRow = new Map<number, number[]>();
      for (const img of sheetImages) {
        const imageId = parseInt(img.imageId, 10);
        const tl = img.range?.tl as { nativeRow?: number; row?: number } | undefined;
        const nativeRow = tl?.nativeRow ?? tl?.row;
        if (nativeRow == null) continue;

        if (DEV) {
          const mediaArr = workbook.model.media as (ExcelJS.Media | undefined)[];
          const m = mediaArr[imageId];
          console.log(
            `[importar]   imageId=${imageId} nativeRow=${nativeRow}` +
            ` ext=${m?.extension ?? '?'} type=${m?.type ?? '?'} bufSize=${m?.buffer?.byteLength ?? 0}`
          );
        }

        const list = imagesByNativeRow.get(nativeRow) ?? [];
        list.push(imageId);
        imagesByNativeRow.set(nativeRow, list);
      }

      const errores: string[] = [];
      const advertencias: string[] = [];
      let insertados = 0;
      let duplicados = 0;

      const validacionTipoCache = new Map<string, { permitido: boolean; warning?: string; error?: string }>();
      const warningsEmitidos = new Set<string>();
      const tramosHolguraCache = new Map<string, TramoHolgura[]>();

      const lastRowNum = worksheet.lastRow?.number ?? 1;
      if (DEV) console.log(`[importar] hoja "${sheetName}": filas de datos = ${Math.max(0, lastRowNum - headerRowNum)}`);

      for (let rowIdx = headerRowNum + 1; rowIdx <= lastRowNum; rowIdx++) {
        try {
          const row = worksheet.getRow(rowIdx);
          const rowObj: Record<string, unknown> = {};
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const key = headers[colNumber - 1];
            if (key) rowObj[key] = cellStr(cell.value);
          });

          let fecha: Date = new Date();
          let dia_semana: string = DIAS[fecha.getDay()];

          let descripcion_material: string;
          let modulo: string;
          let piso: string;
          let eje_alfabetico: string;
          let eje_numerico: string;
          let numero_sello: string;
          let cantidad_sellos: number;
          let nombre_sellador: string;
          let metros_lineales: number | null = null;
          let observaciones: string | null = null;
          let itemizadoSacyr: string | null = null;
          let codigoBeck: string | null = null;
          let itemizadoMandanteId: string | null = null;
          let accesibilidad: number | null = null;
          let aislacion_raw: string | null = null;
          let reparacion_tabique_raw: string | null = null;
          let recinto: string | null = null;
          let itemizadoBeck: string | null = null;
          let itemizadoMandanteTexto: string | null = null;
          let folio: string | null = null;
          let holgura: number = 1.0;

          if (tipoRegistro === 'sello_cortafuego') {
            const fechaRaw = getCell(
              rowObj,
              'Fecha ejecucion sello', 'Fecha Ejecucion Sello', 'Fecha ejecución sello',
              'FECHA EJECUCION SELLO', 'Fecha ejecucion', 'Fecha ejecución', 'Fecha',
            );
            const fechaParsed = parseFecha(fechaRaw);
            if (fechaParsed) fecha = fechaParsed;
            const diaRaw = getCell(rowObj, 'Día', 'Dia', 'DIA', 'DÍA');
            dia_semana = diaRaw && diaRaw.trim() ? diaRaw.trim() : DIAS[fecha.getDay()];

            codigoBeck =
              getCell(rowObj, 'Código BECK', 'Codigo BECK', 'CODIGO BECK', 'CÓDIGO BECK') ?? null;
            itemizadoBeck =
              getCell(rowObj, 'Itemizado BECK', 'Itemizado Beck', 'ITEMIZADO BECK', 'Itemizado') ?? null;
            descripcion_material = itemizadoBeck ?? '';
            itemizadoSacyr =
              getCell(rowObj, 'Itemizado SACYR', 'Itemizado Sacyr', 'ITEMIZADO SACYR') ?? null;
            const itemizadoMandanteTextoRaw =
              getCell(rowObj, 'Itemizado Mandante', 'Itemizado mandante', 'ITEMIZADO MANDANTE') ?? null;
            itemizadoMandanteTexto = itemizadoMandanteTextoRaw ?? itemizadoSacyr ?? null;
            itemizadoMandanteId =
              getCell(rowObj, 'Itemizado Mandante ID', 'itemizadoMandanteId', 'itemizado_mandante_id') ?? null;

            recinto = nullIfNA(getCell(rowObj, 'Recinto', 'RECINTO'));
            modulo =
              nullIfNA(getCell(rowObj, 'Módulo o edificio', 'Modulo o edificio', 'MODULO O EDIFICIO')) ??
              getCell(rowObj, 'Recinto', 'RECINTO') ??
              '';
            piso = getCell(rowObj, 'Piso', 'PISO') ?? '';
            eje_alfabetico =
              getCell(rowObj, 'Eje Alfabético', 'Eje Alfabetico', 'EJE ALFABETICO', 'Eje alfabetico') ?? 'N/A';
            eje_numerico = parseEjeNumericoTexto(
              getCell(rowObj, 'Eje Numérico', 'Eje Numerico', 'EJE NUMERICO', 'Eje numerico'),
            );

            folio = nullIfNA(getCell(rowObj, 'FOLIO', 'Folio', 'folio', 'Nº FOLIO', 'N° FOLIO'));
            numero_sello =
              getCell(rowObj, 'N° DEL SELLO', 'N DEL SELLO', 'N° del Sello', 'Numero Sello', 'NUMERO SELLO', 'Nro Sello') ??
              folio ??
              `S-${rowIdx}`;
            cantidad_sellos = Number(
              getCell(rowObj, 'Cantidad de Sellos', 'CANTIDAD DE SELLOS', 'Cantidad Sellos', 'Cantidad') ?? 0,
            );
            const holguraRaw =
              getCell(rowObj, 'Holgura (cm)', 'Holgura', 'HOLGURA (CM)', 'HOLGURA');
            holgura = parseDecimal(holguraRaw) ?? 1.0;

            nombre_sellador =
              getCell(rowObj, 'Nombre sellador', 'Nombre Sellador', 'NOMBRE SELLADOR', 'Sellador') ?? '';
            observaciones =
              nullIfNA(getCell(rowObj, 'Observaciones', 'OBSERVACIONES', 'observaciones', 'Obs')) ?? null;
          } else {
            codigoBeck =
              getCell(rowObj, 'Código BECK', 'Codigo BECK', 'CODIGO BECK', 'CÓDIGO BECK') ?? null;
            itemizadoMandanteId =
              getCell(rowObj, 'Itemizado Mandante ID', 'itemizadoMandanteId', 'itemizado_mandante_id') ?? null;
            descripcion_material =
              getCell(rowObj, 'Descripción', 'Descripcion', 'DESCRIPCION', 'DESCRIPCIÓN', 'Descripcion material') ?? '';
            modulo = getCell(rowObj, 'Recinto', 'RECINTO') ?? '';
            piso = getCell(rowObj, 'Piso', 'PISO') ?? '';
            eje_alfabetico =
              getCell(rowObj, 'Eje Alfabético', 'Eje Alfabetico', 'EJE ALFABETICO', 'Eje alfabetico') ?? 'N/A';
            eje_numerico = parseEjeNumericoTexto(
              getCell(rowObj, 'Eje Numérico', 'Eje Numerico', 'EJE NUMERICO', 'Eje numerico')
            );

            folio = nullIfNA(getCell(rowObj, 'FOLIO', 'Folio', 'folio', 'Nº FOLIO', 'N° FOLIO'));
            numero_sello = folio ?? `JLE-${rowIdx}`;

            const fechaRaw = getCell(
              rowObj,
              'Fecha ejecucion sello',
              'Fecha Ejecucion Sello',
              'Fecha ejecución sello',
              'FECHA EJECUCION SELLO',
              'Fecha ejecucion',
              'Fecha ejecución',
              'Fecha'
            );
            const fechaParsed = parseFecha(fechaRaw);
            if (fechaParsed) {
              fecha = fechaParsed;
            }
            const diaRaw = getCell(rowObj, 'Día', 'Dia', 'DIA', 'DÍA');
            dia_semana = diaRaw && diaRaw.trim() ? diaRaw.trim() : DIAS[fecha.getDay()];

            const longitudRaw = getCell(
              rowObj,
              'Longitud (m)',
              'Longitud(m)',
              'LONGITUD (M)',
              'Longitud',
              'Longitud m',
              'Metros Lineales',
              'METROS LINEALES'
            );
            if (longitudRaw === null || longitudRaw === '') {
              metros_lineales = null;
              errores.push(`Fila ${rowIdx}: advertencia – Longitud (m) vacía, se guardará como NULL`);
            } else {
              const parsed = parseDecimal(longitudRaw);
              if (parsed === null) {
                metros_lineales = null;
                errores.push(`Fila ${rowIdx}: advertencia – Longitud (m) inválida ('${longitudRaw}'), se guardará como NULL`);
              } else {
                metros_lineales = parsed;
              }
            }

            cantidad_sellos = 0;
            nombre_sellador =
              getCell(rowObj, 'Nombre sellador', 'Nombre Sellador', 'NOMBRE SELLADOR', 'Sellador') ?? '';
            observaciones =
              getCell(rowObj, 'Observaciones', 'OBSERVACIONES', 'observaciones', 'Obs') ?? null;
          }

          const accesibilidadParsed = parseDecimal(getCell(rowObj, 'Accesibilidad', 'Cielo modular', 'cielo_modular', 'cieloModular'));
          accesibilidad = accesibilidadParsed === null ? null : Math.trunc(accesibilidadParsed);
          aislacion_raw = getCell(rowObj, 'Aislación', 'Aislacion', 'aislacion');
          reparacion_tabique_raw = getCell(rowObj, 'Reparación tabique', 'Reparacion tabique', 'Reparación de tabique', 'Reparacion de tabique', 'reparacion_tabique', 'reparacionTabique');

          if (!descripcion_material && !nombre_sellador) continue;

          if (!descripcion_material) {
            errores.push(`Fila ${rowIdx}: falta descripción del material`);
            continue;
          }
          if (!nombre_sellador) {
            errores.push(`Fila ${rowIdx}: falta nombre del sellador`);
            continue;
          }

          let rowObraId: string | null = sheetObraId;
          const rowObraName = getCell(rowObj, 'Obra', 'OBRA', 'obra', 'Nombre Obra', 'Nombre de Obra');
          if (rowObraName) {
            const resolved = resolveObraIdByName(rowObraName);
            if (!resolved) {
              errores.push(`Fila ${rowIdx}: No existe la obra '${rowObraName}'. Debe crearla antes de importar.`);
              continue;
            }
            rowObraId = resolved;
          }
          if (!rowObraId) {
            errores.push(`Fila ${rowIdx}: No se pudo determinar la obra (sin banner ni columna 'Obra' con valor).`);
            continue;
          }

          const cacheKey = `${rowObraId}:${tipoRegistro}`;
          let validacionCacheada = validacionTipoCache.get(cacheKey);
          if (!validacionCacheada) {
            const validResult = await validarTipoRegistroPermitidoPorObra(rowObraId, tipoRegistro);
            validacionCacheada = { permitido: validResult.permitido, warning: validResult.warning, error: validResult.error };
            validacionTipoCache.set(cacheKey, validacionCacheada);
          }
          if (!validacionCacheada.permitido) {
            errores.push(`Fila ${rowIdx}: ${validacionCacheada.error ?? 'Tipo de registro no permitido para esta obra.'}`);
            continue;
          }
          if (validacionCacheada.warning && !warningsEmitidos.has(cacheKey)) {
            advertencias.push(validacionCacheada.warning);
            warningsEmitidos.add(cacheKey);
          }

          const metrosFinal = toFloatOrNull(metros_lineales);
          let itemizadoMandanteIdFinal: string | null = null;
          let codigoBeckFinal = codigoBeck && codigoBeck.trim() ? codigoBeck.trim() : null;

          if (itemizadoMandanteId && itemizadoMandanteId.trim()) {
            const itemizadoMandante = await obtenerItemizadoMandanteActivo(itemizadoMandanteId.trim());
            if (!itemizadoMandante) {
              errores.push(`Fila ${rowIdx}: Itemizado Mandante inválido o inactivo`);
              continue;
            }
            itemizadoMandanteIdFinal = itemizadoMandante.id;
            codigoBeckFinal = itemizadoMandante.codigoBeck;
          }

          let tramosHolgura = tramosHolguraCache.get(cacheKey);
          if (!tramosHolgura) {
            tramosHolgura = await getTramosHolguraObra(rowObraId, tipoRegistro);
            tramosHolguraCache.set(cacheKey, tramosHolgura);
          }

          let calcResult!: CalcRegistroResult;
          try {
            calcResult = calcularCamposRegistroTerreno({
              cantidad_sellos: toInt(cantidad_sellos),
              holgura,
              accesibilidad: accesibilidad ?? 1,
              aislacion: aislacion_raw,
              reparacion_tabique: reparacion_tabique_raw,
              piso,
              tipoRegistro,
              tramosHolgura,
            });
          } catch (err) {
            if (err instanceof Error && err.message === 'CORREGIR HOLGURA') {
              errores.push(`Fila ${rowIdx}: CORREGIR HOLGURA (holgura = ${holgura})`);
              continue;
            }
            throw err;
          }

          const existente = await prisma.registroTerreno.findFirst({
            where: {
              obraId: rowObraId,
              tipoRegistro,
              fecha,
              piso: truncate(piso || 'Sin piso', 50),
              ejeAlfabetico: truncate(eje_alfabetico || 'N/A', 10),
              ejeNumerico: truncate(eje_numerico, 50),
              numeroSello: truncate(numero_sello, 100),
              descripcionMaterial: truncate(descripcion_material, 500),
              ...(tipoRegistro === 'junta_lineal_espuma' && metrosFinal !== null
                ? { metrosLineales: metrosFinal }
                : {}),
            },
            select: { id: true },
          });
          if (existente) {
            advertencias.push(`Registro duplicado omitido fila ${rowIdx}`);
            duplicados++;
            continue;
          }

          const registro = await prisma.registroTerreno.create({
            data: {
              obraId: rowObraId,
              usuarioId: usuario_id,
              fecha,
              diaSemana: truncate(dia_semana ?? '', 20),
              descripcionMaterial: truncate(descripcion_material, 500),
              modulo: truncate(modulo || 'Sin recinto', 100),
              recinto: recinto ? truncate(recinto, 100) : null,
              piso: truncate(piso || 'Sin piso', 50),
              ejeNumerico: truncate(eje_numerico, 50),
              ejeAlfabetico: truncate(eje_alfabetico || 'N/A', 10),
              numeroSello: truncate(numero_sello, 100),
              cantidadSellos: toInt(cantidad_sellos),
              nombreSellador: truncate(nombre_sellador, 255),
              holgura: holgura,
              accesibilidad: accesibilidad ?? 1,
              observaciones: observaciones && observaciones.trim() ? observaciones.trim() : null,
              fotosUrls: [],
              tipoRegistro: truncate(tipoRegistro, 50),
              itemizadoBeck: itemizadoBeck ? truncate(itemizadoBeck, 500) : null,
              itemizadoMandanteTexto: itemizadoMandanteTexto ? truncate(itemizadoMandanteTexto, 255) : null,
              folio: folio ? truncate(folio, 100) : null,
              ...(metrosFinal !== null ? { metrosLineales: metrosFinal } : {}),
              factorPorHolguras: calcResult.factor_por_holguras,
              cantidadSellosConFactores: calcResult.cantidad_sellos_con_factores,
              aislacion: calcResult.aislacion_normalizada,
              cantidadSellosAislacion: calcResult.cantidad_sellos_aislacion,
              reparacionTabique: calcResult.reparacion_tabique_normalizada,
              cantidadFinal: calcResult.cantidad_final,
            },
          });

          if (itemizadoMandanteIdFinal || codigoBeckFinal) {
            await dbQuery(
              `UPDATE registros_terreno
               SET itemizado_mandante_id = $1,
                   codigo_beck = $2
               WHERE id = $3`,
              [
                itemizadoMandanteIdFinal,
                codigoBeckFinal ? truncate(codigoBeckFinal, 255) : null,
                registro.id,
              ],
            );
          }

          const nativeRow = rowIdx - 1;
          const imageIds = imagesByNativeRow.get(nativeRow) ?? [];
          const folder = buildCloudinaryFolder(
            obrasById.get(rowObraId)?.codigo || rowObraId,
            new Date(registro.fecha),
            registro.piso,
            registro.nombreSellador,
          );

          for (const imageId of imageIds) {
            try {
              const img = workbook.getImage(imageId);
              const mediaArr = workbook.model.media as (ExcelJS.Media | undefined)[];
              const mediaItem = mediaArr[imageId];

              let bytes: Uint8Array | null = null;

              if (img?.buffer != null) {
                bytes = new Uint8Array(img.buffer as unknown as ArrayBuffer);
              } else if (typeof img?.base64 === 'string') {
                bytes = Buffer.from(img.base64, 'base64');
              } else if (mediaItem?.buffer != null) {
                bytes = new Uint8Array(mediaItem.buffer as unknown as ArrayBuffer);
              }

              if (!bytes) {
                console.error(
                  `Error subiendo imagen: no se pudo extraer buffer (fila ${rowIdx}, imageId ${imageId})`
                );
                continue;
              }

              const uploaded = await uploadImageDetailed(bytes, folder);

              await prisma.fotos_registro.create({
                data: {
                  registro_id: registro.id,
                  url: uploaded.secure_url,
                  public_id: truncate(uploaded.public_id, 255),
                  formato: uploaded.format ? truncate(uploaded.format, 50) : null,
                  bytes: uploaded.bytes,
                  nombre_archivo: uploaded.original_filename
                    ? truncate(uploaded.original_filename, 255)
                    : null,
                  subido_por_id: usuario_id,
                },
              });
            } catch (imgErr) {
              console.error('Error subiendo imagen:', imgErr);
            }
          }

          insertados++;
        } catch (rowError) {
          errores.push(`Fila ${rowIdx}: ${String(rowError)}`);
        }
      }

      resultados.push({ hoja: sheetName, insertados, duplicadosOmitidos: duplicados, errores, advertencias });
      totalInsertados += insertados;
      totalDuplicados += duplicados;
    }

    res.status(201).json({
      message: `Importación completada. ${totalInsertados} registro(s) insertado(s). ${totalDuplicados} duplicado(s) omitido(s).`,
      totalInsertados,
      totalDuplicados,
      resultados,
    });
  } catch (error) {
    console.error('Error al importar Excel:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      ...(DEV && { detail: (error as Error).message }),
    });
  }
};

/**
 * GET /api/registros/ejemplo-excel
 * Descarga el archivo Excel de ejemplo (con obra "Obra Demo").
 */
export const descargarEjemploExcel = (_req: Request, res: Response): void => {
  const filePath = path.join(process.cwd(), 'public', 'ejemplo-importacion.xlsx');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Archivo de ejemplo no disponible' });
    return;
  }
  res.download(filePath, 'ejemplo-importacion.xlsx', (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'No se pudo descargar el archivo' });
    }
  });
};
