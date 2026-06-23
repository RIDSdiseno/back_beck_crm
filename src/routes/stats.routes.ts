import { Router } from 'express';
import { getDashboardStats, getObrasStats } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

router.use(authenticate);

// GET /api/stats/dashboard - Estadísticas del dashboard
router.get('/dashboard', requirePermission('beck_reportes', 'ver'), getDashboardStats);

// GET /api/stats/obras - Estadísticas de obras
router.get('/obras', requirePermission('beck_reportes', 'ver'), getObrasStats);

export default router;
