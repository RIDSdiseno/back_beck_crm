import { Router } from 'express';
import {
  createCotizacionFiremat,
  deleteCotizacionFiremat,
  downloadCotizacionFirematPdf,
  getCotizacionFirematById,
  getCotizacionesFiremat,
  patchEstadoCotizacionFiremat,
  updateCotizacionFiremat,
} from '../../controllers/firemat/cotizaciones-firemat.controller';
import { authorize } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission(['firemat_cotizaciones', 'firemat_dashboard'], 'ver'), getCotizacionesFiremat);
router.get('/:id/pdf', requirePermission('firemat_cotizaciones', 'ver'), downloadCotizacionFirematPdf);
router.get('/:id', requirePermission('firemat_cotizaciones', 'ver'), getCotizacionFirematById);
router.post('/', requirePermission('firemat_cotizaciones', 'editar'), createCotizacionFiremat);
router.put('/:id', requirePermission('firemat_cotizaciones', 'editar'), updateCotizacionFiremat);
router.patch('/:id/estado', requirePermission('firemat_cotizaciones', 'editar'), patchEstadoCotizacionFiremat);
router.delete('/:id', authorize('administrador'), deleteCotizacionFiremat);

export default router;
