import { Router } from 'express';
import {
  listarClientes,
  buscarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente,
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
// Lectura de clientes accesible también a usuarios con firemat_cotizaciones.ver (incluye editar)
// para que el selector de cliente en el modal de cotizaciones funcione sin permiso de clientes
const canSeeOrCotizaciones = requirePermission(['firemat_clientes', 'firemat_cotizaciones'], 'ver');

// Rutas estáticas antes de /:id para evitar colisión con el parámetro dinámico
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
router.post('/:id/contactos', canEdit, agregarContacto);

export default router;
