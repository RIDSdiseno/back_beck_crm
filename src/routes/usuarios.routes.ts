import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
} from '../controllers/usuarios.controller';
import {
  obtenerPermisosUsuario,
  actualizarPermisosUsuario,
} from '../controllers/permisos-usuario.controller';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('beck_usuarios_parametros', 'ver'), listarUsuarios);
router.post('/', requirePermission('beck_usuarios_parametros', 'editar'), crearUsuario);
router.patch('/:id/password', requirePermission('beck_usuarios_parametros', 'editar'), cambiarPassword);
// Gestión de permisos individuales: solo administrador por diseño del sistema
router.get('/:id/permisos', authorize('administrador'), obtenerPermisosUsuario);
router.put('/:id/permisos', authorize('administrador'), actualizarPermisosUsuario);
router.get('/:id', requirePermission('beck_usuarios_parametros', 'ver'), obtenerUsuario);
router.put('/:id', requirePermission('beck_usuarios_parametros', 'editar'), actualizarUsuario);
router.delete('/:id', requirePermission('beck_usuarios_parametros', 'editar'), eliminarUsuario);

export default router;
