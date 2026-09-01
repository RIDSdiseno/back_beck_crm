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
// Cotizaciones y Funnel necesitan poder listar/leer clientes como dato de apoyo (selector
// de cliente), sin requerir el permiso completo de "Clientes".
const canSeeOrCotizaciones = requirePermission(['trager_clientes', 'trager_cotizaciones', 'trager_funnel'], 'ver');

router.get('/', canSeeOrCotizaciones, listarClientes);
router.post('/', canEdit, crearCliente);
router.get('/:id', canSeeOrCotizaciones, obtenerCliente);
router.put('/:id', canEdit, actualizarCliente);
router.patch('/:id/estado', canEdit, cambiarEstadoCliente);
router.delete('/:id', canEdit, eliminarCliente);

export default router;
