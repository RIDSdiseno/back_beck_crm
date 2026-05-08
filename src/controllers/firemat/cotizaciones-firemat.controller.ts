import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

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

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    doc.font('Helvetica-Bold').fontSize(18).text('Cotizacion Firemat', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica').fontSize(11);
    doc.text(`Numero: ${cotizacion.id}`);
    doc.text(`Cliente: ${cotizacion.cliente}`);
    doc.text(`Contacto: ${cotizacion.contacto ?? '-'}`);
    doc.text(`Fecha: ${formatDate(cotizacion.fechaCotizacion)}`);
    doc.text(`Vencimiento: ${formatDate(cotizacion.fechaVencimiento)}`);
    doc.text(`Estado: ${cotizacion.estado}`);
    if (cotizacion.responsable) doc.text(`Responsable: ${cotizacion.responsable}`);
    if (cotizacion.observaciones) {
      doc.moveDown(0.5);
      doc.text(`Observaciones: ${cotizacion.observaciones}`);
    }
    doc.moveDown();

    let y = doc.y;
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('Producto', 50, y, { width: 190 });
    doc.text('Cant.', 250, y, { width: 45, align: 'right' });
    doc.text('P.Unit.', 305, y, { width: 75, align: 'right' });
    doc.text('Desc.', 390, y, { width: 55, align: 'right' });
    doc.text('Subtotal', 455, y, { width: 105, align: 'right' });
    doc.moveTo(50, y + 16).lineTo(560, y + 16).stroke();
    y += 26;

    for (const detalle of cotizacion.detalles) {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }

      doc.font('Helvetica').fontSize(9);
      doc.text(detalle.producto.nombre, 50, y, { width: 190 });
      doc.text(String(detalle.cantidad), 250, y, { width: 45, align: 'right' });
      doc.text(formatCLP(detalle.precioUnitario), 305, y, { width: 75, align: 'right' });
      doc.text(`${detalle.descuentoPct}%`, 390, y, { width: 55, align: 'right' });
      doc.text(formatCLP(detalle.subtotal), 455, y, { width: 105, align: 'right' });
      y += detalle.observacion ? 32 : 22;
      if (detalle.observacion) {
        doc.fontSize(8).text(`Obs: ${detalle.observacion}`, 50, y - 12, { width: 400 });
      }
    }

    y += 10;
    doc.moveTo(360, y).lineTo(560, y).stroke();
    y += 10;
    doc.font('Helvetica').fontSize(11);
    doc.text(`Subtotal: ${formatCLP(cotizacion.subtotal)}`, 360, y, { width: 200, align: 'right' });
    y += 18;
    doc.text(`Descuento: ${formatCLP(cotizacion.descuento)}`, 360, y, { width: 200, align: 'right' });
    y += 18;
    doc.text(`IVA: ${formatCLP(cotizacion.impuesto)}`, 360, y, { width: 200, align: 'right' });
    y += 20;
    doc.font('Helvetica-Bold');
    doc.text(`Total: ${formatCLP(cotizacion.total)}`, 360, y, { width: 200, align: 'right' });

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF Firemat:', error);
  }
};
