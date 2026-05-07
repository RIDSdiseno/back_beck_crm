import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

const parseDate = (val: string): Date | undefined => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

export const getVentasFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, estado, desde, hasta } = req.query;

    const where: Prisma.VentaWhereInput = {};

    if (typeof estado === 'string' && estado.trim()) {
      where.estado = estado.trim();
    }

    const createdAt: Prisma.DateTimeFilter<'Venta'> = {};
    if (typeof desde === 'string' && desde.trim()) {
      const d = parseDate(desde);
      if (d) createdAt.gte = d;
    }
    if (typeof hasta === 'string' && hasta.trim()) {
      const d = parseDate(hasta);
      if (d) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;

    if (typeof q === 'string' && q.trim()) {
      where.OR = [
        { cliente: { contains: q.trim(), mode: 'insensitive' } },
        { Producto: { nombre: { contains: q.trim(), mode: 'insensitive' } } },
      ];
    }

    const ventas = await firematPrisma.venta.findMany({
      where,
      include: {
        Producto: true,
        VentaDetalle: {
          include: { Producto: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = ventas.map((v) => ({
      id: v.id,
      cliente: v.cliente,
      contacto: v.contacto,
      cantidad: v.cantidad,
      precio: v.precio,
      total: v.total,
      estado: v.estado,
      responsable: v.responsable,
      fechaCierre: v.fechaCierre,
      createdAt: v.createdAt,
      producto: {
        id: v.Producto.id,
        nombre: v.Producto.nombre,
      },
      detalle: v.VentaDetalle.map((d) => ({
        id: d.id,
        productoId: d.productoId,
        nombreProducto: d.Producto.nombre,
        cantidad: d.cantidad,
        precio: d.precio,
        subtotal: d.subtotal,
      })),
    }));

    const totalVentas = data.length;
    const ventasCerradas = data.filter((v) => v.estado === 'CERRADO').length;
    const ventasProspecto = data.filter((v) => v.estado === 'PROSPECTO').length;
    const montoTotal = data.reduce((sum, v) => sum + v.total, 0);
    const montoCerrado = data
      .filter((v) => v.estado === 'CERRADO')
      .reduce((sum, v) => sum + v.total, 0);

    res.json({
      success: true,
      data,
      resumen: {
        totalVentas,
        ventasCerradas,
        ventasProspecto,
        montoTotal,
        montoCerrado,
      },
    });
  } catch (error) {
    console.error('Error al obtener ventas Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener ventas' });
  }
};
