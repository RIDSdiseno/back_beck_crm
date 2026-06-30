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
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadPdfFile, uploadFirematProductoImage } from '../../middlewares/upload';

const router = Router();

// Lectura auxiliar permitida también desde cotizaciones y funnel (selección de productos en formularios)
const canSee = requirePermission(['firemat_productos', 'firemat_cotizaciones', 'firemat_funnel', 'firemat_dashboard'], 'ver');
const canEdit = requirePermission('firemat_productos', 'editar');

// Static routes before parameter routes
router.post('/importar-lista-precios-pdf', canEdit, uploadPdfFile, importarListaPreciosPdf);
router.patch('/asignar-categoria', canEdit, asignarCategoriaProductosFiremat);

router.get('/', canSee, getProductosFiremat);
router.get('/:id', canSee, getProductoFirematById);
router.post('/', canEdit, uploadFirematProductoImage, createProductoFiremat);
router.put('/:id', canEdit, uploadFirematProductoImage, updateProductoFiremat);
router.patch('/:id/estado', canEdit, patchEstadoProductoFiremat);

export default router;
