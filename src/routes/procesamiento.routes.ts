// src/routes/procesamiento.routes.ts
import { Router } from 'express';
import {
  procesarRegistro,
  listarProcesamientos,
  obtenerProcesamiento,
} from '../controllers/procesamiento.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

/**
 * POST /api/procesamiento
 * Procesar un registro de terreno
 */
router.post(
  '/',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  procesarRegistro
);

/**
 * GET /api/procesamiento
 * Listar procesamientos con filtros opcionales
 */
router.get('/', authenticate, requirePermission('beck_procesamiento_ingenieria', 'ver'), listarProcesamientos);

/**
 * GET /api/procesamiento/:id
 * Obtener un procesamiento específico
 */
router.get('/:id', authenticate, requirePermission('beck_procesamiento_ingenieria', 'ver'), obtenerProcesamiento);

export default router;
