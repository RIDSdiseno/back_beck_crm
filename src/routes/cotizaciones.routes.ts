import { Router } from "express";
import {
  createCotizacion,
  getCotizaciones,
  getCotizacionById,
  updateCotizacion,
  patchCotizacionEstado,
  deleteCotizacion,
  downloadCotizacionPdf,
} from "../controllers/cotizaciones.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Todos autenticados pueden ver
router.get("/", authenticate, getCotizaciones);
router.get("/:id", authenticate, getCotizacionById);
router.get("/:id/pdf", authenticate, downloadCotizacionPdf);

// Solo roles con permiso de edición
router.post(
  "/",
  authenticate,
  authorize("administrador", "vendedor", "terreno", "ingenieria"),
  createCotizacion
);

router.put(
  "/:id",
  authenticate,
  authorize("administrador", "vendedor", "terreno", "ingenieria"),
  updateCotizacion
);

router.patch(
  "/:id/estado",
  authenticate,
  authorize("administrador", "vendedor", "terreno", "ingenieria"),
  patchCotizacionEstado
);

router.delete(
  "/:id",
  authenticate,
  authorize("administrador", "vendedor", "terreno", "ingenieria"),
  deleteCotizacion
);

export default router;