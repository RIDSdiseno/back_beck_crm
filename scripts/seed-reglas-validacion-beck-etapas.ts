
import { prisma } from "../src/config/prisma";

type NuevaRegla = {
  etapa: string;
  regla: string;
  campo: string;
  etiqueta: string;
  nivel: "BLOQUEANTE" | "ADVERTENCIA";
};

const NUEVAS_REGLAS: NuevaRegla[] = [
  { etapa: "visita_levantamiento", regla: "FECHA_PRIMER_CONTACTO_REQUERIDA", campo: "fechaPrimerContacto", etiqueta: "La fecha de primer contacto es obligatoria para avanzar.", nivel: "ADVERTENCIA" },
  { etapa: "visita_levantamiento", regla: "TIPO_CONTACTO_REQUERIDO", campo: "tipoContacto", etiqueta: "El tipo de contacto es obligatorio para avanzar.", nivel: "ADVERTENCIA" },
  { etapa: "visita_levantamiento", regla: "TIPO_CLIENTE_REQUERIDO", campo: "tipoCliente", etiqueta: "El tipo de cliente es obligatorio para avanzar.", nivel: "ADVERTENCIA" },
  { etapa: "visita_levantamiento", regla: "NIVEL_INTERES_REQUERIDO", campo: "nivelInteres", etiqueta: "El nivel de interes es obligatorio para avanzar.", nivel: "ADVERTENCIA" },
  { etapa: "visita_levantamiento", regla: "NECESIDAD_DETECTADA_REQUERIDA", campo: "necesidadDetectada", etiqueta: "La necesidad detectada es obligatoria para avanzar.", nivel: "ADVERTENCIA" },
  { etapa: "visita_levantamiento", regla: "TIMING_ESTIMADO_REQUERIDO", campo: "timingEstimado", etiqueta: "El timing estimado es obligatorio para avanzar.", nivel: "ADVERTENCIA" },

  { etapa: "cotizacion_elaborada", regla: "FECHA_VISITA_REQUERIDA", campo: "fechaVisita", etiqueta: "La fecha de visita es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "RESPONSABLE_TECNICO_REQUERIDO", campo: "responsableTecnico", etiqueta: "El responsable tecnico es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "LUGAR_VISITA_REQUERIDO", campo: "lugarVisita", etiqueta: "El lugar de la visita es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "ANTECEDENTES_LEVANTADOS_REQUERIDOS", campo: "antecedentesLevantados", etiqueta: "Los antecedentes levantados son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "BASES_TECNICAS_REQUERIDAS", campo: "basesTecnicas", etiqueta: "Las bases tecnicas son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "OBSERVACIONES_TECNICAS_REQUERIDAS", campo: "observacionesTecnicas", etiqueta: "Las observaciones tecnicas son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "DOCUMENTOS_RECIBIDOS_REQUERIDOS", campo: "documentosRecibidos", etiqueta: "Los documentos recibidos son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "PLANOS_REQUERIDOS", campo: "planos", etiqueta: "Los planos son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_elaborada", regla: "FOTOGRAFIAS_REQUERIDAS", campo: "fotografias", etiqueta: "Las fotografias son obligatorias para avanzar.", nivel: "BLOQUEANTE" },

  { etapa: "cotizacion_enviada", regla: "ESTADO_DESARROLLO_PROPUESTA_REQUERIDO", campo: "estadoDesarrolloPropuesta", etiqueta: "El estado de desarrollo de la propuesta es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_enviada", regla: "INFORMACION_PENDIENTE_REQUERIDA", campo: "informacionPendiente", etiqueta: "La informacion pendiente es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_enviada", regla: "DOCUMENTOS_REQUERIDOS_DEFINIDOS", campo: "documentosRequeridos", etiqueta: "Los documentos requeridos son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_enviada", regla: "RIESGO_TECNICO_REQUERIDO", campo: "riesgoTecnico", etiqueta: "El riesgo tecnico es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_enviada", regla: "CONDICIONES_ESPECIALES_REQUERIDAS", campo: "condicionesEspeciales", etiqueta: "Las condiciones especiales son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "cotizacion_enviada", regla: "FECHA_COMPROMETIDA_ENVIO_REQUERIDA", campo: "fechaComprometidaEnvio", etiqueta: "La fecha comprometida de envio es obligatoria para avanzar.", nivel: "BLOQUEANTE" },

  { etapa: "en_negociacion", regla: "FECHA_ENVIO_PROPUESTA_REQUERIDA", campo: "fechaEnvioPropuesta", etiqueta: "La fecha de envio de la propuesta es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "VERSION_PROPUESTA_REQUERIDA", campo: "versionPropuesta", etiqueta: "La version de la propuesta es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "NUMERO_PROPUESTA_REQUERIDO", campo: "numeroPropuesta", etiqueta: "El numero de propuesta es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "MONTO_PROPUESTO_REQUERIDO", campo: "montoPropuesto", etiqueta: "El monto propuesto es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "FECHA_VENCIMIENTO_PROPUESTA_REQUERIDA", campo: "fechaVencimientoPropuesta", etiqueta: "La fecha de vencimiento de la propuesta es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "PROBABILIDAD_CIERRE_REQUERIDA", campo: "probabilidadCierre", etiqueta: "La probabilidad de cierre es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "COMENTARIOS_CLIENTE_REQUERIDOS", campo: "comentariosCliente", etiqueta: "Los comentarios del cliente son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "OBJECIONES_REQUERIDAS", campo: "objeciones", etiqueta: "Las objeciones son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "CONTRAPROPUESTAS_REQUERIDAS", campo: "contrapropuestas", etiqueta: "Las contrapropuestas son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "en_negociacion", regla: "AJUSTES_SOLICITADOS_REQUERIDOS", campo: "ajustesSolicitados", etiqueta: "Los ajustes solicitados son obligatorios para avanzar.", nivel: "BLOQUEANTE" },

  { etapa: "documentacion_venta", regla: "ORDEN_COMPRA_REQUERIDA", campo: "ordenCompra", etiqueta: "La orden de compra es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "CONTRATO_REQUERIDO", campo: "contrato", etiqueta: "El contrato es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "CORREO_ACEPTACION_REQUERIDO", campo: "correoAceptacion", etiqueta: "El correo de aceptacion es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "ANTICIPO_REQUERIDO", campo: "anticipo", etiqueta: "El anticipo es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "APROBACION_INTERNA_CLIENTE_REQUERIDA", campo: "aprobacionInternaCliente", etiqueta: "La aprobacion interna del cliente es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "CONDICIONES_PAGO_REQUERIDAS", campo: "condicionesPago", etiqueta: "Las condiciones de pago son obligatorias para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "DOCUMENTOS_ADMINISTRATIVOS_PENDIENTES_REQUERIDOS", campo: "documentosAdministrativosPendientes", etiqueta: "Los documentos administrativos pendientes son obligatorios para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "RESPONSABLE_ADMINISTRATIVO_REQUERIDO", campo: "responsableAdministrativo", etiqueta: "El responsable administrativo es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "FECHA_FIRMA_REQUERIDA", campo: "fechaFirma", etiqueta: "La fecha de firma es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "FECHA_INICIO_PROYECTO_REQUERIDA", campo: "fechaInicioProyecto", etiqueta: "La fecha de inicio del proyecto es obligatoria para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "TRASPASADO_OPERACIONES_REQUERIDO", campo: "traspasadoOperaciones", etiqueta: "El traspaso a operaciones es obligatorio para avanzar.", nivel: "BLOQUEANTE" },
  { etapa: "documentacion_venta", regla: "TRASPASADO_ADMINISTRACION_REQUERIDO", campo: "traspasadoAdministracion", etiqueta: "El traspaso a administracion es obligatorio para avanzar.", nivel: "BLOQUEANTE" },

  { etapa: "cerrada", regla: "GANADA_MONTO_FINAL_REQUERIDO", campo: "montoFinalGanado", etiqueta: "El monto final ganado es obligatorio para marcar como Ganada.", nivel: "BLOQUEANTE" },
  { etapa: "cerrada", regla: "GANADA_FECHA_CIERRE_REQUERIDA", campo: "fechaCierre", etiqueta: "La fecha de cierre es obligatoria para marcar como Ganada.", nivel: "BLOQUEANTE" },
];

async function main() {
  let insertadas = 0;
  let omitidas = 0;

  for (const r of NUEVAS_REGLAS) {
    const result: unknown[] = await prisma.$queryRaw`
      INSERT INTO "configuracion_validacion" ("modulo", "etapa", "regla", "campo", "etiqueta", "nivel", "activo", "updated_at")
      VALUES ('BECK', ${r.etapa}, ${r.regla}, ${r.campo}, ${r.etiqueta}, ${r.nivel}, true, now())
      ON CONFLICT ("modulo", "regla", "etapa") DO NOTHING
      RETURNING id;
    `;
    if (result.length > 0) {
      insertadas++;
      console.log(`[INSERTADA] ${r.etapa} / ${r.regla} (${r.nivel})`);
    } else {
      omitidas++;
      console.log(`[YA EXISTIA - omitida] ${r.etapa} / ${r.regla}`);
    }
  }

  console.log(`\nTotal insertadas: ${insertadas}. Total ya existentes (omitidas): ${omitidas}.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
