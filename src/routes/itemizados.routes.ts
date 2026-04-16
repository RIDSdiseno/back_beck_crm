// src/routes/itemizados.routes.ts
import { Router } from 'express';
import {
  listarItemizados,
  obtenerItemizado,
  crearItemizado,
  actualizarItemizado,
  eliminarItemizado,
} from '../controllers/itemizados.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * GET /api/itemizados
 * Listar todos los itemizados
 */
router.get('/', authenticate, listarItemizados);

/**
 * GET /api/itemizados/:id
 * Obtener un itemizado específico
 */
router.get('/:id', authenticate, obtenerItemizado);

/**
 * POST /api/itemizados
 * Crear un nuevo itemizado (solo Admin)
 */
router.post('/', authenticate, authorize('administrador'), crearItemizado);

/**
 * PUT /api/itemizados/:id
 * Actualizar un itemizado (solo Admin)
 */
router.put('/:id', authenticate, authorize('administrador'), actualizarItemizado);

/**
 * DELETE /api/itemizados/:id
 * Eliminar un itemizado (solo Admin)
 */
router.delete('/:id', authenticate, authorize('administrador'), eliminarItemizado);

export default router;
