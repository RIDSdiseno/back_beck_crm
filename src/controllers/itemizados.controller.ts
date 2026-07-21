import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';
import { Itemizado } from '../types';

/**
 * Listar itemizados
 * GET /api/itemizados
 * Query params opcionales: activo (boolean), categoria (string)
 */
export const listarItemizados = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activo, categoria } = req.query;

    let query = 'SELECT * FROM itemizados WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (activo !== undefined) {
      query += ` AND activo = $${paramIndex}`;
      params.push(activo === 'true');
      paramIndex++;
    }

    if (categoria) {
      query += ` AND categoria = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    query += ' ORDER BY categoria, descripcion';

    const result = await dbQuery<Itemizado>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar itemizados:', error);
    res.status(500).json({ error: 'Error al listar itemizados' });
  }
};

/**
 * Obtener un itemizado por ID
 * GET /api/itemizados/:id
 */
export const obtenerItemizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await dbQuery<Itemizado>(
      'SELECT * FROM itemizados WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado no encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener itemizado:', error);
    res.status(500).json({ error: 'Error al obtener itemizado' });
  }
};

/**
 * Crear un nuevo itemizado (solo Admin)
 * POST /api/itemizados
 */
export const crearItemizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, descripcion, unidad_medida, precio_unitario, categoria, activo } =
      req.body;

    if (!codigo || !descripcion || !unidad_medida || !precio_unitario || !categoria) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    const checkCodigo = await dbQuery(
      'SELECT id FROM itemizados WHERE codigo = $1',
      [codigo]
    );
    if (checkCodigo.rows.length > 0) {
      res.status(400).json({ error: 'El código de itemizado ya existe' });
      return;
    }

    const result = await dbQuery<Itemizado>(
      `INSERT INTO itemizados (codigo, descripcion, unidad_medida, precio_unitario, categoria, activo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        codigo,
        descripcion,
        unidad_medida,
        precio_unitario,
        categoria,
        activo !== undefined ? activo : true,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error al crear itemizado:', error);

    if (error.code === '23505') {
      res.status(400).json({ error: 'El código de itemizado ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al crear itemizado' });
  }
};

/**
 * Actualizar un itemizado (solo Admin)
 * PUT /api/itemizados/:id
 */
export const actualizarItemizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigo, descripcion, unidad_medida, precio_unitario, categoria, activo } =
      req.body;

    const checkItemizado = await dbQuery(
      'SELECT id FROM itemizados WHERE id = $1',
      [id]
    );
    if (checkItemizado.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado no encontrado' });
      return;
    }

    if (codigo) {
      const checkCodigo = await dbQuery(
        'SELECT id FROM itemizados WHERE codigo = $1 AND id != $2',
        [codigo, id]
      );
      if (checkCodigo.rows.length > 0) {
        res.status(400).json({ error: 'El código de itemizado ya existe' });
        return;
      }
    }

    const result = await dbQuery<Itemizado>(
      `UPDATE itemizados
       SET codigo = COALESCE($1, codigo),
           descripcion = COALESCE($2, descripcion),
           unidad_medida = COALESCE($3, unidad_medida),
           precio_unitario = COALESCE($4, precio_unitario),
           categoria = COALESCE($5, categoria),
           activo = COALESCE($6, activo),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [codigo, descripcion, unidad_medida, precio_unitario, categoria, activo, id]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error al actualizar itemizado:', error);

    if (error.code === '23505') {
      res.status(400).json({ error: 'El código de itemizado ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al actualizar itemizado' });
  }
};

/**
 * Eliminar un itemizado (solo Admin)
 * DELETE /api/itemizados/:id
 */
export const eliminarItemizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const checkProcesamiento = await dbQuery(
      'SELECT COUNT(*) as count FROM procesamiento_ingenieria WHERE itemizado_id = $1',
      [id]
    );

    if (parseInt(checkProcesamiento.rows[0].count) > 0) {
      res.status(400).json({
        error:
          'No se puede eliminar el itemizado porque está siendo usado en procesamientos',
      });
      return;
    }

    const result = await dbQuery(
      'DELETE FROM itemizados WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado no encontrado' });
      return;
    }

    res.json({ mensaje: 'Itemizado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar itemizado:', error);
    res.status(500).json({ error: 'Error al eliminar itemizado' });
  }
};
