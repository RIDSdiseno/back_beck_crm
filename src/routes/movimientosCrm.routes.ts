import { Router } from 'express';
import {
  getMovimientoCRMById,
  getMovimientosCRM,
} from '../controllers/movimientosCrm.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize('administrador'), getMovimientosCRM);
router.get('/:id', authenticate, authorize('administrador'), getMovimientoCRMById);

export default router;
