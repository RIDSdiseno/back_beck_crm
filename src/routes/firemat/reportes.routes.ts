import { Router } from 'express';
import { getReportesFiremat } from '../../controllers/firemat/reportes.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

const canRead = authorize('administrador', 'vendedor_firemat', 'bodeguero', 'visualizador_firemat');

router.get('/', canRead, getReportesFiremat);

export default router;
