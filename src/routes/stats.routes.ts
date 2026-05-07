import { Router } from 'express';
import { getDashboardStats, getObrasStats } from '../controllers/stats.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);
router.use(authorize('administrador'));

// GET /api/stats/dashboard - Estadísticas del dashboard
router.get('/dashboard', getDashboardStats);

// GET /api/stats/obras - Estadísticas de obras
router.get('/obras', getObrasStats);

export default router;
