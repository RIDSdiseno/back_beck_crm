import { Request, Response } from 'express';
import {
  ModuloMovimientoCRM,
  TipoMovimientoCRM,
} from '@prisma/client';
import { MovimientosCrmService } from '../services/movimientoCrm.service';

const isModuloMovimientoCRM = (value: unknown): value is ModuloMovimientoCRM =>
  typeof value === 'string' &&
  Object.values(ModuloMovimientoCRM).includes(value as ModuloMovimientoCRM);

const isTipoMovimientoCRM = (value: unknown): value is TipoMovimientoCRM =>
  typeof value === 'string' &&
  Object.values(TipoMovimientoCRM).includes(value as TipoMovimientoCRM);

export const getMovimientosCRM = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const modulo = isModuloMovimientoCRM(req.query.modulo)
      ? req.query.modulo
      : undefined;

    const tipo = isTipoMovimientoCRM(req.query.tipo)
      ? req.query.tipo
      : undefined;

    const usuarioId =
      typeof req.query.usuarioId === 'string' ? req.query.usuarioId : undefined;

    const entidadId =
      typeof req.query.entidadId === 'string' ? req.query.entidadId : undefined;

    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;

    const data = await MovimientosCrmService.listarMovimientosCRM({
      modulo,
      tipo,
      usuarioId,
      entidadId,
      limit,
      page,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al listar movimientos CRM:', error);
    res.status(500).json({
      success: false,
      error: 'Error al listar movimientos CRM',
    });
  }
};

export const getMovimientoCRMById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idParam = req.params.id;

if (!idParam || Array.isArray(idParam)) {
  res.status(400).json({
    success: false,
    error: 'ID inválido',
  });
  return;
}

const data = await MovimientosCrmService.getMovimientoCRMById(idParam);

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener movimiento CRM:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener movimiento CRM',
    });
  }
};