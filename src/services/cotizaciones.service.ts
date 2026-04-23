import { EstadoCotizacion, Prisma, TipoLineaCotizacion } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  CotizacionError,
  CotizacionTotals,
  CreateCotizacionInput,
  LineaInput,
  UpdateCotizacionInput,
} from '../types/cotizaciones.types';

const TAX_RATE = 0.19;

const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const toDecimal = (value: number): Prisma.Decimal =>
  new Prisma.Decimal(round2(value).toFixed(2));

const validateDescuentoPct = (descuento: number): void => {
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new CotizacionError('El descuento debe estar entre 0 y 100', 400);
  }
};

// ─── Cálculos ────────────────────────────────────────────────────────────────

const calcLineSubtotal = (linea: LineaInput): number => {
  const precioFinal = linea.gananciaPct
    ? linea.precioUnitario * (1 + linea.gananciaPct / 100)
    : linea.precioUnitario;

  return round2(linea.cantidad * precioFinal);
};

export const calcularTotales = (
  lineas: LineaInput[],
  descuento: number,
  aplicaImpuesto: boolean,
): CotizacionTotals => {
  validateDescuentoPct(descuento);

  const lineasCalculadas = lineas.map((linea) => ({
    ...linea,
    subtotal: calcLineSubtotal(linea),
  }));

  const subtotal = round2(lineasCalculadas.reduce((acc, l) => acc + l.subtotal, 0));
  const descuentoMonto = round2(subtotal * (descuento / 100));
  const neto = round2(subtotal - descuentoMonto);
  const impuesto = aplicaImpuesto ? round2(neto * TAX_RATE) : 0;
  const total = round2(neto + impuesto);
  return { lineasCalculadas, subtotal, descuentoMonto, neto, impuesto, total };
};

export const calcTotals = calcularTotales;

// ─── Parseo y validación de líneas ───────────────────────────────────────────

const VALID_TIPOS = Object.values(TipoLineaCotizacion) as string[];

export const parseLineas = (
  raw: unknown,
): LineaInput[] => {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new CotizacionError('Se requiere al menos una línea', 400);
  }

  return raw.map((item, index) => {
    const pos = index + 1;

    if (!item || typeof item !== 'object') {
      throw new CotizacionError(`Línea ${pos}: formato inválido`, 400);
    }

    const r = item as Record<string, unknown>;

    const tipoLinea = (typeof r.tipoLinea === 'string' && VALID_TIPOS.includes(r.tipoLinea)
      ? r.tipoLinea
      : null) as TipoLineaCotizacion | null;

    if (!tipoLinea) {
      throw new CotizacionError(
        `Línea ${pos}: tipoLinea debe ser PRODUCTO o SERVICIO`,
        400,
      );
    }

    const descripcion =
      typeof r.descripcion === 'string' ? r.descripcion.trim() : '';
    if (!descripcion) {
      throw new CotizacionError(`Línea ${pos}: descripción obligatoria`, 400);
    }

    const cantidad = Number(r.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw new CotizacionError(`Línea ${pos}: cantidad debe ser mayor a 0`, 400);
    }

    const precioUnitario = Number(r.precioUnitario);
    if (!Number.isFinite(precioUnitario) || precioUnitario < 0) {
      throw new CotizacionError(
        `Línea ${pos}: precioUnitario debe ser >= 0`,
        400,
      );
    }

    const gananciaPct = Number(r.gananciaPct ?? 0);
    if (!Number.isFinite(gananciaPct) || gananciaPct < 0 || gananciaPct > 10000) {
      throw new CotizacionError(`Línea ${pos}: gananciaPct inválido`, 400);
    }

    const unidad =
      typeof r.unidad === 'string' && r.unidad.trim() ? r.unidad.trim() : null;
    const notasLinea =
      typeof r.notasLinea === 'string' && r.notasLinea.trim()
        ? r.notasLinea.trim()
        : null;
    const orden = Number.isInteger(Number(r.orden)) ? Number(r.orden) : index;

    const linea: LineaInput = {
      tipoLinea,
      descripcion,
      unidad,
      cantidad,
      precioUnitario,
      gananciaPct,
      subtotal: 0,
      orden,
      notasLinea,
    };

    linea.subtotal = calcLineSubtotal(linea);
    return linea;
  });
};

// ─── Helpers DB ──────────────────────────────────────────────────────────────

const validateObra = async (obraId: string | null): Promise<void> => {
  if (!obraId) return;
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { id: true },
  });
  if (!obra) {
    throw new CotizacionError('La obra indicada no existe', 400);
  }
};

const validateFunnelBeck = async (funnelBeckId: string | null): Promise<void> => {
  if (!funnelBeckId) return;
  const funnelBeck = await prisma.operadorBeck.findUnique({
    where: { id: funnelBeckId },
    select: { id: true },
  });
  if (!funnelBeck) {
    throw new CotizacionError('La oportunidad del funnel indicada no existe', 400);
  }
};

const lineasCreateData = (cotizacionId: string, lineas: LineaInput[]) =>
  lineas.map((l) => ({
    cotizacionId,
    tipoLinea: l.tipoLinea,
    descripcion: l.descripcion,
    unidad: l.unidad,
    cantidad: new Prisma.Decimal(l.cantidad.toFixed(3)),
    precioUnitario: toDecimal(l.precioUnitario),
    gananciaPct: toDecimal(l.gananciaPct),
    subtotal: toDecimal(l.subtotal),
    orden: l.orden,
    notasLinea: l.notasLinea,
  }));

const INCLUDE_FULL = {
  lineas: { orderBy: { orden: 'asc' as const } },
  obra: true,
  funnelBeck: true,
} as const;

// ─── Servicios ───────────────────────────────────────────────────────────────

export const createCotizacion = async (input: CreateCotizacionInput, userId: string) => {
  await validateObra(input.obraId);
  await validateFunnelBeck(input.funnelBeckId);
  validateDescuentoPct(input.descuento);

  const {
    lineasCalculadas,
    subtotal,
    impuesto,
    total,
  } = calcularTotales(input.lineas, input.descuento, input.aplicaImpuesto);

  const cotizacionId = await prisma.$transaction(async (tx) => {
    const cot = await tx.cotizacion.create({
      data: {
        numero: input.numero,
        clienteNombre: input.clienteNombre,
        obraId: input.obraId,
        funnelBeckId: input.funnelBeckId ?? null,
        estado: EstadoCotizacion.BORRADOR,
        subtotal: toDecimal(subtotal),
        descuento: toDecimal(input.descuento),
        impuesto: toDecimal(impuesto),
        aplicaImpuesto: input.aplicaImpuesto,
        total: toDecimal(total),
        vigencia: input.vigencia,
        observaciones: input.observaciones,
        creadoPorId: userId,
      },
      select: { id: true },
    });

    await tx.lineaCotizacion.createMany({
      data: lineasCreateData(cot.id, lineasCalculadas),
    });

    return cot.id;
  });

  return findCotizacion(cotizacionId);
};

export const listCotizaciones = async () =>
  prisma.cotizacion.findMany({
    include: INCLUDE_FULL,
    orderBy: { createdAt: 'desc' },
  });

export const listCotizacionesByFunnelBeck = async (funnelBeckId: string) => {
  await validateFunnelBeck(funnelBeckId);

  return prisma.cotizacion.findMany({
    where: { funnelBeckId },
    include: INCLUDE_FULL,
    orderBy: { createdAt: 'desc' },
  });
};

export const findCotizacion = async (id: string) => {
  const cot = await prisma.cotizacion.findUnique({
    where: { id },
    include: INCLUDE_FULL,
  });
  if (!cot) throw new CotizacionError('Cotización no encontrada', 404);
  return cot;
};

export const updateCotizacion = async (id: string, input: UpdateCotizacionInput) => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    include: { lineas: true },
  });
  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  if (input.obraId !== undefined) {
    await validateObra(input.obraId);
  }
  if (input.funnelBeckId !== undefined) {
    await validateFunnelBeck(input.funnelBeckId);
  }
  if (input.descuento !== undefined) {
    validateDescuentoPct(input.descuento);
  }

  const updateData: Prisma.CotizacionUncheckedUpdateInput = {};

  if (input.numero !== undefined) updateData.numero = input.numero;
  if (input.clienteNombre !== undefined) updateData.clienteNombre = input.clienteNombre;
  if (input.obraId !== undefined) updateData.obraId = input.obraId;
  if (input.funnelBeckId !== undefined) updateData.funnelBeckId = input.funnelBeckId;
  if (input.estado !== undefined) updateData.estado = input.estado;
  if (input.vigencia !== undefined) updateData.vigencia = input.vigencia;
  if (input.observaciones !== undefined) updateData.observaciones = input.observaciones;

  const replaceLineas = input.lineas !== undefined;

  if (replaceLineas || input.descuento !== undefined || input.aplicaImpuesto !== undefined) {
    const lineas = input.lineas ?? existing.lineas.map((l) => ({
      tipoLinea: l.tipoLinea,
      descripcion: l.descripcion,
      unidad: l.unidad,
      cantidad: Number(l.cantidad),
      precioUnitario: Number(l.precioUnitario),
      gananciaPct: Number(l.gananciaPct),
      subtotal: Number(l.subtotal),
      orden: l.orden,
      notasLinea: l.notasLinea,
    }));

    const descuento = input.descuento ?? Number(existing.descuento);

      if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
        throw new CotizacionError(
          'La cotización tiene un descuento antiguo guardado como monto. Debe normalizarse antes de editarla.',
          400,
        );
    }
    const aplicaImpuesto = input.aplicaImpuesto ?? existing.aplicaImpuesto;
    const {
      lineasCalculadas,
      subtotal,
      impuesto,
      total,
    } = calcularTotales(lineas, descuento, aplicaImpuesto);

    updateData.subtotal = toDecimal(subtotal);
    updateData.descuento = toDecimal(descuento);
    updateData.impuesto = toDecimal(impuesto);
    updateData.aplicaImpuesto = aplicaImpuesto;
    updateData.total = toDecimal(total);

    if (replaceLineas) {
      const cotizacionId = await prisma.$transaction(async (tx) => {
        await tx.cotizacion.update({ where: { id }, data: updateData });
        await tx.lineaCotizacion.deleteMany({ where: { cotizacionId: id } });
        await tx.lineaCotizacion.createMany({ data: lineasCreateData(id, lineasCalculadas) });
        return id;
      });

      return findCotizacion(cotizacionId);
    }
  }

  return prisma.cotizacion.update({
    where: { id },
    data: updateData,
    include: INCLUDE_FULL,
  });
};

export const patchEstado = async (id: string, estado: EstadoCotizacion) => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  return prisma.cotizacion.update({
    where: { id },
    data: { estado },
    include: INCLUDE_FULL,
  });
};

export const deleteCotizacion = async (id: string): Promise<void> => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  await prisma.cotizacion.delete({ where: { id } });
};
