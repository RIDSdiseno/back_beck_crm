import { Router } from 'express';
import {
  getInventarioFiremat,
  getMovimientosInventarioFiremat,
  updateInventarioFiremat,
} from '../../controllers/firemat/inventario.controller';
import { importarInventarioPdf } from '../../controllers/firemat/importar-firemat-pdf.controller';
import { authorize } from '../../middlewares/auth';
import { uploadPdfFile } from '../../middlewares/upload';

const router = Router();

const canRead  = authorize('administrador', 'bodeguero', 'visualizador_firemat');
const canWrite = authorize('administrador', 'bodeguero');

// Static routes before parameter routes
router.post('/importar-pdf', canWrite, uploadPdfFile, importarInventarioPdf);

router.get('/', canRead, getInventarioFiremat);
router.get('/movimientos', canRead, getMovimientosInventarioFiremat);
router.patch('/:productoId', canWrite, updateInventarioFiremat);

export default router;
