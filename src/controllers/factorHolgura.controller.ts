import { Request, Response } from 'express';
import * as FactorHolguraService from '../services/factorHolgura.service';
import { FactorHolguraError } from '../services/factorHolgura.service';

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof FactorHolguraError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const getParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

export const listarFactoresHolguraObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const data = await FactorHolguraService.listarFactoresHolguraObra(obraId);
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarFactoresHolguraObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const tipoRegistro = getParam(req.params.tipoRegistro);
    const tramos = (req.body as Record<string, unknown>).tramos;
    const data = await FactorHolguraService.guardarTramosHolguraObra(obraId, tipoRegistro, tramos);
    res.json({ success: true, data, message: 'Tramos guardados correctamente' });
  } catch (error) {
    handleError(res, error);
  }
};

export const restaurarFactoresHolguraObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const tipoRegistro = getParam(req.params.tipoRegistro);
    await FactorHolguraService.restaurarTramosHolguraPorDefecto(obraId, tipoRegistro);
    res.json({ success: true, message: 'Tramos restaurados a los valores por defecto' });
  } catch (error) {
    handleError(res, error);
  }
};
