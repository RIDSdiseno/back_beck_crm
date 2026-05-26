import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from '../controllers/configuracionCamposRegistro.controller';

const router = Router();

// Cualquier usuario autenticado puede consultar la configuración de campos para un rol
router.get('/', authenticate, obtenerConfiguracion);

// Solo administrador e ingenieria pueden modificar la configuración
router.put(
  '/',
  authenticate,
  authorize('administrador', 'ingenieria'),
  actualizarConfiguracion,
);

export default router;
