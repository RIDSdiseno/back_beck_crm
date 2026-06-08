import { prisma } from "../config/prisma";
import { ALERTAS_CONFIG } from "../config/alertas.config";

type SeveridadAlerta = "ALTA" | "MEDIA" | "BAJA";

export type AlertaBeck = {
  alertaKey: string;
  modulo: "BECK";
  tipo: string;
  oportunidadId: string;
  titulo: string;
  descripcion: string;
  responsable: string | null;
  severidad: SeveridadAlerta;
  fechaReferencia?: string | null;
  diasRestantes?: number | null;
  diasAtraso?: number | null;
  url?: string;
};

function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Returns a - b in whole days (positive = a is after b)
function diffDias(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export interface FiltroVendedor {
  nombre: string;
  email: string;
}

export async function generarAlertasBeck(filtroVendedor?: FiltroVendedor): Promise<AlertaBeck[]> {
  const cfg = ALERTAS_CONFIG.beck;
  const hoy = toStartOfDay(new Date());

  const todasOportunidades = await prisma.operadorBeck.findMany({
    select: {
      id: true,
      nombreProyecto: true,
      empresa: true,
      etapa: true,
      estadoCierre: true,
      proximaAccion: true,
      fechaProximaAccion: true,
      updatedAt: true,
      vendedor: true,
      valorClp: true,
      fechaReactivacion: true,
      estadoDocumentacionVenta: true,
      documentosAdministrativosPendientes: true,
      documentosRequeridos: true,
      reprogramacionesCount: true,
    },
  });

  // Filtrar por vendedor si corresponde (rol vendedor)
  let oportunidades = todasOportunidades;
  if (filtroVendedor) {
    const nombreNorm = filtroVendedor.nombre.trim().toLowerCase();
    const emailNorm = filtroVendedor.email.trim().toLowerCase();
    oportunidades = todasOportunidades.filter((op) => {
      const vendedorNorm = (op.vendedor ?? "").trim().toLowerCase();
      return vendedorNorm === nombreNorm || vendedorNorm === emailNorm;
    });
  }

  const alertas: AlertaBeck[] = [];

  for (const op of oportunidades) {
    const estaActiva =
      op.etapa !== "cerrada" &&
      op.estadoCierre !== "ganada" &&
      op.estadoCierre !== "perdida" &&
      op.estadoCierre !== "postergada";

    // --- 1. SIN_PROXIMA_ACCION ---
    if (estaActiva && (!op.proximaAccion || !op.fechaProximaAccion)) {
      alertas.push({
        alertaKey: `BECK-SIN_PROXIMA_ACCION-${op.id}`,
        modulo: "BECK",
        tipo: "SIN_PROXIMA_ACCION",
        oportunidadId: op.id,
        titulo: "Oportunidad sin próxima acción",
        descripcion: `La oportunidad "${op.nombreProyecto}" no tiene próxima acción definida.`,
        responsable: op.vendedor,
        severidad: "ALTA",
      });
    }

    // --- 2. PROXIMA_ACCION_* ---
    if (estaActiva && op.fechaProximaAccion) {
      const fechaAccion = toStartOfDay(new Date(op.fechaProximaAccion));
      // diasDiff > 0: faltan días, == 0: hoy, < 0: vencida
      const diasDiff = diffDias(fechaAccion, hoy);

      if (diasDiff < 0) {
        const diasAtraso = Math.abs(diasDiff);
        alertas.push({
          alertaKey: `BECK-PROXIMA_ACCION_VENCIDA-${op.id}`,
          modulo: "BECK",
          tipo: "PROXIMA_ACCION_VENCIDA",
          oportunidadId: op.id,
          titulo: "Próxima acción vencida",
          descripcion: `La próxima acción está pendiente/vencida hace ${diasAtraso} días. Debe realizarse o reagendarse.`,
          responsable: op.vendedor,
          severidad: "ALTA",
          fechaReferencia: op.fechaProximaAccion.toISOString(),
          diasAtraso,
        });
      } else if (diasDiff === 0) {
        alertas.push({
          alertaKey: `BECK-PROXIMA_ACCION_HOY-${op.id}`,
          modulo: "BECK",
          tipo: "PROXIMA_ACCION_HOY",
          oportunidadId: op.id,
          titulo: "Próxima acción vence hoy",
          descripcion: "Hoy es el último día para realizar o reagendar la próxima acción.",
          responsable: op.vendedor,
          severidad: "ALTA",
          fechaReferencia: op.fechaProximaAccion.toISOString(),
          diasRestantes: 0,
        });
      } else if (diasDiff <= cfg.diasAvisoProximaAccion) {
        const severidad: SeveridadAlerta = diasDiff >= 3 ? "BAJA" : "MEDIA";
        const descripcion =
          diasDiff === 1
            ? "Mañana vence la próxima acción."
            : `Quedan ${diasDiff} días para realizar o reagendar la próxima acción.`;

        alertas.push({
          alertaKey: `BECK-PROXIMA_ACCION_POR_VENCER-${op.id}`,
          modulo: "BECK",
          tipo: "PROXIMA_ACCION_POR_VENCER",
          oportunidadId: op.id,
          titulo: "Próxima acción por vencer",
          descripcion,
          responsable: op.vendedor,
          severidad,
          fechaReferencia: op.fechaProximaAccion.toISOString(),
          diasRestantes: diasDiff,
        });
      }
    }

    // --- 3. COTIZACION_ENVIADA_SIN_SEGUIMIENTO ---
    if (estaActiva && op.etapa === "cotizacion_enviada") {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasCotizacionEnviadaSinSeguimiento) {
        alertas.push({
          alertaKey: `BECK-COTIZACION_ENVIADA_SIN_SEGUIMIENTO-${op.id}`,
          modulo: "BECK",
          tipo: "COTIZACION_ENVIADA_SIN_SEGUIMIENTO",
          oportunidadId: op.id,
          titulo: "Cotización enviada sin seguimiento",
          descripcion: `La cotización lleva ${diasSinMovimiento} días sin seguimiento.`,
          responsable: op.vendedor,
          severidad: "MEDIA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    // --- 4. DESARROLLO_PROPUESTA_DETENIDO ---
    if (
      estaActiva &&
      (op.etapa === "cotizacion_elaborada" || op.etapa === "visita_levantamiento")
    ) {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasDesarrolloPropuesta) {
        alertas.push({
          alertaKey: `BECK-DESARROLLO_PROPUESTA_DETENIDO-${op.id}`,
          modulo: "BECK",
          tipo: "DESARROLLO_PROPUESTA_DETENIDO",
          oportunidadId: op.id,
          titulo: "Desarrollo de propuesta detenido",
          descripcion: `La oportunidad lleva ${diasSinMovimiento} días sin avance en desarrollo de propuesta.`,
          responsable: op.vendedor,
          severidad: "MEDIA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    // --- 5. DOCUMENTACION_VENTA_PENDIENTE ---
    if (estaActiva && op.etapa === "documentacion_venta") {
      const documentacionPendiente =
        !op.estadoDocumentacionVenta ||
        !!op.documentosAdministrativosPendientes ||
        !op.documentosRequeridos;

      if (documentacionPendiente) {
        alertas.push({
          alertaKey: `BECK-DOCUMENTACION_VENTA_PENDIENTE-${op.id}`,
          modulo: "BECK",
          tipo: "DOCUMENTACION_VENTA_PENDIENTE",
          oportunidadId: op.id,
          titulo: "Documentación de venta pendiente",
          descripcion: `La oportunidad "${op.nombreProyecto}" tiene documentación de venta incompleta.`,
          responsable: op.vendedor,
          severidad: "ALTA",
        });
      }
    }

    // --- 6. POSTERGADA_REACTIVAR ---
    if (op.estadoCierre === "postergada" && op.fechaReactivacion) {
      const fechaReac = toStartOfDay(new Date(op.fechaReactivacion));
      // diasHastaReac > 0: quedan días, <= 0: hoy o vencida
      const diasHastaReac = diffDias(fechaReac, hoy);

      if (diasHastaReac <= cfg.diasAvisoReactivacion) {
        const severidad: SeveridadAlerta = diasHastaReac <= 0 ? "ALTA" : "MEDIA";
        const descripcion =
          diasHastaReac <= 0
            ? "La fecha de reactivación ha llegado o pasado."
            : `Faltan ${diasHastaReac} días para la fecha de reactivación.`;

        alertas.push({
          alertaKey: `BECK-POSTERGADA_REACTIVAR-${op.id}`,
          modulo: "BECK",
          tipo: "POSTERGADA_REACTIVAR",
          oportunidadId: op.id,
          titulo: "Oportunidad postergada próxima a reactivar",
          descripcion,
          responsable: op.vendedor,
          severidad,
          fechaReferencia: op.fechaReactivacion.toISOString(),
          diasRestantes: diasHastaReac > 0 ? diasHastaReac : null,
          diasAtraso: diasHastaReac <= 0 ? Math.abs(diasHastaReac) : null,
        });
      }
    }

    // --- 7. ALTO_MONTO_DETENIDA ---
    if (estaActiva && Number(op.valorClp) >= cfg.montoAltoClp) {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasAltoMontoDetenida) {
        alertas.push({
          alertaKey: `BECK-ALTO_MONTO_DETENIDA-${op.id}`,
          modulo: "BECK",
          tipo: "ALTO_MONTO_DETENIDA",
          oportunidadId: op.id,
          titulo: "Oportunidad de alto monto detenida",
          descripcion: `La oportunidad de alto monto lleva ${diasSinMovimiento} días sin actividad.`,
          responsable: op.vendedor,
          severidad: "ALTA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    // --- 8. MULTIPLES_REPROGRAMACIONES ---
    if (op.reprogramacionesCount >= 3) {
      alertas.push({
        alertaKey: `BECK-MULTIPLES_REPROGRAMACIONES-${op.id}`,
        modulo: "BECK",
        tipo: "MULTIPLES_REPROGRAMACIONES",
        oportunidadId: op.id,
        titulo: "Múltiples reprogramaciones",
        descripcion: `La oportunidad "${op.nombreProyecto}" ha sido reprogramada ${op.reprogramacionesCount} veces.`,
        responsable: op.vendedor,
        severidad: "MEDIA",
      });
    }
  }

  return alertas;
}
