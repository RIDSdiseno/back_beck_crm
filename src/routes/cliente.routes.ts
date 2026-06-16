import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  getClientesBeck,
  getUsuariosClientes,
  getObrasCliente,
  getRegistrosObra,
  getDashboardCliente,
} from '../controllers/cliente.controller';

const router = Router();

const soloCliente = [authenticate, authorize('cliente', 'administrador')];
const soloAdmin = [authenticate, authorize('administrador')];

// Listas para que el admin seleccione el cliente a visualizar
router.get('/clientes-beck', soloAdmin, getClientesBeck);
router.get('/usuarios-clientes', soloAdmin, getUsuariosClientes);

// Vista de cliente — admin usa ?clienteBeckId=UUID o ?clienteUsuarioId=UUID
// Cliente autenticado usa siempre su propio userId (query params ignorados)
router.get('/obras', soloCliente, getObrasCliente);
router.get('/obras/:obraId/registros', soloCliente, getRegistrosObra);
router.get('/dashboard', soloCliente, getDashboardCliente);

export default router;
