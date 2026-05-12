import { Router } from 'express';
import {
  getProductosFiremat,
  getProductoFirematById,
  createProductoFiremat,
  updateProductoFiremat,
  patchEstadoProductoFiremat,
} from '../../controllers/firemat/productos.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

const canRead = authorize('administrador', 'vendedor', 'visualizador');
const canWrite = authorize('administrador', 'vendedor');

router.get('/', authenticate, canRead, getProductosFiremat);
router.get('/:id', authenticate, canRead, getProductoFirematById);
router.post('/', authenticate, canWrite, createProductoFiremat);
router.put('/:id', authenticate, canWrite, updateProductoFiremat);
router.patch('/:id/estado', authenticate, canWrite, patchEstadoProductoFiremat);

export default router;
