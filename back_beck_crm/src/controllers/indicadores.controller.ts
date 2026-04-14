import { Request, Response } from "express";
import {
  getDolarMercado,
  getUfActual,
} from "../services/indicadores.service";

export const getUfActualController = async (_req: Request, res: Response) => {
  try {
    const uf = await getUfActual();

    return res.status(200).json({
      success: true,
      data: uf,
    });
  } catch (error) {
    console.error("Error en getUfActualController:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo obtener el valor de la UF",
    });
  }
};

export const getDolarMercadoController = async (
  _req: Request,
  res: Response
) => {
  try {
    const dolarMercado = await getDolarMercado();

    return res.status(200).json({
      success: true,
      data: dolarMercado,
    });
  } catch (error) {
    console.error("Error en getDolarMercadoController:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo obtener el valor del dólar de mercado",
    });
  }
};
