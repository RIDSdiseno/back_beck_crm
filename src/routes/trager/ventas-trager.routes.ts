import { Router } from 'express';
import { getVentasTrager, crearVentaTrager } from '../../controllers/trager/ventas-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

const canSee = requirePermission(['trager_ventas', 'trager_dashboard'], 'ver');
const canEdit = requirePermission('trager_ventas', 'editar');

const methodNotAllowed = (_req: import('express').Request, res: import('express').Response): void => {
  res.status(405).json({ success: false, error: 'Metodo no permitido para ventas Trager' });
};

router.get('/', canSee, getVentasTrager);
router.post('/', canEdit, crearVentaTrager);
router.put('/:id', canEdit, methodNotAllowed);
router.patch('/:id', canEdit, methodNotAllowed);
router.delete('/:id', canEdit, methodNotAllowed);

export default router;
