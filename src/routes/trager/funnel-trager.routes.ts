import { Router } from 'express';
import {
  createFunnelTrager,
  deleteFunnelTrager,
  getFunnelTrager,
  getFunnelTragerById,
  getHistorialEtapasTrager,
  patchEtapaFunnelTrager,
  updateFunnelTrager,
} from '../../controllers/trager/funnel-trager.controller';
import { getDashboardFunnelTrager } from '../../controllers/trager/funnel-trager-dashboard.controller';
import {
  eliminarArchivoFunnelTrager,
  listarArchivosFunnelTrager,
  subirArchivosFunnelTrager,
} from '../../controllers/trager/funnel-trager-archivos.controller';
import { authorize } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadFunnelBeckFiles as uploadFunnelTragerFiles } from '../../middlewares/upload';

const router = Router();

const canSeeDashboard = requirePermission('trager_dashboard', 'ver');
const canSee = requirePermission('trager_funnel', 'ver');
const canEdit = requirePermission('trager_funnel', 'editar');

router.get('/', canSee, getFunnelTrager);
router.get('/dashboard', canSeeDashboard, getDashboardFunnelTrager);
router.delete('/archivos/:archivoId', canEdit, eliminarArchivoFunnelTrager);
router.get('/:id/archivos', canSee, listarArchivosFunnelTrager);
router.post('/:id/archivos', canEdit, uploadFunnelTragerFiles, subirArchivosFunnelTrager);
router.get('/:id/historial-etapas', canSee, getHistorialEtapasTrager);
router.get('/:id', canSee, getFunnelTragerById);
router.post('/', canEdit, createFunnelTrager);
router.put('/:id', canEdit, updateFunnelTrager);
router.patch('/:id/etapa', canEdit, patchEtapaFunnelTrager);
router.delete('/:id', authorize('administrador'), deleteFunnelTrager);

export default router;
