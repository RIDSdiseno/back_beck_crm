import { Router } from 'express';
import {
  getInventarioTrager,
  getMovimientosInventarioTrager,
  exportInventarioTrager,
  updateInventarioTrager,
} from '../../controllers/trager/inventario-trager.controller';
import { importarInventarioExcel } from '../../controllers/trager/importar-trager-excel.controller';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadExcelFile } from '../../middlewares/upload';

// Inventario de Trager: mismo comportamiento que Firemat, sobre la base de Trager.
// La importación de lista de precios en PDF queda pendiente hasta tener el formato del proveedor.
const router = Router();

const canSeeInventario = requirePermission(['trager_inventario', 'trager_dashboard'], 'ver');
const canSeeMovimientos = requirePermission(['trager_movimientos', 'trager_inventario', 'trager_dashboard'], 'ver');
const canEditInventario = requirePermission('trager_inventario', 'editar');

router.post('/importar-excel', canEditInventario, uploadExcelFile, importarInventarioExcel);
router.get('/', canSeeInventario, getInventarioTrager);
router.get('/exportar', requirePermission('trager_inventario', 'ver'), exportInventarioTrager);
router.get('/movimientos', canSeeMovimientos, getMovimientosInventarioTrager);
router.patch('/:productoId', canEditInventario, updateInventarioTrager);

export default router;
