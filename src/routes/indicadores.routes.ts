import { Router } from "express";
import {
  getDolarMercadoController,
  getIndicadorController,
  getUfActualController,
} from "../controllers/indicadores.controller";

const router = Router();

router.get("/uf", getUfActualController);
router.get("/dolar-mercado", getDolarMercadoController);
router.get("/:tipo", getIndicadorController);

export default router;
