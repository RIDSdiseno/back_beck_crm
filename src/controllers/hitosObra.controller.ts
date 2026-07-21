
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Hito no encontrado' });
      return;
    }
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, error: 'Conflicto de orden del hito. Intenta nuevamente.' });
      return;
    }
  }
  console.error('Error en HitosObra:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const getObraOr404 = async (
  obraId: string,
  res: Response,
): Promise<{ id: string; nombre: string } | null> => {
  if (!UUID_REGEX.test(obraId)) {
    res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
    return null;
  }
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { id: true, nombre: true },
  });
  if (!obra) {
    res.status(404).json({ success: false, error: 'Obra no encontrada' });
    return null;
  }
  return obra;
};

const getHitoDeObraOr404 = async (
  obraId: string,
  hitoId: string,
  res: Response,
): Promise<{
  id: string;
  obraId: string;
  orden: number;
  terminado: boolean;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
} | null> => {
  if (!UUID_REGEX.test(hitoId)) {
    res.status(400).json({ success: false, error: 'hitoId debe ser un UUID válido' });
    return null;
  }
  const hito = await prisma.hitoObra.findUnique({
    where: { id: hitoId },
    select: { id: true, obraId: true, orden: true, terminado: true, fechaDesde: true, fechaHasta: true },
  });
  if (!hito || hito.obraId !== obraId) {
    res.status(404).json({ success: false, error: 'Hito no encontrado en esta obra' });
    return null;
  }
  return hito;
};

// --- Período del hito (Estado de Pago) ---------------------------------

const parseFecha = (value: unknown): Date | null => {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatearFechaCorta = (d: Date): string =>
  `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;

// Dos períodos se superponen si el inicio de uno cae antes o el mismo día
// que el fin del otro, en ambas direcciones (intersección de intervalos
// cerrados). Solo compara contra hitos que YA tienen período definido
// (los legados sin fechaDesde/fechaHasta no participan).
const buscarSuperposicion = async (
  obraId: string,
  fechaDesde: Date,
  fechaHasta: Date,
  excluirHitoId?: string,
): Promise<{ nombre: string; fechaDesde: Date; fechaHasta: Date } | null> => {
  const conflicto = await prisma.hitoObra.findFirst({
    where: {
      obraId,
      ...(excluirHitoId ? { id: { not: excluirHitoId } } : {}),
      fechaDesde: { not: null, lte: fechaHasta },
      fechaHasta: { not: null, gte: fechaDesde },
    },
    select: { nombre: true, fechaDesde: true, fechaHasta: true },
  });
  if (!conflicto || !conflicto.fechaDesde || !conflicto.fechaHasta) return null;
  return { nombre: conflicto.nombre, fechaDesde: conflicto.fechaDesde, fechaHasta: conflicto.fechaHasta };
};

// Valida orden y superposición para un período dado. Devuelve el mensaje de
// error a responder (400) o null si el período es válido.
const validarPeriodo = async (
  obraId: string,
  fechaDesde: Date,
  fechaHasta: Date,
  excluirHitoId?: string,
): Promise<string | null> => {
  if (fechaHasta < fechaDesde) {
    return 'La fecha hasta no puede ser menor que la fecha desde.';
  }
  const conflicto = await buscarSuperposicion(obraId, fechaDesde, fechaHasta, excluirHitoId);
  if (conflicto) {
    return `El período se superpone con "${conflicto.nombre}" (${formatearFechaCorta(conflicto.fechaDesde)} al ${formatearFechaCorta(conflicto.fechaHasta)}).`;
  }
  return null;
};

// Bloquea cualquier modificación sobre un hito terminado. Se valida en el
// backend (no solo en el frontend) para que no pueda saltarse llamando
// directamente al endpoint. Devuelve true si el hito está terminado (y ya
// respondió el 409); el llamador debe cortar el flujo en ese caso.
const bloquearSiTerminado = (
  hito: { terminado: boolean },
  res: Response,
): boolean => {
  if (hito.terminado) {
    res.status(409).json({
      success: false,
      error: 'El hito está terminado y no puede modificarse.',
    });
    return true;
  }
  return false;
};

type ItemizadoResuelto = {
  itemizadoOpcionId: string;
  configId: string | null;
  codigoBeck: string | null;
  itemizadoBeck: string | null;
  itemizadoMandante: string | null;
  precioUnitario: Prisma.Decimal | null;
  moneda: string | null;
  orden: number | null;
  // Ejecución acumulada GLOBAL de la obra (sin filtro de fecha). Se
  // mantiene EXCLUSIVAMENTE para no tocar la lógica de saldo pendiente del
  // frontend (calcularSaldoPendiente en EstadosAvanceObraDrawer.tsx), que
  // sigue basándose en el total histórico, no en un período. La ejecución
  // POR PERÍODO de cada hito vive aparte, en hito.cantidadesEjecutadas/
  // hito.subtotales — nunca se mezclan ambas nociones en este mismo campo.
  cantidadEjecutada: number;
};

const calcularSubtotal = (
  precioUnitario: Prisma.Decimal | null,
  cantidadEjecutada: number,
): Prisma.Decimal | null =>
  precioUnitario === null ? null : precioUnitario.mul(cantidadEjecutada);

const toCantidadSegura = (valor: unknown): number => {
  if (valor === null || valor === undefined) return 0;
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

const cantidadFisicaDe = (registro: {
  tipoRegistro: string;
  cantidadSellos: number;
  metrosLineales: number | null;
}): number =>
  registro.tipoRegistro === 'junta_lineal_espuma'
    ? toCantidadSegura(registro.metrosLineales)
    : toCantidadSegura(registro.cantidadSellos);

type RegistroValidado = {
  codigoBeck: string;
  fecha: Date;
  tipoRegistro: string;
  cantidadSellos: number;
  metrosLineales: number | null;
};

// Una sola consulta por obra: sirve tanto para la ejecución GLOBAL (saldo
// pendiente) como para la ejecución POR PERÍODO de cada hito (filtrando en
// memoria), evitando repetir la misma query por cada hito (sin N+1).
// Mismo criterio de "registro válido" que ya usaba la lógica anterior:
// misma obra, estado === 'validado', codigoBeck no nulo ni vacío.
const obtenerRegistrosValidados = async (obraId: string): Promise<RegistroValidado[]> => {
  const registros = await prisma.registroTerreno.findMany({
    where: { obraId, estado: 'validado', codigoBeck: { not: null } },
    select: { codigoBeck: true, fecha: true, tipoRegistro: true, cantidadSellos: true, metrosLineales: true },
  });

  const resultado: RegistroValidado[] = [];
  for (const r of registros) {
    if (!r.codigoBeck || !r.codigoBeck.trim()) continue;
    resultado.push({
      codigoBeck: r.codigoBeck,
      fecha: r.fecha,
      tipoRegistro: r.tipoRegistro,
      cantidadSellos: r.cantidadSellos,
      metrosLineales: r.metrosLineales,
    });
  }
  return resultado;
};

const sumarCantidadPorCodigoBeck = (registros: RegistroValidado[]): Map<string, number> => {
  const mapa = new Map<string, number>();
  for (const r of registros) {
    mapa.set(r.codigoBeck, (mapa.get(r.codigoBeck) ?? 0) + cantidadFisicaDe(r));
  }
  return mapa;
};

// Compara solo año/mes/día en UTC. RegistroTerreno.fecha y
// HitoObra.fechaDesde/fechaHasta son ambos @db.Date (sin componente de
// hora), pero llegan como Date de JS — normalizar explícitamente a una
// clave de día evita cualquier desajuste de zona horaria en la comparación.
const aClaveDia = (d: Date): number => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

// Ambos límites incluidos (fechaDesde <= fecha <= fechaHasta).
const dentroDePeriodo = (fecha: Date, fechaDesde: Date, fechaHasta: Date): boolean => {
  const clave = aClaveDia(fecha);
  return clave >= aClaveDia(fechaDesde) && clave <= aClaveDia(fechaHasta);
};

// Ejecución de UN hito: solo registros cuya fecha cae dentro de su período.
// Reutiliza cantidadFisicaDe (misma regla sellos/metros lineales por
// tipoRegistro que ya existía) — no se inventa una regla nueva, solo se le
// agrega el filtro de fecha.
const cantidadEjecutadaPorCodigoBeckEnPeriodo = (
  registros: RegistroValidado[],
  fechaDesde: Date,
  fechaHasta: Date,
): Map<string, number> =>
  sumarCantidadPorCodigoBeck(registros.filter((r) => dentroDePeriodo(r.fecha, fechaDesde, fechaHasta)));

const resolverItemizadosDeObra = async (
  obraId: string,
  registrosValidados: RegistroValidado[],
): Promise<ItemizadoResuelto[]> => {
  const configs = await prisma.configuracionItemizadoOpcionObra.findMany({
    where: { obraId },
    select: {
      id: true,
      itemizadoOpcionId: true,
      visible: true,
      nombrePersonalizado: true,
      orden: true,
      precioUnitario: true,
      moneda: true,
      itemizadoOpcion: {
        select: { id: true, codigoBeck: true, elementoPasante: true },
      },
    },
  });

  const configuredIds = configs.map((c) => c.itemizadoOpcionId);

  const globalVisibles = await prisma.itemizadoOpcion.findMany({
    where: {
      visible: true,
      ...(configuredIds.length > 0 ? { id: { notIn: configuredIds } } : {}),
    },
    select: { id: true, codigoBeck: true, elementoPasante: true },
  });

  const cantidadEjecutadaGlobalPorCodigoBeck = sumarCantidadPorCodigoBeck(registrosValidados);
  const cantidadEjecutadaDe = (codigoBeck: string | null): number =>
    codigoBeck ? cantidadEjecutadaGlobalPorCodigoBeck.get(codigoBeck) ?? 0 : 0;

  const fromConfigs: ItemizadoResuelto[] = configs
    .filter((c) => c.visible)
    .map((c) => ({
      itemizadoOpcionId: c.itemizadoOpcionId,
      configId: c.id,
      codigoBeck: c.itemizadoOpcion.codigoBeck,
      itemizadoBeck: c.itemizadoOpcion.elementoPasante,
      itemizadoMandante:
        c.nombrePersonalizado && c.nombrePersonalizado.trim()
          ? c.nombrePersonalizado.trim()
          : c.itemizadoOpcion.elementoPasante,
      precioUnitario: c.precioUnitario,
      moneda: c.moneda,
      orden: c.orden,
      cantidadEjecutada: cantidadEjecutadaDe(c.itemizadoOpcion.codigoBeck),
    }));

  const fromGlobal: ItemizadoResuelto[] = globalVisibles.map((op) => ({
    itemizadoOpcionId: op.id,
    configId: null,
    codigoBeck: op.codigoBeck,
    itemizadoBeck: op.elementoPasante,
    itemizadoMandante: op.elementoPasante,
    precioUnitario: null,
    moneda: null,
    orden: null,
    cantidadEjecutada: cantidadEjecutadaDe(op.codigoBeck),
  }));

  return [...fromConfigs, ...fromGlobal].sort((a, b) => {
    if (a.orden !== null && b.orden !== null) return a.orden - b.orden;
    if (a.orden !== null) return -1;
    if (b.orden !== null) return 1;
    return (a.codigoBeck ?? '').localeCompare(b.codigoBeck ?? '', 'es');
  });
};

export const listarHitosObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;

    // Una sola consulta de registros para toda la respuesta: alimenta tanto
    // la ejecución global de `items` (saldo pendiente, sin tocar) como la
    // ejecución por período de cada hito, calculada abajo en memoria.
    const registrosValidados = await obtenerRegistrosValidados(obraId);

    const [items, hitos] = await Promise.all([
      resolverItemizadosDeObra(obraId, registrosValidados),
      prisma.hitoObra.findMany({
        where: { obraId },
        orderBy: { orden: 'asc' },
        select: {
          id: true,
          nombre: true,
          orden: true,
          activo: true,
          terminado: true,
          terminadoAt: true,
          terminadoPorId: true,
          fechaDesde: true,
          fechaHasta: true,
          cantidades: {
            select: {
              cantidadHito: true,
              configuracionItemizadoObra: { select: { itemizadoOpcionId: true } },
            },
          },
        },
      }),
    ]);

    const data = hitos.map((h) => {
      // Hito legado sin período completo: 0 explícito para todos los
      // itemizados, NUNCA el total global como fallback (no se mezcla
      // lógica global con lógica por período).
      const tienePeriodo = h.fechaDesde !== null && h.fechaHasta !== null;
      const mapaPeriodo = tienePeriodo
        ? cantidadEjecutadaPorCodigoBeckEnPeriodo(registrosValidados, h.fechaDesde as Date, h.fechaHasta as Date)
        : new Map<string, number>();

      const cantidadesEjecutadas: Record<string, number> = {};
      const subtotales: Record<string, number | null> = {};
      for (const item of items) {
        const cantidadEjecutadaDelPeriodo =
          tienePeriodo && item.codigoBeck ? mapaPeriodo.get(item.codigoBeck) ?? 0 : 0;
        cantidadesEjecutadas[item.itemizadoOpcionId] = cantidadEjecutadaDelPeriodo;
        const subtotalDecimal = calcularSubtotal(item.precioUnitario, cantidadEjecutadaDelPeriodo);
        subtotales[item.itemizadoOpcionId] = subtotalDecimal === null ? null : subtotalDecimal.toNumber();
      }

      return {
        id: h.id,
        nombre: h.nombre,
        orden: h.orden,
        activo: h.activo,
        terminado: h.terminado,
        terminadoAt: h.terminadoAt ? h.terminadoAt.toISOString() : null,
        terminadoPorId: h.terminadoPorId,
        fechaDesde: h.fechaDesde ? h.fechaDesde.toISOString() : null,
        fechaHasta: h.fechaHasta ? h.fechaHasta.toISOString() : null,
        tieneCantidadesGuardadas: h.cantidades.length > 0,
        cantidades: Object.fromEntries(
          h.cantidades.map((c) => [
            c.configuracionItemizadoObra.itemizadoOpcionId,
            c.cantidadHito,
          ]),
        ),
        cantidadesEjecutadas,
        subtotales,
      };
    });

    res.json({ success: true, obra, items, hitos: data });
  } catch (error) {
    handleError(res, error);
  }
};

export const crearHitoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;

    const body = req.body as Record<string, unknown>;
    if (
      Object.prototype.hasOwnProperty.call(body, 'nombre') &&
      body.nombre !== undefined &&
      body.nombre !== null &&
      typeof body.nombre !== 'string'
    ) {
      res.status(400).json({ success: false, error: 'nombre debe ser texto' });
      return;
    }
    const nombreSolicitado = typeof body.nombre === 'string' ? body.nombre.trim() : '';

    // El período es obligatorio para hitos nuevos (el nombre sigue siendo
    // opcional, con fallback a "Hito N"). La columna es nullable en Prisma
    // solo para no romper hitos legados; la API sí exige ambas fechas.
    const fechaDesde = parseFecha(body.fechaDesde);
    const fechaHasta = parseFecha(body.fechaHasta);
    if (!fechaDesde || !fechaHasta) {
      res.status(400).json({
        success: false,
        error: 'fechaDesde y fechaHasta son obligatorias y deben ser fechas válidas',
      });
      return;
    }

    const errorPeriodo = await validarPeriodo(obraId, fechaDesde, fechaHasta);
    if (errorPeriodo) {
      res.status(400).json({ success: false, error: errorPeriodo });
      return;
    }

    const hito = await prisma.$transaction(
      async (tx) => {
        const ultimo = await tx.hitoObra.findFirst({
          where: { obraId },
          orderBy: { orden: 'desc' },
          select: { orden: true },
        });
        const orden = (ultimo?.orden ?? 0) + 1;
        return tx.hitoObra.create({
          data: {
            obraId,
            nombre: nombreSolicitado || `Hito ${orden}`,
            orden,
            fechaDesde,
            fechaHasta,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    res.status(201).json({ success: true, data: hito });
  } catch (error) {
    handleError(res, error);
  }
};

export const actualizarHitoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const hitoId = req.params.hitoId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;
    const hito = await getHitoDeObraOr404(obraId, hitoId, res);
    if (!hito) return;
    if (bloquearSiTerminado(hito, res)) return;

    const body = req.body as Record<string, unknown>;
    const tieneNombre = Object.prototype.hasOwnProperty.call(body, 'nombre');
    const tieneOrden = Object.prototype.hasOwnProperty.call(body, 'orden');
    const tieneFechaDesde = Object.prototype.hasOwnProperty.call(body, 'fechaDesde');
    const tieneFechaHasta = Object.prototype.hasOwnProperty.call(body, 'fechaHasta');

    let nombre: string | undefined;
    if (tieneNombre) {
      nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
      if (!nombre) {
        res.status(400).json({ success: false, error: 'nombre no puede estar vacío' });
        return;
      }
    }

    let nuevoOrden: number | undefined;
    if (tieneOrden) {
      if (
        typeof body.orden !== 'number' ||
        !Number.isInteger(body.orden) ||
        body.orden < 1
      ) {
        res.status(400).json({ success: false, error: 'orden debe ser un entero positivo' });
        return;
      }
      nuevoOrden = body.orden;
    }

    let nuevaFechaDesde: Date | undefined;
    if (tieneFechaDesde) {
      const parsed = parseFecha(body.fechaDesde);
      if (!parsed) {
        res.status(400).json({ success: false, error: 'fechaDesde debe ser una fecha válida' });
        return;
      }
      nuevaFechaDesde = parsed;
    }

    let nuevaFechaHasta: Date | undefined;
    if (tieneFechaHasta) {
      const parsed = parseFecha(body.fechaHasta);
      if (!parsed) {
        res.status(400).json({ success: false, error: 'fechaHasta debe ser una fecha válida' });
        return;
      }
      nuevaFechaHasta = parsed;
    }

    // Solo se valida el período si al menos una de las dos fechas cambia, y
    // solo cuando ambas quedan resueltas (la nueva o la ya persistida): un
    // hito legado con una sola fecha no se puede validar todavía.
    if (tieneFechaDesde || tieneFechaHasta) {
      const desdeEfectiva = nuevaFechaDesde ?? hito.fechaDesde;
      const hastaEfectiva = nuevaFechaHasta ?? hito.fechaHasta;
      if (desdeEfectiva && hastaEfectiva) {
        const errorPeriodo = await validarPeriodo(obraId, desdeEfectiva, hastaEfectiva, hitoId);
        if (errorPeriodo) {
          res.status(400).json({ success: false, error: errorPeriodo });
          return;
        }
      }
    }

    const data = await prisma.$transaction(async (tx) => {
      if (nuevoOrden !== undefined && nuevoOrden !== hito.orden) {
        const ocupante = await tx.hitoObra.findUnique({
          where: { obraId_orden: { obraId, orden: nuevoOrden } },
          select: { id: true },
        });
        if (ocupante) {
          await tx.hitoObra.update({ where: { id: ocupante.id }, data: { orden: -1 } });
          await tx.hitoObra.update({ where: { id: hitoId }, data: { orden: nuevoOrden } });
          await tx.hitoObra.update({ where: { id: ocupante.id }, data: { orden: hito.orden } });
        } else {
          await tx.hitoObra.update({ where: { id: hitoId }, data: { orden: nuevoOrden } });
        }
      }
      if (nombre !== undefined || nuevaFechaDesde !== undefined || nuevaFechaHasta !== undefined) {
        await tx.hitoObra.update({
          where: { id: hitoId },
          data: {
            ...(nombre !== undefined ? { nombre } : {}),
            ...(nuevaFechaDesde !== undefined ? { fechaDesde: nuevaFechaDesde } : {}),
            ...(nuevaFechaHasta !== undefined ? { fechaHasta: nuevaFechaHasta } : {}),
          },
        });
      }
      return tx.hitoObra.findUniqueOrThrow({ where: { id: hitoId } });
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const eliminarHitoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const hitoId = req.params.hitoId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;
    const hito = await getHitoDeObraOr404(obraId, hitoId, res);
    if (!hito) return;
    if (bloquearSiTerminado(hito, res)) return;

    await prisma.hitoObra.delete({ where: { id: hitoId } });
    res.json({ success: true, message: 'Hito eliminado' });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarCantidadesHito = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const hitoId = req.params.hitoId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;
    const hito = await getHitoDeObraOr404(obraId, hitoId, res);
    if (!hito) return;
    if (bloquearSiTerminado(hito, res)) return;

    const body = req.body as { items?: unknown };
    if (!Array.isArray(body.items)) {
      res.status(400).json({ success: false, error: 'items debe ser un arreglo' });
      return;
    }

    type ItemInput = { itemizadoOpcionId: string; cantidadHito: number | null };
    const items: ItemInput[] = [];
    const vistos = new Set<string>();

    for (const raw of body.items as unknown[]) {
      if (typeof raw !== 'object' || raw === null) {
        res.status(400).json({ success: false, error: 'Cada item debe ser un objeto' });
        return;
      }
      const { itemizadoOpcionId, cantidadHito } = raw as Record<string, unknown>;
      if (typeof itemizadoOpcionId !== 'string' || !UUID_REGEX.test(itemizadoOpcionId)) {
        res.status(400).json({
          success: false,
          error: `itemizadoOpcionId inválido: ${String(itemizadoOpcionId)}`,
        });
        return;
      }
      if (vistos.has(itemizadoOpcionId)) {
        res.status(400).json({
          success: false,
          error: `itemizadoOpcionId duplicado en el payload: ${itemizadoOpcionId}`,
        });
        return;
      }
      vistos.add(itemizadoOpcionId);
      if (
        cantidadHito !== null &&
        !(typeof cantidadHito === 'number' && Number.isFinite(cantidadHito) && cantidadHito >= 0)
      ) {
        res.status(400).json({
          success: false,
          error: `cantidadHito debe ser un número no negativo o null en el item ${itemizadoOpcionId}`,
        });
        return;
      }
      items.push({ itemizadoOpcionId, cantidadHito: cantidadHito as number | null });
    }

    if (items.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const encontrados = await prisma.itemizadoOpcion.findMany({
      where: { id: { in: items.map((i) => i.itemizadoOpcionId) } },
      select: { id: true },
    });
    const idsEncontrados = new Set(encontrados.map((e) => e.id));
    const faltantes = items
      .map((i) => i.itemizadoOpcionId)
      .filter((id) => !idsEncontrados.has(id));
    if (faltantes.length > 0) {
      res.status(404).json({
        success: false,
        error: 'Algunos itemizados no existen',
        ids: faltantes,
      });
      return;
    }

    const results = await prisma.$transaction(async (tx) => {
      const out = [];
      for (const item of items) {
        if (item.cantidadHito === null) {
          const configExistente = await tx.configuracionItemizadoOpcionObra.findUnique({
            where: {
              obraId_itemizadoOpcionId: {
                obraId,
                itemizadoOpcionId: item.itemizadoOpcionId,
              },
            },
            select: { id: true },
          });
          if (configExistente) {
            await tx.hitoObraCantidad.deleteMany({
              where: {
                hitoObraId: hitoId,
                configuracionItemizadoObraId: configExistente.id,
              },
            });
          }
          out.push({ itemizadoOpcionId: item.itemizadoOpcionId, cantidadHito: null });
          continue;
        }

        const config = await tx.configuracionItemizadoOpcionObra.upsert({
          where: {
            obraId_itemizadoOpcionId: {
              obraId,
              itemizadoOpcionId: item.itemizadoOpcionId,
            },
          },
          create: { obraId, itemizadoOpcionId: item.itemizadoOpcionId, visible: true },
          update: {},
          select: { id: true, obraId: true },
        });

        const cantidad = await tx.hitoObraCantidad.upsert({
          where: {
            hitoObraId_configuracionItemizadoObraId: {
              hitoObraId: hitoId,
              configuracionItemizadoObraId: config.id,
            },
          },
          create: {
            hitoObraId: hitoId,
            configuracionItemizadoObraId: config.id,
            cantidadHito: item.cantidadHito,
          },
          update: { cantidadHito: item.cantidadHito },
        });
        out.push(cantidad);
      }
      return out;
    });

    res.json({ success: true, data: results });
  } catch (error) {
    handleError(res, error);
  }
};

// PATCH /obras/:obraId/hitos/:hitoId/terminar
// Idempotente: si el hito ya está terminado, devuelve éxito sin reescribir
// terminadoAt/terminadoPorId (no se "re-termina" un hito ya cerrado).
export const terminarHitoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const hitoId = req.params.hitoId as string;
    const obra = await getObraOr404(obraId, res);
    if (!obra) return;
    const hito = await getHitoDeObraOr404(obraId, hitoId, res);
    if (!hito) return;

    if (hito.terminado) {
      const actual = await prisma.hitoObra.findUniqueOrThrow({ where: { id: hitoId } });
      res.json({ success: true, data: actual });
      return;
    }

    const data = await prisma.hitoObra.update({
      where: { id: hitoId },
      data: {
        terminado: true,
        terminadoAt: new Date(),
        terminadoPorId: req.userId ?? null,
      },
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};
