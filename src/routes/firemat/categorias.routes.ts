import { Router } from 'express';
import {
  actualizarCategoriaFiremat,
  crearCategoriaFiremat,
  eliminarCategoriaFiremat,
  getCategoriasFiremat,
} from '../../controllers/firemat/categorias.controller';
import { authorize } from '../../middlewares/auth';

const router = Router();

const canRead = authorize('administrador', 'vendedor_firemat', 'bodeguero', 'visualizador_firemat');
const canManage = authorize('administrador', 'bodeguero');

router.get('/', canRead, getCategoriasFiremat);
router.post('/', canManage, crearCategoriaFiremat);
router.put('/:id', canManage, actualizarCategoriaFiremat);
router.delete('/:id', canManage, eliminarCategoriaFiremat);

export default router;