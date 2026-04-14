import { Request, Response } from "express";
import {
  createFunnelBeck,
  deleteFunnelBeck,
  getAllFunnelBeck,
  getFunnelBeckById,
  updateEtapaFunnelBeck,
  updateFunnelBeck,
} from "../services/funnelBeck.service";

export async function createFunnelBeckController(req: Request, res: Response) {
  try {
    const oportunidad = await createFunnelBeck(req.body);
    return res.status(201).json({
      success: true,
      data: oportunidad,
      message: "Oportunidad creada correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al crear la oportunidad.",
    });
  }
}

export async function getAllFunnelBeckController(_req: Request, res: Response) {
  try {
    const oportunidades = await getAllFunnelBeck();
    return res.status(200).json({
      success: true,
      data: oportunidades,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener oportunidades.",
    });
  }
}

export async function getFunnelBeckByIdController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const oportunidad = await getFunnelBeckById(id);
    return res.status(200).json({
      success: true,
      data: oportunidad,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : "Oportunidad no encontrada.",
    });
  }
}

export async function updateFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const oportunidad = await updateFunnelBeck(id, req.body);
    return res.status(200).json({
      success: true,
      data: oportunidad,
      message: "Oportunidad actualizada correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar la oportunidad.",
    });
  }
}

export async function updateEtapaFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const oportunidad = await updateEtapaFunnelBeck(id, req.body);
    return res.status(200).json({
      success: true,
      data: oportunidad,
      message: "Etapa actualizada correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar etapa.",
    });
  }
}

export async function deleteFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await deleteFunnelBeck(id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar la oportunidad.",
    });
  }
}
