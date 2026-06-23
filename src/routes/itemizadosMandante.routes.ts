import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  actualizarItemizadoMandante,
  crearItemizadoMandante,
  eliminarItemizadoMandante,
  listarItemizadosMandante,
} from '../controllers/itemizadosMandante.controller';

const router = Router();

router.get('/', authenticate, listarItemizadosMandante);
router.post('/', authenticate, requirePermission('beck_obras', 'editar'), crearItemizadoMandante);
router.put('/:id', authenticate, requirePermission('beck_obras', 'editar'), actualizarItemizadoMandante);
router.delete('/:id', authenticate, requirePermission('beck_obras', 'editar'), eliminarItemizadoMandante);

export default router;
