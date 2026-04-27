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
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getAllFunnelBeckController);
router.get("/:id/cotizaciones", authenticate, getCotizacionesByFunnelBeckController);
router.get("/:id", authenticate, getFunnelBeckByIdController);
router.post("/", authenticate, createFunnelBeckController);
router.put("/:id", authenticate, updateFunnelBeckController);
router.patch("/:id/etapa", authenticate, updateEtapaFunnelBeckController);
router.delete("/:id", authenticate, deleteFunnelBeckController);

export default router;
