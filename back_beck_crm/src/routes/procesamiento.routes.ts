// src/routes/procesamiento.routes.ts
import { Router } from 'express';
import {
  procesarRegistro,
  listarProcesamientos,
  obtenerProcesamiento,
} from '../controllers/procesamiento.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * POST /api/procesamiento
 * Procesar un registro de terreno
 * Solo ingenieria y administrador
 */
router.post(
  '/',
  authenticate,
  authorize('ingenieria', 'administrador'),
  procesarRegistro
);

/**
 * GET /api/procesamiento
 * Listar procesamientos con filtros opcionales
 */
router.get('/', authenticate, listarProcesamientos);

/**
 * GET /api/procesamiento/:id
 * Obtener un procesamiento específico
 */
router.get('/:id', authenticate, obtenerProcesamiento);

export default router;
