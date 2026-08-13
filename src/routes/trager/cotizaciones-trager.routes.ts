import { Router } from 'express';
import {
  createCotizacionTrager,
  deleteCotizacionTrager,
  downloadCotizacionTragerPdf,
  getCotizacionTragerById,
  getCotizacionesTrager,
  patchEstadoCotizacionTrager,
  updateCotizacionTrager,
} from '../../controllers/trager/cotizaciones-trager.controller';
import { authorize } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission(['trager_cotizaciones', 'trager_dashboard'], 'ver'), getCotizacionesTrager);
router.get('/:id/pdf', requirePermission('trager_cotizaciones', 'ver'), downloadCotizacionTragerPdf);
router.get('/:id', requirePermission('trager_cotizaciones', 'ver'), getCotizacionTragerById);
router.post('/', requirePermission('trager_cotizaciones', 'editar'), createCotizacionTrager);
router.put('/:id', requirePermission('trager_cotizaciones', 'editar'), updateCotizacionTrager);
router.patch('/:id/estado', requirePermission('trager_cotizaciones', 'editar'), patchEstadoCotizacionTrager);
router.delete('/:id', authorize('administrador'), deleteCotizacionTrager);

export default router;
