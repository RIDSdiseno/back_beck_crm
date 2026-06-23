import { Router } from 'express';
import {
  getInventarioFiremat,
  getMovimientosInventarioFiremat,
  updateInventarioFiremat,
} from '../../controllers/firemat/inventario.controller';
import { importarInventarioPdf } from '../../controllers/firemat/importar-firemat-pdf.controller';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadPdfFile } from '../../middlewares/upload';

const router = Router();

// Static routes before parameter routes
router.post('/importar-pdf', requirePermission('firemat_inventario', 'editar'), uploadPdfFile, importarInventarioPdf);

router.get('/', requirePermission('firemat_inventario', 'ver'), getInventarioFiremat);
router.get('/movimientos', requirePermission('firemat_movimientos', 'ver'), getMovimientosInventarioFiremat);
router.patch('/:productoId', requirePermission('firemat_inventario', 'editar'), updateInventarioFiremat);

export default router;
