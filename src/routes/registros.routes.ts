// src/routes/registros.routes.ts
import { Router } from 'express';
import {
  crearRegistro,
  listarRegistros,
  obtenerRegistro,
  listarPendientes,
  actualizarEstadoRegistro,
  actualizarRegistro,
  descargarRegistroPdf,
} from '../controllers/registros.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

/**
 * POST /api/registros
 * Crear registro con fotos (1-5 imágenes)
 * Solo terreno y administrador
 */
router.post(
  '/',
  authenticate,
  authorize('terreno', 'administrador'),
  upload.array('fotos', 5), // Max 5 fotos
  crearRegistro
);

/**
 * GET /api/registros
 * Listar registros con filtros opcionales
 */
router.get('/', authenticate, listarRegistros);

/**
 * GET /api/registros/pendientes
 * Listar registros pendientes (para Ingeniería)
 * Solo ingenieria, administrador, visualizador
 */
router.get(
  '/pendientes',
  authenticate,
  authorize('ingenieria', 'administrador', 'visualizador'),
  listarPendientes
);

/**
 * PATCH /api/registros/:id/estado
 * Actualizar estado del registro (pendiente, validado, rechazado)
 * Solo administrador e ingenieria
 */
router.patch(
  '/:id/estado',
  authenticate,
  authorize('administrador', 'ingenieria'),
  actualizarEstadoRegistro,
);

/**
 * GET /api/registros/:id/pdf
 * Descargar PDF con detalle completo del registro
 * Solo administrador e ingenieria
 */
router.get(
  '/:id/pdf',
  authenticate,
  authorize('administrador', 'ingenieria'),
  descargarRegistroPdf,
);

/**
 * PUT /api/registros/:id
 * Actualizar campos editables de un registro
 * Solo administrador e ingenieria
 */
router.put(
  '/:id',
  authenticate,
  authorize('administrador', 'ingenieria'),
  actualizarRegistro,
);

/**
 * GET /api/registros/:id
 * Obtener un registro especifico
 */
router.get('/:id', authenticate, obtenerRegistro);

export default router;
