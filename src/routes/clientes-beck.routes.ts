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
import { authenticate, authorize } from '../middlewares/auth';
import { uploadExcelOrCsvFile } from '../middlewares/upload';

const router = Router();

const canReadClientes = authorize('administrador', 'vendedor', 'ingenieria', 'visualizador');
const canWriteClientes = authorize('administrador', 'vendedor');

// Rutas estáticas antes de /:id para evitar colisión con parámetro
router.post('/importar', authenticate, canWriteClientes, uploadExcelOrCsvFile, importarClientes);

router.get('/buscar', authenticate, canReadClientes, buscarClientes);

router.get('/', authenticate, canReadClientes, listarClientes);

router.get('/:id/oportunidades', authenticate, canReadClientes, obtenerOportunidadesCliente);
router.get('/:id/obras', authenticate, authorize('administrador', 'ingenieria'), getObrasPorClienteBeck);

router.get('/:id', authenticate, canReadClientes, obtenerCliente);

router.post('/', authenticate, canWriteClientes, crearCliente);

router.put('/contactos/:contactoId', authenticate, canWriteClientes, actualizarContacto);

router.patch('/contactos/:contactoId/estado', authenticate, canWriteClientes, cambiarEstadoContacto);

router.put('/:id', authenticate, canWriteClientes, actualizarCliente);

router.patch('/:id/estado', authenticate, canWriteClientes, cambiarEstadoCliente);

router.post('/:id/contactos', authenticate, canWriteClientes, agregarContacto);

export default router;
