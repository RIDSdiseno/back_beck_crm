import { Router } from 'express';
import { getReportesTrager } from '../../controllers/trager/reportes-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission('trager_reportes', 'ver'), getReportesTrager);

export default router;
