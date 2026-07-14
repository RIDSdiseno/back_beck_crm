import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { Prisma, EtapaFunnelBeck, EstadoCierreFunnel, FuenteLeadFunnel } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  AdvertenciaCamposCriticosError,
  createFunnelBeck,
  deleteFunnelBeck,
  getAllFunnelBeck,
  getFunnelBeckById,
  getGanadasSinObraFunnelBeck,
  getHistorialEtapasBeck,
  getHistorialCombinadoBeck,
  cambiarVendedorFunnelBeck,
  updateEstadoCierreFunnelBeck,
  updateEtapaFunnelBeck,
  updateFunnelBeck,
  updateObraFunnelBeck,
} from "../services/funnelBeck.service";
import {
  CotizacionError,
} from "../types/cotizaciones.types";
import { MotivoInvalidoError } from "../constants/motivosCierre";
import {
  listCotizacionesByFunnelBeck,
} from "../services/cotizaciones.service";
import {
  createFunnelBeckArchivos,
  deleteFunnelBeckArchivo,
  listFunnelBeckArchivos,
} from "../services/funnelBeckArchivos.service";
import { maskCotizacionGanancia } from "./cotizaciones.controller";

// ── Helpers para exportación Excel ────────────────────────────────────────────

const ETAPA_EXCEL_LABELS: Record<string, string> = {
  prospecto_identificado: "Prospecto identificado",
  visita_levantamiento:   "Visita / levantamiento",
  cotizacion_elaborada:   "Cotización elaborada",
  cotizacion_enviada:     "Cotización enviada",
  en_negociacion:         "En negociación",
  documentacion_venta:    "Documentación venta",
  cerrada:                "Cerrada",
};

const FUENTE_LEAD_EXCEL_LABELS: Record<string, string> = {
  web:                "Web",
  prospeccion:        "Prospección",
  cliente_recurrente: "Cliente recurrente",
  referido:           "Referido",
  otro:               "Otro",
};

const ESTADO_CIERRE_EXCEL_LABELS: Record<string, string> = {
  ganada:     "Ganada",
  perdida:    "Perdida",
  postergada: "Postergada",
};

function formatFechaExcel(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

function startOfDayExport(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDayExport(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

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
    const { oportunidad, advertencias } = await updateFunnelBeck(id, req.body, req.userId ?? '', req.userRole ?? undefined);
    return res.status(200).json({
      success: true,
      data: oportunidad,
      ...(advertencias.length > 0 && { advertencias }),
      message: "Oportunidad actualizada correctamente.",
    });
  } catch (error) {
    if (error instanceof MotivoInvalidoError) {
      return res.status(400).json({
        success: false,
        error: "Motivo inválido",
        detalles: error.detalles,
      });
    }
    if (error instanceof AdvertenciaCamposCriticosError) {
      return res.status(409).json({
        success: false,
        bloqueos: error.bloqueos,
        advertencias: error.advertencias,
        puedeAvanzar: false,
        message: 'Faltan campos críticos para avanzar de etapa.',
      });
    }
    if (error instanceof Error && (error as NodeJS.ErrnoException & { statusCode?: number }).statusCode === 403) {
      return res.status(403).json({ success: false, error: error.message });
    }
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar la oportunidad.",
    });
  }
}

/**
 * PATCH /api/funnel-beck/:id/vendedor
 * Cambia únicamente el vendedor — no acepta ni valida ningún otro campo de
 * la oportunidad. Pensado para el botón "Cambiar vendedor" del detalle.
 */
export async function cambiarVendedorFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { oportunidad } = await cambiarVendedorFunnelBeck(id, req.body?.vendedor, req.userId ?? '');
    return res.status(200).json({
      success: true,
      data: oportunidad,
      message: "Vendedor actualizado correctamente.",
    });
  } catch (error) {
    const statusCode = error instanceof Error && (error as NodeJS.ErrnoException & { statusCode?: number }).statusCode
      ? (error as NodeJS.ErrnoException & { statusCode?: number }).statusCode!
      : (error instanceof Error && error.message === "Oportunidad no encontrada." ? 404 : 400);
    return res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : "Error al cambiar el vendedor.",
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
    if (error instanceof MotivoInvalidoError) {
      return res.status(400).json({
        success: false,
        error: "Motivo inválido",
        detalles: error.detalles,
      });
    }
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

export async function updateEstadoCierreFunnelBeckController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const oportunidad = await updateEstadoCierreFunnelBeck(id, req.body, req.userId ?? '');
    return res.status(200).json({
      success: true,
      data: oportunidad,
      message: "Estado de cierre actualizado correctamente.",
    });
  } catch (error) {
    if (error instanceof MotivoInvalidoError) {
      return res.status(400).json({
        success: false,
        error: "Motivo inválido",
        detalles: error.detalles,
      });
    }
    const message = error instanceof Error ? error.message : "Error al actualizar el estado de cierre.";
    const statusCode = message === "Oportunidad no encontrada." ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      error: message,
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

/**
 * GET /api/funnel-beck/:id/historial
 * Línea de tiempo combinada: cambios de etapa (HistorialEtapaBeck) + cambios
 * de vendedor (MovimientoCRM, tipo VENDEDOR_MODIFICADO), ordenados por fecha.
 * No reemplaza /historial-etapas — ese endpoint sigue existiendo tal cual
 * para no romper a otros consumidores.
 */
export async function getHistorialCombinadoBeckController(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "").trim();
    const historial = await getHistorialCombinadoBeck(id);
    return res.status(200).json({
      success: true,
      data: historial,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener historial de la oportunidad.";
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

export async function exportarFunnelBeck(req: Request, res: Response): Promise<void> {
  try {
    const {
      unidadNegocio,
      vendedor,
      origen,
      etapa,
      cliente,
      obraId,
      estado,
      fechaIngresoDesde,
      fechaIngresoHasta,
      fechaCierreDesde,
      fechaCierreHasta,
    } = req.query;

    const where: Prisma.OperadorBeckWhereInput = {};

    if (typeof unidadNegocio === "string" && unidadNegocio.trim())
      where.unidadNegocio = unidadNegocio.trim();

    if (typeof vendedor === "string" && vendedor.trim())
      where.vendedor = vendedor.trim();

    if (typeof origen === "string" && origen.trim())
      where.fuenteLead = origen.trim() as FuenteLeadFunnel;

    if (typeof etapa === "string" && etapa.trim())
      where.etapa = etapa.trim() as EtapaFunnelBeck;

    if (typeof cliente === "string" && cliente.trim())
      where.empresa = { contains: cliente.trim(), mode: "insensitive" };

    if (typeof obraId === "string" && obraId.trim())
      where.obraId = obraId.trim();

    const estadoParam = typeof estado === "string" ? estado.trim().toLowerCase() : "";
    if (estadoParam === "activa") {
      where.estadoCierre = null;
      if (!where.etapa) where.etapa = { not: "cerrada" };
    } else if (
      estadoParam === "ganada" ||
      estadoParam === "perdida" ||
      estadoParam === "postergada"
    ) {
      where.estadoCierre = estadoParam as EstadoCierreFunnel;
    } else if (estadoParam === "cerrada") {
      where.estadoCierre = { in: ["ganada", "perdida", "postergada"] as EstadoCierreFunnel[] };
    }

    if (
      (typeof fechaIngresoDesde === "string" && fechaIngresoDesde) ||
      (typeof fechaIngresoHasta === "string" && fechaIngresoHasta)
    ) {
      const createdAtFilter: { gte?: Date; lte?: Date } = {};
      if (typeof fechaIngresoDesde === "string" && fechaIngresoDesde)
        createdAtFilter.gte = startOfDayExport(new Date(fechaIngresoDesde));
      if (typeof fechaIngresoHasta === "string" && fechaIngresoHasta)
        createdAtFilter.lte = endOfDayExport(new Date(fechaIngresoHasta));
      where.createdAt = createdAtFilter;
    }

    if (
      (typeof fechaCierreDesde === "string" && fechaCierreDesde) ||
      (typeof fechaCierreHasta === "string" && fechaCierreHasta)
    ) {
      const fechaCierreFilter: { gte?: Date; lte?: Date } = {};
      if (typeof fechaCierreDesde === "string" && fechaCierreDesde)
        fechaCierreFilter.gte = startOfDayExport(new Date(fechaCierreDesde));
      if (typeof fechaCierreHasta === "string" && fechaCierreHasta)
        fechaCierreFilter.lte = endOfDayExport(new Date(fechaCierreHasta));
      where.fechaProbableCierre = fechaCierreFilter;
    }

    const oportunidades = await prisma.operadorBeck.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        clienteBeck: { select: { rut: true, razonSocial: true, nombreEmpresa: true } },
        obra:        { select: { nombre: true, codigo: true } },
      },
    });

    // ── Construir workbook ─────────────────────────────────────────────────────
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Pipeline Beck");

    sheet.columns = [
      { header: "Cliente",               key: "cliente",            width: 30 },
      { header: "RUT",                   key: "rut",                width: 16 },
      { header: "Proyecto / Obra",       key: "proyecto",           width: 35 },
      { header: "Oportunidad",           key: "oportunidad",        width: 35 },
      { header: "Unidad de negocio",     key: "unidadNegocio",      width: 20 },
      { header: "Etapa",                 key: "etapa",              width: 22 },
      { header: "Responsable",           key: "responsable",        width: 22 },
      { header: "Origen",                key: "origen",             width: 20 },
      { header: "Monto estimado (CLP)",  key: "montoEstimado",      width: 22 },
      { header: "Monto final (CLP)",     key: "montoFinal",         width: 22 },
      { header: "Próxima acción",        key: "proximaAccion",      width: 30 },
      { header: "Fecha próxima acción",  key: "fechaProximaAccion", width: 20 },
      { header: "Estado cierre",         key: "estadoCierre",       width: 18 },
      { header: "Motivo cierre",         key: "motivoCierre",       width: 35 },
      { header: "Última actividad",      key: "ultimaActividad",    width: 20 },
      { header: "Fecha creación",        key: "fechaCreacion",      width: 20 },
    ];

    // Encabezados en negrita
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle" };
    headerRow.height = 18;

    // Filas de datos
    for (const opp of oportunidades) {
      const clienteNombre =
        opp.clienteBeck?.razonSocial ??
        opp.clienteBeck?.nombreEmpresa ??
        opp.empresa;

      const rut = opp.rutEmpresa ?? opp.clienteBeck?.rut ?? "";

      const proyecto = opp.obra
        ? `${opp.nombreProyecto} / ${opp.obra.nombre}`
        : opp.nombreProyecto;

      const motivoCierre = opp.motivoPerdida ?? opp.motivoPostergacion ?? "";

      sheet.addRow({
        cliente:            clienteNombre,
        rut,
        proyecto,
        oportunidad:        opp.nombreProyecto,
        unidadNegocio:      opp.unidadNegocio ?? "",
        etapa:              ETAPA_EXCEL_LABELS[opp.etapa] ?? opp.etapa,
        responsable:        opp.vendedor ?? "",
        origen:             opp.fuenteLead
                              ? (FUENTE_LEAD_EXCEL_LABELS[opp.fuenteLead] ?? opp.fuenteLead)
                              : "",
        montoEstimado:      opp.valorClp !== null ? Number(opp.valorClp) : null,
        montoFinal:         opp.montoFinalGanado !== null ? Number(opp.montoFinalGanado) : null,
        proximaAccion:      opp.proximaAccion ?? "",
        fechaProximaAccion: formatFechaExcel(opp.fechaProximaAccion),
        estadoCierre:       opp.estadoCierre
                              ? (ESTADO_CIERRE_EXCEL_LABELS[opp.estadoCierre] ?? opp.estadoCierre)
                              : "Activa",
        motivoCierre,
        ultimaActividad:    formatFechaExcel(opp.updatedAt),
        fechaCreacion:      formatFechaExcel(opp.createdAt),
      });
    }

    // Formato numérico nativo para montos (permite sumas y filtros en Excel)
    sheet.getColumn("montoEstimado").numFmt = "#,##0";
    sheet.getColumn("montoFinal").numFmt    = "#,##0";

    // ── Respuesta HTTP ─────────────────────────────────────────────────────────
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", 'attachment; filename="pipeline-beck.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar Funnel Beck:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Error al generar el archivo Excel.",
      });
    }
  }
}
