import { EstadoCotizacion, Prisma, TipoLineaCotizacion, TipoMovimientoCRM } from '@prisma/client';
import { prisma } from '../config/prisma';
import { firematPrisma } from '../config/firematPrisma';
import { registrarMovimientoCRM } from './movimientoCrm.service';
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

const formatMoney = (value: number | string | Prisma.Decimal | null | undefined, moneda?: string | null) => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  if (moneda === 'USD') {
    return `US$${safeValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  if (moneda === 'UF') {
    return `UF ${safeValue.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${Math.round(safeValue).toLocaleString('es-CL')}`;
};

const OPORTUNIDAD_SELECT = {
  id: true,
  nombreProyecto: true,
} as const;

type OportunidadCotizacion = Prisma.OperadorBeckGetPayload<{
  select: typeof OPORTUNIDAD_SELECT;
}>;

const generarNumeroCotizacion = async (): Promise<string> => {
  const cotizaciones = await prisma.cotizacion.findMany({
    where: { numero: { not: null } },
    select: { numero: true },
  });

  const ultimoNumero = cotizaciones.reduce((max, cotizacion) => {
    const numero = Number(cotizacion.numero);
    return Number.isFinite(numero) && numero > max ? numero : max;
  }, 0);

  return String(ultimoNumero + 1);
};

const resolveNumeroCotizacion = async (numero?: string | null): Promise<string> => {
  const normalized = numero?.trim();
  return normalized || generarNumeroCotizacion();
};

const validateNumeroDisponibleParaUpdate = async (
  numero: string | null,
  idsMismaCotizacion: string[],
): Promise<void> => {
  if (!numero) return;

  const duplicada = await prisma.cotizacion.findFirst({
    where: {
      numero,
      id: {
        notIn: idsMismaCotizacion,
      },
    },
    select: { id: true },
  });

  if (duplicada) {
    throw new CotizacionError('Ya existe una cotización con ese número', 409);
  }
};

const findOportunidadCotizacion = async (
  funnelBeckId: string | null,
): Promise<OportunidadCotizacion | null> => {
  if (!funnelBeckId) return null;

  return prisma.operadorBeck.findUnique({
    where: { id: funnelBeckId },
    select: OPORTUNIDAD_SELECT,
  });
};

const descripcionOportunidad = (
  oportunidad: OportunidadCotizacion | null,
  prefix: 'en',
): string => (
  oportunidad ? ` ${prefix} oportunidad ${oportunidad.nombreProyecto}` : ''
);

const descripcionEmpresa = (clienteNombre: string): string =>
  ` para la empresa ${clienteNombre}`;

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
        `Línea ${pos}: tipoLinea debe ser uno de: ${VALID_TIPOS.join(', ')}`,
        400,
      );
    }

    let productoFirematId: number | null = null;
    if (tipoLinea === TipoLineaCotizacion.PRODUCTO_FIREMAT) {
      const pfId = Number(r.productoFirematId);
      if (!Number.isInteger(pfId) || pfId <= 0) {
        throw new CotizacionError(
          `Línea ${pos}: productoFirematId es obligatorio para PRODUCTO_FIREMAT`,
          400,
        );
      }
      productoFirematId = pfId;
    }

    const descripcion =
      typeof r.descripcion === 'string' ? r.descripcion.trim() : '';
    if (!descripcion && tipoLinea !== TipoLineaCotizacion.PRODUCTO_FIREMAT) {
      throw new CotizacionError(`Línea ${pos}: descripción obligatoria`, 400);
    }

    const cantidad = Number(r.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw new CotizacionError(`Línea ${pos}: cantidad debe ser mayor a 0`, 400);
    }

    const precioUnitario = Number(r.precioUnitario ?? 0);
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
      productoFirematId,
    };

    linea.subtotal = calcLineSubtotal(linea);
    return linea;
  });
};

const enrichLineasFiremat = async (
  lineas: LineaInput[],
): Promise<{ lineas: LineaInput[]; advertencias: string[] }> => {
  const advertencias: string[] = [];

  const enriched = await Promise.all(
    lineas.map(async (linea, index) => {
      if (linea.tipoLinea !== TipoLineaCotizacion.PRODUCTO_FIREMAT) return linea;

      const { productoFirematId } = linea;
      if (!productoFirematId) {
        throw new CotizacionError(
          `Línea ${index + 1}: productoFirematId es obligatorio para PRODUCTO_FIREMAT`,
          400,
        );
      }

      const producto = await firematPrisma.producto.findUnique({
        where: { id: productoFirematId },
      });

      if (!producto) {
        throw new CotizacionError(
          `Línea ${index + 1}: producto Firemat ID ${productoFirematId} no existe`,
          400,
        );
      }

      if (!producto.activo) {
        throw new CotizacionError(
          `Línea ${index + 1}: el producto Firemat "${producto.nombre}" está inactivo`,
          400,
        );
      }

      const stockDisponible = producto.stock - producto.stockReservado;
      if (linea.cantidad > stockDisponible) {
        advertencias.push(
          `Línea ${index + 1} "${producto.nombre}": cantidad (${linea.cantidad}) supera el stock disponible (${stockDisponible})`,
        );
      }

      return {
        ...linea,
        descripcion: linea.descripcion || producto.nombre,
        precioUnitario: linea.precioUnitario > 0 ? linea.precioUnitario : producto.precio,
      };
    }),
  );

  return { lineas: enriched, advertencias };
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
    productoFirematId: l.productoFirematId ?? null,
  }));

const INCLUDE_FULL = {
  lineas: { orderBy: { orden: 'asc' as const } },
  obra: true,
  funnelBeck: true,
} as const;

const ESTADO_TIPO_MAP: Partial<Record<EstadoCotizacion, TipoMovimientoCRM>> = {
  [EstadoCotizacion.ENVIADA]: TipoMovimientoCRM.COTIZACION_ENVIADA,
  [EstadoCotizacion.ACEPTADA]: TipoMovimientoCRM.COTIZACION_ACEPTADA,
  [EstadoCotizacion.RECHAZADA]: TipoMovimientoCRM.COTIZACION_RECHAZADA,
};

// ─── Servicios ───────────────────────────────────────────────────────────────

export const createCotizacion = async (input: CreateCotizacionInput, userId: string) => {
  await validateObra(input.obraId);
  await validateFunnelBeck(input.funnelBeckId);
  validateDescuentoPct(input.descuento);

  const numeroCotizacion = await resolveNumeroCotizacion(input.numero);
  const oportunidad = await findOportunidadCotizacion(input.funnelBeckId);

  const { lineas: lineasEnriquecidas, advertencias } = await enrichLineasFiremat(input.lineas);

  const {
    lineasCalculadas,
    subtotal,
    impuesto,
    total,
  } = calcularTotales(lineasEnriquecidas, input.descuento, input.aplicaImpuesto);

  const cotizacionId = await prisma.$transaction(async (tx) => {
    const cot = await tx.cotizacion.create({
      data: {
        numero: numeroCotizacion,
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

  const cotizacion = await findCotizacion(cotizacionId);
  const moneda = 'moneda' in cotizacion ? String(cotizacion.moneda ?? 'CLP') : 'CLP';

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'COTIZACION',
    tipo: TipoMovimientoCRM.COTIZACION_CREADA,
    entidadId: cotizacion.id,
    descripcion: `Se creó cotización ${numeroCotizacion} por ${formatMoney(input.total ?? total, moneda)}${descripcionEmpresa(cotizacion.clienteNombre)}${descripcionOportunidad(oportunidad, 'en')}`,
    datos: {
      numero: numeroCotizacion,
      total: input.total ?? total,
      empresa: cotizacion.clienteNombre,
      funnelBeckId: oportunidad?.id ?? null,
      oportunidad: oportunidad?.nombreProyecto ?? null,
    },
  });

  return { cotizacion, advertencias };
};

export const listCotizaciones = async () =>
  prisma.cotizacion.findMany({
    where: { esActual: true },
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

export const getCotizacionVersiones = async (id: string) => {
  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id },
  });

  if (!cotizacion) {
    throw new CotizacionError('Cotización no encontrada', 404);
  }

  const baseId = cotizacion.cotizacionBaseId ?? cotizacion.id;

  return prisma.cotizacion.findMany({
    where: {
      OR: [
        { id: baseId },
        { cotizacionBaseId: baseId },
      ],
    },
    orderBy: {
      version: 'desc',
    },
    include: {
      lineas: {
        orderBy: { orden: 'asc' },
      },
      creadoPor: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
      obra: true,
      funnelBeck: true,
    },
  });
};

export const updateCotizacion = async (
  id: string,
  input: UpdateCotizacionInput,
  userId: string,
) => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    include: { lineas: true },
  });

  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  if (input.obraId !== undefined) await validateObra(input.obraId);
  if (input.funnelBeckId !== undefined) await validateFunnelBeck(input.funnelBeckId);
  if (input.descuento !== undefined) validateDescuentoPct(input.descuento);

  const numeroCotizacion =
    input.numero !== undefined
      ? input.numero?.trim() || existing.numero
      : existing.numero;
  const cotizacionBaseId = existing.cotizacionBaseId ?? existing.id;
  const versionesMismaCotizacion = await prisma.cotizacion.findMany({
    where: {
      OR: [
        { id: cotizacionBaseId },
        { cotizacionBaseId },
      ],
    },
    select: {
      id: true,
      version: true,
    },
  });
  const idsMismaCotizacion = versionesMismaCotizacion.map((cotizacion) => cotizacion.id);

  await validateNumeroDisponibleParaUpdate(numeroCotizacion, idsMismaCotizacion);

  const funnelBeckIdFinal =
    input.funnelBeckId !== undefined ? input.funnelBeckId : existing.funnelBeckId;
  const oportunidad = await findOportunidadCotizacion(funnelBeckIdFinal);
  const cambioFunnelBeck = existing.funnelBeckId !== funnelBeckIdFinal;
  const oportunidadAnterior =
    cambioFunnelBeck && existing.funnelBeckId
      ? await findOportunidadCotizacion(existing.funnelBeckId)
      : null;

  const descuento = input.descuento ?? Number(existing.descuento);
  const aplicaImpuesto = input.aplicaImpuesto ?? existing.aplicaImpuesto;

  let lineasParaCalcular: LineaInput[];
  let advertencias: string[] = [];

  if (input.lineas !== undefined) {
    const resultado = await enrichLineasFiremat(input.lineas);
    lineasParaCalcular = resultado.lineas;
    advertencias = resultado.advertencias;
  } else {
    lineasParaCalcular = existing.lineas.map((l) => ({
      tipoLinea: l.tipoLinea,
      descripcion: l.descripcion,
      unidad: l.unidad,
      cantidad: Number(l.cantidad),
      precioUnitario: Number(l.precioUnitario),
      gananciaPct: Number(l.gananciaPct),
      subtotal: Number(l.subtotal),
      orden: l.orden,
      notasLinea: l.notasLinea,
      productoFirematId: l.productoFirematId ?? null,
    }));
  }

  const { lineasCalculadas, subtotal, impuesto, total } = calcularTotales(
    lineasParaCalcular,
    descuento,
    aplicaImpuesto,
  );

  const nuevaVersion = Math.max(
    existing.version,
    ...versionesMismaCotizacion.map((cotizacion) => cotizacion.version),
  ) + 1;

  const nuevaCotizacionId = await prisma.$transaction(async (tx) => {
    await tx.cotizacion.updateMany({
      where: {
        OR: [
          { id: cotizacionBaseId },
          { cotizacionBaseId },
        ],
      },
      data: { esActual: false },
    });

    const nueva = await tx.cotizacion.create({
      data: {
        numero: numeroCotizacion,
        version: nuevaVersion,
        esActual: true,
        cotizacionBaseId,

        clienteNombre:
          input.clienteNombre !== undefined
            ? input.clienteNombre
            : existing.clienteNombre,

        obraId: input.obraId !== undefined ? input.obraId : existing.obraId,
        funnelBeckId: funnelBeckIdFinal,

        estado: input.estado !== undefined ? input.estado : existing.estado,

        subtotal: toDecimal(subtotal),
        descuento: toDecimal(descuento),
        impuesto: toDecimal(impuesto),
        aplicaImpuesto,
        total: toDecimal(total),

        vigencia: input.vigencia !== undefined ? input.vigencia : existing.vigencia,
        observaciones:
          input.observaciones !== undefined
            ? input.observaciones
            : existing.observaciones,

        creadoPorId: userId,
      },
      select: { id: true },
    });

    await tx.lineaCotizacion.createMany({
      data: lineasCreateData(nueva.id, lineasCalculadas),
    });

    return nueva.id;
  });

  const nuevaCotizacion = await findCotizacion(nuevaCotizacionId);
  const totalAntes = parseFloat(existing.total.toFixed(2));
  const totalDespues = input.total ?? total;
  const numeroVisible = nuevaCotizacion.numero ?? existing.numero ?? 'sin número';
  const moneda = 'moneda' in nuevaCotizacion ? String(nuevaCotizacion.moneda ?? 'CLP') : 'CLP';
  const anteriores = new Set(
    existing.lineas.map((linea) =>
      linea.descripcion.trim().toLowerCase(),
    ),
  );
  const lineasNuevas = nuevaCotizacion.lineas.filter((linea) => {
    const descripcion = linea.descripcion.trim().toLowerCase();
    return descripcion && !anteriores.has(descripcion);
  });

  let descripcion = '';

  if (lineasNuevas.length > 0) {
    descripcion = `Se editó cotización ${numeroVisible}, se agregó "${lineasNuevas[0].descripcion}" de ${formatMoney(totalAntes, moneda)} a ${formatMoney(totalDespues, moneda)}${descripcionEmpresa(nuevaCotizacion.clienteNombre)}${descripcionOportunidad(oportunidad, 'en')}`;
  } else if (totalAntes !== totalDespues) {
    descripcion = `Se editó cotización ${numeroVisible} de ${formatMoney(totalAntes, moneda)} a ${formatMoney(totalDespues, moneda)}${descripcionEmpresa(nuevaCotizacion.clienteNombre)}${descripcionOportunidad(oportunidad, 'en')}`;
  } else {
    descripcion = `Se editó cotización ${numeroVisible}${descripcionEmpresa(nuevaCotizacion.clienteNombre)}${descripcionOportunidad(oportunidad, 'en')}`;
  }

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'COTIZACION',
    tipo: TipoMovimientoCRM.COTIZACION_EDITADA,
    entidadId: nuevaCotizacion.id,
    descripcion,
    datos: {
      numero: numeroVisible,
      versionAnterior: existing.version,
      versionNueva: nuevaCotizacion.version,
      totalAntes,
      totalDespues,
      moneda,
      empresa: nuevaCotizacion.clienteNombre,
      funnelBeckId: oportunidad?.id ?? null,
      oportunidad: oportunidad?.nombreProyecto ?? null,
      lineasNuevas: lineasNuevas.map((linea) => linea.descripcion),
    },
  });

  if (cambioFunnelBeck && oportunidad) {
    const descripcionAsignacion = oportunidadAnterior
      ? `Se reasignó cotización ${numeroVisible} de oportunidad ${oportunidadAnterior.nombreProyecto} a oportunidad ${oportunidad.nombreProyecto}`
      : `Se asignó cotización ${numeroVisible} a oportunidad ${oportunidad.nombreProyecto}`;

    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: 'COTIZACION',
      tipo: TipoMovimientoCRM.COTIZACION_EDITADA,
      entidadId: nuevaCotizacion.id,
      descripcion: descripcionAsignacion,
      datos: {
        numero: numeroVisible,
        funnelBeckId: oportunidad.id,
        oportunidad: oportunidad.nombreProyecto,
        funnelBeckIdAnterior: oportunidadAnterior?.id ?? null,
        oportunidadAnterior: oportunidadAnterior?.nombreProyecto ?? null,
      },
    });
  }

  return { cotizacion: nuevaCotizacion, advertencias };
};

export const patchEstado = async (id: string, estado: EstadoCotizacion, userId: string) => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  const cotizacion = await prisma.cotizacion.update({
    where: { id },
    data: { estado },
    include: INCLUDE_FULL,
  });

  const tipo = ESTADO_TIPO_MAP[estado];
  if (tipo) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: 'COTIZACION',
      tipo,
      entidadId: cotizacion.id,
      descripcion: `Cotización #${cotizacion.numero ?? cotizacion.id} marcada como ${estado}`,
      datos: { estado },
    });
  }

  return cotizacion;
};

export const deleteCotizacion = async (id: string, userId: string): Promise<void> => {
  const existing = await prisma.cotizacion.findUnique({
    where: { id },
    select: { id: true, numero: true, clienteNombre: true, total: true, funnelBeckId: true },
  });
  if (!existing) throw new CotizacionError('Cotización no encontrada', 404);

  const oportunidad = await findOportunidadCotizacion(existing.funnelBeckId);
  const numero = existing.numero ?? id;

  await prisma.cotizacion.delete({ where: { id } });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'COTIZACION',
    tipo: TipoMovimientoCRM.COTIZACION_ELIMINADA,
    entidadId: id,
    descripcion: `Se eliminó cotización ${numero} por ${formatMoney(existing.total)} para la empresa ${existing.clienteNombre}${oportunidad ? ` en oportunidad ${oportunidad.nombreProyecto}` : ''}`,
    datos: {
      numero,
      total: Number(existing.total),
      clienteNombre: existing.clienteNombre,
      funnelBeckId: existing.funnelBeckId,
      oportunidad: oportunidad?.nombreProyecto ?? null,
    },
  });
};
