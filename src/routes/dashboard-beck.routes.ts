import { Router } from 'express';
import { getDashboardBeck } from '../controllers/dashboard-beck.controller';

const router = Router();

router.get('/', getDashboardBeck);

export default router;
