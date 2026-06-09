import { Router } from "express";
import { authorize } from "../middlewares/auth";
import {
  getAlertasBeckController,
  marcarAlertasVistasController,
  getAlertasFirematController,
  marcarAlertasFirematVistasController,
} from "../controllers/alertas.controller";

const router = Router();

const canAccessAlertasBeck = authorize("administrador", "vendedor", "ingenieria");
const canAccessAlertasFiremat = authorize("administrador", "vendedor_firemat");

router.get("/beck", canAccessAlertasBeck, getAlertasBeckController);
router.post("/marcar-vista", canAccessAlertasBeck, marcarAlertasVistasController);

router.get("/firemat", canAccessAlertasFiremat, getAlertasFirematController);
router.post("/firemat/marcar-vista", canAccessAlertasFiremat, marcarAlertasFirematVistasController);

export default router;
