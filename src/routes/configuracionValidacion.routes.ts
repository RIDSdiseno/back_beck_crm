import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";
import {
  getConfiguracionValidacion,
  updateConfiguracionValidacion,
} from "../controllers/configuracionValidacion.controller";

const router = Router();

router.get("/", authenticate, requirePermission('beck_reglas_validacion', 'ver'), getConfiguracionValidacion);
router.put("/:id", authenticate, requirePermission('beck_reglas_validacion', 'editar'), updateConfiguracionValidacion);

export default router;
