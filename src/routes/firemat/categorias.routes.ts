import { Router } from 'express';
import {
  actualizarCategoriaFiremat,
  crearCategoriaFiremat,
  eliminarCategoriaFiremat,
  getCategoriasFiremat,
} from '../../controllers/firemat/categorias.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get(
  '/',
  requirePermission(
    ['firemat_categorias', 'firemat_productos', 'firemat_cotizaciones', 'firemat_funnel', 'firemat_dashboard'],
    'ver'
  ),
  getCategoriasFiremat
);
router.post('/', requirePermission('firemat_categorias', 'editar'), crearCategoriaFiremat);
router.put('/:id', requirePermission('firemat_categorias', 'editar'), actualizarCategoriaFiremat);
router.delete('/:id', requirePermission('firemat_categorias', 'editar'), eliminarCategoriaFiremat);

export default router;
