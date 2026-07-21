import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';
import { puedeCambiarEmpresa } from '../../helpers/puedeCambiarEmpresa';

const ESTADOS_PERMITIDOS = [
  'BORRADOR',
  'ENVIADA',
  'SEGUIMIENTO',
  'ORDEN_CONFIRMADA',
  'GANADA',
  'PERDIDA',
  'POSTERGADA',
] as const;

type EstadoCotizacionFiremat = (typeof ESTADOS_PERMITIDOS)[number];

type DetalleInput = {
  productoId?: unknown;
  cantidad?: unknown;
  precioUnitario?: unknown;
  descuentoPct?: unknown;
  observacion?: unknown;
};

type DetalleCalculado = {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuentoPct: number;
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

const FM_MARGIN    = 40;
const FM_W         = 595;
const FM_CONTENT_W = 515;
const FM_RED       = '#c0392b';
const FM_DARK      = '#111827';
const FM_TEXT      = '#1e293b';
const FM_MUTED     = '#64748b';
const FM_BORDER    = '#e2e8f0';
const FM_ROW_ALT   = '#fff8f6';
const ESTADO_FM_COLORS: Record<string, string> = {
  BORRADOR:         '#64748b',
  ENVIADA:          '#2563eb',
  SEGUIMIENTO:      '#7c3aed',
  ORDEN_CONFIRMADA: '#0891b2',
  GANADA:           '#16a34a',
  PERDIDA:          '#dc2626',
  POSTERGADA:       '#d97706',
};

const ESTADOS_RESERVAN_STOCK = new Set<string>([
  'BORRADOR',
  'ENVIADA',
  'SEGUIMIENTO',
  'ORDEN_CONFIRMADA',
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

const parseEstado = (value: unknown): EstadoCotizacionFiremat | null => {
  if (typeof value !== 'string') return null;
  return ESTADOS_PERMITIDOS.includes(value as EstadoCotizacionFiremat)
    ? (value as EstadoCotizacionFiremat)
    : null;
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

  console.error('Error en cotizaciones Firemat:', error);
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

  const productos = await firematPrisma.producto.findMany({
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

    const subtotal = roundMoney(cantidad * precioUnitario * (1 - descuentoPct / 100));

    return {
      productoId: producto.id,
      cantidad,
      precioUnitario,
      descuentoPct,
      subtotal,
      stockDisponible: producto.stock - producto.stockReservado,
      observacion: getNullableString(detalle.observacion),
    };
  });
};

const calcularTotales = (
  detalles: DetalleCalculado[],
  descuentoPctInput: unknown,
  impuestoInput: unknown
) => {
  const subtotal = roundMoney(detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0));
  const descuentoPct = getNumber(descuentoPctInput, 0);

  if (descuentoPct === null || descuentoPct < 0 || descuentoPct > 100) {
    throw new ValidationError('descuento debe ser un porcentaje entre 0 y 100');
  }

  const descuento = roundMoney(subtotal * (descuentoPct / 100));
  const impuestoBody = getNumber(impuestoInput);
  const impuesto = impuestoBody !== null && impuestoBody >= 0
    ? roundMoney(impuestoBody)
    : roundMoney((subtotal - descuento) * IVA_PCT);
  const total = roundMoney(subtotal - descuento + impuesto);

  return { subtotal, descuento, impuesto, total };
};

const estadoReservaStock = (estado: string | null | undefined): boolean =>
  !!estado && ESTADOS_RESERVAN_STOCK.has(estado);

const estadoDescuentaStock = (estado: string | null | undefined): boolean =>
  estado === 'GANADA';

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

export const getCotizacionesFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, estado, cliente, desde, hasta } = req.query;
    const where: Prisma.CotizacionFirematWhereInput = {};

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

    const fechaCotizacion: Prisma.DateTimeFilter<'CotizacionFiremat'> = {};
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

    const data = await firematPrisma.cotizacionFiremat.findMany({
      where,
      include: buildCotizacionInclude,
      orderBy: { createdAt: 'desc' },
    });

    const resumen = {
      totalCotizaciones: data.length,
      borradores: data.filter((c) => c.estado === 'BORRADOR').length,
      enviadas: data.filter((c) => c.estado === 'ENVIADA').length,
      ganadas: data.filter((c) => c.estado === 'GANADA').length,
      perdidas: data.filter((c) => c.estado === 'PERDIDA').length,
      montoTotal: roundMoney(data.reduce((sum, c) => sum + c.total, 0)),
    };

    res.json({ success: true, data, resumen });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCotizacionFirematById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const data = await firematPrisma.cotizacionFiremat.findUnique({
      where: { id },
      include: buildCotizacionInclude,
    });

    if (!data) {
      res.status(404).json({ success: false, error: 'Cotizacion no encontrada' });
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const createCotizacionFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const cliente = getString(body.cliente);
    if (!cliente) {
      res.status(400).json({ success: false, error: 'cliente es obligatorio' });
      return;
    }

    const detalles = await validateDetalles(body.detalles);
    const totales = calcularTotales(detalles, body.descuento, body.impuesto);
    const estado = parseEstado(body.estado) ?? 'BORRADOR';

    const data = await firematPrisma.$transaction(async (tx) => {
      await ajustarStockCotizacion(tx, null, [], estado, detalles);

      return tx.cotizacionFiremat.create({
        data: {
          cliente,
          contacto: getNullableString(body.contacto),
          tipoCliente: getNullableString(body.tipoCliente),
          responsable: getNullableString(body.responsable),
          estado,
          descuento: totales.descuento,
          impuesto: totales.impuesto,
          subtotal: totales.subtotal,
          total: totales.total,
          fechaVencimiento: getDate(body.fechaVencimiento),
          fechaSeguimiento: getDate(body.fechaSeguimiento),
          fechaEnvio: estado === 'ENVIADA' ? new Date() : null,
          fechaCierre: estado === 'GANADA' ? new Date() : null,
          observaciones: getNullableString(body.observaciones),
          detalles: {
            create: detalles.map((detalle) => ({
              productoId: detalle.productoId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              descuentoPct: detalle.descuentoPct,
              subtotal: detalle.subtotal,
              stockDisponible: detalle.stockDisponible,
              observacion: detalle.observacion,
            })),
          },
        },
        include: buildCotizacionInclude,
      });
    });

    res.status(201).json({ success: true, data, message: 'Cotizacion Firemat creada' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const updateCotizacionFiremat = async (req: Request, res: Response): Promise<void> => {
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

    const detalles = await validateDetalles(body.detalles);
    const totales = calcularTotales(detalles, body.descuento, body.impuesto);

    if (req.userId && req.userRole && req.userRole !== 'administrador') {
      const actual = await firematPrisma.cotizacionFiremat.findUnique({
        where: { id },
        select: { cliente: true },
      });
      if (actual && cliente !== actual.cliente) {
        const puede = await puedeCambiarEmpresa(req.userId, req.userRole, 'firemat');
        if (!puede) {
          res.status(403).json({ success: false, error: 'No tienes permiso para cambiar la empresa o cliente asociado.' });
          return;
        }
      }
    }

    const data = await firematPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionFiremat.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      const estadoFinal = estado ?? actual.estado;
      await ajustarStockCotizacion(tx, actual.estado, actual.detalles, estadoFinal, detalles);
      await tx.cotizacionFirematDetalle.deleteMany({ where: { cotizacionId: id } });

      return tx.cotizacionFiremat.update({
        where: { id },
        data: {
          cliente,
          contacto: getNullableString(body.contacto),
          tipoCliente: getNullableString(body.tipoCliente),
          responsable: getNullableString(body.responsable),
          estado: estadoFinal,
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
              subtotal: detalle.subtotal,
              stockDisponible: detalle.stockDisponible,
              observacion: detalle.observacion,
            })),
          },
        },
        include: buildCotizacionInclude,
      });
    });

    res.json({ success: true, data, message: 'Cotizacion Firemat actualizada' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const patchEstadoCotizacionFiremat = async (req: Request, res: Response): Promise<void> => {
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

    const data = await firematPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionFiremat.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      await ajustarStockCotizacion(tx, actual.estado, actual.detalles, estado, actual.detalles);

      return tx.cotizacionFiremat.update({
        where: { id },
        data: {
          estado,
          ...(estado === 'ENVIADA' && !actual.fechaEnvio ? { fechaEnvio: new Date() } : {}),
          ...(estado === 'GANADA' && !actual.fechaCierre ? { fechaCierre: new Date() } : {}),
        },
        include: buildCotizacionInclude,
      });
    });

    res.json({ success: true, data, message: 'Estado actualizado' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const deleteCotizacionFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    await firematPrisma.$transaction(async (tx) => {
      const actual = await tx.cotizacionFiremat.findUnique({
        where: { id },
        include: { detalles: true },
      });

      if (!actual) {
        throw new NotFoundError('Cotizacion no encontrada');
      }

      if (estadoReservaStock(actual.estado)) {
        await ajustarStockCotizacion(tx, actual.estado, actual.detalles, null, []);
      }
      await tx.cotizacionFiremat.delete({ where: { id } });
    });

    res.json({ success: true, message: 'Cotizacion Firemat eliminada' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    handleError(res, error);
  }
};

export const downloadCotizacionFirematPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const cotizacion = await firematPrisma.cotizacionFiremat.findUnique({
      where: { id },
      include: buildCotizacionInclude,
    });

    if (!cotizacion) {
      res.status(404).json({ success: false, error: 'Cotizacion no encontrada' });
      return;
    }

    const fileName = `cotizacion-firemat-${cotizacion.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ size: 'A4', margin: FM_MARGIN, autoFirstPage: true });
    doc.pipe(res);

    const fval = (v: unknown): string => {
      if (v == null) return '—';
      const s = String(v).trim();
      return s.length > 0 ? s : '—';
    };

    const fmBadge = ESTADO_FM_COLORS[cotizacion.estado] ?? '#64748b';


    doc.rect(0, 0, FM_W, 4).fill(FM_RED);

    const FM_HDR_TOP   = 14;
    const FM_RBOX_X    = 348;
    const FM_RBOX_W    = FM_W - FM_MARGIN - FM_RBOX_X;
    const FM_RBOX_H    = 76;
    const FM_RBOX_HDRH = 15;

    doc.font('Helvetica-Bold').fontSize(13).fillColor(FM_DARK)
      .text('FIREMAT', FM_MARGIN, FM_HDR_TOP, { lineBreak: false });
    doc.font('Helvetica').fontSize(7.5).fillColor(FM_MUTED)
      .text('RUT: —',       FM_MARGIN, FM_HDR_TOP + 16, { lineBreak: false })
      .text('Dirección: —', FM_MARGIN, FM_HDR_TOP + 26, { width: FM_RBOX_X - FM_MARGIN - 10, lineBreak: false })
      .text('Correo: —',    FM_MARGIN, FM_HDR_TOP + 36, { lineBreak: false })
      .text('Teléfono: —',  FM_MARGIN, FM_HDR_TOP + 46, { lineBreak: false });

    doc.lineWidth(0.8).rect(FM_RBOX_X, FM_HDR_TOP - 1, FM_RBOX_W, FM_RBOX_H).stroke(FM_BORDER);
    doc.rect(FM_RBOX_X, FM_HDR_TOP - 1, FM_RBOX_W, FM_RBOX_HDRH).fill(FM_RED);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
      .text('COTIZACIÓN', FM_RBOX_X, FM_HDR_TOP + 2, { width: FM_RBOX_W, align: 'center', lineBreak: false });

    const FM_BLX = FM_RBOX_X + 6;
    const FM_BVX = FM_RBOX_X + 76;
    const FM_BVW = FM_RBOX_W - 82;

    const fmRLine = (label: string, value: string, y: number): void => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(FM_MUTED)
        .text(label, FM_BLX, y, { width: 68, lineBreak: false });
      doc.font('Helvetica').fontSize(8).fillColor(FM_TEXT)
        .text(value, FM_BVX, y, { width: FM_BVW, lineBreak: false });
    };
    fmRLine('N°:',       fval(cotizacion.numero),               FM_HDR_TOP + 20);
    fmRLine('Emisión:',  formatDate(cotizacion.fechaCotizacion), FM_HDR_TOP + 32);
    fmRLine('Vigencia:', formatDate(cotizacion.fechaVencimiento), FM_HDR_TOP + 44);

    const FM_BDGE_Y = FM_HDR_TOP + 57;
    doc.rect(FM_RBOX_X + 6, FM_BDGE_Y, FM_RBOX_W - 12, 13).fill(fmBadge);
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#ffffff')
      .text(cotizacion.estado, FM_RBOX_X + 6, FM_BDGE_Y + 3,
        { width: FM_RBOX_W - 12, align: 'center', lineBreak: false });

    doc.y = FM_HDR_TOP + FM_RBOX_H + 4;

    doc.rect(FM_MARGIN, doc.y, FM_CONTENT_W, 1.5).fill(FM_RED);
    doc.y += 8;


    const FM_BINFO_TOP = doc.y;
    const FM_BINFO_LX  = FM_MARGIN;
    const FM_BINFO_LW  = 254;
    const FM_BINFO_RX  = FM_MARGIN + FM_BINFO_LW + 7;
    const FM_BINFO_RW  = FM_W - FM_MARGIN - FM_BINFO_RX;
    const FM_BI_HDR_H  = 16;
    const FM_BI_ROW_H  = 14;
    const FM_BI_ROWS   = 5;
    const FM_BI_BODY_H = FM_BI_ROWS * FM_BI_ROW_H + 8;
    const FM_BI_TOTAL  = FM_BI_HDR_H + FM_BI_BODY_H;

    const fmDrawInfoBox = (
      bx: number,
      bw: number,
      title: string,
      rows: Array<[string, string]>,
    ): void => {
      doc.rect(bx, FM_BINFO_TOP, bw, FM_BI_HDR_H).fill(FM_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text(title, bx + 6, FM_BINFO_TOP + 4, { width: bw - 12, lineBreak: false });
      doc.lineWidth(0.5).rect(bx, FM_BINFO_TOP + FM_BI_HDR_H, bw, FM_BI_BODY_H).stroke(FM_BORDER);
      const kw = 82;
      const vw = bw - kw - 14;
      let ry = FM_BINFO_TOP + FM_BI_HDR_H + 5;
      for (const [key, value] of rows) {
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(FM_MUTED)
          .text(key, bx + 6, ry, { width: kw, lineBreak: false });
        doc.font('Helvetica').fontSize(7.5).fillColor(FM_TEXT)
          .text(value, bx + kw + 6, ry, { width: vw, lineBreak: false });
        ry += FM_BI_ROW_H;
      }
    };

    fmDrawInfoBox(FM_BINFO_LX, FM_BINFO_LW, 'DATOS DEL CLIENTE', [
      ['Cliente:',  cotizacion.cliente],
      ['Contacto:', fval(cotizacion.contacto)],
      ['Correo:',   '—'],
      ['Teléfono:', '—'],
      ['Tipo:',     fval(cotizacion.tipoCliente)],
    ]);

    fmDrawInfoBox(FM_BINFO_RX, FM_BINFO_RW, 'DATOS DE COTIZACIÓN', [
      ['Responsable:',   fval(cotizacion.responsable)],
      ['Fecha emisión:', formatDate(cotizacion.fechaCotizacion)],
      ['Vigencia:',      formatDate(cotizacion.fechaVencimiento)],
      ['Estado:',        cotizacion.estado],
      ['Versión:',       String(cotizacion.version ?? 1)],
    ]);

    doc.y = FM_BINFO_TOP + FM_BI_TOTAL + 10;


    const FM_TC_NUM = { x: FM_MARGIN,       w: 20  };
    const FM_TC_SKU = { x: FM_MARGIN + 20,  w: 60  };
    const FM_TC_PRD = { x: FM_MARGIN + 80,  w: 170 };
    const FM_TC_QTY = { x: FM_MARGIN + 250, w: 35  };
    const FM_TC_PUN = { x: FM_MARGIN + 285, w: 70  };
    const FM_TC_DSC = { x: FM_MARGIN + 355, w: 45  };
    const FM_TC_SUB = { x: FM_MARGIN + 400, w: 115 };

    const fmDrawTableHeader = (): void => {
      const ty = doc.y;
      doc.rect(FM_MARGIN, ty, FM_CONTENT_W, 17).fill(FM_RED);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff');
      doc.text('#',        FM_TC_NUM.x + 2, ty + 4, { width: FM_TC_NUM.w,                  lineBreak: false });
      doc.text('SKU',      FM_TC_SKU.x + 2, ty + 4, { width: FM_TC_SKU.w,                  lineBreak: false });
      doc.text('PRODUCTO', FM_TC_PRD.x + 2, ty + 4, { width: FM_TC_PRD.w,                  lineBreak: false });
      doc.text('CANT.',    FM_TC_QTY.x,     ty + 4, { width: FM_TC_QTY.w, align: 'right',  lineBreak: false });
      doc.text('P. UNIT.', FM_TC_PUN.x,     ty + 4, { width: FM_TC_PUN.w, align: 'right',  lineBreak: false });
      doc.text('DESC.',    FM_TC_DSC.x,     ty + 4, { width: FM_TC_DSC.w, align: 'right',  lineBreak: false });
      doc.text('SUBTOTAL', FM_TC_SUB.x,     ty + 4, { width: FM_TC_SUB.w - 4, align: 'right', lineBreak: false });
      doc.y = ty + 17;
    };

    fmDrawTableHeader();

    let fmRowIdx = 0;
    for (const detalle of cotizacion.detalles) {
      if (doc.y > 740) {
        doc.addPage();
        doc.y = FM_MARGIN;
        fmDrawTableHeader();
        fmRowIdx = 0;
      }
      const rowY = doc.y;
      const rowH = 18;

      if (fmRowIdx % 2 === 1) {
        doc.rect(FM_MARGIN, rowY, FM_CONTENT_W, rowH).fill(FM_ROW_ALT);
      }

      doc.font('Helvetica').fontSize(8).fillColor(FM_TEXT);
      doc.text(String(fmRowIdx + 1),             FM_TC_NUM.x + 2, rowY + 4, { width: FM_TC_NUM.w,                  lineBreak: false });
      doc.text(fval(detalle.producto.sku),        FM_TC_SKU.x + 2, rowY + 4, { width: FM_TC_SKU.w,                  lineBreak: false });
      doc.text(detalle.producto.nombre,           FM_TC_PRD.x + 2, rowY + 4, { width: FM_TC_PRD.w,                  lineBreak: false });
      doc.text(String(detalle.cantidad),          FM_TC_QTY.x,     rowY + 4, { width: FM_TC_QTY.w, align: 'right',  lineBreak: false });
      doc.text(formatCLP(detalle.precioUnitario), FM_TC_PUN.x,     rowY + 4, { width: FM_TC_PUN.w, align: 'right',  lineBreak: false });
      doc.text(`${detalle.descuentoPct}%`,        FM_TC_DSC.x,     rowY + 4, { width: FM_TC_DSC.w, align: 'right',  lineBreak: false });
      doc.text(formatCLP(detalle.subtotal),       FM_TC_SUB.x,     rowY + 4, { width: FM_TC_SUB.w - 4, align: 'right', lineBreak: false });

      doc.y = rowY + rowH;

      if (detalle.observacion) {
        doc.font('Helvetica').fontSize(7.5).fillColor(FM_MUTED)
          .text(`Obs: ${detalle.observacion}`, FM_TC_PRD.x + 2, doc.y, { width: FM_TC_PRD.w });
      }

      fmRowIdx++;
    }

    doc.lineWidth(0.5)
      .moveTo(FM_MARGIN, doc.y).lineTo(FM_W - FM_MARGIN, doc.y).stroke(FM_BORDER);
    doc.y += 12;


    const FM_TT_X  = 358;
    const FM_TT_LW = 112;
    const FM_TT_VX = FM_TT_X + FM_TT_LW;
    const FM_TT_VW = FM_W - FM_MARGIN - FM_TT_VX;
    let   fmTotY   = doc.y;

    const fmDrawTotRow = (
      label: string,
      value: string,
      opts: { bold?: boolean; highlight?: boolean } = {},
    ): void => {
      const { bold = false, highlight = false } = opts;
      if (highlight) {
        doc.rect(FM_TT_X - 6, fmTotY - 2, FM_W - FM_MARGIN - FM_TT_X + 6, 18).fill(FM_RED);
      }
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
        .fillColor(highlight ? '#ffffff' : FM_TEXT);
      doc.text(label, FM_TT_X,  fmTotY, { width: FM_TT_LW,                  lineBreak: false });
      doc.text(value, FM_TT_VX, fmTotY, { width: FM_TT_VW, align: 'right',  lineBreak: false });
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
      .moveTo(FM_TT_X - 6, fmTotY - 3).lineTo(FM_W - FM_MARGIN, fmTotY - 3).stroke(FM_BORDER);
    fmTotY += 4;

    fmDrawTotRow('TOTAL:', formatCLP(cotizacion.total), { bold: true, highlight: true });
    doc.y = fmTotY + 10;


    if (cotizacion.observaciones) {
      if (doc.y > 720) { doc.addPage(); doc.y = FM_MARGIN; }
      doc.y += 6;

      const obsY = doc.y;
      doc.rect(FM_MARGIN, obsY, FM_CONTENT_W, 16).fill(FM_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text('OBSERVACIONES', FM_MARGIN + 8, obsY + 4, { width: FM_CONTENT_W - 16, lineBreak: false });

      doc.y = obsY + 16;
      doc.lineWidth(0.5)
        .moveTo(FM_MARGIN, doc.y).lineTo(FM_W - FM_MARGIN, doc.y).stroke(FM_BORDER);

      doc.font('Helvetica').fontSize(8.5).fillColor(FM_TEXT)
        .text(cotizacion.observaciones, FM_MARGIN + 6, doc.y + 6, { width: FM_CONTENT_W - 12 });

      doc.y += 8;
      doc.lineWidth(0.5)
        .moveTo(FM_MARGIN, doc.y).lineTo(FM_W - FM_MARGIN, doc.y).stroke(FM_BORDER);
      doc.y += 8;
    }


    if (doc.y > 760) { doc.addPage(); doc.y = FM_MARGIN; }

    const fmSigY = doc.y < 690 ? 710 : doc.y + 24;
    doc.lineWidth(0.5)
      .moveTo(FM_MARGIN, fmSigY).lineTo(FM_MARGIN + 190, fmSigY).stroke('#94a3b8');
    doc.font('Helvetica').fontSize(8).fillColor(FM_MUTED)
      .text('Firma y Aclaración', FM_MARGIN, fmSigY + 5, { lineBreak: false });

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF Firemat:', error);
  }
};
