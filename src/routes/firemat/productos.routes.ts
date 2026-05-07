import { Router } from 'express';
import { getProductosFiremat } from '../../controllers/firemat/productos.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('administrador', 'vendedor', 'visualizador'),
  getProductosFiremat
);

export default router;
