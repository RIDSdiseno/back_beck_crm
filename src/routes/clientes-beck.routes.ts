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
  getObrasPorClienteBeck,
} from '../controllers/clientes-beck.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import { uploadExcelOrCsvFile } from '../middlewares/upload';

const router = Router();

// Modulos que necesitan leer/crear clientes Beck como dato de apoyo (selector de cliente,
// alta rapida de cliente/contacto) sin requerir el permiso completo de "Clientes".
const MODULOS_QUE_VEN_CLIENTES_COMO_APOYO = ['beck_clientes', 'beck_funnel', 'beck_cotizaciones', 'beck_obras', 'beck_usuarios_parametros'];
const MODULOS_QUE_EDITAN_CLIENTES_COMO_APOYO = ['beck_clientes', 'beck_cotizaciones'];
const canSeeOApoyo = requirePermission(MODULOS_QUE_VEN_CLIENTES_COMO_APOYO, 'ver');
const canEditOApoyo = requirePermission(MODULOS_QUE_EDITAN_CLIENTES_COMO_APOYO, 'editar');

router.post('/importar', authenticate, requirePermission('beck_clientes', 'editar'), uploadExcelOrCsvFile, importarClientes);

router.get('/buscar', authenticate, canSeeOApoyo, buscarClientes);

router.get('/', authenticate, canSeeOApoyo, listarClientes);

router.get('/:id/oportunidades', authenticate, requirePermission('beck_clientes', 'ver'), obtenerOportunidadesCliente);
router.get('/:id/obras', authenticate, requirePermission('beck_clientes', 'ver'), getObrasPorClienteBeck);

router.get('/:id', authenticate, canSeeOApoyo, obtenerCliente);

router.post('/', authenticate, canEditOApoyo, crearCliente);

router.put('/contactos/:contactoId', authenticate, requirePermission('beck_clientes', 'editar'), actualizarContacto);

router.patch('/contactos/:contactoId/estado', authenticate, requirePermission('beck_clientes', 'editar'), cambiarEstadoContacto);

router.put('/:id', authenticate, requirePermission('beck_clientes', 'editar'), actualizarCliente);

router.patch('/:id/estado', authenticate, requirePermission('beck_clientes', 'editar'), cambiarEstadoCliente);

router.post('/:id/contactos', authenticate, canEditOApoyo, agregarContacto);

export default router;
