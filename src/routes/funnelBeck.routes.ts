import { Router } from "express";
import {
  createFunnelBeckController,
  deleteFunnelBeckController,
  getAllFunnelBeckController,
  getCotizacionesByFunnelBeckController,
  getFunnelBeckByIdController,
  updateEtapaFunnelBeckController,
  updateFunnelBeckController,
} from "../controllers/funnelBeck.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

const canReadFunnelBeck = authorize("administrador", "vendedor", "terreno", "ingenieria", "visualizador");
const canWriteFunnelBeck = authorize("administrador", "vendedor", "terreno", "ingenieria");
const canReadCotizacionesBeck = authorize("administrador", "vendedor", "ingenieria", "visualizador");

router.get("/", authenticate, canReadFunnelBeck, getAllFunnelBeckController);
router.get("/:id/cotizaciones", authenticate, canReadCotizacionesBeck, getCotizacionesByFunnelBeckController);
router.get("/:id", authenticate, canReadFunnelBeck, getFunnelBeckByIdController);
router.post("/", authenticate, canWriteFunnelBeck, createFunnelBeckController);
router.put("/:id", authenticate, canWriteFunnelBeck, updateFunnelBeckController);
router.patch("/:id/etapa", authenticate, canWriteFunnelBeck, updateEtapaFunnelBeckController);
router.delete("/:id", authenticate, authorize("administrador"), deleteFunnelBeckController);

export default router;
