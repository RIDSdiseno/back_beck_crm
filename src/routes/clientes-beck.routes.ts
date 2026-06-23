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

// Rutas estáticas antes de /:id para evitar colisión con parámetro
router.post('/importar', authenticate, requirePermission('beck_clientes', 'editar'), uploadExcelOrCsvFile, importarClientes);

router.get('/buscar', authenticate, requirePermission('beck_clientes', 'ver'), buscarClientes);

router.get('/', authenticate, requirePermission('beck_clientes', 'ver'), listarClientes);

router.get('/:id/oportunidades', authenticate, requirePermission('beck_clientes', 'ver'), obtenerOportunidadesCliente);
router.get('/:id/obras', authenticate, requirePermission('beck_clientes', 'ver'), getObrasPorClienteBeck);

router.get('/:id', authenticate, requirePermission('beck_clientes', 'ver'), obtenerCliente);

router.post('/', authenticate, requirePermission('beck_clientes', 'editar'), crearCliente);

router.put('/contactos/:contactoId', authenticate, requirePermission('beck_clientes', 'editar'), actualizarContacto);

router.patch('/contactos/:contactoId/estado', authenticate, requirePermission('beck_clientes', 'editar'), cambiarEstadoContacto);

router.put('/:id', authenticate, requirePermission('beck_clientes', 'editar'), actualizarCliente);

router.patch('/:id/estado', authenticate, requirePermission('beck_clientes', 'editar'), cambiarEstadoCliente);

router.post('/:id/contactos', authenticate, requirePermission('beck_clientes', 'editar'), agregarContacto);

export default router;
