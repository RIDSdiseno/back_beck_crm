import { Request, Response } from "express";
import {
  getDolarMercado,
  getFallbackIndicador,
  getIndicador,
  getUfActual,
} from "../services/indicadores.service";

export const getIndicadorController = async (req: Request, res: Response) => {
  try {
    const tipo = String(req.params.tipo || "").trim().toUpperCase() as "UF" | "USD";
    const data = await getIndicador(tipo);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error en getIndicadorController:", error);

    return res.status(200).json({
      success: false,
      data: getFallbackIndicador(),
      fallback: true,
    });
  }
};

export const getUfActualController = async (_req: Request, res: Response) => {
  try {
    const data = await getUfActual();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error en getUfActualController:", error);

    return res.status(200).json({
      success: false,
      data: getFallbackIndicador(),
      fallback: true,
    });
  }
};

export const getDolarMercadoController = async (_req: Request, res: Response) => {
  try {
    const data = await getDolarMercado();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error en getDolarMercadoController:", error);

    return res.status(200).json({
      success: false,
      data: getFallbackIndicador(),
      fallback: true,
    });
  }
};
