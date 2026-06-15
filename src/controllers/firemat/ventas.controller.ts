import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

interface DetalleInput {
  productoId: number;
  cantidad: number;
  precio: number;
}

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

export const crearVentaFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cliente, contacto, responsable, estado, detalle } = req.body as {
      cliente?: string;
      contacto?: string;
      responsable?: string;
      estado?: string;
      detalle?: DetalleInput[];
    };

    if (!cliente || !cliente.trim()) {
      res.status(400).json({ success: false, error: 'El campo cliente es obligatorio' });
      return;
    }
    if (!detalle || !Array.isArray(detalle)) {
      res.status(400).json({ success: false, error: 'El campo detalle debe ser un array' });
      return;
    }
    if (detalle.length === 0) {
      res.status(400).json({ success: false, error: 'El detalle debe tener al menos un producto' });
      return;
    }

    for (const [i, item] of detalle.entries()) {
      if (!item.productoId || !Number.isInteger(item.productoId)) {
        res.status(400).json({ success: false, error: `detalle[${i}]: productoId inválido` });
        return;
      }
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        res.status(400).json({ success: false, error: `detalle[${i}]: cantidad debe ser > 0` });
        return;
      }
      if (typeof item.precio !== 'number' || item.precio < 0) {
        res.status(400).json({ success: false, error: `detalle[${i}]: precio debe ser >= 0` });
        return;
      }
    }

    const productoIds = detalle.map((d) => d.productoId);
    const productos = await firematPrisma.producto.findMany({
      where: { id: { in: productoIds } },
    });

    const productoMap = new Map(productos.map((p) => [p.id, p]));

    for (const [i, item] of detalle.entries()) {
      const producto = productoMap.get(item.productoId);
      if (!producto) {
        res.status(400).json({ success: false, error: `detalle[${i}]: producto con id ${item.productoId} no existe` });
        return;
      }
      if (producto.stock < item.cantidad) {
        res.status(400).json({
          success: false,
          error: `Stock insuficiente para "${producto.nombre}": disponible ${producto.stock}, solicitado ${item.cantidad}`,
        });
        return;
      }
    }

    const primerItem = detalle[0];
    const cantidadTotal = detalle.reduce((sum, d) => sum + d.cantidad, 0);
    const total = detalle.reduce((sum, d) => sum + d.cantidad * d.precio, 0);
    const now = new Date();

    const resultado = await firematPrisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          cliente: cliente.trim(),
          contacto: contacto?.trim() ?? null,
          responsable: responsable?.trim() ?? null,
          estado: estado?.trim() ?? 'PROSPECTO',
          productoId: primerItem.productoId,
          cantidad: cantidadTotal,
          precio: primerItem.precio,
          total,
          fechaCierre: estado === 'CERRADO' ? now : null,
        },
      });

      const detallesCreados = await Promise.all(
        detalle.map((item) =>
          tx.ventaDetalle.create({
            data: {
              ventaId: venta.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
              precio: item.precio,
              subtotal: item.cantidad * item.precio,
            },
          }),
        ),
      );

      for (const item of detalle) {
        const producto = productoMap.get(item.productoId)!;
        const stockAnterior = producto.stock;
        const stockNuevo = stockAnterior - item.cantidad;

        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: stockNuevo,
            salidas: (producto.salidas ?? 0) + item.cantidad,
            fechaUltimaSalida: now,
          },
        });

        await tx.movimiento.create({
          data: {
            tipo: 'VENTA',
            cantidad: item.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: 'Venta Firemat',
            productoId: item.productoId,
          },
        });
      }

      return { venta, detallesCreados };
    });

    res.status(201).json({
      success: true,
      message: 'Venta creada correctamente',
      data: {
        id: resultado.venta.id,
        cliente: resultado.venta.cliente,
        total: resultado.venta.total,
        detalle: resultado.detallesCreados.map((d) => ({
          id: d.id,
          productoId: d.productoId,
          cantidad: d.cantidad,
          precio: d.precio,
          subtotal: d.subtotal,
        })),
      },
    });
  } catch (error) {
    console.error('Error al crear venta Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al crear venta' });
  }
};
