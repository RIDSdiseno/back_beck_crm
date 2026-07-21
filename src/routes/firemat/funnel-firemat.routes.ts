import { Router } from 'express';
import {
  createFunnelFiremat,
  deleteFunnelFiremat,
  getFunnelFiremat,
  getFunnelFirematById,
  getHistorialEtapasFiremat,
  patchEtapaFunnelFiremat,
  updateFunnelFiremat,
} from '../../controllers/firemat/funnel-firemat.controller';
import { getDashboardFunnelFiremat } from '../../controllers/firemat/funnel-firemat-dashboard.controller';
import {
  eliminarArchivoFunnelFiremat,
  listarArchivosFunnelFiremat,
  subirArchivosFunnelFiremat,
} from '../../controllers/firemat/funnel-firemat-archivos.controller';
import { authorize } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import { uploadFunnelBeckFiles as uploadFunnelFirematFiles } from '../../middlewares/upload';

const router = Router();

const canSeeDashboard = requirePermission('firemat_dashboard', 'ver');
const canSee = requirePermission('firemat_funnel', 'ver');
const canEdit = requirePermission('firemat_funnel', 'editar');

router.get('/', canSee, getFunnelFiremat);
router.get('/dashboard', canSeeDashboard, getDashboardFunnelFiremat);
router.delete('/archivos/:archivoId', canEdit, eliminarArchivoFunnelFiremat);
router.get('/:id/archivos', canSee, listarArchivosFunnelFiremat);
router.post('/:id/archivos', canEdit, uploadFunnelFirematFiles, subirArchivosFunnelFiremat);
router.get('/:id/historial-etapas', canSee, getHistorialEtapasFiremat);
router.get('/:id', canSee, getFunnelFirematById);
router.post('/', canEdit, createFunnelFiremat);
router.put('/:id', canEdit, updateFunnelFiremat);
router.patch('/:id/etapa', canEdit, patchEtapaFunnelFiremat);
router.delete('/:id', authorize('administrador'), deleteFunnelFiremat);

export default router;
