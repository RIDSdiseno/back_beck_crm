import { Request, Response } from 'express';
import * as FactorAccesibilidadService from '../services/factorAccesibilidad.service';
import { FactorAccesibilidadError } from '../services/factorAccesibilidad.service';

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof FactorAccesibilidadError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const getParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

export const listarFactoresAccesibilidadObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const data = await FactorAccesibilidadService.listarFactoresAccesibilidadObra(obraId);
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarFactorAccesibilidadObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const nivel = getParam(req.params.nivel);
    const factor = (req.body as Record<string, unknown>).factor;
    const data = await FactorAccesibilidadService.guardarFactorAccesibilidadObra(obraId, nivel, factor);
    res.json({ success: true, data, message: 'Factor guardado correctamente' });
  } catch (error) {
    handleError(res, error);
  }
};

export const restaurarFactorAccesibilidadObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = getParam(req.params.obraId);
    const nivel = getParam(req.params.nivel);
    await FactorAccesibilidadService.restaurarFactorAccesibilidadPorDefecto(obraId, nivel);
    res.json({ success: true, message: 'Factor restaurado al valor por defecto' });
  } catch (error) {
    handleError(res, error);
  }
};
