import {
  EtapaFunnelBeck,
  EstadoCierreFunnel,
  MonedaFunnel,
  FuenteLeadFunnel,
  TipoMovimientoCRM,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { registrarMovimientoCRM } from "./movimientoCrm.service";

// De momento referencial. Después esto debería venir de una API o tabla propia.
const UF_REFERENCIAL = 38000;

const ETAPA_LABELS: Record<string, string> = {
  prospecto_identificado: "Prospecto Identificado",
  visita_levantamiento: "Visita / Levantamiento",
  cotizacion_elaborada: "Cotización Elaborada",
  cotizacion_enviada: "Cotización Enviada",
  en_negociacion: "En Negociación",
  cerrada: "Cerrada",
};

function formatEtapa(etapa: string): string {
  return ETAPA_LABELS[etapa] ?? etapa;
}

function formatFecha(fecha: Date | string | null | undefined): string {
  if (!fecha) return "sin fecha";
  return new Date(fecha).toLocaleDateString("es-CL");
}

const FUENTE_LEAD_LABELS: Record<string, string> = {
  web: "Web",
  prospeccion: "Prospección",
  cliente_recurrente: "Cliente recurrente",
  referido: "Referido",
  otro: "Otro",
};

function formatFuenteLead(value: string | null | undefined): string {
  if (!value) return "Sin fuente";
  return (
    FUENTE_LEAD_LABELS[value] ??
    value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

function normalizeString(value: unknown): string {
  return String(value ?? "").trim();
}

function optStr(value: unknown): string | null {
  const s = normalizeString(value);
  return s || null;
}

function toNumber(value: number | string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error("El valor ingresado no es numérico.");
  }
  return parsed;
}

function parseOptionalDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

function validarProbabilidad(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (isNaN(n) || n < 0 || n > 100) {
    throw new Error("La probabilidad de cierre debe ser un número entre 0 y 100.");
  }
  return n;
}

function validarRutChileno(rutLimpio: string): boolean {
  if (rutLimpio.length < 2) return false;
  const dv = rutLimpio.slice(-1).toUpperCase();
  const digits = rutLimpio.slice(0, -1);
  if (!/^\d+$/.test(digits)) return false;
  if (!/^[\dK]$/.test(dv)) return false;
  const num = parseInt(digits, 10);
  if (num < 1_000_000) return false;
  let suma = 0;
  let factor = 2;
  let n = num;
  while (n > 0) {
    suma += (n % 10) * factor;
    n = Math.floor(n / 10);
    factor = factor === 7 ? 2 : factor + 1;
  }
  const dvEsp = 11 - (suma % 11);
  const dvCalc = dvEsp === 11 ? "0" : dvEsp === 10 ? "K" : String(dvEsp);
  return dv === dvCalc;
}

function procesarRut(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;
  const limpio = raw.replace(/[.\-]/g, "").toUpperCase();
  if (!validarRutChileno(limpio)) throw new Error("RUT empresa inválido");
  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

function procesarTelefono(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;
  const soloDigitos = raw.replace(/\D/g, "");
  if (soloDigitos.length < 8 || soloDigitos.length > 12) throw new Error("Teléfono inválido");
  return soloDigitos;
}

function procesarCorreo(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) throw new Error("Correo inválido");
  return raw.toLowerCase();
}

function calcularValores(
  valorOriginal: number,
  monedaOriginal: MonedaFunnel,
): { valorClp: number; valorUf: number } {
  if (monedaOriginal === "UF") {
    return {
      valorUf: valorOriginal,
      valorClp: Number((valorOriginal * UF_REFERENCIAL).toFixed(2)),
    };
  }
  return {
    valorClp: valorOriginal,
    valorUf: Number((valorOriginal / UF_REFERENCIAL).toFixed(4)),
  };
}

// Accepts both camelCase and snake_case from request body
function extractInput(raw: Record<string, unknown>) {
  return {
    nombreProyecto:      (raw.nombreProyecto      ?? raw.nombre_proyecto)      as string | undefined,
    empresa:              raw.empresa                                            as string | undefined,
    valorOriginal:       (raw.valorOriginal        ?? raw.valor_original)       as number | string | undefined,
    monedaOriginal:      (raw.monedaOriginal       ?? raw.moneda_original)      as MonedaFunnel | undefined,
    fechaProbableCierre: (raw.fechaProbableCierre  ?? raw.fecha_probable_cierre) as string | undefined,
    vendedor:             raw.vendedor                                            as string | undefined,
    region:               raw.region                                              as string | undefined,
    comuna:               raw.comuna                                              as string | undefined,
    fuenteLead:          (raw.fuenteLead           ?? raw.fuente_lead)           as FuenteLeadFunnel | undefined,
    etapa:                raw.etapa                                               as EtapaFunnelBeck | undefined,
    estadoCierre:        (raw.estadoCierre         ?? raw.estado_cierre)         as EstadoCierreFunnel | undefined,
    motivoPerdida:       (raw.motivoPerdida        ?? raw.motivo_perdida)        as string | undefined,
    // Prospecto identificado
    rutEmpresa:          (raw.rutEmpresa           ?? raw.rut_empresa)           as string | undefined,
    cargoContacto:       (raw.cargoContacto        ?? raw.cargo_contacto)        as string | undefined,
    telefonoContacto:    (raw.telefonoContacto     ?? raw.telefono_contacto)     as string | undefined,
    correoContacto:      (raw.correoContacto       ?? raw.correo_contacto)       as string | undefined,
    nombreContacto:      (raw.nombreContacto       ?? raw.nombre_contacto)       as string | undefined,
    tipoCliente:         (raw.tipoCliente          ?? raw.tipo_cliente)          as string | undefined,
    tipoOportunidad:     (raw.tipoOportunidad      ?? raw.tipo_oportunidad)      as string | undefined,
    // Primera reunión / seguimiento
    fechaPrimerContacto: (raw.fechaPrimerContacto  ?? raw.fecha_primer_contacto) as string | undefined,
    tipoContacto:        (raw.tipoContacto         ?? raw.tipo_contacto)         as string | undefined,
    necesidadDetectada:  (raw.necesidadDetectada   ?? raw.necesidad_detectada)   as string | undefined,
    timingEstimado:      (raw.timingEstimado       ?? raw.timing_estimado)       as string | undefined,
    nivelInteres:        (raw.nivelInteres         ?? raw.nivel_interes)         as string | undefined,
    // Próxima acción
    proximaAccion:       (raw.proximaAccion        ?? raw.proxima_accion)        as string | undefined,
    fechaProximaAccion:  (raw.fechaProximaAccion   ?? raw.fecha_proxima_accion)  as string | undefined,
    // Propuesta / negociación
    probabilidadCierre:  (raw.probabilidadCierre   ?? raw.probabilidad_cierre)   as number | undefined,
    objeciones:           raw.objeciones                                          as string | undefined,
    contrapropuestas:     raw.contrapropuestas                                    as string | undefined,
    ajustesSolicitados:  (raw.ajustesSolicitados   ?? raw.ajustes_solicitados)   as string | undefined,
    // Cierre perdido / postergado
    etapaPerdida:        (raw.etapaPerdida         ?? raw.etapa_perdida)         as string | undefined,
    motivoPostergacion:  (raw.motivoPostergacion   ?? raw.motivo_postergacion)   as string | undefined,
    fechaReactivacion:   (raw.fechaReactivacion    ?? raw.fecha_reactivacion)    as string | undefined,
    // Cierre ganado
    documentoRespaldo:   (raw.documentoRespaldo    ?? raw.documento_respaldo)    as string | undefined,
    flujoPosterior:      (raw.flujoPosterior       ?? raw.flujo_posterior)       as string | undefined,
  };
}

type NormalizedInput = ReturnType<typeof extractInput>;

function validarEtapaYCierre(params: {
  etapa?: EtapaFunnelBeck;
  estadoCierre?: EstadoCierreFunnel;
  motivoPerdida?: string;
  motivoPostergacion?: string;
  fechaReactivacion?: string;
}) {
  const { etapa, estadoCierre, motivoPerdida, motivoPostergacion, fechaReactivacion } = params;

  if (etapa === "cerrada" && !estadoCierre) {
    throw new Error("Si la etapa es cerrada, debes indicar si fue ganada, perdida o postergada.");
  }

  if (estadoCierre === "perdida" && !normalizeString(motivoPerdida)) {
    throw new Error("Debes indicar el motivo de pérdida.");
  }

  if (estadoCierre === "postergada") {
    if (!normalizeString(motivoPostergacion)) {
      throw new Error("Debes indicar el motivo de postergación.");
    }
    if (!fechaReactivacion) {
      throw new Error("Debes indicar la fecha de reactivación.");
    }
  }
}

function validarCamposObligatorios(data: NormalizedInput) {
  if (!normalizeString(data.nombreProyecto)) throw new Error("El nombre del proyecto es obligatorio.");
  if (!normalizeString(data.empresa)) throw new Error("La empresa es obligatoria.");
  if (!normalizeString(data.vendedor)) throw new Error("El vendedor es obligatorio.");
  if (!normalizeString(data.region)) throw new Error("La región es obligatoria.");
  if (!normalizeString(data.comuna)) throw new Error("La comuna es obligatoria.");
  if (!data.fechaProbableCierre) throw new Error("La fecha probable de cierre es obligatoria.");
  if (!data.monedaOriginal) throw new Error("La moneda es obligatoria.");
  if (data.valorOriginal === undefined) throw new Error("El valor original es obligatorio.");

  const valor = toNumber(data.valorOriginal);
  if (valor <= 0) throw new Error("El valor debe ser mayor a 0.");

  validarEtapaYCierre({
    etapa: data.etapa,
    estadoCierre: data.estadoCierre,
    motivoPerdida: data.motivoPerdida,
    motivoPostergacion: data.motivoPostergacion,
    fechaReactivacion: data.fechaReactivacion,
  });
}

export async function createFunnelBeck(rawData: Record<string, unknown>, userId: string) {
  const data = extractInput(rawData);
  validarCamposObligatorios(data);

  const valorOriginal = toNumber(data.valorOriginal!);
  const monedaOriginal = data.monedaOriginal!;
  const { valorClp, valorUf } = calcularValores(valorOriginal, monedaOriginal);

  const oportunidad = await prisma.operadorBeck.create({
    data: {
      nombreProyecto:      normalizeString(data.nombreProyecto),
      empresa:             normalizeString(data.empresa),
      valorOriginal,
      monedaOriginal,
      valorClp,
      valorUf,
      fechaProbableCierre: new Date(data.fechaProbableCierre!),
      vendedor:            normalizeString(data.vendedor),
      region:              normalizeString(data.region),
      comuna:              normalizeString(data.comuna),
      fuenteLead:          data.fuenteLead ?? undefined,
      etapa:               data.etapa ?? "prospecto_identificado",
      estadoCierre:        data.estadoCierre ?? null,
      motivoPerdida:       optStr(data.motivoPerdida),
      // Prospecto identificado
      rutEmpresa:          procesarRut(data.rutEmpresa),
      cargoContacto:       optStr(data.cargoContacto),
      telefonoContacto:    procesarTelefono(data.telefonoContacto),
      correoContacto:      procesarCorreo(data.correoContacto),
      nombreContacto:      optStr(data.nombreContacto),
      tipoCliente:         optStr(data.tipoCliente),
      tipoOportunidad:     optStr(data.tipoOportunidad),
      // Primera reunión / seguimiento
      fechaPrimerContacto: parseOptionalDate(data.fechaPrimerContacto),
      tipoContacto:        optStr(data.tipoContacto),
      necesidadDetectada:  optStr(data.necesidadDetectada),
      timingEstimado:      optStr(data.timingEstimado),
      nivelInteres:        optStr(data.nivelInteres),
      // Próxima acción
      proximaAccion:       optStr(data.proximaAccion),
      fechaProximaAccion:  parseOptionalDate(data.fechaProximaAccion),
      // Propuesta / negociación
      probabilidadCierre:  validarProbabilidad(data.probabilidadCierre),
      objeciones:          optStr(data.objeciones),
      contrapropuestas:    optStr(data.contrapropuestas),
      ajustesSolicitados:  optStr(data.ajustesSolicitados),
      // Cierre perdido / postergado
      etapaPerdida:        optStr(data.etapaPerdida),
      motivoPostergacion:  optStr(data.motivoPostergacion),
      fechaReactivacion:   parseOptionalDate(data.fechaReactivacion),
      // Cierre ganado
      documentoRespaldo:   optStr(data.documentoRespaldo),
      flujoPosterior:      optStr(data.flujoPosterior),
    },
  });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: "FUNNEL",
    tipo: TipoMovimientoCRM.OPORTUNIDAD_CREADA,
    entidadId: oportunidad.id,
    descripcion: `Se creó oportunidad ${oportunidad.nombreProyecto} para la empresa ${oportunidad.empresa}`,
    datos: {
      nombreProyecto: oportunidad.nombreProyecto,
      empresa: oportunidad.empresa,
      etapa: oportunidad.etapa,
    },
  });

  return oportunidad;
}

export async function getAllFunnelBeck() {
  return prisma.operadorBeck.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getFunnelBeckById(id: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
  });

  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  return oportunidad;
}

export async function updateFunnelBeck(id: string, rawData: Record<string, unknown>, userId: string) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  const data = extractInput(rawData);

  const nombreProyecto = data.nombreProyecto !== undefined
    ? normalizeString(data.nombreProyecto) : existente.nombreProyecto;
  const empresa = data.empresa !== undefined
    ? normalizeString(data.empresa) : existente.empresa;
  const vendedor = data.vendedor !== undefined
    ? normalizeString(data.vendedor) : existente.vendedor;
  const region = data.region !== undefined
    ? normalizeString(data.region) : existente.region;
  const comuna = data.comuna !== undefined
    ? normalizeString(data.comuna) : existente.comuna;
  const monedaOriginal = data.monedaOriginal ?? existente.monedaOriginal;
  const valorOriginal = data.valorOriginal !== undefined
    ? toNumber(data.valorOriginal) : Number(existente.valorOriginal);
  const { valorClp, valorUf } = calcularValores(valorOriginal, monedaOriginal);
  const etapa = data.etapa ?? existente.etapa;
  const estadoCierre = data.estadoCierre !== undefined ? data.estadoCierre : existente.estadoCierre;
  const motivoPerdida = data.motivoPerdida !== undefined
    ? optStr(data.motivoPerdida) : existente.motivoPerdida;

  if (!nombreProyecto) throw new Error("El nombre del proyecto es obligatorio.");
  if (!empresa) throw new Error("La empresa es obligatoria.");
  if (!vendedor) throw new Error("El vendedor es obligatorio.");
  if (!region) throw new Error("La región es obligatoria.");
  if (!comuna) throw new Error("La comuna es obligatoria.");
  if (valorOriginal <= 0) throw new Error("El valor debe ser mayor a 0.");

  const motivoPostergacion = data.motivoPostergacion !== undefined
    ? optStr(data.motivoPostergacion) : existente.motivoPostergacion;
  const fechaReactivacion = data.fechaReactivacion !== undefined
    ? parseOptionalDate(data.fechaReactivacion) : existente.fechaReactivacion;

  validarEtapaYCierre({
    etapa,
    estadoCierre: estadoCierre ?? undefined,
    motivoPerdida: motivoPerdida ?? undefined,
    motivoPostergacion: motivoPostergacion ?? undefined,
    fechaReactivacion: fechaReactivacion ? fechaReactivacion.toISOString() : undefined,
  });

  const oportunidad = await prisma.operadorBeck.update({
    where: { id },
    data: {
      nombreProyecto,
      empresa,
      valorOriginal,
      monedaOriginal,
      valorClp,
      valorUf,
      fechaProbableCierre: data.fechaProbableCierre
        ? new Date(data.fechaProbableCierre) : existente.fechaProbableCierre,
      vendedor,
      region,
      comuna,
      fuenteLead: data.fuenteLead !== undefined ? data.fuenteLead : existente.fuenteLead,
      etapa,
      estadoCierre: estadoCierre ?? null,
      motivoPerdida,
      // Prospecto identificado
      ...(data.rutEmpresa         !== undefined && { rutEmpresa:         procesarRut(data.rutEmpresa) }),
      ...(data.cargoContacto      !== undefined && { cargoContacto:      optStr(data.cargoContacto) }),
      ...(data.telefonoContacto   !== undefined && { telefonoContacto:   procesarTelefono(data.telefonoContacto) }),
      ...(data.correoContacto     !== undefined && { correoContacto:     procesarCorreo(data.correoContacto) }),
      ...(data.nombreContacto     !== undefined && { nombreContacto:     optStr(data.nombreContacto) }),
      ...(data.tipoCliente        !== undefined && { tipoCliente:        optStr(data.tipoCliente) }),
      ...(data.tipoOportunidad    !== undefined && { tipoOportunidad:    optStr(data.tipoOportunidad) }),
      // Primera reunión / seguimiento
      ...(data.fechaPrimerContacto !== undefined && { fechaPrimerContacto: parseOptionalDate(data.fechaPrimerContacto) }),
      ...(data.tipoContacto       !== undefined && { tipoContacto:       optStr(data.tipoContacto) }),
      ...(data.necesidadDetectada !== undefined && { necesidadDetectada: optStr(data.necesidadDetectada) }),
      ...(data.timingEstimado     !== undefined && { timingEstimado:     optStr(data.timingEstimado) }),
      ...(data.nivelInteres       !== undefined && { nivelInteres:       optStr(data.nivelInteres) }),
      // Próxima acción
      ...(data.proximaAccion      !== undefined && { proximaAccion:      optStr(data.proximaAccion) }),
      ...(data.fechaProximaAccion !== undefined && { fechaProximaAccion: parseOptionalDate(data.fechaProximaAccion) }),
      // Propuesta / negociación
      ...(data.probabilidadCierre !== undefined && { probabilidadCierre: validarProbabilidad(data.probabilidadCierre) }),
      ...(data.objeciones         !== undefined && { objeciones:         optStr(data.objeciones) }),
      ...(data.contrapropuestas   !== undefined && { contrapropuestas:   optStr(data.contrapropuestas) }),
      ...(data.ajustesSolicitados !== undefined && { ajustesSolicitados: optStr(data.ajustesSolicitados) }),
      // Cierre perdido / postergado
      ...(data.etapaPerdida       !== undefined && { etapaPerdida:       optStr(data.etapaPerdida) }),
      motivoPostergacion,
      fechaReactivacion,
      // Cierre ganado
      ...(data.documentoRespaldo  !== undefined && { documentoRespaldo:  optStr(data.documentoRespaldo) }),
      ...(data.flujoPosterior     !== undefined && { flujoPosterior:     optStr(data.flujoPosterior) }),
    },
  });

  const cambios: string[] = [];
  if (existente.nombreProyecto !== nombreProyecto)
    cambios.push(`nombre de "${existente.nombreProyecto}" a "${nombreProyecto}"`);
  if (existente.empresa !== empresa)
    cambios.push(`empresa de "${existente.empresa}" a "${empresa}"`);
  if (Number(existente.valorOriginal) !== valorOriginal)
    cambios.push(`valor de $${existente.valorOriginal} a $${valorOriginal}`);
  if (existente.etapa !== etapa)
    cambios.push(`etapa de ${formatEtapa(existente.etapa)} a ${formatEtapa(etapa)}`);
  if (data.fechaProbableCierre !== undefined &&
      formatFecha(existente.fechaProbableCierre) !== formatFecha(data.fechaProbableCierre))
    cambios.push(`fecha de cierre de ${formatFecha(existente.fechaProbableCierre)} a ${formatFecha(data.fechaProbableCierre)}`);
  if (existente.region !== region)
    cambios.push(`región de "${existente.region}" a "${region}"`);
  if (existente.comuna !== comuna)
    cambios.push(`comuna de "${existente.comuna}" a "${comuna}"`);
  if (data.fuenteLead !== undefined && existente.fuenteLead !== data.fuenteLead)
    cambios.push(`fuente de lead de "${formatFuenteLead(existente.fuenteLead)}" a "${formatFuenteLead(data.fuenteLead)}"`);

  const descripcionEdicion =
    cambios.length > 0
      ? `Se editó oportunidad ${existente.nombreProyecto}: ${cambios.join(", ")}`
      : `Se editó oportunidad ${existente.nombreProyecto}`;

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: "FUNNEL",
    tipo: "OPORTUNIDAD_EDITADA",
    entidadId: oportunidad.id,
    descripcion: descripcionEdicion,
  });

  if (data.etapa !== undefined && data.etapa !== existente.etapa) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: "FUNNEL",
      tipo: "ETAPA_MODIFICADA",
      entidadId: oportunidad.id,
      descripcion: `Se movió ${oportunidad.nombreProyecto} de ${formatEtapa(existente.etapa)} a ${formatEtapa(etapa)}`,
      datos: { de: existente.etapa, a: etapa },
    });
  }

  return oportunidad;
}

export async function updateEtapaFunnelBeck(
  id: string,
  rawPayload: Record<string, unknown>,
  userId: string,
) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  const payload = extractInput(rawPayload);

  if (!payload.etapa) throw new Error("La etapa es obligatoria.");

  validarEtapaYCierre({
    etapa: payload.etapa,
    estadoCierre: payload.estadoCierre,
    motivoPerdida: payload.motivoPerdida,
    motivoPostergacion: payload.motivoPostergacion,
    fechaReactivacion: payload.fechaReactivacion,
  });

  const oportunidad = await prisma.operadorBeck.update({
    where: { id },
    data: {
      etapa: payload.etapa,
      estadoCierre: payload.estadoCierre ?? null,
      motivoPerdida: optStr(payload.motivoPerdida),
      // Campos de cierre postergado
      ...(payload.motivoPostergacion !== undefined && { motivoPostergacion: optStr(payload.motivoPostergacion) }),
      ...(payload.fechaReactivacion  !== undefined && { fechaReactivacion:  parseOptionalDate(payload.fechaReactivacion) }),
      // Campos de cierre perdido
      ...(payload.etapaPerdida       !== undefined && { etapaPerdida:       optStr(payload.etapaPerdida) }),
      // Campos de cierre ganado
      ...(payload.documentoRespaldo  !== undefined && { documentoRespaldo:  optStr(payload.documentoRespaldo) }),
      ...(payload.flujoPosterior     !== undefined && { flujoPosterior:     optStr(payload.flujoPosterior) }),
    },
  });

  if (payload.etapa !== existente.etapa) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: "FUNNEL",
      tipo: "ETAPA_MODIFICADA",
      entidadId: oportunidad.id,
      descripcion: `Se movió ${oportunidad.nombreProyecto} de ${formatEtapa(existente.etapa)} a ${formatEtapa(payload.etapa)}`,
      datos: { de: existente.etapa, a: payload.etapa },
    });
  }

  return oportunidad;
}

export async function deleteFunnelBeck(id: string, userId: string) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  await prisma.operadorBeck.delete({ where: { id } });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: "FUNNEL",
    tipo: "OPORTUNIDAD_ELIMINADA",
    entidadId: id,
    descripcion: `Se eliminó oportunidad ${existente.nombreProyecto} para la empresa ${existente.empresa}`,
    datos: {
      nombreProyecto: existente.nombreProyecto,
      empresa: existente.empresa,
      etapa: existente.etapa,
    },
  });

  return { message: "Oportunidad eliminada correctamente." };
}
