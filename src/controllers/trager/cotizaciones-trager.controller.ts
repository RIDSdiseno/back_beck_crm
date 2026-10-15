// Cotizaciones de Trager: misma lógica que Firemat (firemat/cotizaciones-firemat.controller.ts)
// sobre la base de Trager: versiones, moneda, IVA opcional, cliente y contacto vinculados,
// vínculo con el funnel y % de ganancia visible solo para administradores.
import fs from 'node:fs';
import path from 'node:path';
import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Prisma } from '../../generated/trager-client';
import { tragerPrisma } from '../../config/tragerPrisma';
import { puedeCambiarEmpresa } from '../../helpers/puedeCambiarEmpresa';

// Trager todavía no tiene logo en el backend: el PDF usa el nombre como encabezado.
// Para agregarlo basta con dejar el archivo en src/assets/trager-logo.png.
const TG_LOGO_PATH = path.join(__dirname, '../../assets/trager-logo.png');
const TG_LOGO_BUFFER = fs.existsSync(TG_LOGO_PATH) ? fs.readFileSync(TG_LOGO_PATH) : null;
const TG_LOGO_ASPECT = 214 / 375;

const ESTADOS_PERMITIDOS = [
  'BORRADOR',
  'ENVIADA',
  'ACEPTADA',
  'RECHAZADA',
  'VENCIDA',
] as const;

type EstadoCotizacionTrager = (typeof ESTADOS_PERMITIDOS)[number];

type DetalleInput = {
  productoId?: unknown;
  cantidad?: unknown;
  precioUnitario?: unknown;
  descuentoPct?: unknown;
  gananciaPct?: unknown;
  observacion?: unknown;
};

type DetalleCalculado = {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuentoPct: number;
  gananciaPct: number;
  subtotal: number;
  stockDisponible: number;
  observacion: string | null;
};

type StockDetalle = {
  productoId: number;
  cantidad: number;
};

type LockedProducto = {
  id: number;
  nombre: string;
  stock: number;
  stockReservado: number;
};

const IVA_PCT = 0.19;

const TG_MARGIN    = 40;
const TG_W         = 595;
const TG_CONTENT_W = 515;
const TG_RED       = '#e63c1e';
const TG_DARK      = '#111827';
const TG_TEXT      = '#1e293b';
const TG_MUTED     = '#64748b';
const TG_BORDER    = '#e2e8f0';
const TG_ROW_ALT   = '#fff7f5';
const ESTADO_TG_COLORS: Record<string, string> = {
  BORRADOR:  '#64748b',
  ENVIADA:   '#2563eb',
  ACEPTADA:  '#16a34a',
  RECHAZADA: '#dc2626',
  VENCIDA:   '#d97706',
};

const ESTADOS_RESERVAN_STOCK = new Set<string>([
  'BORRADOR',
  'ENVIADA',
]);

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const canViewGanancia = (req: Request): boolean => req.userRole === 'administrador';

const stripGananciaPctFromRawDetalles = (raw: unknown): unknown => {
  if (!Array.isArray(raw)) return raw;

  return raw.map((item) => (
    item && typeof item === 'object'
      ? { ...(item as Record<string, unknown>), gananciaPct: 0 }
      : item
  ));
};

export const maskCotizacionTragerGanancia = <T>(value: T, showGanancia: boolean): T => {
  if (showGanancia) return value;

  if (Array.isArray(value)) {
    return value.map((item) => maskCotizacionTragerGanancia(item, false)) as T;
  }

  if (!value || typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  const masked: Record<string, unknown> = { ...record };

  if (Array.isArray(record.detalles)) {
    masked.detalles = record.detalles.map((detalle) => (
      detalle && typeof detalle === 'object'
        ? { ...(detalle as Record<string, unknown>), gananciaPct: 0 }
        : detalle
    ));
  }

  return masked as T;
};

const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const getString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  return getString(value);
};

const getNumber = (value: unknown, fallback?: number): number | null => {
  if (value === undefined || value === null || value === '') return fallback ?? null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const getInt = (value: unknown): number | null => {
  const n = getNumber(value);
  return n !== null && Number.isInteger(n) ? n : null;
};

const getBoolean = (value: unknown, fallback: boolean): boolean => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

const getDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
};

const parseIdParam = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseEstado = (value: unknown): EstadoCotizacionTrager | null => {
  if (typeof value !== 'string') return null;
  return ESTADOS_PERMITIDOS.includes(value as EstadoCotizacionTrager)
    ? (value as EstadoCotizacionTrager)
    : null;
};

const resolveClienteContactoIds = async (
  body: Record<string, unknown>
): Promise<{ clienteTragerId: number | null; contactoTragerId: number | null }> => {
  const clienteTragerId = getInt(body.clienteTragerId ?? body.clienteId);
  const contactoTragerId = getInt(body.contactoTragerId ?? body.contactoId);

  if (clienteTragerId !== null) {
    const cliente = await tragerPrisma.cliente.findUnique({
      where: { id: clienteTragerId },
      select: { id: true },
    });
    if (!cliente) throw new ValidationError('clienteTragerId no existe');
  }

  if (contactoTragerId !== null) {
    const contacto = await tragerPrisma.contactoClienteTrager.findUnique({
      where: { id: contactoTragerId },
      select: { id: true },
    });
    if (!contacto) throw new ValidationError('contactoTragerId no existe');
  }

  return { clienteTragerId, contactoTragerId };
};

const resolveFunnelTragerId = async (body: Record<string, unknown>): Promise<number | null> => {
  const funnelTragerId = getInt(body.funnelTragerId);
  if (funnelTragerId === null) return null;

  const oportunidad = await tragerPrisma.funnelTragerOpportunity.findUnique({
    where: { id: funnelTragerId },
    select: { id: true },
  });
  if (!oportunidad) throw new ValidationError('funnelTragerId no existe');

  return funnelTragerId;
};

const vincularOportunidadTragerACotizacion = async (
  tx: Prisma.TransactionClient,
  cotizacionId: number,
  funnelTragerId: number | null
): Promise<void> => {
  await tx.funnelTragerOpportunity.updateMany({
    where: {
      cotizacionId,
      ...(funnelTragerId !== null ? { id: { not: funnelTragerId } } : {}),
    },
    data: { cotizacionId: null },
  });

  if (funnelTragerId !== null) {
    await tx.funnelTragerOpportunity.update({
      where: { id: funnelTragerId },
      data: { cotizacionId },
    });
  }
};

const formatCLP = (value: number): string =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: Date | null | undefined): string =>
  value ? new Date(value).toLocaleDateString('es-CL') : '-';

const buildCotizacionInclude = {
  detalles: {
    include: {
      producto: {
        include: { Categoria: true },
      },
    },
    orderBy: { id: 'asc' as const },
  },
  FunnelTragerOpportunity: {
    select: { id: true },
  },
};

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof NotFoundError) {
    res.status(404).json({ success: false, error: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(404).json({ success: false, error: 'Cotizacion no encontrada' });
    return;
  }

  console.error('Error en cotizaciones Trager:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const validateDetalles = async (rawDetalles: unknown): Promise<DetalleCalculado[]> => {
  if (!Array.isArray(rawDetalles) || rawDetalles.length === 0) {
    throw new ValidationError('Debe incluir al menos 1 producto');
  }

  const detallesInput = rawDetalles as DetalleInput[];
  const productoIds = detallesInput
    .map((d) => getInt(d.productoId))
    .filter((id): id is number => id !== null);

  if (productoIds.length !== detallesInput.length) {
    throw new ValidationError('Todos los detalles deben incluir productoId valido');
  }

  const productos = await tragerPrisma.producto.findMany({
    where: { id: { in: productoIds } },
  });
  const productosById = new Map(productos.map((p) => [p.id, p]));

  return detallesInput.map((detalle) => {
    const productoId = getInt(detalle.productoId);
    const producto = productoId === null ? null : productosById.get(productoId);

    if (!producto) {
      throw new ValidationError(`Producto ${productoId ?? ''} no existe`);
    }
    if (!producto.activo) {
      throw new ValidationError(`Producto ${producto.nombre} no esta activo`);
    }

    const cantidad = getNumber(detalle.cantidad);
    if (cantidad === null || cantidad <= 0) {
      throw new ValidationError(`Cantidad invalida para ${producto.nombre}`);
    }

    const precioUnitario = getNumber(detalle.precioUnitario);
    if (precioUnitario === null || precioUnitario < 0) {
      throw new ValidationError(`Precio unitario invalido para ${producto.nombre}`);
    }

    const descuentoPct = getNumber(detalle.descuentoPct, 0);
    if (descuentoPct === null || descuentoPct < 0 || descuentoPct > 100) {
      throw new ValidationError(`Descuento invalido para ${producto.nombre}`);
    }

    const gananciaPct = getNumber(detalle.gananciaPct, 0);
    if (gananciaPct === null || gananciaPct < 0 || gananciaPct > 100) {
      throw new ValidationError(`Ganancia invalida para ${producto.nombre}`);
    }

    const precioConMargen = precioUnitario * (1 + gananciaPct / 100);
    const subtotal = roundMoney(cantidad * precioConMargen * (1 - descuentoPct / 100));

    return {
      productoId: producto.id,
      cantidad,
      precioUnitario,
      descuentoPct,
      gananciaPct,
      subtotal,
      stockDisponible: producto.stock - producto.stockReservado,
      observacion: getNullableString(detalle.observacion),
    };
  });
};

const calcularTotales = (
  detalles: DetalleCalculado[],
  descuentoPctInput: unknown,
  impuestoInput: unknown,
  aplicaImpuesto: boolean
) => {
  const subtotal = roundMoney(detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0));
  const descuentoPct = getNumber(descuentoPctInput, 0);

  if (descuentoPct === null || descuentoPct < 0 || descuentoPct > 100) {
    throw new ValidationError('descuento debe ser un porcentaje entre 0 y 100');
  }

  const descuento = roundMoney(subtotal * (descuentoPct / 100));
  const impuestoBody = getNumber(impuestoInput);
  const impuesto = !aplicaImpuesto
    ? 0
    : impuestoBody !== null && impuestoBody >= 0
      ? roundMoney(impuestoBody)
      : roundMoney((subtotal - descuento) * IVA_PCT);
  const total = roundMoney(subtotal - descuento + impuesto);

  return { subtotal, descuento, impuesto, total };
};

const estadoReservaStock = (estado: string | null | undefined): boolean =>
  !!estado && ESTADOS_RESERVAN_STOCK.has(estado);

const estadoDescuentaStock = (estado: string | null | undefined): boolean =>
  estado === 'ACEPTADA';

const aggregateStockDetalles = (detalles: StockDetalle[]): Map<number, number> => {
  const aggregated = new Map<number, number>();
  for (const detalle of detalles) {
    if (!Number.isInteger(detalle.cantidad) || detalle.cantidad <= 0) {
      throw new ValidationError('Todas las cantidades deben ser enteros positivos');
    }
    aggregated.set(
      detalle.productoId,
      (aggregated.get(detalle.productoId) ?? 0) + detalle.cantidad
    );
  }
  return aggregated;
};

const lockProductos = async (
  tx: Prisma.TransactionClient,
  productoIds: number[]
): Promise<Map<number, LockedProducto>> => {
  const uniqueIds = [...new Set(productoIds)];
  if (uniqueIds.length === 0) return new Map();

  const productos = await tx.$queryRaw<LockedProducto[]>(
    Prisma.sql`SELECT id, nombre, stock, "stockReservado" FROM "Producto" WHERE id IN (${Prisma.join(uniqueIds)}) FOR UPDATE`
  );
  const productosById = new Map(productos.map((producto) => [producto.id, producto]));

  for (const productoId of uniqueIds) {
    if (!productosById.has(productoId)) {
      throw new ValidationError(`Producto ${productoId} no existe`);
    }
  }

  return productosById;
};

const updateProductoStock = async (
  tx: Prisma.TransactionClient,
  productoId: number,
  data: Prisma.ProductoUpdateInput
): Promise<void> => {
  await tx.producto.update({
    where: { id: productoId },
    data,
  });
};

const revertirStockCotizacion = async (
  tx: Prisma.TransactionClient,
  productosById: Map<number, LockedProducto>,
  estadoAnterior: string | null | undefined,
  detallesAnteriores: Map<number, number>
): Promise<void> => {
  if (estadoReservaStock(estadoAnterior)) {
    for (const [productoId, cantidad] of detallesAnteriores) {
      const producto = productosById.get(productoId);
      if (!producto || producto.stockReservado < cantidad) {
        throw new ValidationError('La reserva actual de stock no permite revertir esta cotizacion');
      }

      producto.stockReservado -= cantidad;
      await updateProductoStock(tx, productoId, {
        stockReservado: { decrement: cantidad },
      });
    }
    return;
  }

  if (estadoDescuentaStock(estadoAnterior)) {
    for (const [productoId, cantidad] of detallesAnteriores) {
      const producto = productosById.get(productoId);
      if (!producto) {
        throw new ValidationError(`Producto ${productoId} no existe`);
      }

      producto.stock += cantidad;
      await updateProductoStock(tx, productoId, {
        stock: { increment: cantidad },
      });
    }
  }
};

const aplicarStockCotizacion = async (
  tx: Prisma.TransactionClient,
  productosById: Map<number, LockedProducto>,
  estadoNuevo: string | null | undefined,
  detallesNuevos: Map<number, number>
): Promise<void> => {
  if (estadoReservaStock(estadoNuevo)) {
    for (const [productoId, cantidad] of detallesNuevos) {
      const producto = productosById.get(productoId);
      if (!producto) {
        throw new ValidationError(`Producto ${productoId} no existe`);
      }

      const disponible = producto.stock - producto.stockReservado;
      if (disponible < cantidad) {
        throw new ValidationError(`Stock disponible insuficiente para ${producto.nombre}`);
      }

      producto.stockReservado += cantidad;
      await updateProductoStock(tx, productoId, {
        stockReservado: { increment: cantidad },
      });
    }
    return;
  }

  if (estadoDescuentaStock(estadoNuevo)) {
    for (const [productoId, cantidad] of detallesNuevos) {
      const producto = productosById.get(productoId);
      if (!producto) {
        throw new ValidationError(`Producto ${productoId} no existe`);
      }
      const disponible = producto.stock - producto.stockReservado;
      if (disponible < cantidad) {
        throw new ValidationError(`Stock insuficiente para ganar la cotizacion de ${producto.nombre}`);
      }

      producto.stock -= cantidad;
      await updateProductoStock(tx, productoId, {
        stock: { decrement: cantidad },
      });
    }
  }
};

const ajustarStockCotizacion = async (
  tx: Prisma.TransactionClient,
  estadoAnterior: string | null | undefined,
  detallesAnterioresRaw: StockDetalle[],
  estadoNuevo: string | null | undefined,
  detallesNuevosRaw: StockDetalle[]
): Promise<void> => {
  const detallesAnteriores = aggregateStockDetalles(detallesAnterioresRaw);
  const detallesNuevos = aggregateStockDetalles(detallesNuevosRaw);
  const productoIds = [...detallesAnteriores.keys(), ...detallesNuevos.keys()];
  const productosById = await lockProductos(tx, productoIds);

  await revertirStockCotizacion(tx, productosById, estadoAnterior, detallesAnteriores);
  await aplicarStockCotizacion(tx, productosById, estadoNuevo, detallesNuevos);
};

export const getCotizacionesTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, estado, cliente, desde, hasta } = req.query;
    const where: Prisma.CotizacionTragerWhereInput = {};

    if (typeof estado === 'string' && estado.trim()) {
      where.estado = estado.trim();
    }

    if (typeof cliente === 'string' && cliente.trim()) {
      where.cliente = { contains: cliente.trim(), mode: 'insensitive' };
    }

    if (typeof q === 'string' && q.trim()) {
      const term = q.trim();
      where.OR = [
        { cliente: { contains: term, mode: 'insensitive' } },
        { contacto: { contains: term, mode: 'insensitive' } },
        { responsable: { contains: term, mode: 'insensitive' } },
      ];
    }

    const fechaCotizacion: Prisma.DateTimeFilter<'CotizacionTrager'> = {};
    if (typeof desde === 'string' && desde.trim()) {
      const d = getDate(desde);
      if (d) fechaCotizacion.gte = d;
    }
    if (typeof hasta === 'string' && hasta.trim()) {
      const d = getDate(hasta);
      if (d) {
        d.setHours(23, 59, 59, 999);
        fechaCotizacion.lte = d;
      }
    }
    if (Object.keys(fechaCotizacion).length > 0) where.fechaCotizacion = fechaCotizacion;

    const data = await tragerPrisma.cotizacionTrager.findMany({
      where,
      include: buildCotizacionInclude,
      orderBy: { createdAt: 'desc' },
    });

    const resumen = {
      totalCotizaciones: data.length,
      borradores: data.filter((c) => c.estado === 'BORRADOR').length,
      enviadas: data.filter((c) => c.estado === 'ENVIADA').length,
      aceptadas: data.filter((c) => c.estado === 'ACEPTADA').length,
      rechazadas: data.filter((c) => c.estado === 'RECHAZADA').length,
      montoTotal: roundMoney(data.reduce((sum, c) => sum + c.total, 0)),
    };

    res.json({ success: true, data: maskCotizacionTragerGanancia(data, canViewGanancia(req)), resumen });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCotizacionTragerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const data = await tragerPrisma.cotizacionTrager.findUnique({
      where: { id },
      include: buildCotizacionInclude,
    });

    if (!data) {
      res.status(404).json({ success: false, error: 'Cotizacion no encontrada' });
      return;
    }

    res.json({ success: true, data: maskCotizacionTragerGanancia(data, canViewGanancia(req)) });
  } catch (error) {
    handleError(res, error);
  }
};

export const createCotizacionTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const cliente = getString(body.cliente);
    if (!cliente) {
      res.status(400).json({ success: false, error: 'cliente es obligatorio' });
      return;
    }

    const detallesRaw = canViewGanancia(req) ? body.detalles : stripGananciaPctFromRawDetalles(body.detalles);
    const detalles = await validateDetalles(detallesRaw);
    const aplicaImpuesto = getBoolean(body.aplicaImpuesto, true);
    const totales = calcularTotales(detalles, body.descuento, body.impuesto, aplicaImpuesto);
    const estado = parseEstado(body.estado) ?? 'BORRADOR';
    const { clienteTragerId, contactoTragerId } = await resolveClienteContactoIds(body);
    const funnelTragerId = await resolveFunnelTragerId(body);

    const data = await tragerPrisma.$transaction(async (tx) => {
      await ajustarStockCotizacion(tx, null, [], estado, detalles);

      const creada = await tx.cotizacionTrager.create({
        data: {
          cliente,
          contacto: getNullableString(body.contacto),
          clienteTragerId,
          contactoTragerId,
          telefono: getNullableString(body.telefono),
          correo: getNullableString(body.correo),
          tipoCliente: getNullableString(body.tipoCliente),
          cargo: getNullableString(body.cargo),
          responsable: getNullableString(body.responsable),
          estado,
          moneda: getString(body.moneda) ?? 'CLP',
          aplicaImpuesto,
          descuento: totales.descuento,
          impuesto: totales.impuesto,
          subtotal: totales.subtotal,
          total: totales.total,
          fechaVencimiento: getDate(body.fechaVencimiento),
          fechaSeguimiento: getDate(body.fechaSeguimiento),
          fechaEnvio: estado === 'ENVIADA' ? new Date() : null,
          fechaCierre: estado === 'ACEPTADA' ? new Date() : null,
          observaciones: getNullableString(body.observaciones),
          detalles: {
            create: detalles.map((detalle) => ({
              productoId: detalle.productoId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              descuentoPct: detalle.descuentoPct,
              gananciaPct: detalle.gananciaPct,
              subtotal: detalle.subtotal,
              stockDisponible: detalle.stockDisponible,
              observacion: detalle.observacion,
            })),
          },
        },
      });

      await vincularOportunidadTragerACotizacion(tx, creada.id, funnelTragerId);

      return tx.cotizacionTrager.findUniqueOrThrow({
        where: { id: creada.id },
        include: buildCotizacionInclude,
      });
    });

    res.status(201).json({
      success: true,
      data: maskCotizacionTragerGanancia(data, canViewGanancia(req)),
      message: 'Cotizacion Trager creada',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const updateCotizacionTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const cliente = getString(body.cliente);
    if (!cliente) {
      res.status(400).json({ success: false, error: 'cliente es obligatorio' });
      return;
    }

    const estado = body.estado === undefined ? undefined : parseEstado(body.estado);
    if (body.estado !== undefined && !estado) {
      res.status(400).json({ success: false, error: `estado debe ser uno de: ${ESTADOS_PERMITIDOS.join(', ')}` });
      return;
    }

    const detallesRaw = canViewGanancia(req) ? body.detalles : stripGananciaPctFromRawDetalles(body.detalles);
    const detalles = await validateDetalles(detallesRaw);
    const aplicaImpuesto = getBoolean(body.aplicaImpuesto, true);
    const totales = calcularTotales(detalles, body.descuento, body.impuesto, aplicaImpuesto);
    const { clienteTragerId, contactoTragerId } = await resolveClienteContactoIds(body);
    const funnelTragerId = await resolveFunnelTragerId(body);

    if (req.userId && req.userRole && req.userRole !== 'administrador') {
      const actual = await tragerPrisma.cotizacionTrager.findUnique({
        where: { id },
        select: { cliente: true },
      });
      if (actual && cliente !== actual.cliente) {
        const puede = await puedeCambiarEmpresa(req.userId, req.userRole, 'trager');
        if (!puede) {
          res.status(403).json({ success: false, error: 'No tienes permiso para cambiar la empresa o cliente asociado.' });
          return;
        }
      }
    }

    const data = await tragerPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionTrager.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      const estadoFinal = estado ?? actual.estado;
      await ajustarStockCotizacion(tx, actual.estado, actual.detalles, estadoFinal, detalles);
      await tx.cotizacionTragerDetalle.deleteMany({ where: { cotizacionId: id } });

      await tx.cotizacionTrager.update({
        where: { id },
        data: {
          cliente,
          contacto: getNullableString(body.contacto),
          clienteTragerId,
          contactoTragerId,
          telefono: getNullableString(body.telefono),
          correo: getNullableString(body.correo),
          tipoCliente: getNullableString(body.tipoCliente),
          cargo: getNullableString(body.cargo),
          responsable: getNullableString(body.responsable),
          estado: estadoFinal,
          moneda: getString(body.moneda) ?? 'CLP',
          aplicaImpuesto,
          descuento: totales.descuento,
          impuesto: totales.impuesto,
          subtotal: totales.subtotal,
          total: totales.total,
          fechaVencimiento: getDate(body.fechaVencimiento),
          fechaSeguimiento: getDate(body.fechaSeguimiento),
          observaciones: getNullableString(body.observaciones),
          detalles: {
            create: detalles.map((detalle) => ({
              productoId: detalle.productoId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              descuentoPct: detalle.descuentoPct,
              gananciaPct: detalle.gananciaPct,
              subtotal: detalle.subtotal,
              stockDisponible: detalle.stockDisponible,
              observacion: detalle.observacion,
            })),
          },
        },
      });

      await vincularOportunidadTragerACotizacion(tx, id, funnelTragerId);

      return tx.cotizacionTrager.findUniqueOrThrow({
        where: { id },
        include: buildCotizacionInclude,
      });
    });

    res.json({
      success: true,
      data: maskCotizacionTragerGanancia(data, canViewGanancia(req)),
      message: 'Cotizacion Trager actualizada',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const patchEstadoCotizacionTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const estado = parseEstado((req.body as Record<string, unknown>).estado);
    if (!estado) {
      res.status(400).json({ success: false, error: `estado debe ser uno de: ${ESTADOS_PERMITIDOS.join(', ')}` });
      return;
    }

    const data = await tragerPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionTrager.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      await ajustarStockCotizacion(tx, actual.estado, actual.detalles, estado, actual.detalles);

      return tx.cotizacionTrager.update({
        where: { id },
        data: {
          estado,
          ...(estado === 'ENVIADA' && !actual.fechaEnvio ? { fechaEnvio: new Date() } : {}),
          ...(estado === 'ACEPTADA' && !actual.fechaCierre ? { fechaCierre: new Date() } : {}),
        },
        include: buildCotizacionInclude,
      });
    });

    res.json({
      success: true,
      data: maskCotizacionTragerGanancia(data, canViewGanancia(req)),
      message: 'Estado actualizado',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const deleteCotizacionTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    await tragerPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionTrager.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      if (estadoReservaStock(actual.estado)) {
        await ajustarStockCotizacion(tx, actual.estado, actual.detalles, null, []);
      }
      await tx.cotizacionTrager.delete({ where: { id } });
    });

    res.json({ success: true, message: 'Cotizacion Trager eliminada' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const downloadCotizacionTragerPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const cotizacion = await tragerPrisma.cotizacionTrager.findUnique({
      where: { id },
      include: buildCotizacionInclude,
    });

    if (!cotizacion) {
      res.status(404).json({ success: false, error: 'Cotizacion no encontrada' });
      return;
    }

    const fileName = `cotizacion-trager-${cotizacion.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ size: 'A4', margin: TG_MARGIN, autoFirstPage: true });
    doc.pipe(res);

    const fval = (v: unknown): string => {
      if (v == null) return '—';
      const s = String(v).trim();
      return s.length > 0 ? s : '—';
    };

    const tgBadge = ESTADO_TG_COLORS[cotizacion.estado] ?? '#64748b';


    doc.rect(0, 0, TG_W, 4).fill(TG_RED);

    const TG_HDR_TOP   = 14;
    const TG_RBOX_X    = 348;
    const TG_RBOX_W    = TG_W - TG_MARGIN - TG_RBOX_X;
    const TG_RBOX_H    = 108;
    const TG_RBOX_HDRH = 15;

    if (TG_LOGO_BUFFER) {
      const logoWidth = 110;
      doc.image(TG_LOGO_BUFFER, TG_MARGIN, TG_HDR_TOP - 4, {
        width: logoWidth,
        height: logoWidth * TG_LOGO_ASPECT,
      });
    } else {
      doc.font('Helvetica-Bold').fontSize(13).fillColor(TG_DARK)
        .text('TRAGER', TG_MARGIN, TG_HDR_TOP, { lineBreak: false });
    }
    const TG_INFO_TOP = TG_LOGO_BUFFER ? TG_HDR_TOP + 66 : TG_HDR_TOP + 18;
    doc.font('Helvetica').fontSize(7.5).fillColor(TG_MUTED)
      .text('RUT: —',       TG_MARGIN, TG_INFO_TOP, { lineBreak: false })
      .text('Dirección: —', TG_MARGIN, TG_INFO_TOP + 9, { width: TG_RBOX_X - TG_MARGIN - 10, lineBreak: false })
      .text('Correo: —',    TG_MARGIN, TG_INFO_TOP + 18, { lineBreak: false })
      .text('Teléfono: —',  TG_MARGIN, TG_INFO_TOP + 27, { lineBreak: false });

    doc.lineWidth(0.8).rect(TG_RBOX_X, TG_HDR_TOP - 1, TG_RBOX_W, TG_RBOX_H).stroke(TG_BORDER);
    doc.rect(TG_RBOX_X, TG_HDR_TOP - 1, TG_RBOX_W, TG_RBOX_HDRH).fill(TG_RED);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
      .text('COTIZACIÓN', TG_RBOX_X, TG_HDR_TOP + 2, { width: TG_RBOX_W, align: 'center', lineBreak: false });

    const TG_BLX = TG_RBOX_X + 6;
    const TG_BVX = TG_RBOX_X + 76;
    const TG_BVW = TG_RBOX_W - 82;

    const fmRLine = (label: string, value: string, y: number): void => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(TG_MUTED)
        .text(label, TG_BLX, y, { width: 68, lineBreak: false });
      doc.font('Helvetica').fontSize(8).fillColor(TG_TEXT)
        .text(value, TG_BVX, y, { width: TG_BVW, lineBreak: false });
    };
    fmRLine('N°:',       fval(cotizacion.numero),               TG_HDR_TOP + 30);
    fmRLine('Emisión:',  formatDate(cotizacion.fechaCotizacion), TG_HDR_TOP + 46);
    fmRLine('Vigencia:', formatDate(cotizacion.fechaVencimiento), TG_HDR_TOP + 62);

    const TG_BDGE_Y = TG_HDR_TOP + 82;
    doc.rect(TG_RBOX_X + 6, TG_BDGE_Y, TG_RBOX_W - 12, 15).fill(tgBadge);
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#ffffff')
      .text(cotizacion.estado, TG_RBOX_X + 6, TG_BDGE_Y + 4,
        { width: TG_RBOX_W - 12, align: 'center', lineBreak: false });

    doc.y = TG_HDR_TOP + TG_RBOX_H + 4;

    doc.rect(TG_MARGIN, doc.y, TG_CONTENT_W, 1.5).fill(TG_RED);
    doc.y += 8;


    const TG_BINFO_TOP = doc.y;
    const TG_BINFO_LX  = TG_MARGIN;
    const TG_BINFO_LW  = 254;
    const TG_BINFO_RX  = TG_MARGIN + TG_BINFO_LW + 7;
    const TG_BINFO_RW  = TG_W - TG_MARGIN - TG_BINFO_RX;
    const TG_BI_HDR_H  = 16;
    const TG_BI_ROW_H  = 14;
    const TG_BI_ROWS   = 5;
    const TG_BI_BODY_H = TG_BI_ROWS * TG_BI_ROW_H + 8;
    const TG_BI_TOTAL  = TG_BI_HDR_H + TG_BI_BODY_H;

    const fmDrawInfoBox = (
      bx: number,
      bw: number,
      title: string,
      rows: Array<[string, string]>,
    ): void => {
      doc.rect(bx, TG_BINFO_TOP, bw, TG_BI_HDR_H).fill(TG_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text(title, bx + 6, TG_BINFO_TOP + 4, { width: bw - 12, lineBreak: false });
      doc.lineWidth(0.5).rect(bx, TG_BINFO_TOP + TG_BI_HDR_H, bw, TG_BI_BODY_H).stroke(TG_BORDER);
      const kw = 82;
      const vw = bw - kw - 14;
      let ry = TG_BINFO_TOP + TG_BI_HDR_H + 5;
      for (const [key, value] of rows) {
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(TG_MUTED)
          .text(key, bx + 6, ry, { width: kw, lineBreak: false });
        doc.font('Helvetica').fontSize(7.5).fillColor(TG_TEXT)
          .text(value, bx + kw + 6, ry, { width: vw, lineBreak: false });
        ry += TG_BI_ROW_H;
      }
    };

    fmDrawInfoBox(TG_BINFO_LX, TG_BINFO_LW, 'DATOS DEL CLIENTE', [
      ['Cliente:',  cotizacion.cliente],
      ['Contacto:', fval(cotizacion.contacto)],
      ['Correo:',   '—'],
      ['Teléfono:', '—'],
      ['Tipo:',     fval(cotizacion.tipoCliente)],
    ]);

    fmDrawInfoBox(TG_BINFO_RX, TG_BINFO_RW, 'DATOS DE COTIZACIÓN', [
      ['Responsable:',   fval(cotizacion.responsable)],
      ['Fecha emisión:', formatDate(cotizacion.fechaCotizacion)],
      ['Vigencia:',      formatDate(cotizacion.fechaVencimiento)],
      ['Estado:',        cotizacion.estado],
      ['Versión:',       String(cotizacion.version ?? 1)],
    ]);

    doc.y = TG_BINFO_TOP + TG_BI_TOTAL + 10;


    const TG_TC_NUM = { x: TG_MARGIN,       w: 20  };
    const TG_TC_SKU = { x: TG_MARGIN + 20,  w: 60  };
    const TG_TC_PRD = { x: TG_MARGIN + 80,  w: 170 };
    const TG_TC_QTY = { x: TG_MARGIN + 250, w: 35  };
    const TG_TC_PUN = { x: TG_MARGIN + 285, w: 70  };
    const TG_TC_DSC = { x: TG_MARGIN + 355, w: 45  };
    const TG_TC_SUB = { x: TG_MARGIN + 400, w: 115 };

    const fmDrawTableHeader = (): void => {
      const ty = doc.y;
      doc.rect(TG_MARGIN, ty, TG_CONTENT_W, 17).fill(TG_RED);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff');
      doc.text('#',        TG_TC_NUM.x + 2, ty + 4, { width: TG_TC_NUM.w,                  lineBreak: false });
      doc.text('SKU',      TG_TC_SKU.x + 2, ty + 4, { width: TG_TC_SKU.w,                  lineBreak: false });
      doc.text('PRODUCTO', TG_TC_PRD.x + 2, ty + 4, { width: TG_TC_PRD.w,                  lineBreak: false });
      doc.text('CANT.',    TG_TC_QTY.x,     ty + 4, { width: TG_TC_QTY.w, align: 'right',  lineBreak: false });
      doc.text('P. UNIT.', TG_TC_PUN.x,     ty + 4, { width: TG_TC_PUN.w, align: 'right',  lineBreak: false });
      doc.text('DESC.',    TG_TC_DSC.x,     ty + 4, { width: TG_TC_DSC.w, align: 'right',  lineBreak: false });
      doc.text('SUBTOTAL', TG_TC_SUB.x,     ty + 4, { width: TG_TC_SUB.w - 4, align: 'right', lineBreak: false });
      doc.y = ty + 17;
    };

    fmDrawTableHeader();

    let fmRowIdx = 0;
    for (const detalle of cotizacion.detalles) {
      if (doc.y > 740) {
        doc.addPage();
        doc.y = TG_MARGIN;
        fmDrawTableHeader();
        fmRowIdx = 0;
      }
      const rowY = doc.y;
      const rowH = 18;

      if (fmRowIdx % 2 === 1) {
        doc.rect(TG_MARGIN, rowY, TG_CONTENT_W, rowH).fill(TG_ROW_ALT);
      }

      doc.font('Helvetica').fontSize(8).fillColor(TG_TEXT);
      doc.text(String(fmRowIdx + 1),             TG_TC_NUM.x + 2, rowY + 4, { width: TG_TC_NUM.w,                  lineBreak: false });
      doc.text(fval(detalle.producto.sku),        TG_TC_SKU.x + 2, rowY + 4, { width: TG_TC_SKU.w,                  lineBreak: false });
      doc.text(detalle.producto.nombre,           TG_TC_PRD.x + 2, rowY + 4, { width: TG_TC_PRD.w,                  lineBreak: false });
      const precioClientePdf = roundMoney(
        Number(detalle.precioUnitario) * (1 + Number(detalle.gananciaPct) / 100)
      );
      doc.text(String(detalle.cantidad),          TG_TC_QTY.x,     rowY + 4, { width: TG_TC_QTY.w, align: 'right',  lineBreak: false });
      doc.text(formatCLP(precioClientePdf),       TG_TC_PUN.x,     rowY + 4, { width: TG_TC_PUN.w, align: 'right',  lineBreak: false });
      doc.text(`${detalle.descuentoPct}%`,        TG_TC_DSC.x,     rowY + 4, { width: TG_TC_DSC.w, align: 'right',  lineBreak: false });
      doc.text(formatCLP(detalle.subtotal),       TG_TC_SUB.x,     rowY + 4, { width: TG_TC_SUB.w - 4, align: 'right', lineBreak: false });

      doc.y = rowY + rowH;

      if (detalle.observacion) {
        doc.font('Helvetica').fontSize(7.5).fillColor(TG_MUTED)
          .text(`Obs: ${detalle.observacion}`, TG_TC_PRD.x + 2, doc.y, { width: TG_TC_PRD.w });
      }

      fmRowIdx++;
    }

    doc.lineWidth(0.5)
      .moveTo(TG_MARGIN, doc.y).lineTo(TG_W - TG_MARGIN, doc.y).stroke(TG_BORDER);
    doc.y += 12;


    const TG_TT_X  = 358;
    const TG_TT_LW = 112;
    const TG_TT_VX = TG_TT_X + TG_TT_LW;
    const TG_TT_VW = TG_W - TG_MARGIN - TG_TT_VX;
    let   fmTotY   = doc.y;

    const fmDrawTotRow = (
      label: string,
      value: string,
      opts: { bold?: boolean; highlight?: boolean } = {},
    ): void => {
      const { bold = false, highlight = false } = opts;
      if (highlight) {
        doc.rect(TG_TT_X - 6, fmTotY - 2, TG_W - TG_MARGIN - TG_TT_X + 6, 18).fill(TG_RED);
      }
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
        .fillColor(highlight ? '#ffffff' : TG_TEXT);
      doc.text(label, TG_TT_X,  fmTotY, { width: TG_TT_LW,                  lineBreak: false });
      doc.text(value, TG_TT_VX, fmTotY, { width: TG_TT_VW, align: 'right',  lineBreak: false });
      fmTotY += 16;
    };

    fmDrawTotRow('Subtotal:', formatCLP(cotizacion.subtotal));
    if (cotizacion.descuento > 0) {
      fmDrawTotRow('Descuento:', `− ${formatCLP(cotizacion.descuento)}`);
    }
    if (cotizacion.impuesto > 0) {
      fmDrawTotRow('IVA (19%):', formatCLP(cotizacion.impuesto));
    }

    doc.lineWidth(0.5)
      .moveTo(TG_TT_X - 6, fmTotY - 3).lineTo(TG_W - TG_MARGIN, fmTotY - 3).stroke(TG_BORDER);
    fmTotY += 4;

    fmDrawTotRow('TOTAL:', formatCLP(cotizacion.total), { bold: true, highlight: true });
    doc.y = fmTotY + 10;


    {
      if (doc.y > 720) { doc.addPage(); doc.y = TG_MARGIN; }
      doc.y += 6;

      const obsY = doc.y;
      doc.rect(TG_MARGIN, obsY, TG_CONTENT_W, 16).fill(TG_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text('OBSERVACIONES', TG_MARGIN + 8, obsY + 4, { width: TG_CONTENT_W - 16, lineBreak: false });

      doc.y = obsY + 16;
      doc.lineWidth(0.5)
        .moveTo(TG_MARGIN, doc.y).lineTo(TG_W - TG_MARGIN, doc.y).stroke(TG_BORDER);

      if (cotizacion.observaciones) {
        doc.font('Helvetica').fontSize(8.5).fillColor(TG_TEXT)
          .text(cotizacion.observaciones, TG_MARGIN + 6, doc.y + 6, { width: TG_CONTENT_W - 12 });
      } else {
        doc.y += 26;
      }

      doc.y += 8;
      doc.lineWidth(0.5)
        .moveTo(TG_MARGIN, doc.y).lineTo(TG_W - TG_MARGIN, doc.y).stroke(TG_BORDER);
      doc.y += 8;
    }


    if (doc.y > 760) { doc.addPage(); doc.y = TG_MARGIN; }

    const fmSigY = doc.y < 690 ? 710 : doc.y + 24;
    doc.lineWidth(0.5)
      .moveTo(TG_MARGIN, fmSigY).lineTo(TG_MARGIN + 190, fmSigY).stroke('#94a3b8');
    doc.font('Helvetica').fontSize(8).fillColor(TG_MUTED)
      .text('Firma y Aclaración', TG_MARGIN, fmSigY + 5, { lineBreak: false });

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF Trager:', error);
  }
};
