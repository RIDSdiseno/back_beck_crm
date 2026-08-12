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
import {
  listarFactoresHolguraObra,
  guardarFactoresHolguraObra,
  restaurarFactoresHolguraObra,
} from '../controllers/factorHolgura.controller';
import {
  listarFactoresAccesibilidadObra,
  guardarFactorAccesibilidadObra,
  restaurarFactorAccesibilidadObra,
} from '../controllers/factorAccesibilidad.controller';
import {
  listarFactoresAislacionObra,
  guardarFactorAislacionObra,
  restaurarFactorAislacionObra,
} from '../controllers/factorAislacion.controller';
import {
  listarHitosObra,
  crearHitoObra,
  actualizarHitoObra,
  eliminarHitoObra,
  terminarHitoObra,
} from '../controllers/hitosObra.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.get('/', authenticate, requirePermission('beck_obras', 'ver'), listarObras);

router.get('/mis-obras', authenticate, misObras);

router.get(
  '/:id/usuarios',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarUsuariosObra,
);

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

router.get(
  '/:obraId/factores-holgura',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarFactoresHolguraObra,
);

router.put(
  '/:obraId/factores-holgura/:tipoRegistro',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  guardarFactoresHolguraObra,
);

router.delete(
  '/:obraId/factores-holgura/:tipoRegistro',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  restaurarFactoresHolguraObra,
);

router.get(
  '/:obraId/factores-accesibilidad',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarFactoresAccesibilidadObra,
);

router.put(
  '/:obraId/factores-accesibilidad/:nivel',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  guardarFactorAccesibilidadObra,
);

router.delete(
  '/:obraId/factores-accesibilidad/:nivel',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  restaurarFactorAccesibilidadObra,
);

router.get(
  '/:obraId/factores-aislacion',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarFactoresAislacionObra,
);

router.put(
  '/:obraId/factores-aislacion/:aplica',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  guardarFactorAislacionObra,
);

router.delete(
  '/:obraId/factores-aislacion/:aplica',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  restaurarFactorAislacionObra,
);

router.get(
  '/:obraId/hitos',
  authenticate,
  requirePermission('beck_obras', 'ver'),
  listarHitosObra,
);

router.post(
  '/:obraId/hitos',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  crearHitoObra,
);

router.put(
  '/:obraId/hitos/:hitoId',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  actualizarHitoObra,
);

router.delete(
  '/:obraId/hitos/:hitoId',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  eliminarHitoObra,
);

router.patch(
  '/:obraId/hitos/:hitoId/terminar',
  authenticate,
  requirePermission('beck_obras', 'editar'),
  terminarHitoObra,
);

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
