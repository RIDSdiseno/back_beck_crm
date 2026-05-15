import { Router } from 'express';
import { getCategoriasFiremat } from '../../controllers/firemat/categorias.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

const canRead = authorize('administrador', 'vendedor_firemat', 'bodeguero', 'visualizador_firemat');

router.get('/', canRead, getCategoriasFiremat);

export default router;
