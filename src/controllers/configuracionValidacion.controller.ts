import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getConfiguracionValidacion(_req: Request, res: Response) {
  try {
    const reglas = await prisma.configuracionValidacion.findMany({
      orderBy: [{ modulo: "asc" }, { etapa: "asc" }, { regla: "asc" }],
    });
    return res.status(200).json({ success: true, data: reglas });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener configuración de validación.",
    });
  }
}

export async function updateConfiguracionValidacion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID inválido." });
    }

    const { nivel, activo } = req.body as { nivel?: string; activo?: boolean };

    if (nivel !== undefined && nivel !== "BLOQUEANTE" && nivel !== "ADVERTENCIA" && nivel !== "IGNORAR") {
      return res.status(400).json({
        success: false,
        error: 'El nivel debe ser "BLOQUEANTE", "ADVERTENCIA" o "IGNORAR".',
      });
    }

    if (activo !== undefined && typeof activo !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "El campo activo debe ser un booleano.",
      });
    }

    const existe = await prisma.configuracionValidacion.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ success: false, error: "Regla de validación no encontrada." });
    }

    const actualizado = await prisma.configuracionValidacion.update({
      where: { id },
      data: {
        ...(nivel !== undefined && { nivel }),
        ...(activo !== undefined && { activo }),
      },
    });

    return res.status(200).json({
      success: true,
      data: actualizado,
      message: "Regla actualizada correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar regla de validación.",
    });
  }
}
