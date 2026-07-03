import { Request, Response } from "express";
import { getPermisosEfectivos } from "../helpers/permisosEfectivos";
import {
  obtenerFunnelUnificado,
  FiltroEstadoCierre,
  FiltroUnidadNegocio,
} from "../services/funnelUnificado.service";

function parseUnidadNegocio(raw: unknown): FiltroUnidadNegocio {
  const valor = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return valor === "beck" || valor === "firemat" ? valor : "todas";
}

function parseEstadoCierre(raw: unknown): FiltroEstadoCierre {
  const valor = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (valor === "activa" || valor === "ganada" || valor === "perdida" || valor === "postergada" || valor === "descartada") {
    return valor;
  }
  return "todas";
}

export async function getFunnelUnificadoController(req: Request, res: Response) {
  try {
    const permisos = await getPermisosEfectivos(req.userId ?? "", req.userRole!);
    const puedeVerBeck = permisos.some((p) => p.modulo === "beck_funnel" && p.puedeVer);
    const puedeVerFiremat = permisos.some((p) => p.modulo === "firemat_funnel" && p.puedeVer);

    const unidadNegocio = parseUnidadNegocio(req.query.unidadNegocio);
    const estadoCierre = parseEstadoCierre(req.query.estadoCierre);

    const data = await obtenerFunnelUnificado({
      incluirBeck: puedeVerBeck,
      incluirFiremat: puedeVerFiremat,
      unidadNegocio,
      estadoCierre,
    });

    return res.status(200).json({
      success: true,
      data,
      meta: {
        beckIncluido: puedeVerBeck && unidadNegocio !== "firemat",
        firematIncluido: puedeVerFiremat && unidadNegocio !== "beck",
        total: data.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el funnel unificado.",
    });
  }
}
