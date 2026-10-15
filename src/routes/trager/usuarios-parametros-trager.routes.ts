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

router.use((_req: Request, _res: Response, next: NextFunction) => {
  _req.empresaContexto = 'trager';
  next();
});

router.use(authenticate);

const methodNotAllowed = (_req: Request, res: Response): void => {
  res.status(405).json({ success: false, error: 'Metodo no permitido para usuarios y parametros Trager' });
};

router.get('/', requirePermission('trager_usuarios_parametros', 'ver'), listarUsuariosParametros);
router.post('/', requirePermission('trager_usuarios_parametros', 'editar'), crearUsuarioParametros);
router.put('/:id', requirePermission('trager_usuarios_parametros', 'editar'), actualizarUsuarioParametros);
router.patch('/:id', requirePermission('trager_usuarios_parametros', 'editar'), methodNotAllowed);
router.delete('/:id', requirePermission('trager_usuarios_parametros', 'editar'), eliminarUsuarioParametros);

export default router;
