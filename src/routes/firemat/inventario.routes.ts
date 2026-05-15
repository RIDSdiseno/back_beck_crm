import { Router } from 'express';
import {
  getInventarioFiremat,
  getMovimientosInventarioFiremat,
} from '../../controllers/firemat/inventario.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

// vendedor_firemat excluido — no ajusta stock manualmente
const canRead = authorize('administrador', 'bodeguero', 'visualizador_firemat');

router.get('/', canRead, getInventarioFiremat);
router.get('/movimientos', canRead, getMovimientosInventarioFiremat);

export default router;
