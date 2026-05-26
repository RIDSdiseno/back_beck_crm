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
import { authorize } from '../../middlewares/auth';
import { uploadExcelOrCsvFile } from '../../middlewares/upload';

const router = Router();

// bodeguero y visualizador_firemat son solo lectura
const canRead = authorize(
  'administrador', 'vendedor', 'visualizador',
  'vendedor_firemat', 'visualizador_firemat', 'bodeguero'
);
const canWrite = authorize('administrador', 'vendedor', 'vendedor_firemat');
const canImport = authorize('administrador', 'vendedor_firemat');

// Rutas estáticas antes de /:id para evitar colisión con el parámetro dinámico
router.get('/buscar', canRead, buscarClientes);
router.post('/importar', canImport, uploadExcelOrCsvFile, importarClientes);

router.put('/contactos/:contactoId', canWrite, actualizarContacto);
router.patch('/contactos/:contactoId/estado', canWrite, cambiarEstadoContacto);

router.get('/', canRead, listarClientes);
router.post('/', canWrite, crearCliente);

router.get('/:id/oportunidades', canRead, obtenerOportunidadesCliente);
router.get('/:id', canRead, obtenerCliente);
router.put('/:id', canWrite, actualizarCliente);
router.patch('/:id/estado', canWrite, cambiarEstadoCliente);
router.post('/:id/contactos', canWrite, agregarContacto);

export default router;
