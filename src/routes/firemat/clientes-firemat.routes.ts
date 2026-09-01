import { Router } from 'express';
import {
  listarClientes,
  buscarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente,
  eliminarCliente,
  agregarContacto,
  actualizarContacto,
  cambiarEstadoContacto,
  obtenerOportunidadesCliente,
  importarClientes,
} from '../../controllers/firemat/clientes-firemat.controller';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadExcelOrCsvFile } from '../../middlewares/upload';

const router = Router();

const canSee = requirePermission('firemat_clientes', 'ver');
const canEdit = requirePermission('firemat_clientes', 'editar');
const canSeeOrCotizaciones = requirePermission(['firemat_clientes', 'firemat_cotizaciones'], 'ver');
// Cotizaciones permite dar de alta un cliente/contacto rapido desde su propio flujo,
// sin requerir el permiso completo de edicion de "Clientes".
const canEditOrCotizaciones = requirePermission(['firemat_clientes', 'firemat_cotizaciones'], 'editar');

router.get('/buscar', canSeeOrCotizaciones, buscarClientes);
router.post('/importar', canEdit, uploadExcelOrCsvFile, importarClientes);

router.put('/contactos/:contactoId', canEdit, actualizarContacto);
router.patch('/contactos/:contactoId/estado', canEdit, cambiarEstadoContacto);

router.get('/', canSeeOrCotizaciones, listarClientes);
router.post('/', canEdit, crearCliente);

router.get('/:id/oportunidades', canSee, obtenerOportunidadesCliente);
router.get('/:id', canSeeOrCotizaciones, obtenerCliente);
router.put('/:id', canEdit, actualizarCliente);
router.patch('/:id/estado', canEdit, cambiarEstadoCliente);
router.delete('/:id', canEdit, eliminarCliente);
router.post('/:id/contactos', canEditOrCotizaciones, agregarContacto);

export default router;
