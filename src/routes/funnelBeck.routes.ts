import { Router } from "express";
import {
  createFunnelBeckController,
  createFunnelBeckArchivosController,
  deleteFunnelBeckController,
  deleteFunnelBeckArchivoController,
  getAllFunnelBeckController,
  getCotizacionesByFunnelBeckController,
  getFunnelBeckArchivosController,
  getFunnelBeckByIdController,
  getGanadasSinObraFunnelBeckController,
  updateEtapaFunnelBeckController,
  updateFunnelBeckController,
  updateObraFunnelBeckController,
} from "../controllers/funnelBeck.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { uploadFunnelBeckFiles } from "../middlewares/upload";

const router = Router();

const canReadFunnelBeck = authorize("administrador", "vendedor", "terreno", "ingenieria", "visualizador");
const canWriteFunnelBeck = authorize("administrador", "vendedor", "terreno", "ingenieria");
const canReadCotizacionesBeck = authorize("administrador", "vendedor", "ingenieria", "visualizador");

router.get("/", authenticate, canReadFunnelBeck, getAllFunnelBeckController);
router.get("/ganadas-sin-obra", authenticate, canReadFunnelBeck, getGanadasSinObraFunnelBeckController);
router.delete("/archivos/:archivoId", authenticate, canWriteFunnelBeck, deleteFunnelBeckArchivoController);
router.get("/:id/archivos", authenticate, canReadFunnelBeck, getFunnelBeckArchivosController);
router.post("/:id/archivos", authenticate, canWriteFunnelBeck, uploadFunnelBeckFiles, createFunnelBeckArchivosController);
router.get("/:id/cotizaciones", authenticate, canReadCotizacionesBeck, getCotizacionesByFunnelBeckController);
router.get("/:id", authenticate, canReadFunnelBeck, getFunnelBeckByIdController);
router.post("/", authenticate, canWriteFunnelBeck, createFunnelBeckController);
router.put("/:id", authenticate, canWriteFunnelBeck, updateFunnelBeckController);
router.patch("/:id/etapa", authenticate, canWriteFunnelBeck, updateEtapaFunnelBeckController);
router.patch("/:id/obra", authenticate, canWriteFunnelBeck, updateObraFunnelBeckController);
router.delete("/:id", authenticate, authorize("administrador"), deleteFunnelBeckController);

export default router;
