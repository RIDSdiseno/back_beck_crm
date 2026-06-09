/**
 * Seed: Reglas de validación por etapa para módulo BECK.
 * Ejecutar con: npx tsx prisma/seed-configuracion-validacion-beck.ts
 *
 * Niveles:
 *   BLOQUEANTE  → HTTP 409, no permite avanzar de etapa.
 *   ADVERTENCIA → permite avanzar, devuelve advertencias.
 *   IGNORAR     → no valida, no muestra nada.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Nivel = 'BLOQUEANTE' | 'ADVERTENCIA' | 'IGNORAR';
type Regla = {
  modulo: string;
  regla: string;
  etapa: string;
  campo: string;
  etiqueta: string;
  nivel: Nivel;
  activo: boolean;
};

// Etapas activas (no cierre)
const ETAPAS_ACTIVAS = [
  'prospecto_identificado',
  'visita_levantamiento',
  'cotizacion_elaborada',
  'cotizacion_enviada',
  'en_negociacion',
  'documentacion_venta',
] as const;

// Etapas tempranas (ADVERTENCIA) vs tardías (BLOQUEANTE)
const ETAPAS_ADVERTENCIA = new Set(['prospecto_identificado', 'visita_levantamiento']);

function nivelPorEtapa(etapa: string): Nivel {
  return ETAPAS_ADVERTENCIA.has(etapa) ? 'ADVERTENCIA' : 'BLOQUEANTE';
}

// Campos de contacto/empresa que aplican a todas las etapas activas
const camposGenerales: Array<{ regla: string; campo: string; etiqueta: string }> = [
  { regla: 'EMPRESA_REQUERIDA',              campo: 'empresa',                         etiqueta: 'Empresa o cliente asociado' },
  { regla: 'CONTACTO_REQUERIDO',             campo: 'nombreContacto',                  etiqueta: 'Nombre de contacto' },
  { regla: 'TELEFONO_CORREO_REQUERIDO',      campo: 'telefonoContacto_correoContacto', etiqueta: 'Teléfono o correo de contacto' },
  { regla: 'RESPONSABLE_COMERCIAL_REQUERIDO', campo: 'vendedor',                        etiqueta: 'Responsable comercial' },
  { regla: 'UNIDAD_NEGOCIO_REQUERIDA',       campo: 'unidadNegocio',                   etiqueta: 'Unidad de negocio' },
];

// Próxima acción: BLOQUEANTE en todas las etapas activas
const camposProximaAccion: Array<{ regla: string; campo: string; etiqueta: string }> = [
  { regla: 'PROXIMA_ACCION_REQUERIDA',        campo: 'proximaAccion',       etiqueta: 'Próxima acción' },
  { regla: 'FECHA_PROXIMA_ACCION_REQUERIDA',  campo: 'fechaProximaAccion',  etiqueta: 'Fecha próxima acción' },
];

// Reglas de cierre: solo aplican a etapa=cerrada
const reglasCierre: Array<{ regla: string; campo: string; etiqueta: string; nivel: Nivel }> = [
  { regla: 'GANADA_DOCUMENTO_RESPALDO',               campo: 'documentoRespaldo',  etiqueta: 'Documento de respaldo para oportunidad ganada',    nivel: 'BLOQUEANTE' },
  { regla: 'GANADA_FLUJO_POSTERIOR_REQUERIDO',        campo: 'flujoPosterior',     etiqueta: 'Flujo posterior para oportunidad ganada',           nivel: 'BLOQUEANTE' },
  { regla: 'PERDIDA_MOTIVO_REQUERIDO',                campo: 'motivoPerdida',      etiqueta: 'Motivo de pérdida',                                 nivel: 'BLOQUEANTE' },
  { regla: 'PERDIDA_ETAPA_REQUERIDA',                 campo: 'etapaPerdida',       etiqueta: 'Etapa en que se perdió la oportunidad',             nivel: 'BLOQUEANTE' },
  { regla: 'POSTERGADA_MOTIVO_REQUERIDO',             campo: 'motivoPostergacion', etiqueta: 'Motivo de postergación',                            nivel: 'BLOQUEANTE' },
  { regla: 'POSTERGADA_FECHA_REACTIVACION_REQUERIDA', campo: 'fechaReactivacion',  etiqueta: 'Fecha tentativa de reactivación',                   nivel: 'BLOQUEANTE' },
];

// Reglas exclusivas de etapa cotizacion_enviada
const reglasCotizacionEnviada: Array<{ regla: string; campo: string; etiqueta: string; nivel: Nivel }> = [
  { regla: 'COTIZACION_ENVIADA_PROXIMA_ACCION', campo: 'proximaAccion', etiqueta: 'Cotización enviada con próxima acción programada', nivel: 'BLOQUEANTE' },
];

function buildReglas(): Regla[] {
  const reglas: Regla[] = [];

  // Campos generales × etapas activas
  for (const etapa of ETAPAS_ACTIVAS) {
    for (const c of camposGenerales) {
      reglas.push({ modulo: 'BECK', etapa, nivel: nivelPorEtapa(etapa), activo: true, ...c });
    }
    for (const c of camposProximaAccion) {
      reglas.push({ modulo: 'BECK', etapa, nivel: 'BLOQUEANTE', activo: true, ...c });
    }
  }

  // Reglas de cierre → etapa cerrada
  for (const c of reglasCierre) {
    reglas.push({ modulo: 'BECK', etapa: 'cerrada', activo: true, ...c });
  }

  // Reglas exclusivas de cotización enviada
  for (const c of reglasCotizacionEnviada) {
    reglas.push({ modulo: 'BECK', etapa: 'cotizacion_enviada', activo: true, ...c });
  }

  return reglas;
}

async function main() {
  const reglas = buildReglas();
  console.log(`🌱 Seeding ${reglas.length} reglas de validación BECK por etapa...`);

  for (const regla of reglas) {
    await prisma.configuracionValidacion.upsert({
      where: {
        modulo_regla_etapa: { modulo: regla.modulo, regla: regla.regla, etapa: regla.etapa },
      },
      create: regla,
      update: {
        campo:    regla.campo,
        etiqueta: regla.etiqueta,
        nivel:    regla.nivel,
        activo:   regla.activo,
      },
    });
  }

  console.log(`✅ ${reglas.length} reglas de validación BECK cargadas.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
