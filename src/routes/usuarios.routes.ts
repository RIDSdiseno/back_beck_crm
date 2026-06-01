import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
} from '../controllers/usuarios.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize('administrador', 'ingenieria', 'vendedor'), listarUsuarios);
router.post('/', authorize('administrador', 'ingenieria'), crearUsuario);
router.patch('/:id/password', authorize('administrador', 'ingenieria'), cambiarPassword);
router.put('/:id', authorize('administrador', 'ingenieria'), actualizarUsuario);
router.delete('/:id', authorize('administrador', 'ingenieria'), eliminarUsuario);

export default router;
