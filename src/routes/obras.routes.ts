// src/routes/obras.routes.ts
import { Router } from 'express';
import {
  listarObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  eliminarObra,
} from '../controllers/obras.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * GET /api/obras
 * Listar todas las obras
 */
router.get('/', authenticate, listarObras);

/**
 * GET /api/obras/:id
 * Obtener una obra específica
 */
router.get('/:id', authenticate, obtenerObra);

/**
 * POST /api/obras
 * Crear una nueva obra (solo Admin)
 */
router.post('/', authenticate, authorize('administrador'), crearObra);

/**
 * PUT /api/obras/:id
 * Actualizar una obra (solo Admin)
 */
router.put('/:id', authenticate, authorize('administrador'), actualizarObra);

/**
 * DELETE /api/obras/:id
 * Eliminar una obra (solo Admin)
 */
router.delete('/:id', authenticate, authorize('administrador'), eliminarObra);

export default router;
