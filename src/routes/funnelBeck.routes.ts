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

const router = Router();

router.get("/", getAllFunnelBeckController);
router.get("/:id/cotizaciones", getCotizacionesByFunnelBeckController);
router.get("/:id", getFunnelBeckByIdController);
router.post("/", createFunnelBeckController);
router.put("/:id", updateFunnelBeckController);
router.patch("/:id/etapa", updateEtapaFunnelBeckController);
router.delete("/:id", deleteFunnelBeckController);

export default router;
