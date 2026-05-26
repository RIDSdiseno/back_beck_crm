import {
  EstadoSolicitudOficinaTecnica,
  Prisma,
  TipoArchivoFunnel,
} from "@prisma/client";
import { prisma } from "../config/prisma";

const ESTADOS_ACTIVOS: EstadoSolicitudOficinaTecnica[] = [
  EstadoSolicitudOficinaTecnica.pendiente,
  EstadoSolicitudOficinaTecnica.en_revision,
  EstadoSolicitudOficinaTecnica.informacion_pendiente,
];

const TIPOS_ARCHIVOS_PREVENTA: TipoArchivoFunnel[] = [
  TipoArchivoFunnel.DOCUMENTO_RECIBIDO,
  TipoArchivoFunnel.PLANO,
  TipoArchivoFunnel.FOTOGRAFIA,
];

const OPORTUNIDAD_BASICA_SELECT = {
  id: true,
  nombreProyecto: true,
  empresa: true,
  rutEmpresa: true,
  etapa: true,
  vendedor: true,
  fechaProbableCierre: true,
  archivos: {
    where: { tipo: { in: TIPOS_ARCHIVOS_PREVENTA } },
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.OperadorBeckSelect;

const SOLICITUD_INCLUDE = {
  oportunidad: {
    select: OPORTUNIDAD_BASICA_SELECT,
  },
} satisfies Prisma.SolicitudOficinaTecnicaInclude;

function optStr(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function parseEstado(value: unknown): EstadoSolicitudOficinaTecnica {
  const estado = String(value ?? "").trim();
  if (!Object.values(EstadoSolicitudOficinaTecnica).includes(estado as EstadoSolicitudOficinaTecnica)) {
    throw new Error("Estado de solicitud inválido.");
  }
  return estado as EstadoSolicitudOficinaTecnica;
}

function parseOptionalDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error("Fecha de revisión inválida.");
  }
  return date;
}

export type CrearSolicitudOficinaTecnicaInput = {
  oportunidadId?: unknown;
  responsableTecnico?: unknown;
  antecedentesLevantados?: unknown;
  basesTecnicas?: unknown;
  especificaciones?: unknown;
  observacionesTecnicas?: unknown;
};

export async function crearSolicitudOficinaTecnica(input: CrearSolicitudOficinaTecnicaInput) {
  const oportunidadId = String(input.oportunidadId ?? "").trim();

  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id: oportunidadId },
    select: {
      id: true,
      vendedor: true,
      responsableTecnico: true,
      antecedentesLevantados: true,
      basesTecnicas: true,
      especificaciones: true,
      observacionesTecnicas: true,
      necesidadOficinaTecnica: true,
    },
  });

  if (!oportunidad) throw new Error("La oportunidad no existe.");
  if (oportunidad.necesidadOficinaTecnica !== true) {
    throw new Error("La oportunidad no requiere oficina técnica.");
  }

  const solicitudActiva = await prisma.solicitudOficinaTecnica.findFirst({
    where: {
      oportunidadId,
      estado: { in: ESTADOS_ACTIVOS },
    },
    select: { id: true },
  });
  if (solicitudActiva) {
    throw new Error("Ya existe una solicitud activa para esta oportunidad.");
  }

  return prisma.solicitudOficinaTecnica.create({
    data: {
      oportunidadId,
      responsableComercial: oportunidad.vendedor,
      responsableTecnico: optStr(input.responsableTecnico) ?? oportunidad.responsableTecnico,
      antecedentesLevantados: optStr(input.antecedentesLevantados) ?? oportunidad.antecedentesLevantados,
      basesTecnicas: optStr(input.basesTecnicas) ?? oportunidad.basesTecnicas,
      especificaciones: optStr(input.especificaciones) ?? oportunidad.especificaciones,
      observacionesTecnicas: optStr(input.observacionesTecnicas) ?? oportunidad.observacionesTecnicas,
      estado: EstadoSolicitudOficinaTecnica.pendiente,
    },
    include: SOLICITUD_INCLUDE,
  });
}

export type ListarSolicitudesOficinaTecnicaFilters = {
  estado?: unknown;
  responsableTecnico?: unknown;
  oportunidadId?: unknown;
};

export async function listarSolicitudesOficinaTecnica(filters: ListarSolicitudesOficinaTecnicaFilters) {
  const where: Prisma.SolicitudOficinaTecnicaWhereInput = {};

  if (filters.estado !== undefined && String(filters.estado).trim()) {
    where.estado = parseEstado(filters.estado);
  }

  if (filters.responsableTecnico !== undefined && String(filters.responsableTecnico).trim()) {
    where.responsableTecnico = String(filters.responsableTecnico).trim();
  }

  if (filters.oportunidadId !== undefined && String(filters.oportunidadId).trim()) {
    where.oportunidadId = String(filters.oportunidadId).trim();
  }

  return prisma.solicitudOficinaTecnica.findMany({
    where,
    include: SOLICITUD_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function obtenerSolicitudOficinaTecnica(id: string) {
  const solicitud = await prisma.solicitudOficinaTecnica.findUnique({
    where: { id },
    include: SOLICITUD_INCLUDE,
  });

  if (!solicitud) throw new Error("La solicitud no existe.");
  return solicitud;
}

export type ActualizarSolicitudOficinaTecnicaInput = {
  estado?: unknown;
  responsableTecnico?: unknown;
  antecedentesLevantados?: unknown;
  basesTecnicas?: unknown;
  especificaciones?: unknown;
  observacionesTecnicas?: unknown;
  comentariosRevision?: unknown;
  fechaRevision?: unknown;
};

export async function actualizarSolicitudOficinaTecnica(
  id: string,
  input: ActualizarSolicitudOficinaTecnicaInput,
) {
  const existente = await prisma.solicitudOficinaTecnica.findUnique({
    where: { id },
    select: {
      id: true,
      estado: true,
      oportunidadId: true,
    },
  });

  if (!existente) throw new Error("La solicitud no existe.");

  const data: Prisma.SolicitudOficinaTecnicaUpdateInput = {};
  let estado: EstadoSolicitudOficinaTecnica | undefined;

  if (input.estado !== undefined) {
    estado = parseEstado(input.estado);
    data.estado = estado;
  }

  const responsableTecnico = optStr(input.responsableTecnico);
  if (responsableTecnico !== undefined) data.responsableTecnico = responsableTecnico;

  const antecedentesLevantados = optStr(input.antecedentesLevantados);
  if (antecedentesLevantados !== undefined) data.antecedentesLevantados = antecedentesLevantados;

  const basesTecnicas = optStr(input.basesTecnicas);
  if (basesTecnicas !== undefined) data.basesTecnicas = basesTecnicas;

  const especificaciones = optStr(input.especificaciones);
  if (especificaciones !== undefined) data.especificaciones = especificaciones;

  const observacionesTecnicas = optStr(input.observacionesTecnicas);
  if (observacionesTecnicas !== undefined) data.observacionesTecnicas = observacionesTecnicas;

  const comentariosRevision = optStr(input.comentariosRevision);
  if (comentariosRevision !== undefined) data.comentariosRevision = comentariosRevision;

  if (
    estado === EstadoSolicitudOficinaTecnica.rechazada &&
    (typeof comentariosRevision !== "string" || !comentariosRevision.trim())
  ) {
    throw new Error("Debes ingresar un motivo de rechazo.");
  }

  const fechaRevision = parseOptionalDate(input.fechaRevision);
  if (fechaRevision !== undefined) {
    data.fechaRevision = fechaRevision;
  } else if (
    estado &&
    (estado === EstadoSolicitudOficinaTecnica.aprobada ||
      estado === EstadoSolicitudOficinaTecnica.rechazada)
  ) {
    data.fechaRevision = new Date();
  }

  return prisma.$transaction(async (tx) => {
    if (
      estado === EstadoSolicitudOficinaTecnica.aprobada &&
      existente.estado !== EstadoSolicitudOficinaTecnica.aprobada
    ) {
      await tx.operadorBeck.update({
        where: { id: existente.oportunidadId },
        data: { etapa: "cotizacion_elaborada" },
      });
    }

    return tx.solicitudOficinaTecnica.update({
      where: { id },
      data,
      include: SOLICITUD_INCLUDE,
    });
  });
}
