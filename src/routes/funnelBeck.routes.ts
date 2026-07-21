import { Router } from "express";
import {
  createFunnelBeckController,
  createFunnelBeckArchivosController,
  deleteFunnelBeckController,
  deleteFunnelBeckArchivoController,
  exportarFunnelBeck,
  getAllFunnelBeckController,
  getCotizacionesByFunnelBeckController,
  getFunnelBeckArchivosController,
  getFunnelBeckByIdController,
  getGanadasSinObraFunnelBeckController,
  getHistorialEtapasBeckController,
  getHistorialCombinadoBeckController,
  cambiarVendedorFunnelBeckController,
  updateEstadoCierreFunnelBeckController,
  updateEtapaFunnelBeckController,
  updateFunnelBeckController,
  updateObraFunnelBeckController,
} from "../controllers/funnelBeck.controller";
import { getDashboardFunnelBeck } from "../controllers/funnelBeckDashboard.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";
import { uploadFunnelBeckFiles } from "../middlewares/upload";

const router = Router();

router.get("/", authenticate, requirePermission('beck_funnel', 'ver'), getAllFunnelBeckController);
router.get("/dashboard", authenticate, requirePermission('beck_funnel', 'ver'), getDashboardFunnelBeck);
router.get("/exportar", authenticate, requirePermission('beck_funnel', 'ver'), exportarFunnelBeck);
router.get("/ganadas-sin-obra", authenticate, requirePermission('beck_funnel', 'ver'), getGanadasSinObraFunnelBeckController);
router.delete("/archivos/:archivoId", authenticate, requirePermission('beck_funnel', 'editar'), deleteFunnelBeckArchivoController);
router.get("/:id/archivos", authenticate, requirePermission('beck_funnel', 'ver'), getFunnelBeckArchivosController);
router.post("/:id/archivos", authenticate, requirePermission('beck_funnel', 'editar'), uploadFunnelBeckFiles, createFunnelBeckArchivosController);
router.get("/:id/cotizaciones", authenticate, requirePermission('beck_cotizaciones', 'ver'), getCotizacionesByFunnelBeckController);
router.get("/:id/historial-etapas", authenticate, requirePermission('beck_funnel', 'ver'), getHistorialEtapasBeckController);
router.get("/:id/historial", authenticate, requirePermission('beck_funnel', 'ver'), getHistorialCombinadoBeckController);
router.get("/:id", authenticate, requirePermission('beck_funnel', 'ver'), getFunnelBeckByIdController);
router.post("/", authenticate, requirePermission('beck_funnel', 'editar'), createFunnelBeckController);
router.put("/:id", authenticate, requirePermission('beck_funnel', 'editar'), updateFunnelBeckController);
router.patch("/:id/vendedor", authenticate, requirePermission('beck_funnel', 'editar'), cambiarVendedorFunnelBeckController);
router.patch("/:id/etapa", authenticate, requirePermission('beck_funnel', 'editar'), updateEtapaFunnelBeckController);
router.patch("/:id/estado-cierre", authenticate, requirePermission('beck_funnel', 'editar'), updateEstadoCierreFunnelBeckController);
router.patch("/:id/obra", authenticate, requirePermission('beck_funnel', 'editar'), updateObraFunnelBeckController);
router.delete("/:id", authenticate, authorize("administrador"), requirePermission('beck_funnel', 'editar'), deleteFunnelBeckController);

export default router;
