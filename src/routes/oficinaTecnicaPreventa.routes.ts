import { Router } from "express";
import {
  actualizarSolicitud,
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
} from "../controllers/oficinaTecnicaPreventa.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

const canReadOficinaTecnicaPreventa = authorize("administrador", "ingenieria", "jefeobra", "vendedor", "visualizador");
const canCreateOficinaTecnicaPreventa = authorize("administrador", "ingenieria", "jefeobra");
const canReviewOficinaTecnicaPreventa = authorize("administrador", "ingenieria");

router.use(authenticate);

router.post("/", canCreateOficinaTecnicaPreventa, crearSolicitud);
router.get("/", canReadOficinaTecnicaPreventa, listarSolicitudes);
router.get("/:id", canReadOficinaTecnicaPreventa, obtenerSolicitud);
router.patch("/:id", canReviewOficinaTecnicaPreventa, actualizarSolicitud);

export default router;
