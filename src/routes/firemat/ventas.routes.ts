import { Router } from 'express';
import { getVentasFiremat, crearVentaFiremat } from '../../controllers/firemat/ventas.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get('/', requirePermission('firemat_ventas', 'ver'), getVentasFiremat);
router.post('/', requirePermission('firemat_ventas', 'editar'), crearVentaFiremat);

export default router;
