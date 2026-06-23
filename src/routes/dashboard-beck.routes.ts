import { Router } from 'express';
import { getDashboardBeck } from '../controllers/dashboard-beck.controller';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission('beck_dashboard', 'ver'), getDashboardBeck);

export default router;
