import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from '../controllers/configuracionCamposRegistro.controller';

const router = Router();

// Cualquier usuario autenticado puede consultar la configuración de campos para un rol
router.get('/', authenticate, obtenerConfiguracion);

// requirePermission es la autoridad final para escritura
router.put(
  '/',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  actualizarConfiguracion,
);

export default router;
