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
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

const canReadCotizacionesFiremat = authorize('administrador', 'vendedor', 'visualizador');
const canWriteCotizacionesFiremat = authorize('administrador', 'vendedor');

router.get('/', authenticate, canReadCotizacionesFiremat, getCotizacionesFiremat);
router.get('/:id/pdf', authenticate, canReadCotizacionesFiremat, downloadCotizacionFirematPdf);
router.get('/:id', authenticate, canReadCotizacionesFiremat, getCotizacionFirematById);
router.post('/', authenticate, canWriteCotizacionesFiremat, createCotizacionFiremat);
router.put('/:id', authenticate, canWriteCotizacionesFiremat, updateCotizacionFiremat);
router.patch('/:id/estado', authenticate, canWriteCotizacionesFiremat, patchEstadoCotizacionFiremat);
router.delete('/:id', authenticate, authorize('administrador'), deleteCotizacionFiremat);

export default router;
