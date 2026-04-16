import { Router } from "express";
import {
  getDolarMercadoController,
  getUfActualController,
} from "../controllers/indicadores.controller";

const router = Router();

router.get("/uf", getUfActualController);
router.get("/dolar-mercado", getDolarMercadoController);

export default router;
