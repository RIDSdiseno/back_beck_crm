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
  obtenerTiposRegistroObra,
  actualizarTiposRegistroObra,
} from '../controllers/obras.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.get('/', authenticate, requirePermission('beck_obras', 'ver'), listarObras);

// mis-obras debe estar antes de /:id para no ser capturado como parámetro
router.get('/mis-obras', authenticate, misObras);

// Listar usuarios de una obra: lectura de beck_obras
router.get(
  '/:id/usuarios',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarUsuariosObra,
);

// Tipos de registro habilitados por obra
router.get(
  '/:id/tipos-registro',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  obtenerTiposRegistroObra,
);

router.put(
  '/:id/tipos-registro',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  actualizarTiposRegistroObra,
);

// Rutas de escritura: requirePermission es la autoridad final (valida overrides individuales)
router.post(
  '/',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  crearObra,
);

router.put(
  '/:id',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  actualizarObra,
);

router.patch(
  '/:id/estado',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  cambiarEstadoObra,
);

router.put(
  '/:id/usuarios',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  asignarUsuariosObra,
);

router.post(
  '/:id/usuarios',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  asignarUsuariosObra,
);

router.delete(
  '/:id',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  eliminarObra,
);

router.post(
  '/:id/asignar-usuarios',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  asignarUsuariosObra,
);

router.get('/:id', authenticate, requirePermission('beck_obras', 'ver'), obtenerObra);

export default router;
