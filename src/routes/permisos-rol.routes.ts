import { Router } from 'express';
import { authorize } from '../middlewares/auth';
import {
  listarRoles,
  obtenerPermisosRol,
  actualizarPermisosRol,
  listarUsuariosDeRol,
} from '../controllers/permisos-rol.controller';

const router = Router();

router.use(authorize('administrador'));

router.get('/roles', listarRoles);
router.get('/roles/:rol/usuarios', listarUsuariosDeRol);
router.get('/roles/:rol', obtenerPermisosRol);
router.put('/roles/:rol', actualizarPermisosRol);

export default router;
