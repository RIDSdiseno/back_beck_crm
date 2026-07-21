import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from '../controllers/configuracionCamposRegistro.controller';

const router = Router();

router.get('/', authenticate, obtenerConfiguracion);

router.put(
  '/',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  actualizarConfiguracion,
);

export default router;
