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
} from '../controllers/cliente.controller';

const router = Router();

const soloAdmin = [authenticate, authorize('administrador')];
const vistaCliente = [authenticate, requirePermission('beck_vista_cliente', 'ver')];

router.get('/clientes-beck', vistaCliente, getClientesBeck);
router.get('/usuarios-clientes', soloAdmin, getUsuariosClientes);

router.get('/obras', vistaCliente, getObrasCliente);
router.get('/obras/:obraId/registros', vistaCliente, getRegistrosObra);
router.patch('/registros/:registroId/validar', vistaCliente, validarRegistroCliente);
router.patch('/registros/validar-multiple', vistaCliente, validarRegistrosClienteMultiple);
router.get('/registros/:id/pdf', vistaCliente, obtenerPdfFirmadoCliente);
router.post('/registros/pdf-consolidado', vistaCliente, descargarPdfConsolidadoCliente);
router.get('/dashboard', vistaCliente, getDashboardCliente);

export default router;
