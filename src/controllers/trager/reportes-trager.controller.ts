// Reportes de Trager: misma respuesta que los de Firemat (firemat/reportes.controller.ts),
// con estas diferencias:
// - Las oportunidades salen del funnel de Trager (FunnelTragerOpportunity).
// - Cotizaciones activas = borrador o enviada (las que aún no se aceptan, rechazan ni vencen).
// - Bajo stock y sin stock se calculan con el stock disponible, igual que en Inventario.
import { Request, Response } from 'express';
import { Prisma } from '../../generated/trager-client';
import { tragerPrisma } from '../../config/tragerPrisma';

const parseDate = (val: string): Date | undefined => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const buildDateRange = (desde?: Date, hasta?: Date): Prisma.DateTimeFilter<never> | undefined => {
  const range: Prisma.DateTimeFilter<never> = {};
  if (desde) range.gte = desde;
  if (hasta) range.lte = hasta;
  return desde || hasta ? range : undefined;
};

const parseId = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const id = parseInt(value.trim(), 10);
  return isNaN(id) ? undefined : id;
};

const ESTADOS_ACTIVOS_COT = new Set(['BORRADOR', 'ENVIADA']);
// Mismo criterio que el dashboard del funnel de Trager.
const ETAPAS_CERRADAS_OP = new Set(['GANADA', 'PERDIDA', 'POSTERGADA', 'DESCARTADO']);

export const getReportesTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaDesde, fechaHasta, estadoCotizacion, etapaOportunidad, estadoVenta } = req.query;

    const desde = typeof fechaDesde === 'string' && fechaDesde.trim() ? parseDate(fechaDesde.trim()) : undefined;
    const hasta = typeof fechaHasta === 'string' && fechaHasta.trim() ? parseDate(fechaHasta.trim()) : undefined;
    const catId = parseId(req.query.categoriaId);
    const prodId = parseId(req.query.productoId);
    const dateRange = buildDateRange(desde, hasta);

    const ventasWhere: Prisma.VentaWhereInput = {};
    if (dateRange) ventasWhere.createdAt = dateRange;
    if (typeof estadoVenta === 'string' && estadoVenta.trim()) ventasWhere.estado = estadoVenta.trim();
    if (prodId) ventasWhere.productoId = prodId;

    const productosWhere: Prisma.ProductoWhereInput = {};
    if (catId) productosWhere.categoriaId = catId;
    if (prodId) productosWhere.id = prodId;

    const cotizacionesWhere: Prisma.CotizacionTragerWhereInput = {};
    if (dateRange) cotizacionesWhere.fechaCotizacion = dateRange;
    if (typeof estadoCotizacion === 'string' && estadoCotizacion.trim()) {
      cotizacionesWhere.estado = estadoCotizacion.trim();
    }

    const oportunidadesWhere: Prisma.FunnelTragerOpportunityWhereInput = {};
    if (dateRange) oportunidadesWhere.createdAt = dateRange;
    if (typeof etapaOportunidad === 'string' && etapaOportunidad.trim()) {
      oportunidadesWhere.etapa = etapaOportunidad.trim();
    }
    if (prodId) oportunidadesWhere.productoId = prodId;

    const movimientosWhere: Prisma.MovimientoWhereInput = {};
    if (dateRange) movimientosWhere.createdAt = dateRange;
    if (prodId) movimientosWhere.productoId = prodId;

    const [ventas, productos, cotizaciones, oportunidades, movimientos] = await Promise.all([
      tragerPrisma.venta.findMany({
        where: ventasWhere,
        include: { VentaDetalle: { include: { Producto: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      tragerPrisma.producto.findMany({
        where: productosWhere,
        include: { Categoria: true },
        orderBy: { nombre: 'asc' },
      }),
      tragerPrisma.cotizacionTrager.findMany({
        where: cotizacionesWhere,
        orderBy: { fechaCotizacion: 'desc' },
      }),
      tragerPrisma.funnelTragerOpportunity.findMany({
        where: oportunidadesWhere,
        select: { etapa: true, montoEstimado: true },
      }),
      tragerPrisma.movimiento.findMany({
        where: movimientosWhere,
        include: { Producto: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const disponible = (p: { stock: number; stockReservado: number }) => Math.max(0, p.stock - p.stockReservado);
    const activos = productos.filter((p) => p.activo);
    const sinStock = (p: (typeof productos)[number]) => disponible(p) <= 0;
    const bajoStock = (p: (typeof productos)[number]) => !sinStock(p) && disponible(p) <= p.minStock;

    const inventarioCritico = activos
      .filter((p) => sinStock(p) || bajoStock(p))
      .map((p) => ({
        productoId: p.id,
        sku: p.sku ?? '',
        nombre: p.nombre,
        categoria: p.Categoria.nombre,
        stock: p.stock,
        stockDisponible: disponible(p),
        minStock: p.minStock,
        estadoStock: sinStock(p) ? 'SIN_STOCK' : 'BAJO_STOCK',
      }))
      .sort((a, b) => a.stockDisponible - b.stockDisponible);

    const agrupar = <T>(items: T[], clave: (i: T) => string, monto: (i: T) => number) => {
      const mapa = new Map<string, { cantidad: number; monto: number }>();
      for (const item of items) {
        const e = mapa.get(clave(item)) ?? { cantidad: 0, monto: 0 };
        e.cantidad += 1;
        e.monto += monto(item);
        mapa.set(clave(item), e);
      }
      return [...mapa.entries()].sort((a, b) => b[1].cantidad - a[1].cantidad);
    };

    const cotizacionesPorEstado = agrupar(cotizaciones, (c) => c.estado, (c) => c.total).map(([estado, e]) => ({
      estado,
      ...e,
    }));
    const montoVendido = ventas.reduce((s, v) => s + v.total, 0);

    const ventasPorMesMap = new Map<string, { cantidad: number; monto: number }>();
    for (const v of ventas) {
      const d = new Date(v.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const e = ventasPorMesMap.get(key) ?? { cantidad: 0, monto: 0 };
      e.cantidad += 1;
      e.monto += v.total;
      ventasPorMesMap.set(key, e);
    }
    const ventasPorMes = [...ventasPorMesMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, e]) => ({ mes, cantidad: e.cantidad, monto: e.monto }));

    const ventasPorProductoMap = new Map<
      number,
      { productoId: number; sku: string; nombre: string; cantidadVendida: number; montoVendido: number }
    >();
    for (const v of ventas) {
      for (const d of v.VentaDetalle) {
        const e = ventasPorProductoMap.get(d.productoId) ?? {
          productoId: d.productoId,
          sku: d.Producto.sku ?? '',
          nombre: d.Producto.nombre,
          cantidadVendida: 0,
          montoVendido: 0,
        };
        e.cantidadVendida += d.cantidad;
        e.montoVendido += d.subtotal;
        ventasPorProductoMap.set(d.productoId, e);
      }
    }
    const ventasPorProducto = [...ventasPorProductoMap.values()].sort((a, b) => b.montoVendido - a.montoVendido);

    const oportunidadesPorEtapa = agrupar(oportunidades, (o) => o.etapa, (o) => o.montoEstimado ?? 0).map(
      ([etapa, e]) => ({ etapa, ...e }),
    );

    res.json({
      success: true,
      data: {
        ventasDisponible: true,
        kpis: {
          totalVentas: ventas.length,
          montoVendido,
          ticketPromedio: ventas.length > 0 ? montoVendido / ventas.length : 0,
          totalProductos: productos.length,
          productosActivos: activos.length,
          productosBajoStock: activos.filter(bajoStock).length,
          productosSinStock: activos.filter(sinStock).length,
          stockTotal: productos.reduce((s, p) => s + p.stock, 0),
          stockDisponibleTotal: productos.reduce((s, p) => s + disponible(p), 0),
          cotizacionesTotal: cotizaciones.length,
          cotizacionesActivas: cotizaciones.filter((c) => ESTADOS_ACTIVOS_COT.has(c.estado)).length,
          oportunidadesTotal: oportunidades.length,
          oportunidadesActivas: oportunidades.filter((o) => !ETAPAS_CERRADAS_OP.has(o.etapa)).length,
        },
        ventasPorMes,
        ventasPorProducto,
        inventarioCritico,
        cotizacionesPorEstado,
        oportunidadesPorEtapa,
        movimientosRecientes: movimientos.map((m) => ({
          id: m.id,
          fecha: m.createdAt,
          productoId: m.productoId,
          productoNombre: m.Producto.nombre,
          tipo: m.tipo,
          cantidad: m.cantidad,
          stockAnterior: m.stockAnterior,
          stockNuevo: m.stockNuevo,
          motivo: m.motivo ?? null,
        })),
        ventasDetalle: ventas.map((v) => ({
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
        })),
        productosResumen: productos.map((p) => ({
          id: p.id,
          sku: p.sku ?? '',
          nombre: p.nombre,
          categoria: p.Categoria.nombre,
          stock: p.stock,
          stockReservado: p.stockReservado,
          stockDisponible: disponible(p),
          minStock: p.minStock,
          activo: p.activo,
          precio: p.precio,
          precioSugerido: p.precioSugerido ?? null,
        })),
      },
    });
  } catch (error) {
    console.error('Error al obtener reportes Trager:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reportes' });
  }
};
