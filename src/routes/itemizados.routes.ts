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

router.use(authenticate, authorize('administrador'));

/**
 * GET /api/itemizados
 * Listar todos los itemizados
 */
router.get('/', listarItemizados);

/**
 * GET /api/itemizados/:id
 * Obtener un itemizado específico
 */
router.get('/:id', obtenerItemizado);

/**
 * POST /api/itemizados
 * Crear un nuevo itemizado (solo Admin)
 */
router.post('/', crearItemizado);

/**
 * PUT /api/itemizados/:id
 * Actualizar un itemizado (solo Admin)
 */
router.put('/:id', actualizarItemizado);

/**
 * DELETE /api/itemizados/:id
 * Eliminar un itemizado (solo Admin)
 */
router.delete('/:id', eliminarItemizado);

export default router;
