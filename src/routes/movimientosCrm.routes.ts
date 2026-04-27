import { Router } from 'express';
import {
  getMovimientoCRMById,
  getMovimientosCRM,
} from '../controllers/movimientosCrm.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getMovimientosCRM);
router.get('/:id', authenticate, getMovimientoCRMById);

export default router;