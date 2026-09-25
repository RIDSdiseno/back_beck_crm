import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { archivoPdfFirmado, filtrosPdfsFirmados, listarPdfsFirmados } from '../controllers/pdfsFirmados.controller';

const router = Router();
// Acceso fijo por rol: las excepciones de otros módulos no otorgan este acceso.
router.use(authenticate, authorize('administrador', 'ingenieria'));
router.get('/', listarPdfsFirmados);
router.get('/filtros', filtrosPdfsFirmados);
router.get('/:id/archivo', archivoPdfFirmado);
export default router;
