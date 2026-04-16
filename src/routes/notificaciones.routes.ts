// src/routes/notificaciones.routes.ts
import { Router } from 'express';
import {
  listarNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  contarNoLeidas,
} from '../controllers/notificaciones.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * GET /api/notificaciones
 * Listar notificaciones del usuario
 */
router.get('/', authenticate, listarNotificaciones);

/**
 * GET /api/notificaciones/no-leidas
 * Contar notificaciones no leídas
 */
router.get('/no-leidas', authenticate, contarNoLeidas);

/**
 * PUT /api/notificaciones/leer-todas
 * Marcar todas como leídas
 */
router.put('/leer-todas', authenticate, marcarTodasLeidas);

/**
 * PUT /api/notificaciones/:id/leer
 * Marcar una notificación como leída
 */
router.put('/:id/leer', authenticate, marcarLeida);

export default router;
