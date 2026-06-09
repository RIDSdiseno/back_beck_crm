import { Request, Response } from "express";
import {
  AdvertenciaCamposCriticosError,
  createFunnelBeck,
  deleteFunnelBeck,
  getAllFunnelBeck,
  getFunnelBeckById,
  getGanadasSinObraFunnelBeck,
  getHistorialEtapasBeck,
  updateEtapaFunnelBeck,
  updateFunnelBeck,
  updateObraFunnelBeck,
} from "../services/funnelBeck.service";
import {
  CotizacionError,
} from "../types/cotizaciones.types";
import {
  listCotizacionesByFunnelBeck,
} from "../services/cotizaciones.service";
import {
  createFunnelBeckArchivos,
  deleteFunnelBeckArchivo,
  listFunnelBeckArchivos,
} from "../services/funnelBeckArchivos.service";
import { maskCotizacionGanancia } from "./cotizaciones.controller";

export async function createFunnelBeckController(req: Request, res: Response) {
  try {
    const oportunidad = await createFunnelBeck(req.body, req.userId ?? '');
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

export async function getGanadasSinObraFunnelBeckController(_req: Request, res: Response) {
  try {
    const oportunidades = await getGanadasSinObraFunnelBeck();
    return res.status(200).json({
      success: true,
      data: oportunidades,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener oportunidades ganadas sin obra.",
    });
  }
}

export async function getCotizacionesByFunnelBeckController(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID inválido.",
      });
    }

    const cotizaciones = await listCotizacionesByFunnelBeck(id);
    return res.status(200).json({
      success: true,
      data: maskCotizacionGanancia(cotizaciones, req.userRole === "administrador"),
    });
  } catch (error) {
    if (error instanceof CotizacionError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener cotizaciones de la oportunidad.",
    });
  }
}

export async function createFunnelBeckArchivosController(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const files = req.files as Express.Multer.File[] | undefined;
    const archivos = await createFunnelBeckArchivos(id, req.body?.tipo, files);

    return res.status(201).json({
      success: true,
      data: archivos,
      message: "Archivos subidos correctamente.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir archivos.";
    const statusCode = message === "Oportunidad no encontrada." ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export async function getFunnelBeckArchivosController(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const archivos = await listFunnelBeckArchivos(id);

    return res.status(200).json({
      success: true,
      data: archivos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener archivos.";
    const statusCode = message === "Oportunidad no encontrada." ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export async function deleteFunnelBeckArchivoController(req: Request, res: Response) {
  try {
    const archivoId = String(req.params.archivoId || "").trim();
    const result = await deleteFunnelBeckArchivo(archivoId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar archivo.";
    const statusCode = message === "Archivo no encontrado." ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export async function updateFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { oportunidad, advertencias } = await updateFunnelBeck(id, req.body, req.userId ?? '');
    return res.status(200).json({
      success: true,
      data: oportunidad,
      ...(advertencias.length > 0 && { advertencias }),
      message: "Oportunidad actualizada correctamente.",
    });
  } catch (error) {
    if (error instanceof AdvertenciaCamposCriticosError) {
      return res.status(409).json({
        success: false,
        bloqueos: error.bloqueos,
        advertencias: error.advertencias,
        puedeAvanzar: false,
        message: 'Faltan campos críticos para avanzar de etapa.',
      });
    }
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar la oportunidad.",
    });
  }
}

export async function updateEtapaFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { oportunidad, advertencias } = await updateEtapaFunnelBeck(id, req.body, req.userId ?? '');
    return res.status(200).json({
      success: true,
      data: oportunidad,
      ...(advertencias.length > 0 && { advertencias }),
      message: "Etapa actualizada correctamente.",
    });
  } catch (error) {
    if (error instanceof AdvertenciaCamposCriticosError) {
      return res.status(409).json({
        success: false,
        bloqueos: error.bloqueos,
        advertencias: error.advertencias,
        puedeAvanzar: false,
        message: 'Faltan campos críticos para avanzar de etapa.',
      });
    }
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar etapa.",
    });
  }
}

export async function updateObraFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const obraId = typeof req.body?.obraId === "string" ? req.body.obraId.trim() : "";

    if (!obraId) {
      return res.status(400).json({
        success: false,
        error: "La obra no existe.",
      });
    }

    const oportunidad = await updateObraFunnelBeck(id, obraId);
    return res.status(200).json({
      success: true,
      data: oportunidad,
      message: "Obra vinculada correctamente.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al vincular la obra.";
    const statusCode =
      message === "La oportunidad no existe." || message === "La obra no existe."
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export async function getHistorialEtapasBeckController(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const historial = await getHistorialEtapasBeck(id);
    return res.status(200).json({
      success: true,
      data: historial.map((h) => ({
        id: h.id,
        oportunidadId: h.oportunidadId,
        etapaAnterior: h.etapaAnterior,
        etapaNueva: h.etapaNueva,
        usuarioId: h.usuarioId,
        usuarioNombre: h.usuario?.nombre ?? null,
        usuarioEmail: h.usuario?.email ?? null,
        createdAt: h.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener historial de etapas.";
    const statusCode = message === "Oportunidad no encontrada." ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export async function deleteFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await deleteFunnelBeck(id, req.userId ?? '');
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
