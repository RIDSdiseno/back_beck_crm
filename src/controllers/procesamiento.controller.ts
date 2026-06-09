// src/controllers/procesamiento.controller.ts
import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';
import { ProcesamientoIngenieria } from '../types';

/**
 * Procesar un registro de terreno (solo Ingeniería)
 * POST /api/procesamiento
 * Calcula automáticamente: total_sellos_calculado = cantidad × holgura × accesibilidad
 * Marca el registro como procesado (trigger automático en BD)
 */
export const procesarRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registro_terreno_id, codigo, itemizado_id, notas } = req.body;
    const usuario_id = req.userId;

    // Validar campos obligatorios
    if (!registro_terreno_id || !codigo || !itemizado_id) {
      res.status(400).json({
        error: 'Faltan campos obligatorios: registro_terreno_id, codigo, itemizado_id',
      });
      return;
    }

    // Obtener datos del registro
    const registroQuery = await dbQuery(
      'SELECT cantidad_sellos, holgura, accesibilidad FROM registros_terreno WHERE id = $1',
      [registro_terreno_id]
    );

    if (registroQuery.rows.length === 0) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const registro = registroQuery.rows[0];

    // Verificar que no exista ya un procesamiento para este registro
    const existeProcesamiento = await dbQuery(
      'SELECT id FROM procesamiento_ingenieria WHERE registro_terreno_id = $1',
      [registro_terreno_id]
    );
    if (existeProcesamiento.rows.length > 0) {
      res.status(400).json({ error: 'Este registro ya tiene un procesamiento asociado' });
      return;
    }

    const { cantidad_sellos, holgura, accesibilidad } = registro;

    // CÁLCULO AUTOMÁTICO DE TOTAL DE SELLOS
    const total_sellos_calculado = cantidad_sellos * holgura * (accesibilidad ?? 1);

    // Verificar que el itemizado exista
    const itemizadoCheck = await dbQuery(
      'SELECT id FROM itemizados WHERE id = $1',
      [itemizado_id]
    );
    if (itemizadoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado no encontrado' });
      return;
    }

    // Insertar procesamiento (el trigger marcará automáticamente el registro como procesado)
    const result = await dbQuery<ProcesamientoIngenieria>(
      `INSERT INTO procesamiento_ingenieria (
        registro_terreno_id, usuario_id, codigo, itemizado_id, total_sellos_calculado, notas
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [registro_terreno_id, usuario_id, codigo, itemizado_id, total_sellos_calculado, notas || null]
    );

    const procesamiento = result.rows[0];

    // Crear notificación para el usuario que creó el registro
    const registroUsuario = await dbQuery(
      'SELECT usuario_id FROM registros_terreno WHERE id = $1',
      [registro_terreno_id]
    );

    if (registroUsuario.rows.length > 0) {
      await dbQuery(
        `INSERT INTO notificaciones (usuario_id, tipo, referencia_id, mensaje)
         VALUES ($1, 'registro_procesado', $2, $3)`,
        [
          registroUsuario.rows[0].usuario_id,
          registro_terreno_id,
          `Tu registro ha sido procesado por Ingeniería. Total calculado: ${total_sellos_calculado.toFixed(2)} sellos`,
        ]
      );
    }

    res.status(201).json({
      ...procesamiento,
      mensaje: `Registro procesado exitosamente. Total: ${total_sellos_calculado.toFixed(2)} sellos`,
    });
  } catch (error: any) {
    console.error('Error al procesar registro:', error);

    // Verificar si es error de código duplicado
    if (error.code === '23505' && error.constraint === 'procesamiento_ingenieria_codigo_key') {
      res.status(400).json({ error: 'El código ya existe. Use un código único.' });
      return;
    }

    res.status(500).json({ error: 'Error al procesar registro' });
  }
};

/**
 * Listar procesamientos
 * GET /api/procesamiento
 * Query params opcionales: registro_terreno_id
 */
export const listarProcesamientos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registro_terreno_id } = req.query;

    let query = `
      SELECT
        p.*,
        u.nombre as usuario_nombre,
        i.descripcion as itemizado_descripcion,
        rt.codigo_beck,
        rt.itemizado_mandante_id,
        im.nombre as itemizado_mandante_nombre,
        rt.numero_sello,
        rt.descripcion_material
      FROM procesamiento_ingenieria p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN itemizados i ON p.itemizado_id = i.id
      LEFT JOIN registros_terreno rt ON p.registro_terreno_id = rt.id
      LEFT JOIN itemizados_mandante im ON rt.itemizado_mandante_id = im.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (registro_terreno_id) {
      query += ' AND p.registro_terreno_id = $1';
      params.push(registro_terreno_id);
    }

    query += ' ORDER BY p.procesado_at DESC';

    const result = await dbQuery(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar procesamientos:', error);
    res.status(500).json({ error: 'Error al listar procesamientos' });
  }
};

/**
 * Obtener un procesamiento específico
 * GET /api/procesamiento/:id
 */
export const obtenerProcesamiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await dbQuery(
      `SELECT
        p.*,
        u.nombre as usuario_nombre,
        i.descripcion as itemizado_descripcion,
        rt.codigo_beck,
        rt.itemizado_mandante_id,
        im.nombre as itemizado_mandante_nombre,
        rt.numero_sello,
        rt.descripcion_material,
        rt.cantidad_sellos,
        rt.holgura,
        rt.accesibilidad
      FROM procesamiento_ingenieria p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN itemizados i ON p.itemizado_id = i.id
      LEFT JOIN registros_terreno rt ON p.registro_terreno_id = rt.id
      LEFT JOIN itemizados_mandante im ON rt.itemizado_mandante_id = im.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Procesamiento no encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener procesamiento:', error);
    res.status(500).json({ error: 'Error al obtener procesamiento' });
  }
};
