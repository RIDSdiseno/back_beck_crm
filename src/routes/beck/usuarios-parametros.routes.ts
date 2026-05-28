import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
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

router.get('/', authorize('administrador', 'ingenieria'), listarUsuariosParametros);
router.post('/', authorize('administrador', 'ingenieria'), crearUsuarioParametros);
router.put('/:id', authorize('administrador', 'ingenieria'), actualizarUsuarioParametros);
router.delete('/:id', authorize('administrador', 'ingenieria'), eliminarUsuarioParametros);

export default router;
