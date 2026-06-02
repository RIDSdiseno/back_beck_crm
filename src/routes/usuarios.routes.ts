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

router.get('/', authorize('administrador', 'ingenieria', 'vendedor', 'jefeobra'), listarUsuarios);
router.post('/', authorize('administrador', 'ingenieria', 'jefeobra'), crearUsuario);
router.patch('/:id/password', authorize('administrador', 'ingenieria', 'jefeobra'), cambiarPassword);
router.put('/:id', authorize('administrador', 'ingenieria', 'jefeobra'), actualizarUsuario);
router.delete('/:id', authorize('administrador', 'ingenieria', 'jefeobra'), eliminarUsuario);

export default router;
