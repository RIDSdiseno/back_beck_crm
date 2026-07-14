import {
  EtapaFunnelBeck,
  EstadoCierreFunnel,
  MonedaFunnel,
  FuenteLeadFunnel,
  TipoMovimientoCRM,
  Prisma,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { registrarMovimientoCRM } from "./movimientoCrm.service";
import {
  obtenerMapaReglasValidacion,
  clasificarResultadoValidacion,
} from "./configuracionValidacion.service";
import { validarMotivoCierre, MotivoInvalidoError } from "../constants/motivosCierre";
import { RolUsuario } from "../types";
import { puedeCambiarEmpresa } from "../helpers/puedeCambiarEmpresa";
import { getVendedoresFunnelBeckElegibles } from "../helpers/vendedoresFunnelBeck";

// De momento referencial. Después esto debería venir de una API o tabla propia.
const UF_REFERENCIAL = 38000;

const ETAPA_LABELS: Record<string, string> = {
  prospecto_identificado: "Prospecto Identificado",
  visita_levantamiento: "Visita / Levantamiento",
  cotizacion_elaborada: "Cotización Elaborada",
  cotizacion_enviada: "Cotización Enviada",
  en_negociacion: "En Negociación",
  documentacion_venta: "Documentación de Venta",
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

// Returns undefined (not sent), null (explicitly cleared), or the string value
function optNullableId(a: unknown, b: unknown): string | null | undefined {
  const val = a !== undefined ? a : b;
  if (val === undefined) return undefined;
  if (val === null || val === "") return null;
  return String(val);
}

function toNumber(value: number | string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error("El valor ingresado no es numérico.");
  }
  return parsed;
}
function toOptionalNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
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

function procesarRut(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;

  if (!/^[\dKk.\-]+$/.test(raw)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }
  if (/--/.test(raw)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }
  if (raw.includes(".") && !raw.includes("-")) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

  const limpio = raw.replace(/[.\-]/g, "").toUpperCase();

  if (limpio.length < 8) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);

  if (!/^\d+$/.test(digits) || !/^[\dK]$/.test(dv)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

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
    // Visita / levantamiento tecnico
    fechaVisita:         (raw.fechaVisita           ?? raw.fecha_visita)           as string | undefined,
    responsableTecnico:  (raw.responsableTecnico    ?? raw.responsable_tecnico)    as string | undefined,
    asistentes:           raw.asistentes                                           as string | undefined,
    lugarVisita:         (raw.lugarVisita           ?? raw.lugar_visita)           as string | undefined,
    antecedentesLevantados: (raw.antecedentesLevantados ?? raw.antecedentes_levantados) as string | undefined,
    documentosRecibidos: (raw.documentosRecibidos   ?? raw.documentos_recibidos)   as string | undefined,
    planos:               raw.planos                                               as string | undefined,
    basesTecnicas:       (raw.basesTecnicas         ?? raw.bases_tecnicas)         as string | undefined,
    especificaciones:     raw.especificaciones                                     as string | undefined,
    fotografias:          raw.fotografias                                          as string | undefined,
    observacionesTecnicas: (raw.observacionesTecnicas ?? raw.observaciones_tecnicas) as string | undefined,
    necesidadOficinaTecnica: (raw.necesidadOficinaTecnica ?? raw.necesidad_oficina_tecnica) as boolean | undefined,
    proximosPasos:       (raw.proximosPasos         ?? raw.proximos_pasos)         as string | undefined,
    // Desarrollo de propuesta
    estadoDesarrolloPropuesta: (raw.estadoDesarrolloPropuesta ?? raw.estado_desarrollo_propuesta) as string | undefined,
    informacionPendiente: (raw.informacionPendiente ?? raw.informacion_pendiente)  as string | undefined,
    documentosRequeridos: (raw.documentosRequeridos ?? raw.documentos_requeridos)  as string | undefined,
    riesgoTecnico:       (raw.riesgoTecnico         ?? raw.riesgo_tecnico)         as string | undefined,
    condicionesEspeciales: (raw.condicionesEspeciales ?? raw.condiciones_especiales) as string | undefined,
    necesidadValidacionGerencial: (raw.necesidadValidacionGerencial ?? raw.necesidad_validacion_gerencial) as boolean | undefined,
    fechaComprometidaEnvio: (raw.fechaComprometidaEnvio ?? raw.fecha_comprometida_envio) as string | undefined,
    comentariosInternos: (raw.comentariosInternos   ?? raw.comentarios_internos)   as string | undefined,
    // Propuesta enviada / negociacion
    fechaEnvioPropuesta: (raw.fechaEnvioPropuesta   ?? raw.fecha_envio_propuesta)  as string | undefined,
    versionPropuesta:    (raw.versionPropuesta      ?? raw.version_propuesta)      as string | undefined,
    numeroPropuesta:     (raw.numeroPropuesta       ?? raw.numero_propuesta)       as string | undefined,
    montoPropuesto:      (raw.montoPropuesto        ?? raw.monto_propuesto)        as number | string | undefined,
    fechaVencimientoPropuesta: (raw.fechaVencimientoPropuesta ?? raw.fecha_vencimiento_propuesta) as string | undefined,
    comentariosCliente:  (raw.comentariosCliente    ?? raw.comentarios_cliente)    as string | undefined,
    // Documentacion de venta
    ordenCompra:         (raw.ordenCompra           ?? raw.orden_compra)           as string | undefined,
    contrato:             raw.contrato                                             as string | undefined,
    correoAceptacion:    (raw.correoAceptacion      ?? raw.correo_aceptacion)      as string | undefined,
    anticipo:             raw.anticipo                                             as string | undefined,
    aprobacionInternaCliente: (raw.aprobacionInternaCliente ?? raw.aprobacion_interna_cliente) as string | undefined,
    condicionesPago:     (raw.condicionesPago       ?? raw.condiciones_pago)       as string | undefined,
    documentosAdministrativosPendientes: (raw.documentosAdministrativosPendientes ?? raw.documentos_administrativos_pendientes) as string | undefined,
    responsableAdministrativo: (raw.responsableAdministrativo ?? raw.responsable_administrativo) as string | undefined,
    fechaFirma:          (raw.fechaFirma            ?? raw.fecha_firma)            as string | undefined,
    fechaInicioProyecto: (raw.fechaInicioProyecto   ?? raw.fecha_inicio_proyecto)  as string | undefined,
    traspasadoOperaciones: (raw.traspasadoOperaciones ?? raw.traspasado_operaciones) as boolean | undefined,
    fechaTraspasoOperaciones: (raw.fechaTraspasoOperaciones ?? raw.fecha_traspaso_operaciones) as string | undefined,
    responsableTraspasoOperaciones: (raw.responsableTraspasoOperaciones ?? raw.responsable_traspaso_operaciones) as string | undefined,
    observacionesTraspasoOperaciones: (raw.observacionesTraspasoOperaciones ?? raw.observaciones_traspaso_operaciones) as string | undefined,
    traspasadoAdministracion: (raw.traspasadoAdministracion ?? raw.traspasado_administracion) as boolean | undefined,
    fechaTraspasoAdministracion: (raw.fechaTraspasoAdministracion ?? raw.fecha_traspaso_administracion) as string | undefined,
    responsableTraspasoAdministracion: (raw.responsableTraspasoAdministracion ?? raw.responsable_traspaso_administracion) as string | undefined,
    observacionesTraspasoAdministracion: (raw.observacionesTraspasoAdministracion ?? raw.observaciones_traspaso_administracion) as string | undefined,
    // Cierre perdido / postergado
    etapaPerdida:        (raw.etapaPerdida         ?? raw.etapa_perdida)         as string | undefined,
    motivoPostergacion:  (raw.motivoPostergacion   ?? raw.motivo_postergacion)   as string | undefined,
    fechaReactivacion:   (raw.fechaReactivacion    ?? raw.fecha_reactivacion)    as string | undefined,
    // Cierre ganado
    montoFinalGanado:    (raw.montoFinalGanado      ?? raw.monto_final_ganado)      as number | string | undefined,
    fechaCierre:         (raw.fechaCierre           ?? raw.fecha_cierre)           as string | undefined,
    documentoRespaldo:   (raw.documentoRespaldo    ?? raw.documento_respaldo)    as string | undefined,
    flujoPosterior:      (raw.flujoPosterior       ?? raw.flujo_posterior)       as string | undefined,
    // Clientes Beck
    clienteBeckId:       optNullableId(raw.clienteBeckId,  raw.cliente_beck_id),
    contactoBeckId:      optNullableId(raw.contactoBeckId, raw.contacto_beck_id),
    // Campos adicionales
    direccionProyecto:   (raw.direccionProyecto ?? raw.direccion_proyecto) as string | undefined,
    unidadNegocio:       (raw.unidadNegocio     ?? raw.unidad_negocio)     as string | undefined,
    observaciones:        raw.observaciones                                  as string | undefined,
    urgencia:             raw.urgencia                                       as string | undefined,
    observacionCamposFaltantes: (raw.observacionCamposFaltantes ?? raw.observacion_campos_faltantes) as string | undefined,
    // Campos punto 12 - Beck específicos
    tipoProyecto:             (raw.tipoProyecto             ?? raw.tipo_proyecto)              as string | undefined,
    empresaMandante:          (raw.empresaMandante          ?? raw.empresa_mandante)           as string | undefined,
    necesidadLevantamiento:   (raw.necesidadLevantamiento  ?? raw.necesidad_levantamiento)    as boolean | undefined,
    oficinaTecnicaAsignada:   (raw.oficinaTecnicaAsignada  ?? raw.oficina_tecnica_asignada)   as string | undefined,
    duracionEstimada:         (raw.duracionEstimada         ?? raw.duracion_estimada)          as string | undefined,
    estadoRevisionTecnica:    (raw.estadoRevisionTecnica    ?? raw.estado_revision_tecnica)    as string | undefined,
    garantiasRequeridas:      (raw.garantiasRequeridas      ?? raw.garantias_requeridas)       as string | undefined,
    estadoDocumentacionVenta: (raw.estadoDocumentacionVenta ?? raw.estado_documentacion_venta) as string | undefined,
    esReactivacion: (raw.esReactivacion ?? raw.es_reactivacion) as boolean | undefined,
  };
}

type NormalizedInput = ReturnType<typeof extractInput>;

function validarEtapaYCierre(params: {
  etapa?: EtapaFunnelBeck;
  estadoCierre?: EstadoCierreFunnel;
  motivoPerdida?: string;
  motivoPostergacion?: string;
  fechaReactivacion?: string;
  montoFinalGanado?: unknown;
  fechaCierre?: string;
  documentoRespaldo?: string;
  flujoPosterior?: string;
}) {
  const {
    etapa,
    estadoCierre,
    motivoPerdida,
    motivoPostergacion,
    fechaReactivacion,
    montoFinalGanado,
    fechaCierre,
    documentoRespaldo,
    flujoPosterior,
  } = params;

  if (etapa === "cerrada" && !estadoCierre) {
    throw new Error("Si la etapa es cerrada, debes indicar si fue ganada, perdida o postergada.");
  }

  if (estadoCierre === "ganada") {
    if (toOptionalNumber(montoFinalGanado) === null) {
      throw new Error("Debes indicar el monto final ganado.");
    }
    if (!fechaCierre) {
      throw new Error("Debes indicar la fecha de cierre.");
    }
    if (!normalizeString(documentoRespaldo)) {
      throw new Error("Debes indicar el documento de respaldo.");
    }
    if (!normalizeString(flujoPosterior)) {
      throw new Error("Debes indicar el flujo posterior.");
    }
  }

  if (estadoCierre === "perdida" && !normalizeString(motivoPerdida)) {
    throw new Error("Debes indicar el motivo de pérdida.");
  }
  if (estadoCierre === "perdida" && motivoPerdida && !validarMotivoCierre("PERDIDA", motivoPerdida)) {
    throw new MotivoInvalidoError([
      "El motivo de pérdida debe ser uno de los motivos predefinidos o usar formato Otro: detalle.",
    ]);
  }

  if (estadoCierre === "postergada") {
    if (!normalizeString(motivoPostergacion)) {
      throw new Error("Debes indicar el motivo de postergación.");
    }
    if (!fechaReactivacion) {
      throw new Error("Debes indicar la fecha de reactivación.");
    }
  }
  if (estadoCierre === "postergada" && motivoPostergacion && !validarMotivoCierre("POSTERGACION", motivoPostergacion)) {
    throw new MotivoInvalidoError([
      "El motivo de postergación debe ser uno de los motivos predefinidos o usar formato Otro: detalle.",
    ]);
  }
}

/**
 * "Perdida" y "Postergada" son estadoCierre, no etapas del kanban: la tarjeta debe
 * permanecer en la etapa donde estaba. Esta función intercepta payloads (propios de
 * flujos antiguos del frontend) que intentan mover la etapa a "cerrada" o a un literal
 * inválido ("perdida"/"postergada") junto con un cierre no ganado, y fuerza a mantener
 * la etapa previa de la oportunidad.
 */
function resolverEtapaAlCerrar(params: {
  etapaSolicitada: string | undefined;
  estadoCierreSolicitado: EstadoCierreFunnel | undefined;
  etapaActual: EtapaFunnelBeck;
}): { etapa: EtapaFunnelBeck; estadoCierre: EstadoCierreFunnel | undefined } {
  const { etapaActual } = params;
  let etapaSolicitada = params.etapaSolicitada;
  let estadoCierreSolicitado = params.estadoCierreSolicitado;
  let etapaInvalida = false;

  // Compatibilidad: frontend/legacy enviando literalmente etapa "perdida"/"postergada"
  // (valor inválido para el enum EtapaFunnelBeck) en vez de estadoCierre.
  if (etapaSolicitada === "perdida" || etapaSolicitada === "postergada") {
    if (!estadoCierreSolicitado) {
      estadoCierreSolicitado = etapaSolicitada as EstadoCierreFunnel;
    }
    etapaInvalida = true;
  }

  const cierreNoGanado = estadoCierreSolicitado === "perdida" || estadoCierreSolicitado === "postergada";

  // Si se pide cerrar como perdida/postergada, la etapa NO debe moverse a "cerrada":
  // se mantiene la etapa donde estaba la oportunidad.
  const debeMantenerEtapaActual =
    etapaInvalida || (cierreNoGanado && (etapaSolicitada === undefined || etapaSolicitada === "cerrada"));

  if (debeMantenerEtapaActual) {
    return { etapa: etapaActual, estadoCierre: estadoCierreSolicitado };
  }

  return { etapa: (etapaSolicitada ?? etapaActual) as EtapaFunnelBeck, estadoCierre: estadoCierreSolicitado };
}

function validarOportunidadActiva(params: {
  etapa: EtapaFunnelBeck;
  estadoCierre?: EstadoCierreFunnel | null;
  proximaAccion?: string | null;
  fechaProximaAccion?: Date | string | null;
}) {
  const { etapa, estadoCierre, proximaAccion, fechaProximaAccion } = params;
  const estaActiva =
    etapa !== "cerrada" &&
    estadoCierre !== "ganada" &&
    estadoCierre !== "perdida" &&
    estadoCierre !== "postergada";

  if (estaActiva && (!normalizeString(proximaAccion) || !fechaProximaAccion)) {
    throw new Error(
      "La próxima actividad y la fecha de próxima acción son obligatorias para oportunidades activas.",
    );
  }
}

export class AdvertenciaCamposCriticosError extends Error {
  readonly bloqueos: string[];
  readonly advertencias: string[];
  /** @deprecated use bloqueos */
  readonly faltantes: string[];
  constructor(bloqueos: string[], advertencias: string[] = []) {
    super('Faltan campos críticos para avanzar de etapa.');
    this.name = 'AdvertenciaCamposCriticosError';
    this.bloqueos = bloqueos;
    this.advertencias = advertencias;
    this.faltantes = bloqueos;
  }
}

const ORDEN_ETAPAS_BECK = [
  "prospecto_identificado",
  "visita_levantamiento",
  "cotizacion_elaborada",
  "cotizacion_enviada",
  "en_negociacion",
  "documentacion_venta",
  "cerrada",
] as const;

// Reglas cuyo campo es una condicion de cierre: solo se evaluan si el estadoCierre
// destino coincide; de lo contrario se omiten (no aplica ni como bloqueo ni advertencia).
const REGLAS_CONDICION_ESTADO_CIERRE: Record<string, string> = {
  GANADA_DOCUMENTO_RESPALDO: 'ganada',
  GANADA_FLUJO_POSTERIOR_REQUERIDO: 'ganada',
  GANADA_MONTO_FINAL_REQUERIDO: 'ganada',
  GANADA_FECHA_CIERRE_REQUERIDA: 'ganada',
  PERDIDA_MOTIVO_REQUERIDO: 'perdida',
  PERDIDA_ETAPA_REQUERIDA: 'perdida',
  POSTERGADA_MOTIVO_REQUERIDO: 'postergada',
  POSTERGADA_FECHA_REACTIVACION_REQUERIDA: 'postergada',
  DESCARTADA_MOTIVO_REQUERIDO: 'descartada',
};

function esValorVacioBeck(valor: unknown): boolean {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === 'string') return normalizeString(valor) === '';
  if (valor instanceof Date) return Number.isNaN(valor.getTime());
  if (typeof valor === 'number') return Number.isNaN(valor);
  return false;
}

// Resuelve el valor real en `datos` para el `campo` configurado en configuracion_validacion.
// Soporta campos compuestos (ej. "telefonoContacto_correoContacto") donde basta con que
// uno de los sub-campos tenga valor para considerar la regla satisfecha.
function resolverValorCampoBeck(
  datos: Record<string, unknown>,
  campo: string,
): { valor: unknown; vacio: boolean } {
  if (!(campo in datos) && campo.includes('_')) {
    const subCampos = campo.split('_');
    const valores = subCampos.map((c) => datos[c]);
    const vacio = valores.every((v) => esValorVacioBeck(v));
    return { valor: Object.fromEntries(subCampos.map((c, i) => [c, valores[i]])), vacio };
  }
  return { valor: datos[campo], vacio: esValorVacioBeck(datos[campo]) };
}

// Construye el objeto de datos "efectivos" (el estado que tendria la oportunidad luego
// de aplicar el cambio) mezclando el registro existente con el payload y overrides ya
// normalizados/derivados por el caller. Se usa para evaluar TODAS las reglas activas de
// configuracion_validacion para la etapa destino, no solo un subconjunto hardcodeado.
function construirDatosParaValidacionBeck(
  existente: Record<string, unknown>,
  payload: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const datos: Record<string, unknown> = { ...existente };
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) datos[key] = value;
  }
  Object.assign(datos, overrides);
  return datos;
}

async function validarCamposCriticosBeck(
  etapa: string,
  datos: Record<string, unknown>,
): Promise<{ bloqueos: string[]; advertencias: string[] }> {
  const reglas = await obtenerMapaReglasValidacion('BECK', etapa);
  const estadoCierre = datos.estadoCierre as string | null | undefined;

  // TEMP DEBUG — remover una vez confirmado en producción.
  console.log('[DEBUG validarCamposCriticosBeck]', {
    etapaDestino: etapa,
    estadoCierre,
    reglasEncontradas: reglas.size,
    reglaKeys: Array.from(reglas.keys()),
  });

  const resultado = { bloqueos: [] as string[], advertencias: [] as string[] };

  for (const regla of reglas.values()) {
    if (!regla.activo) continue;

    const estadoRequerido = REGLAS_CONDICION_ESTADO_CIERRE[regla.regla];
    if (estadoRequerido && estadoCierre !== estadoRequerido) {
      console.log('[DEBUG regla omitida]', {
        reglaKey: regla.regla,
        motivo: `requiere estadoCierre=${estadoRequerido}`,
        estadoCierreActual: estadoCierre ?? null,
      });
      continue;
    }

    const { valor, vacio } = resolverValorCampoBeck(datos, regla.campo);

    // TEMP DEBUG — remover una vez confirmado en producción.
    console.log('[DEBUG regla evaluada]', {
      reglaKey: regla.regla,
      campo: regla.campo,
      valor,
      consideradoVacio: vacio,
      nivel: regla.nivel,
    });

    clasificarResultadoValidacion(regla.regla, vacio, reglas, resultado);
  }

  // TEMP DEBUG — remover junto con los logs de arriba.
  console.log('[DEBUG validarCamposCriticosBeck] resultado', resultado);

  return resultado;
}

// Cuando se avanza saltando etapas (ej. prospecto_identificado -> documentacion_venta),
// hay que exigir tambien las reglas de cada etapa intermedia que se esta saltando, no solo
// las de la etapa destino. Retorna el listado de etapas a validar, en orden:
// - Si la etapa no cambia (solo cambia estadoCierre) o los indices no se pueden resolver,
//   se valida unicamente la etapa destino (comportamiento previo, sin rango).
// - Si es un avance, el rango va desde la etapa siguiente a la de origen hasta la destino
//   (ambas incluidas).
// El caller es responsable de no invocar esto en un retroceso (idxDestino < idxActual).
function calcularRangoEtapasBeck(
  idxActual: number,
  idxDestino: number,
  etapaDestino: string,
): string[] {
  if (idxActual === -1 || idxDestino === -1 || idxDestino <= idxActual) {
    return [etapaDestino];
  }
  return ORDEN_ETAPAS_BECK.slice(idxActual + 1, idxDestino + 1);
}

// Valida cada etapa del rango por separado (misma "foto" de datos, distintas reglas por
// etapa) y acumula bloqueos/advertencias. Cuando el rango abarca mas de una etapa, cada
// mensaje se prefija con la etapa de origen de esa regla para que el usuario entienda de
// donde viene cada bloqueo/advertencia; si es una sola etapa (caso normal, avance de a un
// paso) se deja el mensaje tal cual, sin prefijo, igual que antes.
async function validarRangoEtapasBeck(
  etapas: string[],
  datos: Record<string, unknown>,
): Promise<{ bloqueos: string[]; advertencias: string[] }> {
  const bloqueos: string[] = [];
  const advertencias: string[] = [];

  console.log('[DEBUG validarRangoEtapasBeck]', { etapas });

  for (const etapa of etapas) {
    const resultado = await validarCamposCriticosBeck(etapa, datos);
    const prefijo = etapas.length > 1 ? `[${formatEtapa(etapa)}] ` : '';
    bloqueos.push(...resultado.bloqueos.map((b) => `${prefijo}${b}`));
    advertencias.push(...resultado.advertencias.map((a) => `${prefijo}${a}`));
  }

  return { bloqueos, advertencias };
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
    montoFinalGanado: data.montoFinalGanado,
    fechaCierre: data.fechaCierre,
    documentoRespaldo: data.documentoRespaldo,
    flujoPosterior: data.flujoPosterior,
  });

  validarOportunidadActiva({
    etapa: data.etapa ?? "prospecto_identificado",
    estadoCierre: data.estadoCierre,
    proximaAccion: data.proximaAccion,
    fechaProximaAccion: data.fechaProximaAccion,
  });
}

async function registrarCambioEtapaBeck({
  tx,
  oportunidadId,
  etapaAnterior,
  etapaNueva,
  usuarioId,
}: {
  tx: Prisma.TransactionClient;
  oportunidadId: string;
  etapaAnterior: string | null;
  etapaNueva: string;
  usuarioId?: string | null;
}): Promise<void> {
  await tx.historialEtapaBeck.create({
    data: {
      oportunidadId,
      etapaAnterior,
      etapaNueva,
      usuarioId: usuarioId ?? null,
    },
  });
}

export async function createFunnelBeck(rawData: Record<string, unknown>, userId: string) {
  const data = extractInput(rawData);
  validarCamposObligatorios(data);

  const valorOriginal = toNumber(data.valorOriginal!);
  const monedaOriginal = data.monedaOriginal!;
  const { valorClp, valorUf } = calcularValores(valorOriginal, monedaOriginal);

  if (data.clienteBeckId) {
    const cliente = await prisma.clienteBeck.findUnique({
      where: { id: data.clienteBeckId },
      select: { id: true },
    });
    if (!cliente) throw new Error("El cliente indicado no existe.");
  }

  if (data.contactoBeckId) {
    const contacto = await prisma.contactoClienteBeck.findUnique({
      where: { id: data.contactoBeckId },
      select: { id: true, clienteId: true },
    });
    if (!contacto) throw new Error("El contacto indicado no existe.");
    if (data.clienteBeckId && contacto.clienteId !== data.clienteBeckId) {
      throw new Error("El contacto no pertenece al cliente indicado.");
    }
  }

  const oportunidad = await prisma.$transaction(async (tx) => {
  const created = await tx.operadorBeck.create({
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
      // Visita / levantamiento tecnico
      fechaVisita:         parseOptionalDate(data.fechaVisita),
      responsableTecnico:  optStr(data.responsableTecnico),
      asistentes:          optStr(data.asistentes),
      lugarVisita:         optStr(data.lugarVisita),
      antecedentesLevantados: optStr(data.antecedentesLevantados),
      documentosRecibidos: optStr(data.documentosRecibidos),
      planos:              optStr(data.planos),
      basesTecnicas:       optStr(data.basesTecnicas),
      especificaciones:    optStr(data.especificaciones),
      fotografias:         optStr(data.fotografias),
      observacionesTecnicas: optStr(data.observacionesTecnicas),
      necesidadOficinaTecnica: data.necesidadOficinaTecnica ?? null,
      proximosPasos:       optStr(data.proximosPasos),
      // Desarrollo de propuesta
      estadoDesarrolloPropuesta: optStr(data.estadoDesarrolloPropuesta),
      informacionPendiente: optStr(data.informacionPendiente),
      documentosRequeridos: optStr(data.documentosRequeridos),
      riesgoTecnico:       optStr(data.riesgoTecnico),
      condicionesEspeciales: optStr(data.condicionesEspeciales),
      necesidadValidacionGerencial: data.necesidadValidacionGerencial ?? null,
      fechaComprometidaEnvio: parseOptionalDate(data.fechaComprometidaEnvio),
      comentariosInternos: optStr(data.comentariosInternos),
      // Propuesta enviada / negociacion
      fechaEnvioPropuesta: parseOptionalDate(data.fechaEnvioPropuesta),
      versionPropuesta:    optStr(data.versionPropuesta),
      numeroPropuesta:     optStr(data.numeroPropuesta),
      montoPropuesto:      toOptionalNumber(data.montoPropuesto),
      fechaVencimientoPropuesta: parseOptionalDate(data.fechaVencimientoPropuesta),
      comentariosCliente:  optStr(data.comentariosCliente),
      // Documentacion de venta
      ordenCompra:         optStr(data.ordenCompra),
      contrato:            optStr(data.contrato),
      correoAceptacion:    optStr(data.correoAceptacion),
      anticipo:            optStr(data.anticipo),
      aprobacionInternaCliente: optStr(data.aprobacionInternaCliente),
      condicionesPago:     optStr(data.condicionesPago),
      documentosAdministrativosPendientes: optStr(data.documentosAdministrativosPendientes),
      responsableAdministrativo: optStr(data.responsableAdministrativo),
      fechaFirma:          parseOptionalDate(data.fechaFirma),
      fechaInicioProyecto: parseOptionalDate(data.fechaInicioProyecto),
      traspasadoOperaciones: data.traspasadoOperaciones ?? null,
      fechaTraspasoOperaciones: parseOptionalDate(data.fechaTraspasoOperaciones),
      responsableTraspasoOperaciones: optStr(data.responsableTraspasoOperaciones),
      observacionesTraspasoOperaciones: optStr(data.observacionesTraspasoOperaciones),
      traspasadoAdministracion: data.traspasadoAdministracion ?? null,
      fechaTraspasoAdministracion: parseOptionalDate(data.fechaTraspasoAdministracion),
      responsableTraspasoAdministracion: optStr(data.responsableTraspasoAdministracion),
      observacionesTraspasoAdministracion: optStr(data.observacionesTraspasoAdministracion),
      // Cierre perdido / postergado
      etapaPerdida:        optStr(data.etapaPerdida),
      motivoPostergacion:  optStr(data.motivoPostergacion),
      fechaReactivacion:   parseOptionalDate(data.fechaReactivacion),
      // Cierre ganado
      montoFinalGanado:    toOptionalNumber(data.montoFinalGanado),
      fechaCierre:         parseOptionalDate(data.fechaCierre),
      documentoRespaldo:   optStr(data.documentoRespaldo),
      flujoPosterior:      optStr(data.flujoPosterior),
      // Clientes Beck
      clienteBeckId:       data.clienteBeckId  ?? null,
      contactoBeckId:      data.contactoBeckId ?? null,
      // Campos adicionales
      direccionProyecto:   optStr(data.direccionProyecto),
      unidadNegocio:       optStr(data.unidadNegocio),
      observaciones:       optStr(data.observaciones),
      urgencia:            optStr(data.urgencia),
      observacionCamposFaltantes: optStr(data.observacionCamposFaltantes),
      // Campos punto 12 - Beck específicos
      tipoProyecto:             optStr(data.tipoProyecto),
      empresaMandante:          optStr(data.empresaMandante),
      necesidadLevantamiento:   data.necesidadLevantamiento ?? null,
      oficinaTecnicaAsignada:   optStr(data.oficinaTecnicaAsignada),
      duracionEstimada:         optStr(data.duracionEstimada),
      estadoRevisionTecnica:    optStr(data.estadoRevisionTecnica),
      garantiasRequeridas:      optStr(data.garantiasRequeridas),
      estadoDocumentacionVenta: optStr(data.estadoDocumentacionVenta),
      esReactivacion: data.esReactivacion ?? false,
      fechaUltimoCambioEtapa: new Date(),
    },
    include: FUNNEL_BECK_INCLUDE,
  });
  await registrarCambioEtapaBeck({
    tx,
    oportunidadId: created.id,
    etapaAnterior: null,
    etapaNueva: created.etapa,
    usuarioId: userId,
  });
  return created;
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

const CLIENTE_BECK_SELECT = {
  id: true,
  rut: true,
  razonSocial: true,
  nombreEmpresa: true,
  telefono: true,
  correo: true,
  region: true,
  comuna: true,
  activo: true,
} as const;

const CONTACTO_BECK_SELECT = {
  id: true,
  nombre: true,
  cargo: true,
  telefono: true,
  correo: true,
  principal: true,
  activo: true,
} as const;

const OBRA_SELECT = {
  id: true,
  nombre: true,
  codigo: true,
  estado: true,
  cliente: true,
  direccion: true,
} as const;

const FUNNEL_BECK_INCLUDE = {
  clienteBeck:  { select: CLIENTE_BECK_SELECT },
  contactoBeck: { select: CONTACTO_BECK_SELECT },
  obra:         { select: OBRA_SELECT },
} as const;

const FUNNEL_BECK_INCLUDE_WITH_ARCHIVOS = {
  ...FUNNEL_BECK_INCLUDE,
  archivos: { orderBy: { createdAt: "desc" } },
  solicitudesOficinaTecnica: {
    orderBy: { createdAt: "desc" },
    take: 3,
  },
} as const;

const ETAPAS_TABLERO_VALIDAS = new Set<string>([
  "prospecto_identificado",
  "visita_levantamiento",
  "cotizacion_elaborada",
  "cotizacion_enviada",
  "en_negociacion",
  "documentacion_venta",
]);

/**
 * Compatibilidad con datos anteriores a este cambio: hasta ahora, cerrar como
 * perdida/postergada movía la etapa a "cerrada" (perdiendo la etapa real donde
 * estaba la tarjeta). Para esas oportunidades ya guardadas, se reconstruye la
 * última etapa real desde el historial (o etapaPerdida, o un valor por defecto)
 * y se expone como "etapaTablero" sin tocar la columna "etapa" original.
 */
async function resolverEtapasTablero<
  T extends { id: string; etapa: string; estadoCierre: string | null; etapaPerdida: string | null },
>(oportunidades: T[]): Promise<(T & { etapaTablero: string })[]> {
  const necesitanFallback = oportunidades.filter(
    (o) => o.etapa === "cerrada" && (o.estadoCierre === "perdida" || o.estadoCierre === "postergada"),
  );

  const ultimaEtapaRealPorOportunidad = new Map<string, string>();

  if (necesitanFallback.length > 0) {
    const historial = await prisma.historialEtapaBeck.findMany({
      where: {
        oportunidadId: { in: necesitanFallback.map((o) => o.id) },
        etapaNueva: { not: "cerrada" },
      },
      orderBy: { createdAt: "desc" },
      select: { oportunidadId: true, etapaNueva: true },
    });
    for (const h of historial) {
      if (!ultimaEtapaRealPorOportunidad.has(h.oportunidadId) && ETAPAS_TABLERO_VALIDAS.has(h.etapaNueva)) {
        ultimaEtapaRealPorOportunidad.set(h.oportunidadId, h.etapaNueva);
      }
    }
  }

  return oportunidades.map((o) => {
    if (o.etapa !== "cerrada" || (o.estadoCierre !== "perdida" && o.estadoCierre !== "postergada")) {
      return { ...o, etapaTablero: o.etapa };
    }
    const etapaTablero =
      ultimaEtapaRealPorOportunidad.get(o.id)
      ?? (o.etapaPerdida && ETAPAS_TABLERO_VALIDAS.has(o.etapaPerdida) ? o.etapaPerdida : null)
      ?? "prospecto_identificado";
    return { ...o, etapaTablero };
  });
}

export async function getAllFunnelBeck() {
  const oportunidades = await prisma.operadorBeck.findMany({
    orderBy: { createdAt: "desc" },
    include: FUNNEL_BECK_INCLUDE,
  });
  return resolverEtapasTablero(oportunidades);
}

export async function getFunnelBeckById(id: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
    include: FUNNEL_BECK_INCLUDE_WITH_ARCHIVOS,
  });

  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  const [conEtapaTablero] = await resolverEtapasTablero([oportunidad]);
  return conEtapaTablero;
}

export async function getGanadasSinObraFunnelBeck() {
  return prisma.operadorBeck.findMany({
    where: {
      estadoCierre: "ganada",
      obraId: null,
    },
    orderBy: [
      { fechaCierre: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      nombreProyecto: true,
      empresa: true,
      rutEmpresa: true,
      montoFinalGanado: true,
      fechaCierre: true,
      documentoRespaldo: true,
      flujoPosterior: true,
      urgencia: true,
      observacionCamposFaltantes: true,
      region: true,
      comuna: true,
      clienteBeckId: true,
      contactoBeckId: true,
      clienteBeck: {
        select: {
          id: true,
          rut: true,
          razonSocial: true,
          nombreEmpresa: true,
          direccion: true,
          telefono: true,
          correo: true,
          region: true,
          comuna: true,
        },
      },
      contactoBeck: {
        select: {
          id: true,
          nombre: true,
          cargo: true,
          telefono: true,
          correo: true,
        },
      },
    },
  });
}

export async function updateObraFunnelBeck(id: string, obraId: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
    select: {
      id: true,
      estadoCierre: true,
      obraId: true,
    },
  });

  if (!oportunidad) throw new Error("La oportunidad no existe.");
  if (oportunidad.estadoCierre !== "ganada") {
    throw new Error("Solo se pueden vincular obras a oportunidades ganadas.");
  }

  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { id: true },
  });

  if (!obra) throw new Error("La obra no existe.");

  if (oportunidad.obraId && oportunidad.obraId !== obraId) {
    throw new Error("La oportunidad ya está vinculada a otra obra.");
  }

  return prisma.operadorBeck.update({
    where: { id },
    data: { obraId },
    include: FUNNEL_BECK_INCLUDE,
  });
}

export async function updateFunnelBeck(id: string, rawData: Record<string, unknown>, userId: string, userRole?: RolUsuario) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  const data = extractInput(rawData);

  // Resolve final clienteBeckId / contactoBeckId
  const newClienteBeckId  = data.clienteBeckId  !== undefined ? data.clienteBeckId  : existente.clienteBeckId;
  const newContactoBeckId = data.contactoBeckId !== undefined ? data.contactoBeckId : existente.contactoBeckId;

  // Verify permission if empresa/cliente/contacto is changing
  if (userRole && userRole !== 'administrador') {
    const empresaCambia = data.empresa !== undefined && normalizeString(data.empresa) !== existente.empresa;
    const clienteCambia = data.clienteBeckId !== undefined && newClienteBeckId !== existente.clienteBeckId;
    const contactoCambia = data.contactoBeckId !== undefined && newContactoBeckId !== existente.contactoBeckId;
    if (empresaCambia || clienteCambia || contactoCambia) {
      const puede = await puedeCambiarEmpresa(userId, userRole, 'beck');
      if (!puede) {
        throw Object.assign(new Error("No tienes permiso para cambiar la empresa o cliente asociado."), { statusCode: 403 });
      }
    }
  }

  if (newClienteBeckId === null && newContactoBeckId !== null) {
    throw new Error("Para limpiar el cliente debes también limpiar el contacto.");
  }

  if (newClienteBeckId) {
    const cliente = await prisma.clienteBeck.findUnique({
      where: { id: newClienteBeckId },
      select: { id: true },
    });
    if (!cliente) throw new Error("El cliente indicado no existe.");
  }

  if (newContactoBeckId) {
    const contacto = await prisma.contactoClienteBeck.findUnique({
      where: { id: newContactoBeckId },
      select: { id: true, clienteId: true },
    });
    if (!contacto) throw new Error("El contacto indicado no existe.");
    if (newClienteBeckId && contacto.clienteId !== newClienteBeckId) {
      throw new Error("El contacto no pertenece al cliente indicado.");
    }
  }

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
  const resueltoCierre = resolverEtapaAlCerrar({
    etapaSolicitada: data.etapa,
    estadoCierreSolicitado: data.estadoCierre !== undefined ? data.estadoCierre : existente.estadoCierre ?? undefined,
    etapaActual: existente.etapa,
  });
  const etapa = resueltoCierre.etapa;
  const estadoCierre = resueltoCierre.estadoCierre;
  const motivoPerdida = data.motivoPerdida !== undefined
    ? optStr(data.motivoPerdida) : existente.motivoPerdida;
  if (estadoCierre === "perdida" && data.etapaPerdida === undefined && !existente.etapaPerdida) {
    data.etapaPerdida = formatEtapa(existente.etapa);
  }

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
    montoFinalGanado: data.montoFinalGanado !== undefined ? data.montoFinalGanado : existente.montoFinalGanado,
    fechaCierre: data.fechaCierre !== undefined
      ? String(data.fechaCierre)
      : existente.fechaCierre
        ? existente.fechaCierre.toISOString()
        : undefined,
    documentoRespaldo: data.documentoRespaldo !== undefined
      ? data.documentoRespaldo
      : existente.documentoRespaldo ?? undefined,
    flujoPosterior: data.flujoPosterior !== undefined
      ? data.flujoPosterior
      : existente.flujoPosterior ?? undefined,
  });

  const proximaAccionFinal = data.proximaAccion !== undefined
    ? data.proximaAccion
    : existente.proximaAccion;
  const fechaProximaAccionFinal = data.fechaProximaAccion !== undefined
    ? parseOptionalDate(data.fechaProximaAccion)
    : existente.fechaProximaAccion;

  validarOportunidadActiva({
    etapa,
    estadoCierre,
    proximaAccion: proximaAccionFinal,
    fechaProximaAccion: fechaProximaAccionFinal,
  });

  // Regla reprogramaciones: solo incrementar si antes había fecha Y ahora hay fecha distinta
  let incrementarReprogramaciones = false;
  if (data.fechaProximaAccion !== undefined) {
    const anteriorFecha = existente.fechaProximaAccion;
    const nuevaFecha = parseOptionalDate(data.fechaProximaAccion);
    if (anteriorFecha !== null && nuevaFecha !== null) {
      const anteriorStr = anteriorFecha.toISOString().split("T")[0];
      const nuevaStr = nuevaFecha.toISOString().split("T")[0];
      if (anteriorStr !== nuevaStr) incrementarReprogramaciones = true;
    }
  }

  const etapaCambio = etapa !== existente.etapa;
  const cierreCambio = data.estadoCierre !== undefined && data.estadoCierre !== existente.estadoCierre;
  // Normalizado con trim en ambos lados (existente.vendedor puede tener
  // espacios residuales de datos históricos) para no registrar un cambio
  // falso por diferencias puramente de espacios.
  const vendedorAnterior = normalizeString(existente.vendedor);
  const vendedorCambio = vendedorAnterior !== vendedor;

  let advertenciasValidacion: string[] = [];

  if (etapaCambio || cierreCambio) {
    const observacionFinal = data.observacionCamposFaltantes !== undefined
      ? optStr(data.observacionCamposFaltantes)
      : existente.observacionCamposFaltantes;

    if (!observacionFinal) {
      const datosParaValidar = construirDatosParaValidacionBeck(existente, data, {
        nombreProyecto,
        empresa,
        vendedor,
        etapa,
        estadoCierre: estadoCierre ?? null,
        rutEmpresa: data.rutEmpresa !== undefined ? procesarRut(data.rutEmpresa) : existente.rutEmpresa,
        nombreContacto: data.nombreContacto !== undefined ? optStr(data.nombreContacto) : existente.nombreContacto,
        telefonoContacto: data.telefonoContacto !== undefined ? procesarTelefono(data.telefonoContacto) : existente.telefonoContacto,
        correoContacto: data.correoContacto !== undefined ? procesarCorreo(data.correoContacto) : existente.correoContacto,
        unidadNegocio: data.unidadNegocio !== undefined ? optStr(data.unidadNegocio) : existente.unidadNegocio,
        proximaAccion: proximaAccionFinal ?? null,
        fechaProximaAccion: fechaProximaAccionFinal ?? null,
        documentoRespaldo: data.documentoRespaldo !== undefined ? optStr(data.documentoRespaldo) : existente.documentoRespaldo,
        flujoPosterior: data.flujoPosterior !== undefined ? optStr(data.flujoPosterior) : existente.flujoPosterior,
        motivoPerdida: motivoPerdida ?? null,
        etapaPerdida: data.etapaPerdida !== undefined ? optStr(data.etapaPerdida) : existente.etapaPerdida,
        motivoPostergacion: motivoPostergacion ?? null,
        fechaReactivacion: fechaReactivacion ?? null,
      });
      const { bloqueos, advertencias } = await validarCamposCriticosBeck(etapa, datosParaValidar);
      if (bloqueos.length > 0) {
        throw new AdvertenciaCamposCriticosError(bloqueos, advertencias);
      }
      advertenciasValidacion = advertencias;
    }
  }

  const oportunidad = await prisma.$transaction(async (tx) => {
  const updated = await tx.operadorBeck.update({
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
      // Visita / levantamiento tecnico
      ...(data.fechaVisita        !== undefined && { fechaVisita:        parseOptionalDate(data.fechaVisita) }),
      ...(data.responsableTecnico !== undefined && { responsableTecnico: optStr(data.responsableTecnico) }),
      ...(data.asistentes         !== undefined && { asistentes:         optStr(data.asistentes) }),
      ...(data.lugarVisita        !== undefined && { lugarVisita:        optStr(data.lugarVisita) }),
      ...(data.antecedentesLevantados !== undefined && { antecedentesLevantados: optStr(data.antecedentesLevantados) }),
      ...(data.documentosRecibidos !== undefined && { documentosRecibidos: optStr(data.documentosRecibidos) }),
      ...(data.planos             !== undefined && { planos:             optStr(data.planos) }),
      ...(data.basesTecnicas      !== undefined && { basesTecnicas:      optStr(data.basesTecnicas) }),
      ...(data.especificaciones   !== undefined && { especificaciones:   optStr(data.especificaciones) }),
      ...(data.fotografias        !== undefined && { fotografias:        optStr(data.fotografias) }),
      ...(data.observacionesTecnicas !== undefined && { observacionesTecnicas: optStr(data.observacionesTecnicas) }),
      ...(data.necesidadOficinaTecnica !== undefined && { necesidadOficinaTecnica: data.necesidadOficinaTecnica ?? null }),
      ...(data.proximosPasos      !== undefined && { proximosPasos:      optStr(data.proximosPasos) }),
      // Desarrollo de propuesta
      ...(data.estadoDesarrolloPropuesta !== undefined && { estadoDesarrolloPropuesta: optStr(data.estadoDesarrolloPropuesta) }),
      ...(data.informacionPendiente !== undefined && { informacionPendiente: optStr(data.informacionPendiente) }),
      ...(data.documentosRequeridos !== undefined && { documentosRequeridos: optStr(data.documentosRequeridos) }),
      ...(data.riesgoTecnico      !== undefined && { riesgoTecnico:      optStr(data.riesgoTecnico) }),
      ...(data.condicionesEspeciales !== undefined && { condicionesEspeciales: optStr(data.condicionesEspeciales) }),
      ...(data.necesidadValidacionGerencial !== undefined && { necesidadValidacionGerencial: data.necesidadValidacionGerencial ?? null }),
      ...(data.fechaComprometidaEnvio !== undefined && { fechaComprometidaEnvio: parseOptionalDate(data.fechaComprometidaEnvio) }),
      ...(data.comentariosInternos !== undefined && { comentariosInternos: optStr(data.comentariosInternos) }),
      // Propuesta enviada / negociacion
      ...(data.fechaEnvioPropuesta !== undefined && { fechaEnvioPropuesta: parseOptionalDate(data.fechaEnvioPropuesta) }),
      ...(data.versionPropuesta   !== undefined && { versionPropuesta:   optStr(data.versionPropuesta) }),
      ...(data.numeroPropuesta    !== undefined && { numeroPropuesta:    optStr(data.numeroPropuesta) }),
      ...(data.montoPropuesto     !== undefined && { montoPropuesto:     toOptionalNumber(data.montoPropuesto) }),
      ...(data.fechaVencimientoPropuesta !== undefined && { fechaVencimientoPropuesta: parseOptionalDate(data.fechaVencimientoPropuesta) }),
      ...(data.comentariosCliente !== undefined && { comentariosCliente: optStr(data.comentariosCliente) }),
      // Documentacion de venta
      ...(data.ordenCompra        !== undefined && { ordenCompra:        optStr(data.ordenCompra) }),
      ...(data.contrato           !== undefined && { contrato:           optStr(data.contrato) }),
      ...(data.correoAceptacion   !== undefined && { correoAceptacion:   optStr(data.correoAceptacion) }),
      ...(data.anticipo           !== undefined && { anticipo:           optStr(data.anticipo) }),
      ...(data.aprobacionInternaCliente !== undefined && { aprobacionInternaCliente: optStr(data.aprobacionInternaCliente) }),
      ...(data.condicionesPago    !== undefined && { condicionesPago:    optStr(data.condicionesPago) }),
      ...(data.documentosAdministrativosPendientes !== undefined && { documentosAdministrativosPendientes: optStr(data.documentosAdministrativosPendientes) }),
      ...(data.responsableAdministrativo !== undefined && { responsableAdministrativo: optStr(data.responsableAdministrativo) }),
      ...(data.fechaFirma         !== undefined && { fechaFirma:         parseOptionalDate(data.fechaFirma) }),
      ...(data.fechaInicioProyecto !== undefined && { fechaInicioProyecto: parseOptionalDate(data.fechaInicioProyecto) }),
      ...(data.traspasadoOperaciones !== undefined && { traspasadoOperaciones: data.traspasadoOperaciones ?? null }),
      ...(data.fechaTraspasoOperaciones !== undefined && { fechaTraspasoOperaciones: parseOptionalDate(data.fechaTraspasoOperaciones) }),
      ...(data.responsableTraspasoOperaciones !== undefined && { responsableTraspasoOperaciones: optStr(data.responsableTraspasoOperaciones) }),
      ...(data.observacionesTraspasoOperaciones !== undefined && { observacionesTraspasoOperaciones: optStr(data.observacionesTraspasoOperaciones) }),
      ...(data.traspasadoAdministracion !== undefined && { traspasadoAdministracion: data.traspasadoAdministracion ?? null }),
      ...(data.fechaTraspasoAdministracion !== undefined && { fechaTraspasoAdministracion: parseOptionalDate(data.fechaTraspasoAdministracion) }),
      ...(data.responsableTraspasoAdministracion !== undefined && { responsableTraspasoAdministracion: optStr(data.responsableTraspasoAdministracion) }),
      ...(data.observacionesTraspasoAdministracion !== undefined && { observacionesTraspasoAdministracion: optStr(data.observacionesTraspasoAdministracion) }),
      // Cierre perdido / postergado
      ...(data.etapaPerdida       !== undefined && { etapaPerdida:       optStr(data.etapaPerdida) }),
      motivoPostergacion,
      fechaReactivacion,
      // Cierre ganado
      ...(data.montoFinalGanado   !== undefined && { montoFinalGanado:   toOptionalNumber(data.montoFinalGanado) }),
      ...(data.fechaCierre        !== undefined && { fechaCierre:        parseOptionalDate(data.fechaCierre) }),
      ...(data.documentoRespaldo  !== undefined && { documentoRespaldo:  optStr(data.documentoRespaldo) }),
      ...(data.flujoPosterior     !== undefined && { flujoPosterior:     optStr(data.flujoPosterior) }),
      // Clientes Beck
      ...(data.clienteBeckId  !== undefined && { clienteBeckId:  data.clienteBeckId }),
      ...(data.contactoBeckId !== undefined && { contactoBeckId: data.contactoBeckId }),
      // Campos adicionales
      ...(data.direccionProyecto !== undefined && { direccionProyecto: optStr(data.direccionProyecto) }),
      ...(data.unidadNegocio     !== undefined && { unidadNegocio:     optStr(data.unidadNegocio) }),
      ...(data.observaciones     !== undefined && { observaciones:     optStr(data.observaciones) }),
      ...(data.urgencia          !== undefined && { urgencia:          optStr(data.urgencia) }),
      ...(data.observacionCamposFaltantes !== undefined && { observacionCamposFaltantes: optStr(data.observacionCamposFaltantes) }),
      // Campos punto 12 - Beck específicos
      ...(data.tipoProyecto             !== undefined && { tipoProyecto:             optStr(data.tipoProyecto) }),
      ...(data.empresaMandante          !== undefined && { empresaMandante:          optStr(data.empresaMandante) }),
      ...(data.necesidadLevantamiento   !== undefined && { necesidadLevantamiento:   data.necesidadLevantamiento ?? null }),
      ...(data.oficinaTecnicaAsignada   !== undefined && { oficinaTecnicaAsignada:   optStr(data.oficinaTecnicaAsignada) }),
      ...(data.duracionEstimada         !== undefined && { duracionEstimada:         optStr(data.duracionEstimada) }),
      ...(data.estadoRevisionTecnica    !== undefined && { estadoRevisionTecnica:    optStr(data.estadoRevisionTecnica) }),
      ...(data.garantiasRequeridas      !== undefined && { garantiasRequeridas:      optStr(data.garantiasRequeridas) }),
      ...(data.estadoDocumentacionVenta !== undefined && { estadoDocumentacionVenta: optStr(data.estadoDocumentacionVenta) }),
      ...(data.esReactivacion !== undefined && { esReactivacion: data.esReactivacion }),
      ...(incrementarReprogramaciones && { reprogramacionesCount: { increment: 1 } }),
      ...(etapaCambio && { fechaUltimoCambioEtapa: new Date() }),
    },
    include: FUNNEL_BECK_INCLUDE,
  });
  if (etapaCambio) {
    await registrarCambioEtapaBeck({
      tx,
      oportunidadId: id,
      etapaAnterior: existente.etapa,
      etapaNueva: etapa,
      usuarioId: userId,
    });
  }
  if (vendedorCambio && userId) {
    // Se crea con tx (no con registrarMovimientoCRM, que usa el cliente
    // global) para que quede en la MISMA transacción que el update de la
    // oportunidad: si esto falla, se revierte también el cambio de vendedor.
    await tx.movimientoCRM.create({
      data: {
        usuarioId: userId,
        modulo: 'FUNNEL',
        tipo: 'VENDEDOR_MODIFICADO',
        entidadId: id,
        descripcion: `Se cambió el vendedor de ${existente.nombreProyecto} de "${vendedorAnterior}" a "${vendedor}"`,
        datos: {
          vendedorAnterior: vendedorAnterior || null,
          vendedorNuevo: vendedor,
        },
      },
    });
  }
  return updated;
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

  return { oportunidad, advertencias: advertenciasValidacion };
}

/**
 * PATCH /api/funnel-beck/:id/vendedor
 * Cambia ÚNICAMENTE el vendedor de una oportunidad — no toca ningún otro
 * campo, a diferencia de updateFunnelBeck (edición completa). Pensado para
 * el botón "Cambiar vendedor" del modal de detalle, que no debe forzar a
 * completar campos de etapas posteriores del Funnel.
 *
 * Reutiliza:
 *  - getVendedoresFunnelBeckElegibles (misma fuente de verdad que alimenta
 *    el Select de vendedores, para no duplicar la lógica de permisos).
 *  - el mismo patrón de detección de cambio + registro de MovimientoCRM
 *    (tipo VENDEDOR_MODIFICADO) que updateFunnelBeck, dentro de una
 *    transacción para garantizar atomicidad.
 */
export async function cambiarVendedorFunnelBeck(
  id: string,
  vendedorNuevoRaw: unknown,
  userId: string,
) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  const vendedorNuevo = normalizeString(vendedorNuevoRaw);
  if (!vendedorNuevo) throw new Error("El vendedor es obligatorio.");

  const elegibles = await getVendedoresFunnelBeckElegibles();
  const esVendedorValido = elegibles.some(
    (u) => u.nombre === vendedorNuevo || u.email === vendedorNuevo,
  );
  if (!esVendedorValido) {
    throw Object.assign(
      new Error("El vendedor seleccionado no tiene permiso para editar el Funnel."),
      { statusCode: 400 },
    );
  }

  const vendedorAnterior = normalizeString(existente.vendedor);
  const vendedorCambio = vendedorAnterior !== vendedorNuevo;

  if (!vendedorCambio) {
    return { oportunidad: await getFunnelBeckById(id) };
  }

  const oportunidad = await prisma.$transaction(async (tx) => {
    const updated = await tx.operadorBeck.update({
      where: { id },
      data: { vendedor: vendedorNuevo },
      include: FUNNEL_BECK_INCLUDE,
    });

    await tx.movimientoCRM.create({
      data: {
        usuarioId: userId,
        modulo: 'FUNNEL',
        tipo: 'VENDEDOR_MODIFICADO',
        entidadId: id,
        descripcion: `Se cambió el vendedor de ${existente.nombreProyecto} de "${vendedorAnterior}" a "${vendedorNuevo}"`,
        datos: {
          vendedorAnterior: vendedorAnterior || null,
          vendedorNuevo,
        },
      },
    });

    return updated;
  });

  return { oportunidad };
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

  const resuelto = resolverEtapaAlCerrar({
    etapaSolicitada: payload.etapa,
    estadoCierreSolicitado: payload.estadoCierre,
    etapaActual: existente.etapa,
  });
  payload.etapa = resuelto.etapa;
  payload.estadoCierre = resuelto.estadoCierre;
  // Si se cierra como perdida y no se indicó explícitamente, dejamos registro de en qué etapa se perdió.
  if (resuelto.estadoCierre === "perdida" && payload.etapaPerdida === undefined && !existente.etapaPerdida) {
    payload.etapaPerdida = formatEtapa(existente.etapa);
  }

  validarEtapaYCierre({
    etapa: payload.etapa,
    estadoCierre: payload.estadoCierre,
    motivoPerdida: payload.motivoPerdida,
    motivoPostergacion: payload.motivoPostergacion,
    fechaReactivacion: payload.fechaReactivacion,
    montoFinalGanado: payload.montoFinalGanado !== undefined ? payload.montoFinalGanado : existente.montoFinalGanado,
    fechaCierre: payload.fechaCierre !== undefined
      ? payload.fechaCierre
      : existente.fechaCierre
        ? existente.fechaCierre.toISOString()
        : undefined,
    documentoRespaldo: payload.documentoRespaldo !== undefined
      ? payload.documentoRespaldo
      : existente.documentoRespaldo ?? undefined,
    flujoPosterior: payload.flujoPosterior !== undefined
      ? payload.flujoPosterior
      : existente.flujoPosterior ?? undefined,
  });

  const etapaCambio = payload.etapa !== existente.etapa;
  const cierreCambio = payload.estadoCierre !== undefined && payload.estadoCierre !== existente.estadoCierre;

  let advertenciasValidacion: string[] = [];

  if (etapaCambio || cierreCambio) {
    const observacionFinal = payload.observacionCamposFaltantes !== undefined
      ? optStr(payload.observacionCamposFaltantes)
      : existente.observacionCamposFaltantes;

    if (!observacionFinal) {
      const idxActual  = ORDEN_ETAPAS_BECK.indexOf(existente.etapa as typeof ORDEN_ETAPAS_BECK[number]);
      const idxDestino = ORDEN_ETAPAS_BECK.indexOf((payload.etapa ?? '') as typeof ORDEN_ETAPAS_BECK[number]);
      // Retroceso: solo aplica cuando la etapa en sí cambia hacia atrás
      const esRetroceso = etapaCambio && idxActual !== -1 && idxDestino !== -1 && idxDestino < idxActual;
      const etapaUsadaParaValidar = payload.etapa!;

      const etapasAValidar = esRetroceso ? [] : calcularRangoEtapasBeck(idxActual, idxDestino, etapaUsadaParaValidar);

      // TEMP DEBUG — remover una vez confirmado en producción.
      console.log('[DEBUG updateEtapaFunnelBeck]', {
        oportunidadId: id,
        etapaOrigen: existente.etapa,
        etapaDestinoRecibida: payload.etapa,
        etapaUsadaParaValidar,
        esRetroceso,
        etapasAValidar,
      });

      if (!esRetroceso) {
        const datosParaValidar = construirDatosParaValidacionBeck(existente, payload, {
          etapa: etapaUsadaParaValidar,
          estadoCierre: payload.estadoCierre !== undefined ? payload.estadoCierre : existente.estadoCierre,
          documentoRespaldo: payload.documentoRespaldo !== undefined ? optStr(payload.documentoRespaldo) : existente.documentoRespaldo,
          flujoPosterior: payload.flujoPosterior !== undefined ? optStr(payload.flujoPosterior) : existente.flujoPosterior,
          motivoPerdida: payload.motivoPerdida !== undefined ? optStr(payload.motivoPerdida) : existente.motivoPerdida,
          etapaPerdida: payload.etapaPerdida !== undefined ? optStr(payload.etapaPerdida) : existente.etapaPerdida,
          motivoPostergacion: payload.motivoPostergacion !== undefined ? optStr(payload.motivoPostergacion) : existente.motivoPostergacion,
          fechaReactivacion: payload.fechaReactivacion !== undefined ? parseOptionalDate(payload.fechaReactivacion) : existente.fechaReactivacion,
        });
        const { bloqueos, advertencias } = await validarRangoEtapasBeck(etapasAValidar, datosParaValidar);
        if (bloqueos.length > 0) {
          throw new AdvertenciaCamposCriticosError(bloqueos, advertencias);
        }
        advertenciasValidacion = advertencias;
      }
    }
  }

  const oportunidad = await prisma.$transaction(async (tx) => {
  const updated = await tx.operadorBeck.update({
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
      ...(payload.montoFinalGanado  !== undefined && { montoFinalGanado:  toOptionalNumber(payload.montoFinalGanado) }),
      ...(payload.fechaCierre       !== undefined && { fechaCierre:       parseOptionalDate(payload.fechaCierre) }),
      ...(payload.documentoRespaldo  !== undefined && { documentoRespaldo:  optStr(payload.documentoRespaldo) }),
      ...(payload.flujoPosterior     !== undefined && { flujoPosterior:     optStr(payload.flujoPosterior) }),
      ...(payload.traspasadoOperaciones !== undefined && { traspasadoOperaciones: payload.traspasadoOperaciones ?? null }),
      ...(payload.fechaTraspasoOperaciones !== undefined && { fechaTraspasoOperaciones: parseOptionalDate(payload.fechaTraspasoOperaciones) }),
      ...(payload.responsableTraspasoOperaciones !== undefined && { responsableTraspasoOperaciones: optStr(payload.responsableTraspasoOperaciones) }),
      ...(payload.observacionesTraspasoOperaciones !== undefined && { observacionesTraspasoOperaciones: optStr(payload.observacionesTraspasoOperaciones) }),
      ...(payload.traspasadoAdministracion !== undefined && { traspasadoAdministracion: payload.traspasadoAdministracion ?? null }),
      ...(payload.fechaTraspasoAdministracion !== undefined && { fechaTraspasoAdministracion: parseOptionalDate(payload.fechaTraspasoAdministracion) }),
      ...(payload.responsableTraspasoAdministracion !== undefined && { responsableTraspasoAdministracion: optStr(payload.responsableTraspasoAdministracion) }),
      ...(payload.observacionesTraspasoAdministracion !== undefined && { observacionesTraspasoAdministracion: optStr(payload.observacionesTraspasoAdministracion) }),
      ...(payload.observacionCamposFaltantes !== undefined && { observacionCamposFaltantes: optStr(payload.observacionCamposFaltantes) }),
      ...(etapaCambio && { fechaUltimoCambioEtapa: new Date() }),
    },
    include: FUNNEL_BECK_INCLUDE,
  });
  if (etapaCambio) {
    await registrarCambioEtapaBeck({
      tx,
      oportunidadId: id,
      etapaAnterior: existente.etapa,
      etapaNueva: payload.etapa!,
      usuarioId: userId,
    });
  }
  return updated;
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

  return { oportunidad, advertencias: advertenciasValidacion };
}

function pickField(raw: Record<string, unknown>, camel: string, snake: string): unknown {
  return raw[camel] !== undefined ? raw[camel] : raw[snake];
}

function normalizarEstadoCierreInput(raw: unknown): EstadoCierreFunnel {
  const valor = String(raw ?? "").trim().toLowerCase();
  if (valor === "ganada" || valor === "perdida" || valor === "postergada") {
    return valor as EstadoCierreFunnel;
  }
  throw new Error('El campo estadoCierre debe ser "GANADA", "PERDIDA" o "POSTERGADA".');
}

/**
 * Marca una oportunidad como PERDIDA o POSTERGADA sin mover su etapa: la tarjeta
 * permanece en la etapa donde estaba (ver resolverEtapaAlCerrar). Para GANADA se debe
 * usar PATCH /:id/etapa o PUT /:id, que sí exigen los campos de cierre ganado
 * (monto final, documento de respaldo, flujo posterior).
 */
export async function updateEstadoCierreFunnelBeck(
  id: string,
  rawPayload: Record<string, unknown>,
  userId: string,
) {
  const existente = await prisma.operadorBeck.findUnique({ where: { id } });
  if (!existente) throw new Error("Oportunidad no encontrada.");

  const estadoCierre = normalizarEstadoCierreInput(pickField(rawPayload, "estadoCierre", "estado_cierre"));

  if (estadoCierre === "ganada") {
    throw new Error(
      "Para marcar una oportunidad como ganada usa PATCH /:id/etapa o PUT /:id.",
    );
  }

  const motivoCierreGenerico = optStr(pickField(rawPayload, "motivoCierre", "motivo_cierre"));
  const observacionCierreInput = pickField(rawPayload, "observacionCierre", "observacion_cierre");
  const fechaCierreInput = pickField(rawPayload, "fechaCierre", "fecha_cierre");
  const fechaProximaAccionInput = pickField(rawPayload, "fechaProximaAccion", "fecha_proxima_accion");
  const fechaReactivacionInput =
    pickField(rawPayload, "fechaReactivacion", "fecha_reactivacion") ?? fechaProximaAccionInput;

  const motivoPerdida = estadoCierre === "perdida"
    ? optStr(pickField(rawPayload, "motivoPerdida", "motivo_perdida")) ?? motivoCierreGenerico
    : existente.motivoPerdida;
  const motivoPostergacion = estadoCierre === "postergada"
    ? optStr(pickField(rawPayload, "motivoPostergacion", "motivo_postergacion")) ?? motivoCierreGenerico
    : existente.motivoPostergacion;

  validarEtapaYCierre({
    etapa: existente.etapa,
    estadoCierre,
    motivoPerdida: motivoPerdida ?? undefined,
    motivoPostergacion: motivoPostergacion ?? undefined,
    fechaReactivacion: fechaReactivacionInput !== undefined
      ? String(fechaReactivacionInput)
      : existente.fechaReactivacion
        ? existente.fechaReactivacion.toISOString()
        : undefined,
    montoFinalGanado: existente.montoFinalGanado,
    fechaCierre: existente.fechaCierre ? existente.fechaCierre.toISOString() : undefined,
    documentoRespaldo: existente.documentoRespaldo ?? undefined,
    flujoPosterior: existente.flujoPosterior ?? undefined,
  });

  const etapaPerdida = estadoCierre === "perdida"
    ? optStr(pickField(rawPayload, "etapaPerdida", "etapa_perdida"))
      ?? existente.etapaPerdida
      ?? formatEtapa(existente.etapa)
    : existente.etapaPerdida;

  const cierreCambio = estadoCierre !== existente.estadoCierre;
  const motivoCierreFinal = estadoCierre === "perdida" ? motivoPerdida : motivoPostergacion;

  const oportunidad = await prisma.operadorBeck.update({
    where: { id },
    data: {
      // La etapa NO se toca: la oportunidad permanece donde estaba.
      estadoCierre,
      motivoPerdida,
      motivoPostergacion,
      etapaPerdida,
      observacionCierre: observacionCierreInput !== undefined
        ? optStr(observacionCierreInput)
        : existente.observacionCierre,
      fechaCierre: fechaCierreInput !== undefined
        ? parseOptionalDate(fechaCierreInput)
        : existente.fechaCierre ?? new Date(),
      fechaReactivacion: fechaReactivacionInput !== undefined
        ? parseOptionalDate(fechaReactivacionInput)
        : existente.fechaReactivacion,
      ...(fechaProximaAccionInput !== undefined && {
        fechaProximaAccion: parseOptionalDate(fechaProximaAccionInput),
      }),
    },
    include: FUNNEL_BECK_INCLUDE,
  });

  if (cierreCambio) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: "FUNNEL",
      tipo: "OPORTUNIDAD_EDITADA",
      entidadId: oportunidad.id,
      descripcion: `Se marcó ${oportunidad.nombreProyecto} como ${estadoCierre.toUpperCase()}, manteniendo la etapa ${formatEtapa(existente.etapa)}`,
      datos: { estadoCierre, motivoCierre: motivoCierreFinal, etapa: existente.etapa },
    });
  }

  return oportunidad;
}

export async function getHistorialEtapasBeck(id: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  return prisma.historialEtapaBeck.findMany({
    where: { oportunidadId: id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      oportunidadId: true,
      etapaAnterior: true,
      etapaNueva: true,
      usuarioId: true,
      createdAt: true,
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
    },
  });
}

// Historial combinado para la línea de tiempo del Funnel: cambios de etapa
// (HistorialEtapaBeck, sin tocar) + cambios de vendedor (MovimientoCRM,
// tipo VENDEDOR_MODIFICADO), ordenados cronológicamente. No reemplaza ni
// modifica getHistorialEtapasBeck/el endpoint de historial-etapas existente.
export type HistorialCombinadoBeckItem = {
  tipo: 'ETAPA' | 'CAMBIO_VENDEDOR';
  createdAt: string;
  usuario: { id: string; nombre: string } | null;
  etapaAnterior?: string | null;
  etapaNueva?: string | null;
  vendedorAnterior?: string | null;
  vendedorNuevo?: string | null;
};

export async function getHistorialCombinadoBeck(id: string): Promise<HistorialCombinadoBeckItem[]> {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  const [etapas, movimientosVendedor] = await Promise.all([
    prisma.historialEtapaBeck.findMany({
      where: { oportunidadId: id },
      orderBy: { createdAt: "asc" },
      select: {
        etapaAnterior: true,
        etapaNueva: true,
        createdAt: true,
        usuario: { select: { id: true, nombre: true } },
      },
    }),
    prisma.movimientoCRM.findMany({
      where: { entidadId: id, modulo: 'FUNNEL', tipo: 'VENDEDOR_MODIFICADO' },
      orderBy: { createdAt: "asc" },
      select: {
        datos: true,
        createdAt: true,
        usuario: { select: { id: true, nombre: true } },
      },
    }),
  ]);

  const eventosEtapa: HistorialCombinadoBeckItem[] = etapas.map((e) => ({
    tipo: 'ETAPA',
    createdAt: e.createdAt.toISOString(),
    usuario: e.usuario ? { id: e.usuario.id, nombre: e.usuario.nombre } : null,
    etapaAnterior: e.etapaAnterior,
    etapaNueva: e.etapaNueva,
  }));

  const eventosVendedor: HistorialCombinadoBeckItem[] = movimientosVendedor.map((m) => {
    const datos = (m.datos ?? {}) as { vendedorAnterior?: string | null; vendedorNuevo?: string | null };
    return {
      tipo: 'CAMBIO_VENDEDOR',
      createdAt: m.createdAt.toISOString(),
      usuario: m.usuario ? { id: m.usuario.id, nombre: m.usuario.nombre } : null,
      vendedorAnterior: datos.vendedorAnterior ?? null,
      vendedorNuevo: datos.vendedorNuevo ?? null,
    };
  });

  return [...eventosEtapa, ...eventosVendedor].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
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
