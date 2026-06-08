import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import XLSX from 'xlsx';

const getString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
};

const hasOwn = (body: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(body, key);

const handleError = (res: Response, error: unknown): void => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    res.status(404).json({ success: false, error: 'Opción no encontrada' });
    return;
  }
  console.error('Error en ItemizadoOpciones:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

export const listarItemizadoOpciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigoBeck, tipo, elementoPasante, elementoPenetra, materialidad, visible } = req.query;

    const where: Prisma.ItemizadoOpcionWhereInput = {};

    if (typeof codigoBeck === 'string' && codigoBeck.trim()) {
      where.codigoBeck = { contains: codigoBeck.trim(), mode: 'insensitive' };
    }
    if (typeof tipo === 'string' && tipo.trim()) {
      where.tipo = { contains: tipo.trim(), mode: 'insensitive' };
    }
    if (typeof elementoPasante === 'string' && elementoPasante.trim()) {
      where.elementoPasante = { contains: elementoPasante.trim(), mode: 'insensitive' };
    }
    if (typeof elementoPenetra === 'string' && elementoPenetra.trim()) {
      where.elementoPenetra = { contains: elementoPenetra.trim(), mode: 'insensitive' };
    }
    if (typeof materialidad === 'string' && materialidad.trim()) {
      where.materialidad = { contains: materialidad.trim(), mode: 'insensitive' };
    }
    if (visible === 'true') where.visible = true;
    if (visible === 'false') where.visible = false;

    const data = await prisma.itemizadoOpcion.findMany({
      where,
      orderBy: [{ codigoBeck: 'asc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getItemizadoOpcionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = await prisma.itemizadoOpcion.findUnique({ where: { id } });

    if (!data) {
      res.status(404).json({ success: false, error: 'Opción no encontrada' });
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const crearItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;

    const data = await prisma.itemizadoOpcion.create({
      data: {
        codigoBeck: getString(body.codigoBeck),
        tipo: getString(body.tipo),
        elementoPasante: getString(body.elementoPasante),
        elementoPenetra: getString(body.elementoPenetra),
        materialidad: getString(body.materialidad),
        visible: typeof body.visible === 'boolean' ? body.visible : true,
      },
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const actualizarItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body as Record<string, unknown>;

    const updateData: Prisma.ItemizadoOpcionUpdateInput = {};

    if (hasOwn(body, 'codigoBeck')) updateData.codigoBeck = getString(body.codigoBeck);
    if (hasOwn(body, 'tipo')) updateData.tipo = getString(body.tipo);
    if (hasOwn(body, 'elementoPasante')) updateData.elementoPasante = getString(body.elementoPasante);
    if (hasOwn(body, 'elementoPenetra')) updateData.elementoPenetra = getString(body.elementoPenetra);
    if (hasOwn(body, 'materialidad')) updateData.materialidad = getString(body.materialidad);
    if (hasOwn(body, 'visible') && typeof body.visible === 'boolean') {
      updateData.visible = body.visible;
    }

    const data = await prisma.itemizadoOpcion.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchVisibleItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body as Record<string, unknown>;

    if (typeof body.visible !== 'boolean') {
      res.status(400).json({ success: false, error: 'visible debe ser boolean' });
      return;
    }

    const data = await prisma.itemizadoOpcion.update({
      where: { id },
      data: { visible: body.visible },
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const eliminarItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.itemizadoOpcion.delete({ where: { id } });
    res.json({ success: true, message: 'Opción eliminada' });
  } catch (error) {
    handleError(res, error);
  }
};

// ─── Importación masiva desde Excel ───────────────────────────────────────────

const NOMBRE_HOJA = 'Cálculo Material por Pasada';
const FILA_ENCABEZADOS = 12; // 0-indexed → Excel row 13
const FILA_INICIO_DATOS = 13; // 0-indexed → Excel row 14

function leerCeldaXlsx(sheet: XLSX.WorkSheet, r: number, c: number): string | null {
  const addr = XLSX.utils.encode_cell({ r, c });
  const cell = sheet[addr] as XLSX.CellObject | undefined;
  if (!cell || cell.v == null) return null;
  const s = (cell.w !== undefined ? cell.w : String(cell.v)).trim();
  return s || null;
}

function normalizarEncabezado(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function claveUnicidad(row: {
  codigoBeck: string | null;
  tipo: string | null;
  elementoPasante: string | null;
  elementoPenetra: string | null;
  materialidad: string | null;
}): string {
  return [
    row.codigoBeck ?? '',
    row.tipo ?? '',
    row.elementoPasante ?? '',
    row.elementoPenetra ?? '',
    row.materialidad ?? '',
  ].join('\x00');
}

interface FilaItemizadoImport {
  codigoBeck: string | null;
  tipo: string | null;
  elementoPasante: string | null;
  elementoPenetra: string | null;
  materialidad: string | null;
}

export const importarItemizadoOpciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const reemplazar =
      req.query.reemplazar === 'true' ||
      (req.body as Record<string, unknown>).reemplazar === true ||
      (req.body as Record<string, unknown>).reemplazar === 'true';

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: 'Se requiere un archivo Excel en el campo "file"' });
      return;
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(file.buffer, { type: 'buffer', raw: false, cellNF: false });
    } catch {
      res.status(422).json({ success: false, error: 'No se pudo leer el archivo. Verifique que sea un Excel válido.' });
      return;
    }

    const sheet = workbook.Sheets[NOMBRE_HOJA];
    if (!sheet) {
      res.status(422).json({
        success: false,
        error: `No se encontró la hoja "${NOMBRE_HOJA}" en el archivo`,
      });
      return;
    }

    const sheetRef = sheet['!ref'];
    if (!sheetRef) {
      res.json({ success: true, totalFilas: 0, importadas: 0, omitidas: 0, duplicadas: 0, errores: [] });
      return;
    }

    const range = XLSX.utils.decode_range(sheetRef);
    const lastRow = range.e.r;
    const lastCol = range.e.c;

    // Leer encabezados desde Excel row 13 (0-indexed: 12)
    const colNums: Record<string, number> = {};
    for (let c = 0; c <= lastCol; c++) {
      const val = leerCeldaXlsx(sheet, FILA_ENCABEZADOS, c);
      if (val) colNums[normalizarEncabezado(val)] = c;
    }

    const COL = {
      codigoBeck: colNums['codigo'] ?? -1,
      tipo: colNums['tipo'] ?? -1,
      elementoPasante: colNums['elemento pasante'] ?? -1,
      elementoPenetra: colNums['elemento penetrado'] ?? -1,
      materialidad: colNums['materialidad'] ?? -1,
    };

    // Leer filas de datos desde Excel row 14 (0-indexed: 13)
    const filas: FilaItemizadoImport[] = [];
    let totalFilas = 0;

    for (let r = FILA_INICIO_DATOS; r <= lastRow; r++) {
      const fila: FilaItemizadoImport = {
        codigoBeck: COL.codigoBeck >= 0 ? leerCeldaXlsx(sheet, r, COL.codigoBeck) : null,
        tipo: COL.tipo >= 0 ? leerCeldaXlsx(sheet, r, COL.tipo) : null,
        elementoPasante: COL.elementoPasante >= 0 ? leerCeldaXlsx(sheet, r, COL.elementoPasante) : null,
        elementoPenetra: COL.elementoPenetra >= 0 ? leerCeldaXlsx(sheet, r, COL.elementoPenetra) : null,
        materialidad: COL.materialidad >= 0 ? leerCeldaXlsx(sheet, r, COL.materialidad) : null,
      };

      if (!fila.codigoBeck && !fila.tipo && !fila.elementoPasante && !fila.elementoPenetra && !fila.materialidad) {
        continue;
      }

      totalFilas++;
      filas.push(fila);
    }

    // Eliminar catálogo global completo si reemplazar=true
    if (reemplazar) {
      await prisma.itemizadoOpcion.deleteMany({});
    }

    // Cargar claves existentes para deduplicación (solo en modo append)
    let existingKeys = new Set<string>();
    if (!reemplazar) {
      const existing = await prisma.itemizadoOpcion.findMany({
        select: { codigoBeck: true, tipo: true, elementoPasante: true, elementoPenetra: true, materialidad: true },
      });
      existingKeys = new Set(existing.map(claveUnicidad));
    }

    // Construir registros a crear, deduplicando intra-archivo y contra BD
    const registrosACrear: {
      codigoBeck: string | null;
      tipo: string | null;
      elementoPasante: string | null;
      elementoPenetra: string | null;
      materialidad: string | null;
      visible: boolean;
    }[] = [];

    let duplicadas = 0;
    const seenInFile = new Set<string>();

    for (const fila of filas) {
      const key = claveUnicidad(fila);

      if (seenInFile.has(key)) {
        duplicadas++;
        continue;
      }
      seenInFile.add(key);

      if (!reemplazar && existingKeys.has(key)) {
        duplicadas++;
        continue;
      }

      registrosACrear.push({
        codigoBeck: fila.codigoBeck,
        tipo: fila.tipo,
        elementoPasante: fila.elementoPasante,
        elementoPenetra: fila.elementoPenetra,
        materialidad: fila.materialidad,
        visible: true,
      });
    }

    if (registrosACrear.length > 0) {
      await prisma.itemizadoOpcion.createMany({ data: registrosACrear });
    }

    const importadas = registrosACrear.length;
    const omitidas = totalFilas - importadas - duplicadas;

    res.json({
      success: true,
      totalFilas,
      importadas,
      omitidas,
      duplicadas,
      errores: [] as string[],
    });
  } catch (error) {
    console.error('Error en importarItemizadoOpciones:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
