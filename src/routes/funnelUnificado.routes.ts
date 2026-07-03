import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";
import { getFunnelUnificadoController } from "../controllers/funnelUnificado.controller";

const router = Router();

// Basta con poder ver el funnel de Beck o el de Firemat; el controller filtra
// por permiso real cuál(es) de los dos orígenes se incluyen en la respuesta.
router.get("/", authenticate, requirePermission(["beck_funnel", "firemat_funnel"], "ver"), getFunnelUnificadoController);

export default router;
