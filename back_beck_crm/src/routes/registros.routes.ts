// src/routes/registros.routes.ts
import { Router } from 'express';
import {
  crearRegistro,
  listarRegistros,
  obtenerRegistro,
  listarPendientes,
} from '../controllers/registros.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

/**
 * POST /api/registros-terreno
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
 * GET /api/registros-terreno
 * Listar registros con filtros opcionales
 */
router.get('/', authenticate, listarRegistros);

/**
 * GET /api/registros-terreno/pendientes
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
 * GET /api/registros-terreno/:id
 * Obtener un registro específico
 */
router.get('/:id', authenticate, obtenerRegistro);

export default router;
