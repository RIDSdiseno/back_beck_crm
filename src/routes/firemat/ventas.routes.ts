import { Router } from 'express';
import { getVentasFiremat } from '../../controllers/firemat/ventas.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('administrador', 'vendedor', 'visualizador'),
  getVentasFiremat
);

export default router;
