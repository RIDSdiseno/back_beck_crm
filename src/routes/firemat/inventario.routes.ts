import { Router } from 'express';
import {
  getInventarioFiremat,
  getMovimientosInventarioFiremat,
} from '../../controllers/firemat/inventario.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('administrador', 'vendedor', 'visualizador'),
  getInventarioFiremat
);

router.get(
  '/movimientos',
  authenticate,
  authorize('administrador', 'vendedor', 'visualizador'),
  getMovimientosInventarioFiremat
);

export default router;
