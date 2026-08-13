import { Router } from 'express';
import {
  getProductosTrager,
  getProductoTragerById,
  createProductoTrager,
  updateProductoTrager,
  patchEstadoProductoTrager,
  asignarCategoriaProductosTrager,
} from '../../controllers/trager/productos-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadFirematProductoImage as uploadTragerProductoImage } from '../../middlewares/upload';

const router = Router();

const canSee = requirePermission(['trager_productos', 'trager_funnel', 'trager_dashboard'], 'ver');
const canEdit = requirePermission('trager_productos', 'editar');

router.patch('/asignar-categoria', canEdit, asignarCategoriaProductosTrager);

router.get('/', canSee, getProductosTrager);
router.get('/:id', canSee, getProductoTragerById);
router.post('/', canEdit, uploadTragerProductoImage, createProductoTrager);
router.put('/:id', canEdit, uploadTragerProductoImage, updateProductoTrager);
router.patch('/:id/estado', canEdit, patchEstadoProductoTrager);

export default router;
