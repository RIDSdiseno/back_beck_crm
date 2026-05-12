import { Request, Response } from 'express';
import { firematPrisma } from '../../config/firematPrisma';

export const getCategoriasFiremat = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await firematPrisma.categoria.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });

    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al obtener categorías Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener categorías' });
  }
};
