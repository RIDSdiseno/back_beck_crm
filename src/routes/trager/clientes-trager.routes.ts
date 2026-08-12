import { Router } from 'express';
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente,
  eliminarCliente,
} from '../../controllers/trager/clientes-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';

const router = Router();

const canSee = requirePermission('trager_clientes', 'ver');
const canEdit = requirePermission('trager_clientes', 'editar');

router.get('/', canSee, listarClientes);
router.post('/', canEdit, crearCliente);
router.get('/:id', canSee, obtenerCliente);
router.put('/:id', canEdit, actualizarCliente);
router.patch('/:id/estado', canEdit, cambiarEstadoCliente);
router.delete('/:id', canEdit, eliminarCliente);

export default router;
