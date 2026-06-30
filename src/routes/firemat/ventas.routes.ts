import { Router } from 'express';
import { getVentasFiremat, crearVentaFiremat } from '../../controllers/firemat/ventas.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

// Lectura auxiliar permitida también desde dashboard (KPI ventas del mes)
const canSee = requirePermission(['firemat_ventas', 'firemat_dashboard'], 'ver');
const canEdit = requirePermission('firemat_ventas', 'editar');

const methodNotAllowed = (_req: import('express').Request, res: import('express').Response): void => {
  res.status(405).json({ success: false, error: 'Metodo no permitido para ventas Firemat' });
};

router.get('/', canSee, getVentasFiremat);
router.post('/', canEdit, crearVentaFiremat);
router.put('/:id', canEdit, methodNotAllowed);
router.patch('/:id', canEdit, methodNotAllowed);
router.delete('/:id', canEdit, methodNotAllowed);

export default router;
