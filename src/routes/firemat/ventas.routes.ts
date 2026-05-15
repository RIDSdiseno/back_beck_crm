import { Router } from 'express';
import { getVentasFiremat } from '../../controllers/firemat/ventas.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

// bodeguero excluido — no accede a ventas comerciales
const canRead = authorize('administrador', 'vendedor_firemat', 'visualizador_firemat');

router.get('/', canRead, getVentasFiremat);

export default router;
