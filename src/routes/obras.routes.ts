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

const canReadObras = authorize('administrador', 'ingenieria', 'visualizador', 'terreno', 'jefeobra');
const canManageObras = authorize('administrador', 'ingenieria');

router.get('/', authenticate, canReadObras, listarObras);

// mis-obras debe estar antes de /:id para no ser capturado como parámetro
router.get('/mis-obras', authenticate, misObras);

router.get(
  '/:id/usuarios',
  authenticate,
  canManageObras,
  listarUsuariosObra,
);

router.post(
  '/',
  authenticate,
  canManageObras,
  crearObra,
);

router.put(
  '/:id',
  authenticate,
  canManageObras,
  actualizarObra,
);

router.patch(
  '/:id/estado',
  authenticate,
  canManageObras,
  cambiarEstadoObra,
);

router.put(
  '/:id/usuarios',
  authenticate,
  canManageObras,
  asignarUsuariosObra,
);

router.post(
  '/:id/usuarios',
  authenticate,
  canManageObras,
  asignarUsuariosObra,
);

router.delete(
  '/:id',
  authenticate,
  canManageObras,
  eliminarObra,
);

router.post(
  '/:id/asignar-usuarios',
  authenticate,
  canManageObras,
  asignarUsuariosObra,
);

router.get('/:id', authenticate, canReadObras, obtenerObra);

export default router;
