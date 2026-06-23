import { Router } from 'express';
import { getReportesFiremat } from '../../controllers/firemat/reportes.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission('firemat_reportes', 'ver'), getReportesFiremat);

export default router;
