import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { uploadExcelMacrosFile } from '../middlewares/upload';
import {
  listarItemizadoOpciones,
  getItemizadoOpcionById,
  crearItemizadoOpcion,
  actualizarItemizadoOpcion,
  patchVisibleItemizadoOpcion,
  eliminarItemizadoOpcion,
  importarItemizadoOpciones,
} from '../controllers/itemizadoOpciones.controller';

const router = Router();

const ROLES_LECTURA = ['administrador', 'ingenieria', 'jefeobra', 'terreno', 'visualizador'] as const;
const ROLES_ESCRITURA = ['administrador', 'ingenieria', 'jefeobra'] as const;

router.get('/', authenticate, authorize(...ROLES_LECTURA), listarItemizadoOpciones);
router.get('/:id', authenticate, authorize(...ROLES_LECTURA), getItemizadoOpcionById);
router.post('/importar', authenticate, authorize(...ROLES_ESCRITURA), uploadExcelMacrosFile, importarItemizadoOpciones);
router.post('/', authenticate, authorize(...ROLES_ESCRITURA), crearItemizadoOpcion);
router.put('/:id', authenticate, authorize(...ROLES_ESCRITURA), actualizarItemizadoOpcion);
router.patch('/:id/visible', authenticate, authorize(...ROLES_ESCRITURA), patchVisibleItemizadoOpcion);
router.delete('/:id', authenticate, authorize(...ROLES_ESCRITURA), eliminarItemizadoOpcion);

export default router;
