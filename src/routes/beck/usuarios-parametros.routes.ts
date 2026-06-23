import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import {
  listarUsuariosParametros,
  crearUsuarioParametros,
  actualizarUsuarioParametros,
  eliminarUsuarioParametros,
} from '../../controllers/usuarios-parametros.controller';

const router = Router();

// Inyectar contexto de empresa Beck en todos los handlers de este router
router.use((_req: Request, _res: Response, next: NextFunction) => {
  _req.empresaContexto = 'beck';
  next();
});

router.use(authenticate);

router.get('/', requirePermission('beck_usuarios_parametros', 'ver'), listarUsuariosParametros);
// requirePermission es la autoridad final para escritura; lógica de negocio (no-admin no puede asignar administrador) se aplica en el controller
router.post('/', requirePermission('beck_usuarios_parametros', 'editar'), crearUsuarioParametros);
router.put('/:id', requirePermission('beck_usuarios_parametros', 'editar'), actualizarUsuarioParametros);
router.delete('/:id', requirePermission('beck_usuarios_parametros', 'editar'), eliminarUsuarioParametros);

export default router;
