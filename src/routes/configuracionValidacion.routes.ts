import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {
  getConfiguracionValidacion,
  updateConfiguracionValidacion,
} from "../controllers/configuracionValidacion.controller";

const router = Router();

const soloAdmin = authorize("administrador");

router.get("/", authenticate, soloAdmin, getConfiguracionValidacion);
router.put("/:id", authenticate, soloAdmin, updateConfiguracionValidacion);

export default router;
