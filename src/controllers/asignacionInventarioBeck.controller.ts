import { Request, Response } from 'express';
import { EstadoAsignacionInventario } from '@prisma/client';
import {
  crearAsignacionesInventario,
  devolverAsignacionInventario,
  listarAsignacionesInventario,
  listarInventarioDisponibleSupervisor,
  listarObrasParaAsignacion,
  listarSupervisoresParaAsignacion,
  listarTrabajadoresParaAsignacion,
} from '../services/asignacionInventarioBeck.service';

export const listarObrasAsignables = async (_req: Request, res: Response): Promise<void> => {
  try {
    const obras = await listarObrasParaAsignacion();
    res.json({ success: true, data: obras });
  } catch (error) {
    console.error('Error al listar obras para asignacion:', error);
    res.status(500).json({ success: false, error: 'Error interno al listar obras.' });
  }
};

export const listarSupervisoresAsignables = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' ? req.query.obraId : '';
    const data = await listarSupervisoresParaAsignacion(obraId);
    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al listar supervisores para asignacion:', error);
    res.status(500).json({ success: false, error: 'Error interno al listar supervisores.' });
  }
};

export const listarTrabajadoresAsignables = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' ? req.query.obraId : '';
    const data = await listarTrabajadoresParaAsignacion(obraId);
    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al listar trabajadores para asignacion:', error);
    res.status(500).json({ success: false, error: 'Error interno al listar trabajadores.' });
  }
};

export const listarMiInventarioDisponible = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' ? req.query.obraId : '';
    const data = await listarInventarioDisponibleSupervisor(req.userId ?? '', obraId);
    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al listar inventario disponible del supervisor:', error);
    res.status(500).json({ success: false, error: 'Error interno al listar el inventario disponible.' });
  }
};

export const crearAsignaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const asignaciones = await crearAsignacionesInventario({
      ...(req.body as object),
      asignadoPorId: req.userId ?? '',
    });
    res.status(201).json({ success: true, data: asignaciones });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al crear asignaciones de inventario:', error);
    res.status(500).json({ success: false, error: 'Error interno al crear la asignacion.' });
  }
};

export const listarAsignaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' ? req.query.obraId : undefined;
    const jefeObraId = typeof req.query.jefeObraId === 'string' ? req.query.jefeObraId : undefined;
    const estadoRaw = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    if (estadoRaw && !Object.values(EstadoAsignacionInventario).includes(estadoRaw as EstadoAsignacionInventario)) {
      res.status(400).json({ success: false, error: 'Estado de asignación inválido.' });
      return;
    }
    const estado = estadoRaw as EstadoAsignacionInventario | undefined;
    const asignaciones = await listarAsignacionesInventario({ obraId, jefeObraId, estado });
    res.json({ success: true, data: asignaciones });
  } catch (error) {
    console.error('Error al listar asignaciones de inventario:', error);
    res.status(500).json({ success: false, error: 'Error interno al listar asignaciones.' });
  }
};

export const devolverAsignacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ success: false, error: 'ID invalido.' });
      return;
    }
    const asignacion = await devolverAsignacionInventario(id, req.userId ?? '');
    res.json({ success: true, data: asignacion });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al devolver asignacion de inventario:', error);
    res.status(500).json({ success: false, error: 'Error interno al devolver la asignacion.' });
  }
};
