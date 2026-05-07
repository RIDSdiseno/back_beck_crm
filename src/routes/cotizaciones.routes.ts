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

const router = Router();

const canReadCotizaciones = authorize("administrador", "vendedor", "ingenieria", "visualizador");
const canWriteCotizaciones = authorize("administrador", "vendedor");

router.get("/", authenticate, canReadCotizaciones, getCotizaciones);
router.get("/:id/versiones", authenticate, canReadCotizaciones, getCotizacionVersiones);
router.get("/:id", authenticate, canReadCotizaciones, getCotizacionById);
router.get("/:id/pdf", authenticate, canReadCotizaciones, downloadCotizacionPdf);

// Solo roles con permiso de edición
router.post(
  "/",
  authenticate,
  canWriteCotizaciones,
  createCotizacion
);

router.put(
  "/:id",
  authenticate,
  canWriteCotizaciones,
  updateCotizacion
);

router.patch(
  "/:id/estado",
  authenticate,
  canWriteCotizaciones,
  patchCotizacionEstado
);

router.delete(
  "/:id",
  authenticate,
  authorize("administrador"),
  deleteCotizacion
);

export default router;
