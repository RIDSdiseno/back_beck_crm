import { Router } from 'express';
import {
  getMovimientoCRMById,
  getMovimientosCRM,
} from '../controllers/movimientosCrm.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.get('/', authenticate, requirePermission('beck_movimientos', 'ver'), getMovimientosCRM);
router.get('/:id', authenticate, requirePermission('beck_movimientos', 'ver'), getMovimientoCRMById);

export default router;
