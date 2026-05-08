import { Router } from 'express';
import {
  createFunnelFiremat,
  deleteFunnelFiremat,
  getFunnelFiremat,
  getFunnelFirematById,
  patchEtapaFunnelFiremat,
  updateFunnelFiremat,
} from '../../controllers/firemat/funnel-firemat.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

const canReadFunnelFiremat = authorize('administrador', 'vendedor', 'visualizador');
const canWriteFunnelFiremat = authorize('administrador', 'vendedor');

router.get('/', authenticate, canReadFunnelFiremat, getFunnelFiremat);
router.get('/:id', authenticate, canReadFunnelFiremat, getFunnelFirematById);
router.post('/', authenticate, canWriteFunnelFiremat, createFunnelFiremat);
router.put('/:id', authenticate, canWriteFunnelFiremat, updateFunnelFiremat);
router.patch('/:id/etapa', authenticate, canWriteFunnelFiremat, patchEtapaFunnelFiremat);
router.delete('/:id', authenticate, authorize('administrador'), deleteFunnelFiremat);

export default router;
