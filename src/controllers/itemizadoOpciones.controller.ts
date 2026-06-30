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

const getNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const listarItemizadoOpciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigoBeck, tipo, elementoPasante, elementoPenetra, materialidad, visible, obraId } = req.query;

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

    // Cuando se filtra por visible sin obraId se usa el campo global
    const obraIdStr = typeof obraId === 'string' && obraId.trim() ? obraId.trim() : null;
    if (!obraIdStr) {
      if (visible === 'true') where.visible = true;
      if (visible === 'false') where.visible = false;
    }

    const opciones = await prisma.itemizadoOpcion.findMany({
      where,
      orderBy: [{ codigoBeck: 'asc' }, { createdAt: 'asc' }],
    });

    if (!obraIdStr) {
      res.json({ success: true, data: opciones });
      return;
    }

    // Cargar configuraciones específicas de esta obra en un solo query
    const configs = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId: obraIdStr },
      select: { itemizadoOpcionId: true, visible: true },
    });
    const configMap = new Map(configs.map((c) => [c.itemizadoOpcionId, c.visible]));

    const data = opciones.map((op) => ({
      ...op,
      visible: configMap.has(op.id) ? configMap.get(op.id)! : op.visible,
    }));

    // Aplicar filtro de visible después de resolver el efectivo
    const filtrado =
      visible === 'true' ? data.filter((d) => d.visible) :
      visible === 'false' ? data.filter((d) => !d.visible) :
      data;

    res.json({ success: true, data: filtrado });
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
        visible: typeof body.visible === 'boolean' ? body.visible : false,
        rendimientoSellosEsperadoDiario: getNumber(body.rendimientoSellosEsperadoDiario),
        rendimientoReparacionEsperadoDiario: getNumber(body.rendimientoReparacionEsperadoDiario),
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
    if (hasOwn(body, 'rendimientoSellosEsperadoDiario')) {
      updateData.rendimientoSellosEsperadoDiario = getNumber(body.rendimientoSellosEsperadoDiario);
    }

    if (hasOwn(body, 'rendimientoReparacionEsperadoDiario')) {
      updateData.rendimientoReparacionEsperadoDiario = getNumber(body.rendimientoReparacionEsperadoDiario);
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

    const obraId = typeof body.obraId === 'string' && body.obraId.trim() ? body.obraId.trim() : null;

    if (obraId) {
      // Actualizar visibilidad solo para esta obra (no toca el maestro global)
      const config = await prisma.configuracionItemizadoOpcionObra.upsert({
        where: { obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: id } },
        create: { obraId, itemizadoOpcionId: id, visible: body.visible },
        update: { visible: body.visible },
      });

      res.json({ success: true, data: config, scope: 'obra' });
      return;
    }

    // Sin obraId → actualizar visible global (administración del maestro)
    const data = await prisma.itemizadoOpcion.update({
      where: { id },
      data: { visible: body.visible },
    });

    res.json({ success: true, data, scope: 'global' });
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

// ─── Configuración de itemizados por obra ─────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getConfiguracionItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    // Configs explícitas de esta obra (visibles e invisibles)
    const configs = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId },
      include: {
        itemizadoOpcion: {
          select: {
            id: true,
            codigoBeck: true,
            tipo: true,
            elementoPasante: true,
            elementoPenetra: true,
            materialidad: true,
            rendimientoSellosEsperadoDiario: true,
            rendimientoReparacionEsperadoDiario: true,
          },
        },
      },
    });

    const configuredIds = configs.map((c) => c.itemizadoOpcionId);

    // Items globalmente visibles que no tienen config explícita para esta obra
    const globalVisibles = await prisma.itemizadoOpcion.findMany({
      where: {
        visible: true,
        ...(configuredIds.length > 0 ? { id: { notIn: configuredIds } } : {}),
      },
      select: {
        id: true,
        codigoBeck: true,
        tipo: true,
        elementoPasante: true,
        elementoPenetra: true,
        materialidad: true,
        rendimientoSellosEsperadoDiario: true,
        rendimientoReparacionEsperadoDiario: true,
      },
    });

    type ItemResult = {
      id: string | null;
      obraId: string;
      itemizadoOpcionId: string;
      visible: boolean;
      orden: number | null;
      nombrePersonalizado: string | null;
      itemizadoOpcion: {
        id: string;
        codigoBeck: string | null;
        tipo: string | null;
        elementoPasante: string | null;
        elementoPenetra: string | null;
        materialidad: string | null;
        rendimientoSellosEsperadoDiario: number | null;
        rendimientoReparacionEsperadoDiario: number | null;
      };
      nombreMostrar: string;
    };

    const fromConfigs: ItemResult[] = configs
      .filter((c) => c.visible)
      .map((c) => ({
        id: c.id,
        obraId: c.obraId,
        itemizadoOpcionId: c.itemizadoOpcionId,
        visible: c.visible,
        orden: c.orden,
        nombrePersonalizado: c.nombrePersonalizado,
        itemizadoOpcion: c.itemizadoOpcion,
        nombreMostrar:
          c.nombrePersonalizado && c.nombrePersonalizado.trim()
            ? c.nombrePersonalizado.trim()
            : (c.itemizadoOpcion.elementoPasante ?? ''),
      }));

    const fromGlobal: ItemResult[] = globalVisibles.map((op) => ({
      id: null,
      obraId,
      itemizadoOpcionId: op.id,
      visible: true,
      orden: null,
      nombrePersonalizado: null,
      itemizadoOpcion: op,
      nombreMostrar: op.elementoPasante ?? '',
    }));

    const data = [...fromConfigs, ...fromGlobal].sort((a, b) => {
      if (a.orden !== null && b.orden !== null) return a.orden - b.orden;
      if (a.orden !== null) return -1;
      if (b.orden !== null) return 1;
      return (a.itemizadoOpcion.codigoBeck ?? '').localeCompare(
        b.itemizadoOpcion.codigoBeck ?? '',
        'es',
      );
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarConfiguracionItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const body = req.body as { items?: unknown };

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    if (!Array.isArray(body.items)) {
      res.status(400).json({ success: false, error: 'items debe ser un arreglo' });
      return;
    }

    for (const item of body.items as unknown[]) {
      if (typeof item !== 'object' || item === null) {
        res.status(400).json({ success: false, error: 'Cada item debe ser un objeto' });
        return;
      }
      const { itemizadoOpcionId } = item as Record<string, unknown>;
      if (typeof itemizadoOpcionId !== 'string' || !UUID_REGEX.test(itemizadoOpcionId)) {
        res.status(400).json({
          success: false,
          error: `itemizadoOpcionId inválido: ${String(itemizadoOpcionId)}`,
        });
        return;
      }
    }

    type ItemInput = {
      itemizadoOpcionId: string;
      orden?: number | null;
      nombrePersonalizado?: string | null;
    };

    const items = body.items as ItemInput[];
    const allIds = items.map((i) => i.itemizadoOpcionId);

    // Verificar que todos los itemizadoOpcionIds existen
    const found = await prisma.itemizadoOpcion.findMany({
      where: { id: { in: allIds } },
      select: { id: true, visible: true },
    });
    const foundMap = new Map(found.map((f) => [f.id, f.visible]));
    const notFound = allIds.filter((id) => !foundMap.has(id));
    if (notFound.length > 0) {
      res.status(404).json({ success: false, error: 'Algunos itemizados no existen', ids: notFound });
      return;
    }

    // Resolver visibilidad efectiva: config explícita > global
    const explicitConfigs = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId, itemizadoOpcionId: { in: allIds } },
      select: { itemizadoOpcionId: true, visible: true },
    });
    const configMap = new Map(explicitConfigs.map((c) => [c.itemizadoOpcionId, c.visible]));

    const notVisible = allIds.filter((id) =>
      configMap.has(id) ? !configMap.get(id) : !foundMap.get(id),
    );
    if (notVisible.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Algunos itemizados no están visibles para esta obra',
        ids: notVisible,
      });
      return;
    }

    // Upsert: solo actualiza orden y nombrePersonalizado; nunca toca visible existente
    const results = await Promise.all(
      items.map((item) => {
        const ordenVal =
          typeof item.orden === 'number' && Number.isInteger(item.orden) && item.orden > 0
            ? item.orden
            : null;
        const nombreVal =
          typeof item.nombrePersonalizado === 'string' && item.nombrePersonalizado.trim()
            ? item.nombrePersonalizado.trim()
            : null;

        return prisma.configuracionItemizadoOpcionObra.upsert({
          where: {
            obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: item.itemizadoOpcionId },
          },
          create: {
            obraId,
            itemizadoOpcionId: item.itemizadoOpcionId,
            visible: true,
            orden: ordenVal,
            nombrePersonalizado: nombreVal,
          },
          update: {
            orden: ordenVal,
            nombrePersonalizado: nombreVal,
          },
        });
      }),
    );

    res.json({ success: true, data: results });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchVisibleMasivoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const body = req.body as Record<string, unknown>;

    if (typeof body.visible !== 'boolean') {
      res.status(400).json({ success: false, error: 'visible debe ser boolean' });
      return;
    }
    const visible = body.visible;

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    const todasLasOpciones = await prisma.itemizadoOpcion.findMany({ select: { id: true } });
    const todosLosIds = todasLasOpciones.map((op) => op.id);

    if (todosLosIds.length === 0) {
      res.json({ success: true, actualizados: 0, visible });
      return;
    }

    const configsExistentes = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId, itemizadoOpcionId: { in: todosLosIds } },
      select: { itemizadoOpcionId: true },
    });
    const idsConConfig = new Set(configsExistentes.map((c) => c.itemizadoOpcionId));
    const idsSinConfig = todosLosIds.filter((id) => !idsConConfig.has(id));

    await prisma.$transaction(async (tx) => {
      if (idsConConfig.size > 0) {
        await tx.configuracionItemizadoOpcionObra.updateMany({
          where: { obraId, itemizadoOpcionId: { in: [...idsConConfig] } },
          data: { visible },
        });
      }
      if (idsSinConfig.length > 0) {
        await tx.configuracionItemizadoOpcionObra.createMany({
          data: idsSinConfig.map((itemizadoOpcionId) => ({ obraId, itemizadoOpcionId, visible })),
          skipDuplicates: true,
        });
      }
    });

    res.json({ success: true, actualizados: todosLosIds.length, visible });
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
        visible: false,
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
