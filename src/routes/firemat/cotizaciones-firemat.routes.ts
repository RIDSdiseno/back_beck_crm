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

const router = Router();

// bodeguero excluido — no accede a cotizaciones comerciales
const canRead  = authorize('administrador', 'vendedor_firemat', 'visualizador_firemat');
// visualizador_firemat es solo lectura
const canWrite = authorize('administrador', 'vendedor_firemat');

router.get('/', canRead, getCotizacionesFiremat);
router.get('/:id/pdf', canRead, downloadCotizacionFirematPdf);
router.get('/:id', canRead, getCotizacionFirematById);
router.post('/', canWrite, createCotizacionFiremat);
router.put('/:id', canWrite, updateCotizacionFiremat);
router.patch('/:id/estado', canWrite, patchEstadoCotizacionFiremat);
router.delete('/:id', authorize('administrador'), deleteCotizacionFiremat);

export default router;
