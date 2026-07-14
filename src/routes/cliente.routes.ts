import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import {
  getClientesBeck,
  getUsuariosClientes,
  getObrasCliente,
  getRegistrosObra,
  getDashboardCliente,
  validarRegistroCliente,
  validarRegistrosClienteMultiple,
  obtenerPdfFirmadoCliente,
  descargarPdfConsolidadoCliente,
  getItemizadosPropuestosObraCliente,
  actualizarItemizadoClienteObra,
  confirmarItemizadoCliente,
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
router.patch('/registros/:registroId/validar', vistaCliente, validarRegistroCliente);
router.patch('/registros/validar-multiple', vistaCliente, validarRegistrosClienteMultiple);
router.get('/registros/:id/pdf', vistaCliente, obtenerPdfFirmadoCliente);
router.post('/registros/pdf-consolidado', vistaCliente, descargarPdfConsolidadoCliente);
router.get('/dashboard', vistaCliente, getDashboardCliente);

// Itemizado por obra: revisión y confirmación del cliente (solo rol cliente,
// verificado dentro del controller — vistaCliente solo exige el permiso de módulo)
router.get('/obras/:obraId/itemizados', vistaCliente, getItemizadosPropuestosObraCliente);
router.patch(
  '/obras/:obraId/itemizados/:itemizadoOpcionId',
  vistaCliente,
  actualizarItemizadoClienteObra,
);
router.patch('/obras/:obraId/itemizado/confirmar', vistaCliente, confirmarItemizadoCliente);

export default router;
