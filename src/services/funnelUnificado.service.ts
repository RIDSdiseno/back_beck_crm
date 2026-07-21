import { firematPrisma } from "../config/firematPrisma";
import { getAllFunnelBeck } from "./funnelBeck.service";

export type OrigenFunnel = "BECK" | "FIREMAT";
export type EstadoCierreUnificado = "ganada" | "perdida" | "postergada" | "descartada" | null;
export type FiltroUnidadNegocio = "beck" | "firemat" | "mixto" | "todas";
export type FiltroEstadoCierre = "activa" | "ganada" | "perdida" | "postergada" | "descartada" | "todas";

export interface OportunidadUnificada {
  id: string;
  origen: OrigenFunnel;
  titulo: string;
  empresa: string;
  cliente: string;
  contacto: string | null;
  etapa: string;
  etapaTablero: string;
  unidadNegocio: "Beck" | "Firemat";
  unidadNegocioBeck: string | null;
  monto: number;
  probabilidad: number | null;
  proximaAccion: string | null;
  fechaProximaAccion: Date | null;
  fechaCierre: Date | null;
  estadoCierre: EstadoCierreUnificado;
  motivoCierre: string | null;
  observacionCierre: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const FIREMAT_ETAPA_A_TABLERO_BECK: Record<string, string> = {
  PROSPECTO: "prospecto_identificado",
  PRIMER_CONTACTO: "visita_levantamiento",
  DESARROLLO_COTIZACION: "cotizacion_elaborada",
  COTIZACION_ENVIADA: "cotizacion_enviada",
  ORDEN_CONFIRMADA: "documentacion_venta",
  GANADA: "cerrada",
};
const ETAPAS_PIPELINE_FIREMAT = new Set([
  "PROSPECTO",
  "PRIMER_CONTACTO",
  "DESARROLLO_COTIZACION",
  "COTIZACION_ENVIADA",
  "ORDEN_CONFIRMADA",
]);
const ETAPA_TABLERO_POR_DEFECTO = "prospecto_identificado";

function estadoCierreDesdeEtapaFiremat(etapa: string): EstadoCierreUnificado {
  switch (etapa) {
    case "GANADA": return "ganada";
    case "PERDIDA": return "perdida";
    case "POSTERGADA": return "postergada";
    case "DESCARTADO": return "descartada";
    default: return null;
  }
}

/**
 * Firemat guarda GANADA/PERDIDA/POSTERGADA/DESCARTADO como valores de "etapa" (no como un
 * estadoCierre separado, a diferencia de Beck). Para las oportunidades cerradas como
 * perdida/postergada/descartada, la tarjeta debe mostrarse en la última etapa real del
 * pipeline (igual criterio que ya aplica el Funnel Beck), reconstruida desde su historial.
 */
async function resolverEtapasTableroFiremat(
  oportunidades: { id: number; etapa: string }[],
): Promise<Map<number, string>> {
  const resultado = new Map<number, string>();
  const necesitanFallback = oportunidades.filter(
    (o) => o.etapa !== "GANADA" && !ETAPAS_PIPELINE_FIREMAT.has(o.etapa),
  );

  const ultimaEtapaRealPorOportunidad = new Map<number, string>();
  if (necesitanFallback.length > 0) {
    const historial = await firematPrisma.historialEtapaFiremat.findMany({
      where: {
        oportunidadId: { in: necesitanFallback.map((o) => o.id) },
        etapaNueva: { in: [...ETAPAS_PIPELINE_FIREMAT] },
      },
      orderBy: { createdAt: "desc" },
      select: { oportunidadId: true, etapaNueva: true },
    });
    for (const h of historial) {
      if (!ultimaEtapaRealPorOportunidad.has(h.oportunidadId)) {
        ultimaEtapaRealPorOportunidad.set(h.oportunidadId, h.etapaNueva);
      }
    }
  }

  for (const o of oportunidades) {
    if (o.etapa === "GANADA") {
      resultado.set(o.id, "cerrada");
    } else if (ETAPAS_PIPELINE_FIREMAT.has(o.etapa)) {
      resultado.set(o.id, FIREMAT_ETAPA_A_TABLERO_BECK[o.etapa] ?? ETAPA_TABLERO_POR_DEFECTO);
    } else {
      const etapaReal = ultimaEtapaRealPorOportunidad.get(o.id);
      resultado.set(
        o.id,
        (etapaReal && FIREMAT_ETAPA_A_TABLERO_BECK[etapaReal]) ?? ETAPA_TABLERO_POR_DEFECTO,
      );
    }
  }

  return resultado;
}

async function obtenerOportunidadesBeckNormalizadas(): Promise<OportunidadUnificada[]> {
  const oportunidades = await getAllFunnelBeck();

  return oportunidades.map((o) => {
    const clienteNombre = o.clienteBeck?.razonSocial ?? o.clienteBeck?.nombreEmpresa ?? o.empresa;
    const monto = o.montoFinalGanado !== null ? Number(o.montoFinalGanado) : Number(o.valorClp);

    return {
      id: `beck_${o.id}`,
      origen: "BECK",
      titulo: o.nombreProyecto,
      empresa: o.empresa,
      cliente: clienteNombre,
      contacto: o.nombreContacto ?? o.contactoBeck?.nombre ?? null,
      etapa: o.etapa,
      etapaTablero: o.etapaTablero,
      unidadNegocio: "Beck",
      unidadNegocioBeck: o.unidadNegocio ?? null,
      monto,
      probabilidad: o.probabilidadCierre,
      proximaAccion: o.proximaAccion,
      fechaProximaAccion: o.fechaProximaAccion,
      fechaCierre: o.fechaCierre,
      estadoCierre: o.estadoCierre,
      motivoCierre: o.motivoPerdida ?? o.motivoPostergacion ?? null,
      observacionCierre: o.observacionCierre,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  });
}

async function obtenerOportunidadesFirematNormalizadas(): Promise<OportunidadUnificada[]> {
  const oportunidades = await firematPrisma.funnelFirematOpportunity.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      cliente: true,
      contacto: true,
      nombreOportunidad: true,
      etapa: true,
      montoEstimado: true,
      probabilidadCierre: true,
      probabilidad: true,
      proximaAccion: true,
      fechaProximaAccion: true,
      fechaCierre: true,
      motivoPerdida: true,
      motivoPostergacion: true,
      motivoDescarte: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const etapaTableroPorId = await resolverEtapasTableroFiremat(oportunidades);

  return oportunidades.map((o) => ({
    id: `firemat_${o.id}`,
    origen: "FIREMAT",
    titulo: o.nombreOportunidad ?? o.cliente,
    empresa: o.cliente,
    cliente: o.cliente,
    contacto: o.contacto,
    etapa: o.etapa,
    etapaTablero: etapaTableroPorId.get(o.id) ?? ETAPA_TABLERO_POR_DEFECTO,
    unidadNegocio: "Firemat",
    unidadNegocioBeck: null,
    monto: o.montoEstimado,
    probabilidad: o.probabilidadCierre ?? o.probabilidad,
    proximaAccion: o.proximaAccion,
    fechaProximaAccion: o.fechaProximaAccion,
    fechaCierre: o.fechaCierre,
    estadoCierre: estadoCierreDesdeEtapaFiremat(o.etapa),
    motivoCierre: o.motivoPerdida ?? o.motivoPostergacion ?? o.motivoDescarte ?? null,
    observacionCierre: null, // Firemat no tiene un campo equivalente hoy.
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));
}

function coincideEstadoCierre(o: OportunidadUnificada, filtro: FiltroEstadoCierre): boolean {
  if (filtro === "todas") return true;
  if (filtro === "activa") return o.estadoCierre === null;
  return o.estadoCierre === filtro;
}

function coincideUnidadNegocio(o: OportunidadUnificada, filtro: FiltroUnidadNegocio): boolean {
  if (filtro !== "mixto") return true;
  return o.origen === "BECK" && o.unidadNegocioBeck?.trim().toLowerCase() === "mixto";
}

export async function obtenerFunnelUnificado(params: {
  incluirBeck: boolean;
  incluirFiremat: boolean;
  unidadNegocio: FiltroUnidadNegocio;
  estadoCierre: FiltroEstadoCierre;
}): Promise<OportunidadUnificada[]> {
  const { incluirBeck, incluirFiremat, unidadNegocio, estadoCierre } = params;

  const consultarBeck = incluirBeck && unidadNegocio !== "firemat";
  const consultarFiremat = incluirFiremat && (unidadNegocio === "todas" || unidadNegocio === "firemat");

  const [beck, firemat] = await Promise.all([
    consultarBeck ? obtenerOportunidadesBeckNormalizadas() : Promise.resolve([]),
    consultarFiremat ? obtenerOportunidadesFirematNormalizadas() : Promise.resolve([]),
  ]);

  return [...beck, ...firemat]
    .filter((o) => coincideEstadoCierre(o, estadoCierre))
    .filter((o) => coincideUnidadNegocio(o, unidadNegocio))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
