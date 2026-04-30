// src/routes/obras.routes.ts
import { Router } from 'express';
import {
  listarObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  cambiarEstadoObra,
  eliminarObra,
  asignarUsuariosObra,
  listarUsuariosObra,
  misObras,
} from '../controllers/obras.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize('administrador'), listarObras);

// mis-obras debe estar antes de /:id para no ser capturado como parámetro
router.get('/mis-obras', authenticate, misObras);

router.get(
  '/:id/usuarios',
  authenticate,
  authorize('administrador'),
  listarUsuariosObra,
);

router.post(
  '/',
  authenticate,
  authorize('administrador'),
  crearObra,
);

router.put(
  '/:id',
  authenticate,
  authorize('administrador'),
  actualizarObra,
);

router.patch(
  '/:id/estado',
  authenticate,
  authorize('administrador'),
  cambiarEstadoObra,
);

router.put(
  '/:id/usuarios',
  authenticate,
  authorize('administrador'),
  asignarUsuariosObra,
);

router.delete(
  '/:id',
  authenticate,
  authorize('administrador'),
  eliminarObra,
);

router.post(
  '/:id/asignar-usuarios',
  authenticate,
  authorize('administrador'),
  asignarUsuariosObra,
);

router.get('/:id', authenticate, authorize('administrador'), obtenerObra);

export default router;
