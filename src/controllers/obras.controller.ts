// src/controllers/obras.controller.ts
import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';
import { Obra } from '../types';

/**
 * Listar obras
 * GET /api/obras
 * Query params opcionales: activa (boolean)
 */
export const listarObras = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activa } = req.query;

    let query = 'SELECT * FROM obras WHERE 1=1';
    const params: any[] = [];

    if (activa !== undefined) {
      query += ' AND activa = $1';
      params.push(activa === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const result = await dbQuery<Obra>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar obras:', error);
    res.status(500).json({ error: 'Error al listar obras' });
  }
};

/**
 * Obtener una obra por ID
 * GET /api/obras/:id
 */
export const obtenerObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await dbQuery<Obra>('SELECT * FROM obras WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener obra:', error);
    res.status(500).json({ error: 'Error al obtener obra' });
  }
};

/**
 * Crear una nueva obra (solo Admin)
 * POST /api/obras
 */
export const crearObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      codigo,
      nombre,
      direccion,
      ciudad,
      cliente,
      activa,
      fecha_inicio,
      fecha_termino,
    } = req.body;

    // Validar campos obligatorios
    if (!codigo || !nombre || !direccion || !ciudad || !cliente) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    // Verificar que el código no exista
    const checkCodigo = await dbQuery('SELECT id FROM obras WHERE codigo = $1', [codigo]);
    if (checkCodigo.rows.length > 0) {
      res.status(400).json({ error: 'El código de obra ya existe' });
      return;
    }

    const result = await dbQuery<Obra>(
      `INSERT INTO obras (codigo, nombre, direccion, ciudad, cliente, activa, fecha_inicio, fecha_termino)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        codigo,
        nombre,
        direccion,
        ciudad,
        cliente,
        activa !== undefined ? activa : true,
        fecha_inicio || null,
        fecha_termino || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error al crear obra:', error);

    if (error.code === '23505') {
      res.status(400).json({ error: 'El código de obra ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al crear obra' });
  }
};

/**
 * Actualizar una obra (solo Admin)
 * PUT /api/obras/:id
 */
export const actualizarObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nombre,
      direccion,
      ciudad,
      cliente,
      activa,
      fecha_inicio,
      fecha_termino,
    } = req.body;

    // Verificar que la obra exista
    const checkObra = await dbQuery('SELECT id FROM obras WHERE id = $1', [id]);
    if (checkObra.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    // Si se cambia el código, verificar que no exista
    if (codigo) {
      const checkCodigo = await dbQuery(
        'SELECT id FROM obras WHERE codigo = $1 AND id != $2',
        [codigo, id]
      );
      if (checkCodigo.rows.length > 0) {
        res.status(400).json({ error: 'El código de obra ya existe' });
        return;
      }
    }

    const result = await dbQuery<Obra>(
      `UPDATE obras
       SET codigo = COALESCE($1, codigo),
           nombre = COALESCE($2, nombre),
           direccion = COALESCE($3, direccion),
           ciudad = COALESCE($4, ciudad),
           cliente = COALESCE($5, cliente),
           activa = COALESCE($6, activa),
           fecha_inicio = COALESCE($7, fecha_inicio),
           fecha_termino = COALESCE($8, fecha_termino),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [codigo, nombre, direccion, ciudad, cliente, activa, fecha_inicio, fecha_termino, id]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error al actualizar obra:', error);

    if (error.code === '23505') {
      res.status(400).json({ error: 'El código de obra ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al actualizar obra' });
  }
};

/**
 * Eliminar una obra (solo Admin)
 * DELETE /api/obras/:id
 */
export const eliminarObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar que la obra no tenga registros asociados
    const checkRegistros = await dbQuery(
      'SELECT COUNT(*) as count FROM registros_terreno WHERE obra_id = $1',
      [id]
    );

    if (parseInt(checkRegistros.rows[0].count) > 0) {
      res.status(400).json({
        error: 'No se puede eliminar la obra porque tiene registros asociados',
      });
      return;
    }

    const result = await dbQuery('DELETE FROM obras WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    res.json({ mensaje: 'Obra eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar obra:', error);
    res.status(500).json({ error: 'Error al eliminar obra' });
  }
};
