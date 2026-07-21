import { Router } from "express";
import {
  actualizarSolicitud,
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
} from "../controllers/oficinaTecnicaPreventa.controller";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/requirePermission";

const router = Router();

router.use(authenticate);

router.post("/", requirePermission('beck_oficina_tecnica', 'editar'), crearSolicitud);
router.get("/", requirePermission('beck_oficina_tecnica', 'ver'), listarSolicitudes);
router.get("/:id", requirePermission('beck_oficina_tecnica', 'ver'), obtenerSolicitud);
router.patch("/:id", requirePermission('beck_oficina_tecnica', 'editar'), actualizarSolicitud);

export default router;
