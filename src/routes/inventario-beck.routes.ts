import { Router } from 'express';
import { listarConsumos, politicaConsumo, ConsumoError } from '../services/consumosInventario.service';
import {
  actualizarEpp,
  actualizarHerramienta,
  actualizarImplemento,
  cambiarEstadoEpp,
  cambiarEstadoHerramienta,
  cambiarEstadoImplemento,
  crearEpp,
  crearHerramienta,
  crearImplemento,
  generarSkuEpp,
  generarSkuEppMasivo,
  generarSkuImplemento,
  generarSkuImplementoMasivo,
  importarExcelInventarioBeck,
  listarEpp,
  listarHerramientas,
  listarImplementos,
  obtenerEpp,
  obtenerHerramienta,
  obtenerImplemento,
} from '../controllers/inventario-beck.controller';
import {
  crearAsignaciones,
  devolverAsignacion,
  listarAsignaciones,
  listarMiInventarioDisponible,
  listarObrasAsignables,
  listarSupervisoresAsignables,
  listarTrabajadoresAsignables,
} from '../controllers/asignacionInventarioBeck.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import { uploadXlsxFile } from '../middlewares/upload';

const router = Router();
const consumoAction = (fn: (req: import('express').Request) => Promise<unknown>) => async (req: import('express').Request, res: import('express').Response) => {
  try { res.json({ success: true, data: await fn(req) }); }
  catch (e) { res.status(e instanceof ConsumoError ? e.status : 500).json({ success: false, error: e instanceof ConsumoError ? e.message : 'No se pudo consultar el consumo.' }); }
};
router.get('/consumos', authenticate, requirePermission('beck_inventario', 'ver'), consumoAction(req => listarConsumos('bodega', req.userId!, req.query)));
router.get('/consumos/politica/:tipo/:id', authenticate, requirePermission('beck_inventario', 'ver'), consumoAction(req => politicaConsumo(req.params.tipo, req.params.id)));
router.put('/consumos/politica/:tipo/:id', authenticate, requirePermission('beck_inventario', 'editar'), consumoAction(req => politicaConsumo(req.params.tipo, req.params.id, req.userId!, req.body?.consumible)));

router.post(
  '/importar-excel',
  authenticate,
  requirePermission('beck_inventario', 'editar'),
  uploadXlsxFile,
  importarExcelInventarioBeck,
);

router.get('/epp', authenticate, requirePermission('beck_inventario', 'ver'), listarEpp);
router.post('/epp/generar-sku-masivo', authenticate, requirePermission('beck_inventario', 'editar'), generarSkuEppMasivo);
router.get('/epp/:id', authenticate, requirePermission('beck_inventario', 'ver'), obtenerEpp);
router.post('/epp', authenticate, requirePermission('beck_inventario', 'editar'), crearEpp);
router.put('/epp/:id', authenticate, requirePermission('beck_inventario', 'editar'), actualizarEpp);
router.patch('/epp/:id/estado', authenticate, requirePermission('beck_inventario', 'editar'), cambiarEstadoEpp);
router.post('/epp/:id/generar-sku', authenticate, requirePermission('beck_inventario', 'editar'), generarSkuEpp);

router.get('/implementos', authenticate, requirePermission('beck_inventario', 'ver'), listarImplementos);
router.post('/implementos/generar-sku-masivo', authenticate, requirePermission('beck_inventario', 'editar'), generarSkuImplementoMasivo);
router.get('/implementos/:id', authenticate, requirePermission('beck_inventario', 'ver'), obtenerImplemento);
router.post('/implementos', authenticate, requirePermission('beck_inventario', 'editar'), crearImplemento);
router.put('/implementos/:id', authenticate, requirePermission('beck_inventario', 'editar'), actualizarImplemento);
router.patch('/implementos/:id/estado', authenticate, requirePermission('beck_inventario', 'editar'), cambiarEstadoImplemento);
router.post('/implementos/:id/generar-sku', authenticate, requirePermission('beck_inventario', 'editar'), generarSkuImplemento);

router.get('/herramientas', authenticate, requirePermission('beck_inventario', 'ver'), listarHerramientas);
router.get('/herramientas/:id', authenticate, requirePermission('beck_inventario', 'ver'), obtenerHerramienta);
router.post('/herramientas', authenticate, requirePermission('beck_inventario', 'editar'), crearHerramienta);
router.put('/herramientas/:id', authenticate, requirePermission('beck_inventario', 'editar'), actualizarHerramienta);
router.patch('/herramientas/:id/estado', authenticate, requirePermission('beck_inventario', 'editar'), cambiarEstadoHerramienta);

router.get('/obras', authenticate, requirePermission('beck_inventario', 'ver'), listarObrasAsignables);
router.get('/supervisores', authenticate, requirePermission('beck_inventario', 'ver'), listarSupervisoresAsignables);
router.get('/trabajadores', authenticate, requirePermission('beck_inventario', 'ver'), listarTrabajadoresAsignables);
router.get('/mi-inventario', authenticate, requirePermission('beck_inventario', 'ver'), listarMiInventarioDisponible);

router.get('/asignaciones', authenticate, requirePermission('beck_inventario', 'ver'), listarAsignaciones);
router.post('/asignaciones', authenticate, requirePermission('beck_inventario', 'editar'), crearAsignaciones);
router.patch('/asignaciones/:id/devolver', authenticate, requirePermission('beck_inventario', 'editar'), devolverAsignacion);

export default router;
