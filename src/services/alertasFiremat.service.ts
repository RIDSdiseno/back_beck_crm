import { firematPrisma } from "../config/firematPrisma";
import { ALERTAS_CONFIG } from "../config/alertas.config";

type SeveridadAlerta = "ALTA" | "MEDIA" | "BAJA";
type CategoriaAlerta = "FUNNEL" | "COTIZACION";

export type AlertaFiremat = {
  alertaKey: string;
  modulo: "FIREMAT";
  categoria: CategoriaAlerta;
  tipo: string;
  oportunidadId?: number;
  cotizacionId?: number;
  titulo: string;
  descripcion: string;
  responsable: string | null;
  severidad: SeveridadAlerta;
  fechaReferencia?: string | null;
  diasRestantes?: number | null;
  diasAtraso?: number | null;
  url?: string;
};

export interface FiltroVendedorFiremat {
  nombre: string;
  email: string;
}

const ETAPAS_NO_ACTIVAS = new Set<string>(["GANADA", "PERDIDA", "POSTERGADA", "DESCARTADO"]);

function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffDias(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

async function generarAlertasFunnelFiremat(
  filtroVendedor?: FiltroVendedorFiremat,
): Promise<AlertaFiremat[]> {
  const cfg = ALERTAS_CONFIG.firemat;
  const hoy = toStartOfDay(new Date());

  const todasOportunidades = await firematPrisma.funnelFirematOpportunity.findMany({
    select: {
      id: true,
      nombreOportunidad: true,
      cliente: true,
      etapa: true,
      responsable: true,
      proximaAccion: true,
      fechaProximaAccion: true,
      updatedAt: true,
      montoEstimado: true,
      fechaReactivacion: true,
      estadoDocumentacionVenta: true,
      estadoDocumentacion: true,
      coordinacionAdministrativa: true,
      traspasoAdministracion: true,
      traspasoERP: true,
      reprogramacionesCount: true,
    },
  });

  let oportunidades = todasOportunidades;
  if (filtroVendedor) {
    const nombreNorm = filtroVendedor.nombre.trim().toLowerCase();
    const emailNorm = filtroVendedor.email.trim().toLowerCase();
    oportunidades = todasOportunidades.filter((op) => {
      const responsableNorm = (op.responsable ?? "").trim().toLowerCase();
      return responsableNorm === nombreNorm || responsableNorm === emailNorm;
    });
  }

  const alertas: AlertaFiremat[] = [];

  for (const op of oportunidades) {
    const estaActiva = !ETAPAS_NO_ACTIVAS.has(op.etapa);
    const nombreMostrar = op.nombreOportunidad ?? op.cliente;

    if (estaActiva && (!op.proximaAccion || !op.fechaProximaAccion)) {
      alertas.push({
        alertaKey: `FIREMAT-SIN_PROXIMA_ACCION-${op.id}`,
        modulo: "FIREMAT",
        categoria: "FUNNEL",
        tipo: "SIN_PROXIMA_ACCION",
        oportunidadId: op.id,
        titulo: "Oportunidad sin próxima acción",
        descripcion: `La oportunidad "${nombreMostrar}" no tiene próxima acción definida.`,
        responsable: op.responsable,
        severidad: "ALTA",
      });
    }

    if (estaActiva && op.fechaProximaAccion) {
      const fechaAccion = toStartOfDay(new Date(op.fechaProximaAccion));
      const diasDiff = diffDias(fechaAccion, hoy);

      if (diasDiff < 0) {
        const diasAtraso = Math.abs(diasDiff);
        alertas.push({
          alertaKey: `FIREMAT-PROXIMA_ACCION_VENCIDA-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "PROXIMA_ACCION_VENCIDA",
          oportunidadId: op.id,
          titulo: "Próxima acción vencida",
          descripcion: `La próxima acción está pendiente/vencida hace ${diasAtraso} días. Debe realizarse o reagendarse.`,
          responsable: op.responsable,
          severidad: "ALTA",
          fechaReferencia: op.fechaProximaAccion.toISOString(),
          diasAtraso,
        });
      } else if (diasDiff === 0) {
        alertas.push({
          alertaKey: `FIREMAT-PROXIMA_ACCION_HOY-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "PROXIMA_ACCION_HOY",
          oportunidadId: op.id,
          titulo: "Próxima acción vence hoy",
          descripcion: "Hoy es el último día para realizar o reagendar la próxima acción.",
          responsable: op.responsable,
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
          alertaKey: `FIREMAT-PROXIMA_ACCION_POR_VENCER-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "PROXIMA_ACCION_POR_VENCER",
          oportunidadId: op.id,
          titulo: "Próxima acción por vencer",
          descripcion,
          responsable: op.responsable,
          severidad,
          fechaReferencia: op.fechaProximaAccion.toISOString(),
          diasRestantes: diasDiff,
        });
      }
    }

    if (estaActiva && op.etapa === "COTIZACION_ENVIADA") {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasCotizacionEnviadaSinSeguimiento) {
        alertas.push({
          alertaKey: `FIREMAT-COTIZACION_ENVIADA_SIN_SEGUIMIENTO-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "COTIZACION_ENVIADA_SIN_SEGUIMIENTO",
          oportunidadId: op.id,
          titulo: "Cotización enviada sin seguimiento",
          descripcion: `La cotización lleva ${diasSinMovimiento} días sin seguimiento.`,
          responsable: op.responsable,
          severidad: "MEDIA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    if (estaActiva && op.etapa === "DESARROLLO_COTIZACION") {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasDesarrolloCotizacion) {
        alertas.push({
          alertaKey: `FIREMAT-DESARROLLO_COTIZACION_DETENIDO-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "DESARROLLO_COTIZACION_DETENIDO",
          oportunidadId: op.id,
          titulo: "Desarrollo de cotización detenido",
          descripcion: `La oportunidad lleva ${diasSinMovimiento} días sin avance en desarrollo de cotización.`,
          responsable: op.responsable,
          severidad: "MEDIA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    if (estaActiva && op.etapa === "ORDEN_CONFIRMADA") {
      const documentacionPendiente =
        !op.estadoDocumentacionVenta ||
        !op.estadoDocumentacion ||
        !op.coordinacionAdministrativa ||
        op.traspasoAdministracion === null ||
        op.traspasoERP === null;

      if (documentacionPendiente) {
        alertas.push({
          alertaKey: `FIREMAT-DOCUMENTACION_VENTA_PENDIENTE-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "DOCUMENTACION_VENTA_PENDIENTE",
          oportunidadId: op.id,
          titulo: "Documentación de venta pendiente",
          descripcion: `La oportunidad "${nombreMostrar}" tiene documentación de venta incompleta.`,
          responsable: op.responsable,
          severidad: "ALTA",
        });
      }
    }

    if (op.etapa === "POSTERGADA" && op.fechaReactivacion) {
      const fechaReac = toStartOfDay(new Date(op.fechaReactivacion));
      const diasHastaReac = diffDias(fechaReac, hoy);

      if (diasHastaReac <= cfg.diasAvisoReactivacion) {
        const severidad: SeveridadAlerta = diasHastaReac <= 0 ? "ALTA" : "MEDIA";
        const descripcion =
          diasHastaReac <= 0
            ? "La fecha de reactivación ha llegado o pasado."
            : `Faltan ${diasHastaReac} días para la fecha de reactivación.`;

        alertas.push({
          alertaKey: `FIREMAT-POSTERGADA_REACTIVAR-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "POSTERGADA_REACTIVAR",
          oportunidadId: op.id,
          titulo: "Oportunidad postergada próxima a reactivar",
          descripcion,
          responsable: op.responsable,
          severidad,
          fechaReferencia: op.fechaReactivacion.toISOString(),
          diasRestantes: diasHastaReac > 0 ? diasHastaReac : null,
          diasAtraso: diasHastaReac <= 0 ? Math.abs(diasHastaReac) : null,
        });
      }
    }

    if (estaActiva && op.montoEstimado >= cfg.montoAltoClp) {
      const diasSinMovimiento = diffDias(hoy, toStartOfDay(new Date(op.updatedAt)));
      if (diasSinMovimiento > cfg.diasAltoMontoDetenida) {
        alertas.push({
          alertaKey: `FIREMAT-ALTO_MONTO_DETENIDA-${op.id}`,
          modulo: "FIREMAT",
          categoria: "FUNNEL",
          tipo: "ALTO_MONTO_DETENIDA",
          oportunidadId: op.id,
          titulo: "Oportunidad de alto monto detenida",
          descripcion: `La oportunidad de alto monto lleva ${diasSinMovimiento} días sin actividad.`,
          responsable: op.responsable,
          severidad: "ALTA",
          diasAtraso: diasSinMovimiento,
        });
      }
    }

    if (op.reprogramacionesCount >= 3) {
      alertas.push({
        alertaKey: `FIREMAT-MULTIPLES_REPROGRAMACIONES-${op.id}`,
        modulo: "FIREMAT",
        categoria: "FUNNEL",
        tipo: "MULTIPLES_REPROGRAMACIONES",
        oportunidadId: op.id,
        titulo: "Múltiples reprogramaciones",
        descripcion: `La oportunidad "${nombreMostrar}" ha sido reprogramada ${op.reprogramacionesCount} veces.`,
        responsable: op.responsable,
        severidad: "MEDIA",
      });
    }
  }

  return alertas;
}

const ESTADOS_COTIZACION_ACTIVOS = new Set<string>(["BORRADOR", "ENVIADA"]);

async function generarAlertasCotizacionesFiremat(
  filtroVendedor?: FiltroVendedorFiremat,
): Promise<AlertaFiremat[]> {
  const cfg = ALERTAS_CONFIG.firemat;
  const hoy = toStartOfDay(new Date());

  const todasCotizaciones = await firematPrisma.cotizacionFiremat.findMany({
    where: { estado: { in: Array.from(ESTADOS_COTIZACION_ACTIVOS) } },
    select: {
      id: true,
      cliente: true,
      responsable: true,
      estado: true,
      fechaVencimiento: true,
      detalles: {
        select: {
          cantidad: true,
          producto: {
            select: { id: true, nombre: true, stock: true, stockReservado: true },
          },
        },
      },
    },
  });

  let cotizaciones = todasCotizaciones;
  if (filtroVendedor) {
    const nombreNorm = filtroVendedor.nombre.trim().toLowerCase();
    const emailNorm = filtroVendedor.email.trim().toLowerCase();
    cotizaciones = todasCotizaciones.filter((c) => {
      const responsableNorm = (c.responsable ?? "").trim().toLowerCase();
      return responsableNorm === nombreNorm || responsableNorm === emailNorm;
    });
  }

  const alertas: AlertaFiremat[] = [];

  for (const cot of cotizaciones) {
    if (cot.fechaVencimiento) {
      const fechaVenc = toStartOfDay(new Date(cot.fechaVencimiento));
      const diasDiff = diffDias(fechaVenc, hoy);

      if (diasDiff < 0) {
        const diasAtraso = Math.abs(diasDiff);
        alertas.push({
          alertaKey: `FIREMAT-COTIZACION_VENCIDA-${cot.id}`,
          modulo: "FIREMAT",
          categoria: "COTIZACION",
          tipo: "COTIZACION_VENCIDA",
          cotizacionId: cot.id,
          titulo: "Cotización vencida",
          descripcion: `La cotización de "${cot.cliente}" está vencida hace ${diasAtraso} días.`,
          responsable: cot.responsable,
          severidad: "ALTA",
          fechaReferencia: cot.fechaVencimiento.toISOString(),
          diasAtraso,
        });
      } else if (diasDiff === 0) {
        alertas.push({
          alertaKey: `FIREMAT-COTIZACION_VENCE_HOY-${cot.id}`,
          modulo: "FIREMAT",
          categoria: "COTIZACION",
          tipo: "COTIZACION_VENCE_HOY",
          cotizacionId: cot.id,
          titulo: "Cotización vence hoy",
          descripcion: `La cotización de "${cot.cliente}" vence hoy.`,
          responsable: cot.responsable,
          severidad: "ALTA",
          fechaReferencia: cot.fechaVencimiento.toISOString(),
          diasRestantes: 0,
        });
      } else if (diasDiff <= cfg.diasAvisoVencimientoCotizacion) {
        const severidad: SeveridadAlerta = diasDiff >= 3 ? "BAJA" : "MEDIA";
        const descripcion =
          diasDiff === 1
            ? `Mañana vence la cotización de "${cot.cliente}".`
            : `Quedan ${diasDiff} días para que venza la cotización de "${cot.cliente}".`;

        alertas.push({
          alertaKey: `FIREMAT-COTIZACION_POR_VENCER-${cot.id}`,
          modulo: "FIREMAT",
          categoria: "COTIZACION",
          tipo: "COTIZACION_POR_VENCER",
          cotizacionId: cot.id,
          titulo: "Cotización por vencer",
          descripcion,
          responsable: cot.responsable,
          severidad,
          fechaReferencia: cot.fechaVencimiento.toISOString(),
          diasRestantes: diasDiff,
        });
      }
    }

    const productosSinStockVistos = new Set<number>();
    for (const detalle of cot.detalles) {
      const producto = detalle.producto;
      if (productosSinStockVistos.has(producto.id)) continue;

      const disponible = producto.stock - producto.stockReservado;
      if (disponible < 0) {
        productosSinStockVistos.add(producto.id);
        alertas.push({
          alertaKey: `FIREMAT-PRODUCTO_RESERVADO_SIN_STOCK-${cot.id}-${producto.id}`,
          modulo: "FIREMAT",
          categoria: "COTIZACION",
          tipo: "PRODUCTO_RESERVADO_SIN_STOCK",
          cotizacionId: cot.id,
          titulo: "Producto reservado sin stock suficiente",
          descripcion: `"${producto.nombre}" está reservado en la cotización de "${cot.cliente}", pero el stock reservado supera al disponible por ${Math.abs(disponible)} unidad(es).`,
          responsable: cot.responsable,
          severidad: "ALTA",
        });
      }
    }
  }

  return alertas;
}

export async function generarAlertasFiremat(
  filtroVendedor?: FiltroVendedorFiremat,
): Promise<AlertaFiremat[]> {
  const [funnel, cotizaciones] = await Promise.all([
    generarAlertasFunnelFiremat(filtroVendedor),
    generarAlertasCotizacionesFiremat(filtroVendedor),
  ]);
  return [...funnel, ...cotizaciones];
}
