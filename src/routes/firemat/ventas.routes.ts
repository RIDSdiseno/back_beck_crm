import { Router } from 'express';
import { getVentasFiremat, crearVentaFiremat } from '../../controllers/firemat/ventas.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

const canRead = authorize('administrador', 'vendedor_firemat', 'visualizador_firemat');
const canCreate = authorize('administrador', 'vendedor_firemat', 'bodeguero');

router.get('/', canRead, getVentasFiremat);
router.post('/', canCreate, crearVentaFiremat);

export default router;
