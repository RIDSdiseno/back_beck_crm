import { Router } from "express";
import {
  createCotizacion,
  getCotizaciones,
  getCotizacionById,
  getCotizacionVersiones,
  updateCotizacion,
  patchCotizacionEstado,
  deleteCotizacion,
  downloadCotizacionPdf,
} from "../controllers/cotizaciones.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";

const router = Router();

router.get("/", authenticate, requirePermission('beck_cotizaciones', 'ver'), getCotizaciones);
router.get("/:id/versiones", authenticate, requirePermission('beck_cotizaciones', 'ver'), getCotizacionVersiones);
router.get("/:id", authenticate, requirePermission('beck_cotizaciones', 'ver'), getCotizacionById);
router.get("/:id/pdf", authenticate, requirePermission('beck_cotizaciones', 'ver'), downloadCotizacionPdf);

router.post(
  "/",
  authenticate,
  requirePermission('beck_cotizaciones', 'editar'),
  createCotizacion
);

router.put(
  "/:id",
  authenticate,
  requirePermission('beck_cotizaciones', 'editar'),
  updateCotizacion
);

router.patch(
  "/:id/estado",
  authenticate,
  requirePermission('beck_cotizaciones', 'editar'),
  patchCotizacionEstado
);

router.delete(
  "/:id",
  authenticate,
  authorize("administrador"),
  requirePermission('beck_cotizaciones', 'editar'),
  deleteCotizacion
);

export default router;
