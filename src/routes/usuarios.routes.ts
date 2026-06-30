import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  listarUsuarios,
  obtenerUsuario,
  obtenerObrasUsuarioCliente,
  obtenerVistaClienteUsuario,
  crearUsuario,
  actualizarUsuario,
  actualizarObrasUsuarioCliente,
  actualizarVistaClienteUsuario,
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
router.get('/:id/obras', authorize('administrador'), obtenerObrasUsuarioCliente);
router.put('/:id/obras', authorize('administrador'), actualizarObrasUsuarioCliente);
router.get('/:id/vista-cliente', authorize('administrador'), obtenerVistaClienteUsuario);
router.put('/:id/vista-cliente', authorize('administrador'), actualizarVistaClienteUsuario);
router.get('/:id', requirePermission('beck_usuarios_parametros', 'ver'), obtenerUsuario);
router.put('/:id', requirePermission('beck_usuarios_parametros', 'editar'), actualizarUsuario);
router.delete('/:id', requirePermission('beck_usuarios_parametros', 'editar'), eliminarUsuario);

export default router;
