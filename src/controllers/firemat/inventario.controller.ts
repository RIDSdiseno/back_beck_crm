import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

type EstadoStock = 'SIN_STOCK' | 'BAJO_STOCK' | 'OK';

const calcEstadoStock = (disponible: number, minStock: number): EstadoStock => {
  if (disponible <= 0) return 'SIN_STOCK';
  if (disponible <= minStock) return 'BAJO_STOCK';
  return 'OK';
};

const parseDate = (val: string): Date | undefined => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

export const getInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, activo, categoriaId, bajoStock, criticidad } = req.query;

    const where: Prisma.ProductoWhereInput = {};

    if (typeof activo === 'string') {
      where.activo = activo === 'true';
    }

    if (typeof categoriaId === 'string' && categoriaId.trim()) {
      const id = parseInt(categoriaId, 10);
      if (!isNaN(id)) where.categoriaId = id;
    }

    if (typeof criticidad === 'string' && criticidad.trim()) {
      where.criticidad = criticidad.trim();
    }

    if (typeof q === 'string' && q.trim()) {
      where.OR = [
        { nombre: { contains: q.trim(), mode: 'insensitive' } },
        { descripcion: { contains: q.trim(), mode: 'insensitive' } },
      ];
    }

    const productos = await firematPrisma.producto.findMany({
      where,
      include: { Categoria: true },
      orderBy: { nombre: 'asc' },
    });

    let data = productos.map((p) => {
      const stockDisponible = p.stock - p.stockReservado;
      const estadoStock = calcEstadoStock(stockDisponible, p.minStock);
      return {
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        categoria: p.Categoria.nombre,
        categoriaId: p.categoriaId,
        stock: p.stock,
        stockReservado: p.stockReservado,
        stockDisponible,
        minStock: p.minStock,
        estadoStock,
        alertaStockBajo: estadoStock !== 'OK',
        criticidad: p.criticidad,
        ubicacion: p.ubicacion,
        activo: p.activo,
        imagen: p.imagen,
        precio: p.precio,
        createdAt: p.createdAt,
      };
    });

    if (bajoStock === 'true') {
      data = data.filter((p) => p.alertaStockBajo);
    }

    data.sort((a, b) => {
      if (a.alertaStockBajo && !b.alertaStockBajo) return -1;
      if (!a.alertaStockBajo && b.alertaStockBajo) return 1;
      return a.nombre.localeCompare(b.nombre);
    });

    const totalProductos = data.length;
    const productosActivos = data.filter((p) => p.activo).length;
    const productosInactivos = totalProductos - productosActivos;
    const productosSinStock = data.filter((p) => p.estadoStock === 'SIN_STOCK').length;
    const productosBajoStock = data.filter((p) => p.estadoStock === 'BAJO_STOCK').length;
    const stockTotal = data.reduce((sum, p) => sum + p.stock, 0);
    const stockReservadoTotal = data.reduce((sum, p) => sum + p.stockReservado, 0);
    const stockDisponibleTotal = data.reduce((sum, p) => sum + p.stockDisponible, 0);

    res.json({
      success: true,
      data,
      resumen: {
        totalProductos,
        productosActivos,
        productosInactivos,
        productosSinStock,
        productosBajoStock,
        stockTotal,
        stockReservadoTotal,
        stockDisponibleTotal,
      },
    });
  } catch (error) {
    console.error('Error al obtener inventario Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener inventario' });
  }
};

export const getMovimientosInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productoId, tipo, desde, hasta } = req.query;

    const where: Prisma.MovimientoWhereInput = {};

    if (typeof productoId === 'string' && productoId.trim()) {
      const id = parseInt(productoId, 10);
      if (!isNaN(id)) where.productoId = id;
    }

    if (typeof tipo === 'string' && tipo.trim()) {
      where.tipo = tipo.trim();
    }

    const createdAt: Prisma.DateTimeFilter<'Movimiento'> = {};
    if (typeof desde === 'string' && desde.trim()) {
      const d = parseDate(desde);
      if (d) createdAt.gte = d;
    }
    if (typeof hasta === 'string' && hasta.trim()) {
      const d = parseDate(hasta);
      if (d) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;

    const movimientos = await firematPrisma.movimiento.findMany({
      where,
      include: { Producto: true },
      orderBy: { createdAt: 'desc' },
    });

    const data = movimientos.map((m) => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: m.cantidad,
      stockAnterior: m.stockAnterior,
      stockNuevo: m.stockNuevo,
      motivo: m.motivo,
      documento: m.documento,
      productoId: m.productoId,
      productoNombre: m.Producto.nombre,
      userId: m.userId,
      createdAt: m.createdAt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener movimientos Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener movimientos' });
  }
};
