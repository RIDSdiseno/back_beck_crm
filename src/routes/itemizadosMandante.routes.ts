import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  actualizarItemizadoMandante,
  crearItemizadoMandante,
  eliminarItemizadoMandante,
  listarItemizadosMandante,
} from '../controllers/itemizadosMandante.controller';

const router = Router();

router.get('/', authenticate, listarItemizadosMandante);
router.post('/', authenticate, authorize('administrador', 'ingenieria'), crearItemizadoMandante);
router.put('/:id', authenticate, authorize('administrador', 'ingenieria'), actualizarItemizadoMandante);
router.delete('/:id', authenticate, authorize('administrador', 'ingenieria'), eliminarItemizadoMandante);

export default router;
