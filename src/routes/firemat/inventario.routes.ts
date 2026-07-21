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

const canSeeInventario = requirePermission(['firemat_inventario', 'firemat_dashboard'], 'ver');
const canSeeMovimientos = requirePermission(['firemat_movimientos', 'firemat_dashboard'], 'ver');
const canEditInventario = requirePermission('firemat_inventario', 'editar');

const methodNotAllowed = (_req: import('express').Request, res: import('express').Response): void => {
  res.status(405).json({ success: false, error: 'Metodo no permitido para inventario Firemat' });
};

router.post('/importar-pdf', canEditInventario, uploadPdfFile, importarInventarioPdf);

router.get('/', canSeeInventario, getInventarioFiremat);
router.post('/', canEditInventario, methodNotAllowed);
router.put('/', canEditInventario, methodNotAllowed);
router.get('/movimientos', canSeeMovimientos, getMovimientosInventarioFiremat);
router.patch('/:productoId', canEditInventario, updateInventarioFiremat);
router.put('/:productoId', canEditInventario, methodNotAllowed);

export default router;
