import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";
import { getFunnelUnificadoController } from "../controllers/funnelUnificado.controller";

const router = Router();

router.get("/", authenticate, requirePermission(["beck_funnel", "firemat_funnel"], "ver"), getFunnelUnificadoController);

export default router;
