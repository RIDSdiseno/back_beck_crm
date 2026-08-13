import { Router } from 'express';
import {
  actualizarCategoriaTrager,
  crearCategoriaTrager,
  eliminarCategoriaTrager,
  getCategoriasTrager,
} from '../../controllers/trager/categorias-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

router.get(
  '/',
  requirePermission(
    ['trager_categorias', 'trager_productos', 'trager_funnel', 'trager_dashboard'],
    'ver'
  ),
  getCategoriasTrager
);
router.post('/', requirePermission('trager_categorias', 'editar'), crearCategoriaTrager);
router.put('/:id', requirePermission('trager_categorias', 'editar'), actualizarCategoriaTrager);
router.delete('/:id', requirePermission('trager_categorias', 'editar'), eliminarCategoriaTrager);

export default router;
