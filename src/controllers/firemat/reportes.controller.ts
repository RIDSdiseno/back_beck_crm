import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

const parseDate = (val: string): Date | undefined => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const buildDateRange = (
  desde?: Date,
  hasta?: Date,
): Prisma.DateTimeFilter<never> | undefined => {
  const range: Prisma.DateTimeFilter<never> = {};
  if (desde) range.gte = desde;
  if (hasta) range.lte = hasta;
  return desde || hasta ? range : undefined;
};

const ESTADOS_ACTIVOS_COT = new Set(['ENVIADA', 'REVISADA', 'APROBADA', 'EN_NEGOCIACION']);
const ETAPAS_ACTIVAS_OP = new Set(['PROSPECTO', 'CALIFICADO', 'PROPUESTA', 'NEGOCIACION']);

export const getReportesFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fechaDesde,
      fechaHasta,
      categoriaId,
      productoId,
      estadoVenta,
      estadoCotizacion,
      etapaOportunidad,
    } = req.query;

    const desde =
      typeof fechaDesde === 'string' && fechaDesde.trim()
        ? parseDate(fechaDesde.trim())
        : undefined;
    const hasta =
      typeof fechaHasta === 'string' && fechaHasta.trim()
        ? parseDate(fechaHasta.trim())
        : undefined;
    const catIdRaw =
      typeof categoriaId === 'string' && categoriaId.trim()
        ? parseInt(categoriaId.trim(), 10)
        : undefined;
    const catId = catIdRaw && !isNaN(catIdRaw) ? catIdRaw : undefined;
    const prodIdRaw =
      typeof productoId === 'string' && productoId.trim()
        ? parseInt(productoId.trim(), 10)
        : undefined;
    const prodId = prodIdRaw && !isNaN(prodIdRaw) ? prodIdRaw : undefined;

    const dateRange = buildDateRange(desde, hasta);


    const ventasWhere: Prisma.VentaWhereInput = {};
    if (dateRange) ventasWhere.createdAt = dateRange;
    if (typeof estadoVenta === 'string' && estadoVenta.trim())
      ventasWhere.estado = estadoVenta.trim();
    if (prodId) ventasWhere.productoId = prodId;

    const productosWhere: Prisma.ProductoWhereInput = {};
    if (catId) productosWhere.categoriaId = catId;
    if (prodId) productosWhere.id = prodId;

    const cotizacionesWhere: Prisma.CotizacionFirematWhereInput = {};
    if (dateRange) cotizacionesWhere.fechaCotizacion = dateRange;
    if (typeof estadoCotizacion === 'string' && estadoCotizacion.trim())
      cotizacionesWhere.estado = estadoCotizacion.trim();

    const oportunidadesWhere: Prisma.OportunidadWhereInput = {};
    if (dateRange) oportunidadesWhere.createdAt = dateRange;
    if (typeof etapaOportunidad === 'string' && etapaOportunidad.trim())
      oportunidadesWhere.etapa = etapaOportunidad.trim();

    const movimientosWhere: Prisma.MovimientoWhereInput = {};
    if (dateRange) movimientosWhere.createdAt = dateRange;
    if (prodId) movimientosWhere.productoId = prodId;


    const [ventas, productos, cotizaciones, oportunidades, movimientos] = await Promise.all([
      firematPrisma.venta.findMany({
        where: ventasWhere,
        include: {
          VentaDetalle: { include: { Producto: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      firematPrisma.producto.findMany({
        where: productosWhere,
        include: { Categoria: true },
        orderBy: { nombre: 'asc' },
      }),
      firematPrisma.cotizacionFiremat.findMany({
        where: cotizacionesWhere,
        orderBy: { fechaCotizacion: 'desc' },
      }),
      firematPrisma.oportunidad.findMany({
        where: oportunidadesWhere,
        orderBy: { createdAt: 'desc' },
      }),
      firematPrisma.movimiento.findMany({
        where: movimientosWhere,
        include: { Producto: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);


    const totalVentas = ventas.length;
    const montoVendido = ventas.reduce((s, v) => s + v.total, 0);
    const ticketPromedio = totalVentas > 0 ? montoVendido / totalVentas : 0;

    const totalProductos = productos.length;
    const productosActivos = productos.filter((p) => p.activo).length;
    const productosBajoStock = productos.filter(
      (p) => p.activo && p.stock > 0 && p.stock <= p.minStock,
    ).length;
    const productosSinStock = productos.filter((p) => p.activo && p.stock === 0).length;
    const stockTotal = productos.reduce((s, p) => s + p.stock, 0);
    const stockDisponibleTotal = productos.reduce(
      (s, p) => s + Math.max(0, p.stock - p.stockReservado),
      0,
    );

    const cotizacionesTotal = cotizaciones.length;
    const cotizacionesActivas = cotizaciones.filter((c) =>
      ESTADOS_ACTIVOS_COT.has(c.estado),
    ).length;

    const oportunidadesTotal = oportunidades.length;
    const oportunidadesActivas = oportunidades.filter((o) =>
      ETAPAS_ACTIVAS_OP.has(o.etapa),
    ).length;


    const vxmMap = new Map<string, { cantidad: number; monto: number }>();
    for (const v of ventas) {
      const d = new Date(v.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const e = vxmMap.get(key) ?? { cantidad: 0, monto: 0 };
      e.cantidad += 1;
      e.monto += v.total;
      vxmMap.set(key, e);
    }
    const ventasPorMes = [...vxmMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, e]) => ({ mes, cantidad: e.cantidad, monto: e.monto }));


    const vxpMap = new Map<
      number,
      { productoId: number; sku: string; nombre: string; cantidadVendida: number; montoVendido: number }
    >();
    for (const v of ventas) {
      for (const d of v.VentaDetalle) {
        const e = vxpMap.get(d.productoId) ?? {
          productoId: d.productoId,
          sku: d.Producto.sku ?? '',
          nombre: d.Producto.nombre,
          cantidadVendida: 0,
          montoVendido: 0,
        };
        e.cantidadVendida += d.cantidad;
        e.montoVendido += d.subtotal;
        vxpMap.set(d.productoId, e);
      }
    }
    const ventasPorProducto = [...vxpMap.values()].sort(
      (a, b) => b.montoVendido - a.montoVendido,
    );


    const inventarioCritico = productos
      .filter((p) => p.activo && p.stock <= p.minStock)
      .map((p) => ({
        productoId: p.id,
        sku: p.sku ?? '',
        nombre: p.nombre,
        categoria: p.Categoria.nombre,
        stock: p.stock,
        stockDisponible: Math.max(0, p.stock - p.stockReservado),
        minStock: p.minStock,
        estadoStock: p.stock === 0 ? 'SIN_STOCK' : 'BAJO_STOCK',
      }))
      .sort((a, b) => a.stock - b.stock);


    const cxeMap = new Map<string, { cantidad: number; monto: number }>();
    for (const c of cotizaciones) {
      const e = cxeMap.get(c.estado) ?? { cantidad: 0, monto: 0 };
      e.cantidad += 1;
      e.monto += c.total;
      cxeMap.set(c.estado, e);
    }
    const cotizacionesPorEstado = [...cxeMap.entries()]
      .map(([estado, e]) => ({ estado, cantidad: e.cantidad, monto: e.monto }))
      .sort((a, b) => b.cantidad - a.cantidad);


    const oxeMap = new Map<string, { cantidad: number; monto: number }>();
    for (const o of oportunidades) {
      const e = oxeMap.get(o.etapa) ?? { cantidad: 0, monto: 0 };
      e.cantidad += 1;
      e.monto += o.montoEstimado ?? 0;
      oxeMap.set(o.etapa, e);
    }
    const oportunidadesPorEtapa = [...oxeMap.entries()]
      .map(([etapa, e]) => ({ etapa, cantidad: e.cantidad, monto: e.monto }))
      .sort((a, b) => b.cantidad - a.cantidad);


    const movimientosRecientes = movimientos.map((m) => ({
      id: m.id,
      fecha: m.createdAt,
      productoId: m.productoId,
      productoNombre: m.Producto.nombre,
      tipo: m.tipo,
      cantidad: m.cantidad,
      stockAnterior: m.stockAnterior,
      stockNuevo: m.stockNuevo,
      motivo: m.motivo ?? null,
    }));


    const ventasDetalle = ventas.map((v) => ({
      id: v.id,
      fecha: v.createdAt,
      cliente: v.cliente,
      contacto: v.contacto ?? null,
      responsable: v.responsable ?? null,
      estado: v.estado,
      total: v.total,
      detalle: v.VentaDetalle.map((d) => ({
        productoId: d.productoId,
        nombre: d.Producto.nombre,
        cantidad: d.cantidad,
        precio: d.precio,
        subtotal: d.subtotal,
      })),
    }));


    const productosResumen = productos.map((p) => ({
      id: p.id,
      sku: p.sku ?? '',
      nombre: p.nombre,
      categoria: p.Categoria.nombre,
      stock: p.stock,
      stockReservado: p.stockReservado,
      stockDisponible: Math.max(0, p.stock - p.stockReservado),
      minStock: p.minStock,
      activo: p.activo,
      precio: p.precio,
      precioSugerido: p.precioSugerido ?? null,
    }));


    res.json({
      success: true,
      data: {
        kpis: {
          totalVentas,
          montoVendido,
          ticketPromedio,
          totalProductos,
          productosActivos,
          productosBajoStock,
          productosSinStock,
          stockTotal,
          stockDisponibleTotal,
          cotizacionesTotal,
          cotizacionesActivas,
          oportunidadesTotal,
          oportunidadesActivas,
        },
        ventasPorMes,
        ventasPorProducto,
        inventarioCritico,
        cotizacionesPorEstado,
        oportunidadesPorEtapa,
        movimientosRecientes,
        ventasDetalle,
        productosResumen,
      },
    });
  } catch (error) {
    console.error('Error al obtener reportes Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reportes' });
  }
};
