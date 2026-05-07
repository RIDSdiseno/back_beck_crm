import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

export const getProductosFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, activo, categoriaId } = req.query;

    const where: Prisma.ProductoWhereInput = {};

    if (typeof activo === 'string') {
      where.activo = activo === 'true';
    }

    if (typeof categoriaId === 'string' && categoriaId.trim()) {
      const id = parseInt(categoriaId, 10);
      if (!isNaN(id)) where.categoriaId = id;
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
      orderBy: { createdAt: 'desc' },
    });

    const data = productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      stockReservado: p.stockReservado,
      stockDisponible: p.stock - p.stockReservado,
      minStock: p.minStock,
      activo: p.activo,
      criticidad: p.criticidad,
      ubicacion: p.ubicacion,
      imagen: p.imagen,
      categoria: p.Categoria.nombre,
      categoriaId: p.categoriaId,
      alertaStockBajo: p.stock <= p.minStock,
      createdAt: p.createdAt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener productos Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
  }
};
