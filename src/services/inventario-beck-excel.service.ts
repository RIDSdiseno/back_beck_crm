import XLSX from 'xlsx';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { SKU_GENERADO_REGEX } from './inventario-beck.service';

function esSkuGenerado(sku: string | null | undefined): boolean {
  return !!sku && SKU_GENERADO_REGEX.test(sku);
}

type SheetKind = 'epp' | 'implementos' | 'herramientas';

type HojaResumen = {
  procesados: number;
  creados: number;
  actualizados: number;
  errores: number;
  filasValidas: number;
  encabezadoFila: number;
  columnasDetectadas: string[];
};

export type ImportacionInventarioBeckError = {
  hoja: string;
  fila: number;
  motivo: string;
};

export type ImportacionInventarioBeckResultado = {
  epp?: HojaResumen;
  implementos?: HojaResumen;
  herramientas?: HojaResumen;
  errores: ImportacionInventarioBeckError[];
  hojasIgnoradas: string[];
};

type Row = unknown[];
type HeaderInfo = {
  rowIndex: number;
  headers: string[];
  indexes: Map<string, number>;
};

const SHEET_MAP: Record<string, SheetKind | undefined> = {
  epp: 'epp',
  implementos: 'implementos',
  herramientas: 'herramientas',
};

function normalizarTexto(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizarClave(value: unknown): string {
  return normalizarTexto(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizarSku(value: unknown): string | null {
  const sku = normalizarTexto(value);
  if (!sku || sku === '-') return null;
  return sku;
}

function normalizarValorTexto(value: unknown): string | null {
  const text = normalizarTexto(value);
  if (!text || text === '-') return null;
  return text;
}

function capitalizar(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase('es-CL') + value.slice(1);
}

function keyPart(value: unknown): string {
  return normalizarClave(value) || '-';
}

function parseInteger(value: unknown, field: string): number {
  if (value === null || value === undefined || normalizarTexto(value) === '' || normalizarTexto(value) === '-') {
    return 0;
  }
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) throw new Error(`${field} debe ser un entero mayor o igual a 0.`);
    return value;
  }
  const raw = normalizarTexto(value);
  const normalized = /^\d{1,3}(\.\d{3})+$/.test(raw) ? raw.replace(/\./g, '') : raw.replace(',', '.');
  const numberValue = Number(normalized);
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(`${field} no es un numero valido.`);
  }
  return numberValue;
}

function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined || normalizarTexto(value) === '' || normalizarTexto(value) === '-') {
    return null;
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error('Fecha invalida.');
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) throw new Error('Fecha invalida.');
    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }
  const text = normalizarTexto(value);
  const date = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(text)
    ? (() => {
        const [month, day, year] = text.split('/').map(Number);
        return new Date(year < 100 ? 2000 + year : year, month - 1, day);
      })()
    : new Date(`${text}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error('Fecha invalida.');
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCell(row: Row, headers: HeaderInfo, canonicalName: string): unknown {
  const idx = headers.indexes.get(canonicalName);
  return idx === undefined ? null : row[idx];
}

function findHeader(rows: Row[], required: string[]): HeaderInfo {
  const requiredSet = new Set(required);
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const indexes = new Map<string, number>();
    const headers = row.map((cell) => normalizarTexto(cell));
    headers.forEach((header, idx) => {
      if (!header) return;
      const canonical = normalizarHeader(header);
      if (canonical) indexes.set(canonical, idx);
    });
    if ([...requiredSet].every((name) => indexes.has(name))) {
      return { rowIndex, headers: headers.filter(Boolean), indexes };
    }
  }
  throw new Error(`No se encontro la fila de encabezados requerida: ${required.join(', ')}.`);
}

function normalizarHeader(header: string): string | null {
  const normalized = normalizarClave(header);
  const map: Record<string, string | undefined> = {
    sku: 'sku',
    item: 'item',
    nombre: 'nombre',
    'modelo / marca': 'modeloMarca',
    'modelo marca': 'modeloMarca',
    marca: 'marca',
    modelo: 'modelo',
    categoria: 'categoria',
    'unidad medida': 'unidadMedida',
    'unidad de medida': 'unidadMedida',
    talla: 'talla',
    'talla / medida': 'tallaMedida',
    color: 'color',
    'stock inicial': 'stockInicial',
    entrada: 'entrada',
    salida: 'salida',
    saldo: 'saldo',
    cantidad: 'cantidad',
    ubicacion: 'ubicacion',
    fecha: 'fecha',
    'fecha mantencion': 'fechaMantencion',
    'fecha de mantencion': 'fechaMantencion',
    encargado: 'encargado',
  };
  return map[normalized] ?? null;
}

type ParsedEpp = {
  fila: number;
  data: Prisma.InventarioBeckEppUncheckedCreateInput;
  skuKey: string | null;
  compositeKey: string;
};

type ParsedImplemento = {
  fila: number;
  data: Prisma.InventarioBeckImplementoUncheckedCreateInput;
  skuKey: string | null;
  compositeKey: string;
};

type ParsedHerramienta = {
  fila: number;
  data: Prisma.InventarioBeckHerramientaUncheckedCreateInput;
  skuKey: string | null;
  compositeKey: string;
};

function pushRowError(
  errores: ImportacionInventarioBeckError[],
  hoja: string,
  fila: number,
  error: unknown,
): void {
  errores.push({
    hoja: hoja.trim(),
    fila,
    motivo: error instanceof Error ? error.message : 'Error al leer fila.',
  });
}

function parseEppRows(sheetName: string, rows: Row[], headers: HeaderInfo, errores: ImportacionInventarioBeckError[]): ParsedEpp[] {
  const parsed: ParsedEpp[] = [];
  for (let i = headers.rowIndex + 1; i < rows.length; i += 1) {
    try {
      const row = rows[i];
      if (!row.some((cell) => normalizarTexto(cell))) continue;
      const item = normalizarValorTexto(getCell(row, headers, 'item'));
      if (!item) {
        const hasIdentityData = ['sku', 'modeloMarca', 'unidadMedida', 'talla', 'color']
          .some((field) => normalizarValorTexto(getCell(row, headers, field)));
        if (!hasIdentityData) continue;
        throw new Error('El item es obligatorio.');
      }
      const data = {
        sku: normalizarSku(getCell(row, headers, 'sku')),
        item: capitalizar(item),
        modeloMarca: normalizarValorTexto(getCell(row, headers, 'modeloMarca')),
        unidadMedida: normalizarValorTexto(getCell(row, headers, 'unidadMedida')),
        talla: normalizarValorTexto(getCell(row, headers, 'talla')),
        color: normalizarValorTexto(getCell(row, headers, 'color')),
        stockInicial: parseInteger(getCell(row, headers, 'stockInicial'), 'stock inicial'),
        entrada: parseInteger(getCell(row, headers, 'entrada'), 'entrada'),
        salida: parseInteger(getCell(row, headers, 'salida'), 'salida'),
        saldo: parseInteger(getCell(row, headers, 'saldo'), 'saldo'),
        activo: true,
      };
      parsed.push({
        fila: i + 1,
        data,
        skuKey: data.sku ? keyPart(data.sku) : null,
        compositeKey: [data.item, data.modeloMarca, data.talla, data.color].map(keyPart).join('|'),
      });
    } catch (error) {
      pushRowError(errores, sheetName, i + 1, error);
    }
  }
  return parsed;
}

function parseImplementoRows(sheetName: string, rows: Row[], headers: HeaderInfo, errores: ImportacionInventarioBeckError[]): ParsedImplemento[] {
  const parsed: ParsedImplemento[] = [];
  for (let i = headers.rowIndex + 1; i < rows.length; i += 1) {
    try {
      const row = rows[i];
      if (!row.some((cell) => normalizarTexto(cell))) continue;
      const item = normalizarValorTexto(getCell(row, headers, 'item'));
      if (!item) {
        const hasIdentityData = ['sku', 'modeloMarca', 'unidadMedida', 'tallaMedida', 'color', 'ubicacion']
          .some((field) => normalizarValorTexto(getCell(row, headers, field)));
        if (!hasIdentityData) continue;
        throw new Error('El item es obligatorio.');
      }
      const data = {
        sku: normalizarSku(getCell(row, headers, 'sku')),
        item: capitalizar(item),
        modeloMarca: normalizarValorTexto(getCell(row, headers, 'modeloMarca')),
        cantidad: parseInteger(getCell(row, headers, 'cantidad'), 'cantidad'),
        unidadMedida: normalizarValorTexto(getCell(row, headers, 'unidadMedida')),
        tallaMedida: normalizarValorTexto(getCell(row, headers, 'tallaMedida')),
        color: normalizarValorTexto(getCell(row, headers, 'color')),
        ubicacion: normalizarValorTexto(getCell(row, headers, 'ubicacion')),
        fecha: parseDate(getCell(row, headers, 'fecha')),
        salida: parseInteger(getCell(row, headers, 'salida'), 'salida'),
        saldo: parseInteger(getCell(row, headers, 'saldo'), 'saldo'),
        activo: true,
      };
      parsed.push({
        fila: i + 1,
        data,
        skuKey: data.sku ? keyPart(data.sku) : null,
        compositeKey: [data.item, data.modeloMarca, data.tallaMedida, data.color, data.ubicacion].map(keyPart).join('|'),
      });
    } catch (error) {
      pushRowError(errores, sheetName, i + 1, error);
    }
  }
  return parsed;
}

function parseHerramientaRows(sheetName: string, rows: Row[], headers: HeaderInfo, errores: ImportacionInventarioBeckError[]): ParsedHerramienta[] {
  const parsed: ParsedHerramienta[] = [];
  const modeledIndexes = new Set(headers.indexes.values());
  for (let i = headers.rowIndex + 1; i < rows.length; i += 1) {
    try {
      const row = rows[i];
      if (!row.some((cell, idx) => modeledIndexes.has(idx) && normalizarTexto(cell))) continue;
      const nombre = normalizarValorTexto(getCell(row, headers, 'nombre'));
      if (!nombre) {
        const hasIdentityData = ['sku', 'marca', 'modelo', 'categoria', 'ubicacion', 'encargado']
          .some((field) => normalizarValorTexto(getCell(row, headers, field)));
        if (!hasIdentityData) continue;
        throw new Error('El nombre es obligatorio.');
      }
      const data = {
        nombre: capitalizar(nombre),
        marca: normalizarValorTexto(getCell(row, headers, 'marca')),
        modelo: normalizarValorTexto(getCell(row, headers, 'modelo')),
        categoria: normalizarValorTexto(getCell(row, headers, 'categoria')),
        sku: normalizarSku(getCell(row, headers, 'sku')),
        ubicacion: normalizarValorTexto(getCell(row, headers, 'ubicacion')),
        fechaCompra: parseDate(getCell(row, headers, 'fecha')),
        fechaMantencion: parseDate(getCell(row, headers, 'fechaMantencion')),
        encargado: normalizarValorTexto(getCell(row, headers, 'encargado')),
        activo: true,
      };
      parsed.push({
        fila: i + 1,
        data,
        skuKey: data.sku ? keyPart(data.sku) : null,
        compositeKey: data.sku
          ? [data.sku, data.nombre, data.marca, data.modelo, data.categoria].map(keyPart).join('|')
          : [data.nombre, data.marca, data.modelo, data.categoria, data.ubicacion, data.encargado].map(keyPart).join('|'),
      });
    } catch (error) {
      pushRowError(errores, sheetName, i + 1, error);
    }
  }
  return parsed;
}

function countKeys<T extends { skuKey: string | null }>(rows: T[]): Map<string, number> {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    if (!row.skuKey) return;
    counts.set(row.skuKey, (counts.get(row.skuKey) ?? 0) + 1);
  });
  return counts;
}

function countDbSku<T extends { sku: string | null }>(rows: T[]): Map<string, number> {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    if (!row.sku) return;
    const skuKey = keyPart(row.sku);
    counts.set(skuKey, (counts.get(skuKey) ?? 0) + 1);
  });
  return counts;
}

function eppSkuComposite(item: Prisma.InventarioBeckEppUncheckedCreateInput | { sku: string | null; item: string; modeloMarca: string | null; talla: string | null; color: string | null }): string {
  return [item.sku, item.item, item.modeloMarca, item.talla, item.color].map(keyPart).join('|');
}

function implementoSkuComposite(item: Prisma.InventarioBeckImplementoUncheckedCreateInput | { sku: string | null; item: string; modeloMarca: string | null; tallaMedida: string | null; color: string | null; ubicacion: string | null }): string {
  return [item.sku, item.item, item.modeloMarca, item.tallaMedida, item.color, item.ubicacion].map(keyPart).join('|');
}

async function procesarEpp(sheetName: string, rows: Row[], errores: ImportacionInventarioBeckError[]): Promise<HojaResumen> {
  const headers = findHeader(rows, ['sku', 'item']);
  const resumen = initResumen(headers);
  const erroresAntes = errores.length;
  const parsed = parseEppRows(sheetName, rows, headers, errores);
  resumen.errores += errores.length - erroresAntes;
  resumen.filasValidas = parsed.length;
  const skuCounts = countKeys(parsed);
  const existing = await prisma.inventarioBeckEpp.findMany();
  const existingById = new Map(existing.map((item) => [item.id, item]));
  const dbSkuCounts = countDbSku(existing);
  const bySku = new Map(
    existing
      .filter((item) => item.sku && dbSkuCounts.get(keyPart(item.sku)) === 1)
      .map((item) => [keyPart(item.sku), item.id]),
  );
  const bySkuComposite = new Map(
    existing.filter((item) => item.sku).map((item) => [eppSkuComposite(item), item.id]),
  );
  const byNoSkuComposite = new Map(
    existing
      .filter((item) => !item.sku || esSkuGenerado(item.sku))
      .map((item) => [[item.item, item.modeloMarca, item.talla, item.color].map(keyPart).join('|'), item.id]),
  );

  for (const row of parsed) {
    resumen.procesados += 1;
    try {
      const id = row.skuKey
        ? (skuCounts.get(row.skuKey) === 1 ? bySku.get(row.skuKey) : bySkuComposite.get(eppSkuComposite(row.data)))
        : byNoSkuComposite.get(row.compositeKey);
      if (id) {
        const existenteActual = existingById.get(id);
        const data = !row.data.sku && existenteActual && esSkuGenerado(existenteActual.sku)
          ? { ...row.data, sku: existenteActual.sku }
          : row.data;
        await prisma.inventarioBeckEpp.update({ where: { id }, data });
        resumen.actualizados += 1;
      } else {
        const created = await prisma.inventarioBeckEpp.create({ data: row.data });
        if (row.skuKey && skuCounts.get(row.skuKey) === 1) bySku.set(row.skuKey, created.id);
        if (row.skuKey) bySkuComposite.set(eppSkuComposite(row.data), created.id);
        else byNoSkuComposite.set(row.compositeKey, created.id);
        resumen.creados += 1;
      }
    } catch (error) {
      resumen.errores += 1;
      errores.push({ hoja: sheetName.trim(), fila: row.fila, motivo: error instanceof Error ? error.message : 'Error al guardar fila.' });
    }
  }
  return resumen;
}

async function procesarImplementos(sheetName: string, rows: Row[], errores: ImportacionInventarioBeckError[]): Promise<HojaResumen> {
  const headers = findHeader(rows, ['sku', 'item']);
  const resumen = initResumen(headers);
  const erroresAntes = errores.length;
  const parsed = parseImplementoRows(sheetName, rows, headers, errores);
  resumen.errores += errores.length - erroresAntes;
  resumen.filasValidas = parsed.length;
  const skuCounts = countKeys(parsed);
  const existing = await prisma.inventarioBeckImplemento.findMany();
  const dbSkuCounts = countDbSku(existing);
  const bySku = new Map(
    existing
      .filter((item) => item.sku && dbSkuCounts.get(keyPart(item.sku)) === 1)
      .map((item) => [keyPart(item.sku), item.id]),
  );
  const bySkuComposite = new Map(
    existing.filter((item) => item.sku).map((item) => [implementoSkuComposite(item), item.id]),
  );
  const byNoSkuComposite = new Map(
    existing
      .filter((item) => !item.sku)
      .map((item) => [[item.item, item.modeloMarca, item.tallaMedida, item.color, item.ubicacion].map(keyPart).join('|'), item.id]),
  );

  for (const row of parsed) {
    resumen.procesados += 1;
    try {
      const id = row.skuKey
        ? (skuCounts.get(row.skuKey) === 1 ? bySku.get(row.skuKey) : bySkuComposite.get(implementoSkuComposite(row.data)))
        : byNoSkuComposite.get(row.compositeKey);
      if (id) {
        await prisma.inventarioBeckImplemento.update({ where: { id }, data: row.data });
        resumen.actualizados += 1;
      } else {
        const created = await prisma.inventarioBeckImplemento.create({ data: row.data });
        if (row.skuKey && skuCounts.get(row.skuKey) === 1) bySku.set(row.skuKey, created.id);
        if (row.skuKey) bySkuComposite.set(implementoSkuComposite(row.data), created.id);
        else byNoSkuComposite.set(row.compositeKey, created.id);
        resumen.creados += 1;
      }
    } catch (error) {
      resumen.errores += 1;
      errores.push({ hoja: sheetName.trim(), fila: row.fila, motivo: error instanceof Error ? error.message : 'Error al guardar fila.' });
    }
  }
  return resumen;
}

async function procesarHerramientas(sheetName: string, rows: Row[], errores: ImportacionInventarioBeckError[]): Promise<HojaResumen> {
  const headers = findHeader(rows, ['sku', 'nombre']);
  const resumen = initResumen(headers);
  const erroresAntes = errores.length;
  const parsed = parseHerramientaRows(sheetName, rows, headers, errores);
  resumen.errores += errores.length - erroresAntes;
  resumen.filasValidas = parsed.length;
  const existing = await prisma.inventarioBeckHerramienta.findMany();
  const byComposite = new Map(
    existing.map((item) => {
      const key = item.sku
        ? [item.sku, item.nombre, item.marca, item.modelo, item.categoria].map(keyPart).join('|')
        : [item.nombre, item.marca, item.modelo, item.categoria, item.ubicacion, item.encargado].map(keyPart).join('|');
      return [key, item.id];
    }),
  );

  for (const row of parsed) {
    resumen.procesados += 1;
    try {
      const id = byComposite.get(row.compositeKey);
      if (id) {
        await prisma.inventarioBeckHerramienta.update({ where: { id }, data: row.data });
        resumen.actualizados += 1;
      } else {
        const created = await prisma.inventarioBeckHerramienta.create({ data: row.data });
        byComposite.set(row.compositeKey, created.id);
        resumen.creados += 1;
      }
    } catch (error) {
      resumen.errores += 1;
      errores.push({ hoja: sheetName.trim(), fila: row.fila, motivo: error instanceof Error ? error.message : 'Error al guardar fila.' });
    }
  }
  return resumen;
}

function initResumen(headers: HeaderInfo): HojaResumen {
  return {
    procesados: 0,
    creados: 0,
    actualizados: 0,
    errores: 0,
    filasValidas: 0,
    encabezadoFila: headers.rowIndex + 1,
    columnasDetectadas: headers.headers,
  };
}

export async function importarInventarioBeckExcel(buffer: Buffer): Promise<ImportacionInventarioBeckResultado> {
  const workbook = XLSX.read(buffer, {
    type: 'buffer',
    cellDates: true,
    cellFormula: true,
  });
  const resultado: ImportacionInventarioBeckResultado = { errores: [], hojasIgnoradas: [] };

  for (const sheetName of workbook.SheetNames) {
    const kind = SHEET_MAP[normalizarClave(sheetName)];
    if (!kind) {
      resultado.hojasIgnoradas.push(sheetName.trim());
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Row>(worksheet, {
      header: 1,
      defval: null,
      raw: true,
      blankrows: false,
    });

    try {
      if (kind === 'epp') resultado.epp = await procesarEpp(sheetName, rows, resultado.errores);
      if (kind === 'implementos') resultado.implementos = await procesarImplementos(sheetName, rows, resultado.errores);
      if (kind === 'herramientas') resultado.herramientas = await procesarHerramientas(sheetName, rows, resultado.errores);
    } catch (error) {
      resultado.errores.push({
        hoja: sheetName.trim(),
        fila: 0,
        motivo: error instanceof Error ? error.message : 'Error al procesar hoja.',
      });
    }
  }

  if (!resultado.epp && !resultado.implementos && !resultado.herramientas) {
    throw new Error('El archivo no contiene hojas BECK validas para importar.');
  }

  return resultado;
}
