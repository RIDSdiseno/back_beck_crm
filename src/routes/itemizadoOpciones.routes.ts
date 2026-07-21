import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { uploadExcelMacrosFile } from '../middlewares/upload';
import {
  listarItemizadoOpciones,
  getItemizadoOpcionById,
  crearItemizadoOpcion,
  actualizarItemizadoOpcion,
  patchVisibleItemizadoOpcion,
  patchVisibleMasivoObra,
  eliminarItemizadoOpcion,
  importarItemizadoOpciones,
  getConfiguracionItemizadosPorObra,
  guardarConfiguracionItemizadosPorObra,
  getPropuestaItemizadosPorObra,
} from '../controllers/itemizadoOpciones.controller';

const router = Router();

const ROLES_LECTURA = ['administrador', 'ingenieria', 'jefeobra', 'terreno', 'visualizador'] as const;
const ROLES_ESCRITURA = ['administrador', 'ingenieria', 'jefeobra'] as const;

router.get('/', authenticate, authorize(...ROLES_LECTURA), listarItemizadoOpciones);
router.get('/obra/:obraId/configuracion', authenticate, authorize(...ROLES_LECTURA), getConfiguracionItemizadosPorObra);
router.put('/obra/:obraId/configuracion', authenticate, authorize(...ROLES_ESCRITURA), guardarConfiguracionItemizadosPorObra);
router.get('/obra/:obraId/propuesta', authenticate, authorize(...ROLES_LECTURA), getPropuestaItemizadosPorObra);
router.get('/:id', authenticate, authorize(...ROLES_LECTURA), getItemizadoOpcionById);
router.post('/importar', authenticate, authorize(...ROLES_ESCRITURA), uploadExcelMacrosFile, importarItemizadoOpciones);
router.post('/', authenticate, authorize(...ROLES_ESCRITURA), crearItemizadoOpcion);
router.put('/:id', authenticate, authorize(...ROLES_ESCRITURA), actualizarItemizadoOpcion);
router.patch('/obra/:obraId/visible', authenticate, authorize(...ROLES_ESCRITURA), patchVisibleMasivoObra);
router.patch('/:id/visible', authenticate, authorize(...ROLES_ESCRITURA), patchVisibleItemizadoOpcion);
router.delete('/:id', authenticate, authorize(...ROLES_ESCRITURA), eliminarItemizadoOpcion);

export default router;
