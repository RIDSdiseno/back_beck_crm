import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarios.controller';

const router = Router();

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'administrador') {
    res.status(403).json({ error: 'No autorizado' });
    return;
  }

  next();
};

router.use(authenticate);
router.use(requireAdmin);

router.get('/', listarUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;