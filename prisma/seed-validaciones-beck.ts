/**
 * Reglas de validación BECK — criterio oficial Punto 15 del documento de implementación:
 *   "Alertar si..."  → ADVERTENCIA  (avisa pero no bloquea)
 *   "No permitir..." → BLOQUEANTE   (impide la acción)
 *
 * Ejecutar desde la raíz de back_beck_crm:
 *   npx ts-node --skip-project --compiler-options '{"module":"CommonJS"}' prisma/seed-validaciones-beck.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL no está definida en el entorno");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// ── Constantes ─────────────────────────────────────────────────────────────
const MODULO = "BECK";

/**
 * Etapas del kanban BECK. Son las únicas etapas que el servicio consulta
 * cuando llama a obtenerMapaReglasValidacion('BECK', etapa).
 */
const ETAPAS_ACTIVAS = [
  "prospecto_identificado",
  "visita_levantamiento",
  "cotizacion_elaborada",
  "cotizacion_enviada",
  "en_negociacion",
  "documentacion_venta",
  "cerrada",
];

// ── ADVERTENCIAS (7 reglas × 7 etapas = 49 registros) ─────────────────────
const REGLAS_ADVERTENCIA = [
  {
    regla: "EMPRESA_REQUERIDA",
    campo: "clienteBeckId",
    etiqueta: "La oportunidad no tiene empresa o cliente asociado.",
  },
  {
    regla: "CONTACTO_REQUERIDO",
    campo: "nombreContacto",
    etiqueta: "La oportunidad no tiene nombre de contacto.",
  },
  {
    regla: "TELEFONO_CORREO_REQUERIDO",
    campo: "telefonoContacto_correoContacto",
    etiqueta: "La oportunidad no tiene teléfono ni correo de contacto.",
  },
  {
    regla: "RESPONSABLE_REQUERIDO",
    campo: "vendedor",
    etiqueta: "La oportunidad no tiene responsable comercial asignado.",
  },
  {
    regla: "UNIDAD_NEGOCIO_REQUERIDA",
    campo: "unidadNegocio",
    etiqueta: "La oportunidad no tiene unidad de negocio definida.",
  },
  {
    regla: "PROXIMA_ACCION_REQUERIDA",
    campo: "proximaAccion",
    etiqueta: "Esta oportunidad activa no tiene próxima acción definida.",
  },
  {
    regla: "FECHA_PROXIMA_ACCION_REQUERIDA",
    campo: "fechaProximaAccion",
    etiqueta: "Esta oportunidad activa no tiene fecha de próxima acción.",
  },
];

// ── BLOQUEANTES por etapa kanban específica ────────────────────────────────
//
// NOTA IMPORTANTE sobre los estados de cierre:
//
//   estadoCierre='ganada'     → la etapa kanban pasa a 'cerrada'
//   estadoCierre='descartada' → la etapa kanban pasa a 'cerrada'
//   estadoCierre='perdida'    → la etapa kanban NO cambia (se queda donde estaba)
//   estadoCierre='postergada' → la etapa kanban NO cambia (se queda donde estaba)
//
// El filtro REGLAS_CONDICION_ESTADO_CIERRE en funnelBeck.service.ts garantiza
// que cada regla solo se evalúe cuando estadoCierre coincide. Por eso:
//   - ganada/descartada → seedear solo en etapa='cerrada'
//   - perdida/postergada → seedear en TODAS las etapas activas

// Bloqueantes solo en etapa 'cerrada'
const REGLAS_ETAPA_CERRADA = [
  // Cuando estadoCierre='ganada' (filtrado por REGLAS_CONDICION_ESTADO_CIERRE)
  {
    regla: "GANADA_DOCUMENTO_RESPALDO",
    campo: "documentoRespaldo",
    etiqueta: "No se puede marcar como Ganada sin documento de respaldo o referencia formal.",
    nivel: "BLOQUEANTE",
  },
  {
    regla: "GANADA_FLUJO_POSTERIOR_REQUERIDO",
    campo: "flujoPosterior",
    etiqueta: "No se puede marcar como Ganada sin definir el flujo posterior.",
    nivel: "BLOQUEANTE",
  },
  // Cuando estadoCierre='descartada' (filtrado por REGLAS_CONDICION_ESTADO_CIERRE)
  {
    regla: "DESCARTADA_MOTIVO_REQUERIDO",
    campo: "observacionCierre",
    etiqueta: "No se puede descartar una oportunidad sin indicar el motivo.",
    nivel: "BLOQUEANTE",
  },
];

// Bloqueantes para estadoCierre='perdida' o 'postergada' → aplican en TODAS las etapas
const REGLAS_CIERRE_TODAS_ETAPAS = [
  // Cuando estadoCierre='perdida'
  {
    regla: "PERDIDA_MOTIVO_REQUERIDO",
    campo: "motivoPerdida",
    etiqueta: "No se puede marcar como Perdida sin indicar el motivo.",
    nivel: "BLOQUEANTE",
  },
  {
    regla: "PERDIDA_ETAPA_REQUERIDA",
    campo: "etapaPerdida",
    etiqueta: "Registra la etapa en que se perdió la oportunidad.",
    nivel: "BLOQUEANTE",
  },
  // Cuando estadoCierre='postergada'
  {
    regla: "POSTERGADA_MOTIVO_REQUERIDO",
    campo: "motivoPostergacion",
    etiqueta: "No se puede postergar sin indicar el motivo.",
    nivel: "BLOQUEANTE",
  },
  {
    regla: "POSTERGADA_FECHA_REACTIVACION_REQUERIDA",
    campo: "fechaReactivacion",
    etiqueta: "No se puede postergar sin una fecha tentativa de reactivación.",
    nivel: "BLOQUEANTE",
  },
];

// Bloqueantes por etapa específica (sin condición de estadoCierre)
const REGLAS_POR_ETAPA: Record<string, { regla: string; campo: string; etiqueta: string; nivel: string }[]> = {
  cotizacion_enviada: [
    {
      regla: "COTIZACION_ENVIADA_PROXIMA_ACCION",
      campo: "proximaAccion",
      etiqueta: "La cotización enviada debe tener próxima acción programada.",
      nivel: "BLOQUEANTE",
    },
    {
      regla: "COTIZACION_ENVIADA_FECHA_PROXIMA_ACCION",
      campo: "fechaProximaAccion",
      etiqueta: "La cotización enviada debe tener fecha de próxima acción.",
      nivel: "BLOQUEANTE",
    },
  ],
  en_negociacion: [
    {
      regla: "PROPUESTA_ENVIADA_PROXIMA_ACCION",
      campo: "proximaAccion",
      etiqueta: "La propuesta enviada debe tener próxima acción programada.",
      nivel: "BLOQUEANTE",
    },
    {
      regla: "PROPUESTA_ENVIADA_FECHA_PROXIMA_ACCION",
      campo: "fechaProximaAccion",
      etiqueta: "La propuesta enviada debe tener fecha de próxima acción.",
      nivel: "BLOQUEANTE",
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
async function upsertRegla(etapa: string, r: { regla: string; campo: string; etiqueta: string; nivel: string }) {
  await (prisma as any).configuracionValidacion.upsert({
    where: { modulo_regla_etapa: { modulo: MODULO, regla: r.regla, etapa } },
    update: { campo: r.campo, etiqueta: r.etiqueta, nivel: r.nivel, activo: true },
    create: { modulo: MODULO, etapa, regla: r.regla, campo: r.campo, etiqueta: r.etiqueta, nivel: r.nivel, activo: true },
  });
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔧 Aplicando reglas de validación BECK...\n");

  // 1) ADVERTENCIAS en todas las etapas activas
  for (const etapa of ETAPAS_ACTIVAS) {
    for (const r of REGLAS_ADVERTENCIA) {
      await upsertRegla(etapa, { ...r, nivel: "ADVERTENCIA" });
    }
  }
  console.log(`  ✅ ${REGLAS_ADVERTENCIA.length} × ${ETAPAS_ACTIVAS.length} etapas = ${REGLAS_ADVERTENCIA.length * ETAPAS_ACTIVAS.length} ADVERTENCIA`);

  // 2) BLOQUEANTES solo en 'cerrada' (ganada + descartada)
  for (const r of REGLAS_ETAPA_CERRADA) {
    await upsertRegla("cerrada", r);
  }
  console.log(`  ✅ ${REGLAS_ETAPA_CERRADA.length} BLOQUEANTE solo en etapa='cerrada' (ganada/descartada)`);

  // 3) BLOQUEANTES de cierre en todas las etapas activas (perdida + postergada)
  for (const etapa of ETAPAS_ACTIVAS) {
    for (const r of REGLAS_CIERRE_TODAS_ETAPAS) {
      await upsertRegla(etapa, r);
    }
  }
  console.log(`  ✅ ${REGLAS_CIERRE_TODAS_ETAPAS.length} × ${ETAPAS_ACTIVAS.length} etapas = ${REGLAS_CIERRE_TODAS_ETAPAS.length * ETAPAS_ACTIVAS.length} BLOQUEANTE (perdida/postergada)`);

  // 4) BLOQUEANTES por etapa específica
  for (const [etapa, reglas] of Object.entries(REGLAS_POR_ETAPA)) {
    for (const r of reglas) {
      await upsertRegla(etapa, r);
    }
    console.log(`  ✅ ${reglas.length} BLOQUEANTE específico en etapa='${etapa}'`);
  }

  // 5) Resumen final en DB
  const resumen = await (prisma as any).configuracionValidacion.groupBy({
    by: ["etapa", "nivel"],
    where: { modulo: MODULO, activo: true },
    _count: { id: true },
  });

  const totalDB = resumen.reduce((acc: number, r: any) => acc + r._count.id, 0);
  console.log(`\n🎉 Total en DB (modulo='BECK'): ${totalDB} reglas activas`);
  console.log("\n📊 Detalle por etapa:");
  for (const row of resumen.sort((a: any, b: any) => a.etapa.localeCompare(b.etapa))) {
    console.log(`   ${row.etapa.padEnd(36)} ${row.nivel.padEnd(15)} → ${row._count.id} regla(s)`);
  }
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
