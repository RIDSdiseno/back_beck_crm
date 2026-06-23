import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { obtenerMisPermisos } from '../controllers/permisos-usuario.controller';

const router = Router();

router.get('/permisos', authenticate, obtenerMisPermisos);

export default router;
