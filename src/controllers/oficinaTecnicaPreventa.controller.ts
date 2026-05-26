import { Request, Response } from "express";
import {
  actualizarSolicitudOficinaTecnica,
  crearSolicitudOficinaTecnica,
  listarSolicitudesOficinaTecnica,
  obtenerSolicitudOficinaTecnica,
} from "../services/oficinaTecnicaPreventa.service";

function statusForError(message: string): number {
  if (message === "La oportunidad no existe." || message === "La solicitud no existe.") return 404;
  return 400;
}

export async function crearSolicitud(req: Request, res: Response) {
  try {
    const solicitud = await crearSolicitudOficinaTecnica(req.body ?? {});
    return res.status(201).json({
      success: true,
      data: solicitud,
      message: "Solicitud de oficina técnica creada correctamente.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear la solicitud.";
    return res.status(statusForError(message)).json({ success: false, error: message });
  }
}

export async function listarSolicitudes(req: Request, res: Response) {
  try {
    const solicitudes = await listarSolicitudesOficinaTecnica({
      estado: req.query.estado,
      responsableTecnico: req.query.responsableTecnico,
      oportunidadId: req.query.oportunidadId,
    });
    return res.status(200).json({ success: true, data: solicitudes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al listar solicitudes.";
    return res.status(statusForError(message)).json({ success: false, error: message });
  }
}

export async function obtenerSolicitud(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const solicitud = await obtenerSolicitudOficinaTecnica(id);
    return res.status(200).json({ success: true, data: solicitud });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener la solicitud.";
    return res.status(statusForError(message)).json({ success: false, error: message });
  }
}

export async function actualizarSolicitud(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const solicitud = await actualizarSolicitudOficinaTecnica(id, req.body ?? {});
    return res.status(200).json({
      success: true,
      data: solicitud,
      message: "Solicitud de oficina técnica actualizada correctamente.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar la solicitud.";
    return res.status(statusForError(message)).json({ success: false, error: message });
  }
}
