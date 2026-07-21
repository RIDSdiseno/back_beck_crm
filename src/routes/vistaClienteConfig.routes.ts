import { Router } from 'express';
import { authorize } from '../middlewares/auth';
import {
  getConfiguracionGeneral,
  putConfiguracionGeneral,
  getConfiguracionBeck,
  putConfiguracionBeck,
} from '../controllers/vistaClienteConfig.controller';

const router = Router();

router.get('/configuracion/general', authorize('administrador'), getConfiguracionGeneral);
router.put('/configuracion/general', authorize('administrador'), putConfiguracionGeneral);
router.get('/configuracion/cliente/:clienteBeckId', authorize('administrador'), getConfiguracionBeck);
router.put('/configuracion/cliente/:clienteBeckId', authorize('administrador'), putConfiguracionBeck);

export default router;
