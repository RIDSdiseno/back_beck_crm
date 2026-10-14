import { Router } from 'express';
import {
  importarClientes,
  agregarContacto,
  actualizarContacto,
  cambiarEstadoContacto,
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente,
  eliminarCliente,
} from '../../controllers/trager/clientes-trager.controller';
import { requirePermission } from '../../middlewares/requirePermission';

import { uploadExcelOrCsvFile } from '../../middlewares/upload';

const router = Router();

const canEdit = requirePermission('trager_clientes', 'editar');
// Cotizaciones y Funnel necesitan poder listar/leer clientes como dato de apoyo (selector
// de cliente), sin requerir el permiso completo de "Clientes".
const canSeeOrCotizaciones = requirePermission(['trager_clientes', 'trager_cotizaciones', 'trager_funnel'], 'ver');

router.post('/importar', canEdit, uploadExcelOrCsvFile, importarClientes);
router.put('/contactos/:contactoId', canEdit, actualizarContacto);
router.patch('/contactos/:contactoId/estado', canEdit, cambiarEstadoContacto);
router.post('/:id/contactos', canEdit, agregarContacto);

router.get('/', canSeeOrCotizaciones, listarClientes);
router.post('/', canEdit, crearCliente);
router.get('/:id', canSeeOrCotizaciones, obtenerCliente);
router.put('/:id', canEdit, actualizarCliente);
router.patch('/:id/estado', canEdit, cambiarEstadoCliente);
router.delete('/:id', canEdit, eliminarCliente);

export default router;
