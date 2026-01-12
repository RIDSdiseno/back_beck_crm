// src/controllers/registros.controller.ts
import { Request, Response } from 'express';
import { pool } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { RegistroTerreno } from '../types';

/**
 * Crear un nuevo registro de terreno con fotos
 * POST /api/registros-terreno
 * Requiere autenticación y rol 'terreno' o 'administrador'
 */
export const crearRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      obra_id,
      descripcion_material,
      modulo,
      piso,
      eje_numerico,
      eje_alfabetico,
      numero_sello,
      cantidad_sellos,
      nombre_sellador,
      holgura,
      accesibilidad,
      observaciones,
    } = req.body;

    const usuario_id = req.userId; // Del middleware auth

    // Validar campos obligatorios
    if (
      !obra_id ||
      !descripcion_material ||
      !modulo ||
      !piso ||
      !eje_numerico ||
      !eje_alfabetico ||
      !numero_sello ||
      !cantidad_sellos ||
      !nombre_sellador ||
      !holgura ||
      !accesibilidad
    ) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    // Validar que existan fotos (mínimo 1, máximo 5)
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Debe subir al menos 1 foto' });
      return;
    }
    if (files.length > 5) {
      res.status(400).json({ error: 'Máximo 5 fotos por registro' });
      return;
    }

    // Validar que la obra exista
    const obraCheck = await pool.query('SELECT id FROM obras WHERE id = $1', [obra_id]);
    if (obraCheck.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    // Subir fotos a Cloudinary
    const fotosUrls: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadImage(file.buffer, 'beck/registros');
        fotosUrls.push(url);
      } catch (uploadError) {
        console.error('Error al subir foto a Cloudinary:', uploadError);
        res.status(500).json({ error: 'Error al subir las fotos' });
        return;
      }
    }

    // Calcular día de semana
    const fecha = new Date();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia_semana = dias[fecha.getDay()];

    // Insertar en BD
    const result = await pool.query<RegistroTerreno>(
      `INSERT INTO registros_terreno (
        obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
        piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
        nombre_sellador, holgura, accesibilidad, observaciones, fotos_urls
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        obra_id,
        usuario_id,
        fecha.toISOString(),
        dia_semana,
        descripcion_material,
        modulo,
        piso,
        eje_numerico,
        eje_alfabetico,
        numero_sello,
        cantidad_sellos,
        nombre_sellador,
        holgura,
        accesibilidad,
        observaciones || null,
        fotosUrls,
      ]
    );

    const registro = result.rows[0];

    // Crear notificaciones para usuarios de Ingeniería
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, referencia_id, mensaje)
       SELECT id, 'nuevo_registro', $1, $2
       FROM usuarios WHERE rol = 'ingenieria' AND activo = TRUE`,
      [
        registro.id,
        `Nuevo registro de ${nombre_sellador} en ${descripcion_material} (${modulo})`,
      ]
    );

    res.status(201).json(registro);
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

/**
 * Listar registros de terreno
 * GET /api/registros-terreno
 * Query params opcionales: procesado (boolean), obra_id (uuid)
 */
export const listarRegistros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { procesado, obra_id } = req.query;
    const usuario_id = req.userId;
    const user_rol = req.userRole;

    let query = `
      SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre
      FROM registros_terreno rt
      LEFT JOIN obras o ON rt.obra_id = o.id
      LEFT JOIN usuarios u ON rt.usuario_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtro por procesado
    if (procesado !== undefined) {
      query += ` AND rt.procesado = $${paramIndex}`;
      params.push(procesado === 'true');
      paramIndex++;
    }

    // Filtro por obra
    if (obra_id) {
      query += ` AND rt.obra_id = $${paramIndex}`;
      params.push(obra_id);
      paramIndex++;
    }

    // Si el usuario es rol terreno, solo ver sus propios registros
    if (user_rol === 'terreno') {
      query += ` AND rt.usuario_id = $${paramIndex}`;
      params.push(usuario_id);
      paramIndex++;
    }

    query += ' ORDER BY rt.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar registros:', error);
    res.status(500).json({ error: 'Error al listar registros' });
  }
};

/**
 * Obtener un registro específico por ID
 * GET /api/registros-terreno/:id
 */
export const obtenerRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario_id = req.userId;
    const user_rol = req.userRole;

    let query = `
      SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre
      FROM registros_terreno rt
      LEFT JOIN obras o ON rt.obra_id = o.id
      LEFT JOIN usuarios u ON rt.usuario_id = u.id
      WHERE rt.id = $1
    `;

    // Si es terreno, solo puede ver sus propios registros
    if (user_rol === 'terreno') {
      query += ` AND rt.usuario_id = $2`;
      const result = await pool.query(query, [id, usuario_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

/**
 * Listar registros pendientes de procesamiento (para Ingeniería)
 * GET /api/registros-terreno/pendientes
 */
export const listarPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre
       FROM registros_terreno rt
       LEFT JOIN obras o ON rt.obra_id = o.id
       LEFT JOIN usuarios u ON rt.usuario_id = u.id
       WHERE rt.procesado = FALSE
       ORDER BY rt.created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error al listar pendientes' });
  }
};
