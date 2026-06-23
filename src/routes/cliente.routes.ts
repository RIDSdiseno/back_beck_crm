import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  getClientesBeck,
  getUsuariosClientes,
  getObrasCliente,
  getRegistrosObra,
  getDashboardCliente,
} from '../controllers/cliente.controller';

const router = Router();

const soloAdmin = [authenticate, authorize('administrador')];
const vistaCliente = [authenticate, requirePermission('beck_vista_cliente', 'ver')];

// Selector de clientes Beck — accesible a cualquiera con permiso beck_vista_cliente
router.get('/clientes-beck', vistaCliente, getClientesBeck);
router.get('/usuarios-clientes', soloAdmin, getUsuariosClientes);

// Vista de cliente — scope resuelto por resolverScope según rol
// cliente: obras propias | administrador: clienteBeckId o clienteUsuarioId | interno: clienteBeckId obligatorio
router.get('/obras', vistaCliente, getObrasCliente);
router.get('/obras/:obraId/registros', vistaCliente, getRegistrosObra);
router.get('/dashboard', vistaCliente, getDashboardCliente);

export default router;
