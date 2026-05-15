import { Router } from 'express';
import {
  getProductosFiremat,
  getProductoFirematById,
  createProductoFiremat,
  updateProductoFiremat,
  patchEstadoProductoFiremat,
} from '../../controllers/firemat/productos.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

const canRead  = authorize('administrador', 'vendedor_firemat', 'bodeguero', 'visualizador_firemat');
// visualizador_firemat es solo lectura; vendedor_firemat no gestiona catálogo de productos
const canWrite = authorize('administrador', 'bodeguero');

router.get('/', canRead, getProductosFiremat);
router.get('/:id', canRead, getProductoFirematById);
router.post('/', canWrite, createProductoFiremat);
router.put('/:id', canWrite, updateProductoFiremat);
router.patch('/:id/estado', canWrite, patchEstadoProductoFiremat);

export default router;
