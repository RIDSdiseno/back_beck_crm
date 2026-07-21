import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';
import { Notificacion } from '../types';

/**
 * Listar notificaciones del usuario autenticado
 * GET /api/notificaciones
 * Query params opcionales: leido (boolean)
 */
export const listarNotificaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = req.userId;
    const { leido } = req.query;

    let query = 'SELECT * FROM notificaciones WHERE usuario_id = $1';
    const params: any[] = [usuario_id];

    if (leido !== undefined) {
      query += ' AND leido = $2';
      params.push(leido === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const result = await dbQuery<Notificacion>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar notificaciones:', error);
    res.status(500).json({ error: 'Error al listar notificaciones' });
  }
};

/**
 * Marcar una notificación como leída
 * PUT /api/notificaciones/:id/leer
 */
export const marcarLeida = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario_id = req.userId;

    const checkQuery = await dbQuery(
      'SELECT id FROM notificaciones WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );

    if (checkQuery.rows.length === 0) {
      res.status(404).json({ error: 'Notificación no encontrada' });
      return;
    }

    const result = await dbQuery<Notificacion>(
      'UPDATE notificaciones SET leido = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 * PUT /api/notificaciones/leer-todas
 */
export const marcarTodasLeidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = req.userId;

    await dbQuery(
      'UPDATE notificaciones SET leido = TRUE WHERE usuario_id = $1 AND leido = FALSE',
      [usuario_id]
    );

    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({ error: 'Error al marcar todas como leídas' });
  }
};

/**
 * Obtener cantidad de notificaciones no leídas
 * GET /api/notificaciones/no-leidas
 */
export const contarNoLeidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = req.userId;

    const result = await dbQuery(
      'SELECT COUNT(*) as count FROM notificaciones WHERE usuario_id = $1 AND leido = FALSE',
      [usuario_id]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error al contar no leídas:', error);
    res.status(500).json({ error: 'Error al contar no leídas' });
  }
};
