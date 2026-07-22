import { Router } from 'express';
import { getDashboardBeck, getRendimientoTrabajadores } from '../controllers/dashboard-beck.controller';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission('beck_dashboard', 'ver'), getDashboardBeck);
router.get('/rendimiento-trabajadores', requirePermission('beck_dashboard', 'ver'), getRendimientoTrabajadores);

export default router;
