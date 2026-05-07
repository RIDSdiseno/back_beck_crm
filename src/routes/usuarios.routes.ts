import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarios.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize('administrador', 'ingenieria'), listarUsuarios);
router.post('/', authorize('administrador'), crearUsuario);
router.put('/:id', authorize('administrador'), actualizarUsuario);
router.delete('/:id', authorize('administrador'), eliminarUsuario);

export default router;
