import { Router } from 'express';
import {
  getProductosFiremat,
  getProductoFirematById,
  createProductoFiremat,
  updateProductoFiremat,
  patchEstadoProductoFiremat,
  asignarCategoriaProductosFiremat,
} from '../../controllers/firemat/productos.controller';
import { importarListaPreciosPdf } from '../../controllers/firemat/importar-firemat-pdf.controller';
import { authorize } from '../../middlewares/auth';
import { uploadPdfFile } from '../../middlewares/upload';

const router = Router();

const canRead  = authorize('administrador', 'vendedor_firemat', 'bodeguero', 'visualizador_firemat');
const canWrite = authorize('administrador', 'bodeguero');

// Static routes before parameter routes
router.post('/importar-lista-precios-pdf', canWrite, uploadPdfFile, importarListaPreciosPdf);
router.patch('/asignar-categoria', canWrite, asignarCategoriaProductosFiremat);

router.get('/', canRead, getProductosFiremat);
router.get('/:id', canRead, getProductoFirematById);
router.post('/', canWrite, createProductoFiremat);
router.put('/:id', canWrite, updateProductoFiremat);
router.patch('/:id/estado', canWrite, patchEstadoProductoFiremat);

export default router;
