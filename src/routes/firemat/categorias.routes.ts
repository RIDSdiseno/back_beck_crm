import { Router } from 'express';
import { getCategoriasFiremat } from '../../controllers/firemat/categorias.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize('administrador', 'vendedor', 'visualizador'), getCategoriasFiremat);

export default router;
