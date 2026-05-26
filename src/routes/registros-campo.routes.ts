import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listarRegistrosCampo,
  obtenerRegistroCampo,
} from '../controllers/registros-campo.controller';

const router = Router();

const canRead = authorize(
  'terreno',
  'jefeobra',
  'administrador',
  'ingenieria',
  'visualizador',
);

/**
 * GET /api/registros-campo
 * Lista registros con visibilidad de campos aplicada según rol del token.
 * terreno solo ve los suyos; jefeobra/admin/ingenieria ven todos.
 */
router.get('/', authenticate, canRead, listarRegistrosCampo);

/**
 * GET /api/registros-campo/:id
 * Detalle de un registro con visibilidad de campos aplicada según rol del token.
 */
router.get('/:id', authenticate, canRead, obtenerRegistroCampo);

export default router;
