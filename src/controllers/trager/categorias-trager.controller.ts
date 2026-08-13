import { Request, Response } from 'express';
import { tragerPrisma } from '../../config/tragerPrisma';

const normalizarNombre = (value: unknown): string => {
  return String(value ?? '').trim();
};

export const getCategoriasTrager = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await tragerPrisma.categoria.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            Producto: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    res.json({
      success: true,
      data: categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        productosCount: categoria._count.Producto,
      })),
    });
  } catch (error) {
    console.error('Error al obtener categorías Trager:', error);
    res.status(500).json({ success: false, error: 'Error al obtener categorías' });
  }
};

export const crearCategoriaTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const nombre = normalizarNombre(req.body?.nombre);

    if (!nombre) {
      res.status(400).json({
        success: false,
        error: 'El nombre de la categoría es obligatorio',
      });
      return;
    }

    const existente = await tragerPrisma.categoria.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });

    if (existente) {
      res.status(409).json({
        success: false,
        error: 'Ya existe una categoría con ese nombre',
      });
      return;
    }

    const categoria = await tragerPrisma.categoria.create({
      data: { nombre },
      select: { id: true, nombre: true },
    });

    res.status(201).json({
      success: true,
      data: {
        ...categoria,
        productosCount: 0,
      },
    });
  } catch (error) {
    console.error('Error al crear categoría Trager:', error);
    res.status(500).json({ success: false, error: 'Error al crear categoría' });
  }
};

export const actualizarCategoriaTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const nombre = normalizarNombre(req.body?.nombre);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: 'ID de categoría inválido',
      });
      return;
    }

    if (!nombre) {
      res.status(400).json({
        success: false,
        error: 'El nombre de la categoría es obligatorio',
      });
      return;
    }

    const categoriaActual = await tragerPrisma.categoria.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!categoriaActual) {
      res.status(404).json({
        success: false,
        error: 'Categoría no encontrada',
      });
      return;
    }

    const duplicada = await tragerPrisma.categoria.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
        NOT: { id },
      },
    });

    if (duplicada) {
      res.status(409).json({
        success: false,
        error: 'Ya existe otra categoría con ese nombre',
      });
      return;
    }

    const categoria = await tragerPrisma.categoria.update({
      where: { id },
      data: { nombre },
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            Producto: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        id: categoria.id,
        nombre: categoria.nombre,
        productosCount: categoria._count.Producto,
      },
    });
  } catch (error) {
    console.error('Error al actualizar categoría Trager:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar categoría' });
  }
};

export const eliminarCategoriaTrager = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: 'ID de categoría inválido',
      });
      return;
    }

    const categoria = await tragerPrisma.categoria.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            Producto: true,
          },
        },
      },
    });

    if (!categoria) {
      res.status(404).json({
        success: false,
        error: 'Categoría no encontrada',
      });
      return;
    }

    if (categoria._count.Producto > 0) {
      res.status(409).json({
        success: false,
        error: 'No se puede eliminar una categoría con productos asociados',
      });
      return;
    }

    await tragerPrisma.categoria.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar categoría Trager:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar categoría' });
  }
};
