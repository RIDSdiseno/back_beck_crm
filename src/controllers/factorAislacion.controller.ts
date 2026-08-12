import { Request, Response } from 'express';
import * as FactorAislacionService from '../services/factorAislacion.service';
import { FactorAislacionError } from '../services/factorAislacion.service';

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof FactorAislacionError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const getParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

export const listarFactoresAislacionObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const data = await FactorAislacionService.listarFactoresAislacionObra(obraId);
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarFactorAislacionObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const aplica = getParam(req.params.aplica);
    const factor = (req.body as Record<string, unknown>).factor;
    const data = await FactorAislacionService.guardarFactorAislacionObra(obraId, aplica, factor);
    res.json({ success: true, data, message: 'Factor guardado correctamente' });
  } catch (error) {
    handleError(res, error);
  }
};

export const restaurarFactorAislacionObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const aplica = getParam(req.params.aplica);
    await FactorAislacionService.restaurarFactorAislacionPorDefecto(obraId, aplica);
    res.json({ success: true, message: 'Factor restaurado al valor por defecto' });
  } catch (error) {
    handleError(res, error);
  }
};
