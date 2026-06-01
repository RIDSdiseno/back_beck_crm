import { Router } from 'express';
import {
  createFunnelFiremat,
  deleteFunnelFiremat,
  getFunnelFiremat,
  getFunnelFirematById,
  patchEtapaFunnelFiremat,
  updateFunnelFiremat,
} from '../../controllers/firemat/funnel-firemat.controller';
import {
  eliminarArchivoFunnelFiremat,
  listarArchivosFunnelFiremat,
  subirArchivosFunnelFiremat,
} from '../../controllers/firemat/funnel-firemat-archivos.controller';
import { authorize } from '../../middlewares/auth';
import { uploadFunnelBeckFiles as uploadFunnelFirematFiles } from '../../middlewares/upload';

const router = Router();

// bodeguero excluido — no accede al funnel comercial
const canRead  = authorize('administrador', 'vendedor_firemat', 'visualizador_firemat');
// visualizador_firemat es solo lectura
const canWrite = authorize('administrador', 'vendedor_firemat');

router.get('/', canRead, getFunnelFiremat);
router.delete('/archivos/:archivoId', canWrite, eliminarArchivoFunnelFiremat);
router.get('/:id/archivos', canRead, listarArchivosFunnelFiremat);
router.post('/:id/archivos', canWrite, uploadFunnelFirematFiles, subirArchivosFunnelFiremat);
router.get('/:id', canRead, getFunnelFirematById);
router.post('/', canWrite, createFunnelFiremat);
router.put('/:id', canWrite, updateFunnelFiremat);
router.patch('/:id/etapa', canWrite, patchEtapaFunnelFiremat);
router.delete('/:id', authorize('administrador'), deleteFunnelFiremat);

export default router;
