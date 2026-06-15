/**
 * Seed: Reglas de validación por etapa para módulo FIREMAT.
 * Ejecutar con: npx tsx prisma/seed-configuracion-validacion-firemat.ts
 *
 * Niveles:
 *   BLOQUEANTE  → HTTP 409, no permite avanzar/guardar.
 *   ADVERTENCIA → permite avanzar, devuelve advertencias.
 *   IGNORAR     → no valida, no muestra nada.
 *
 * Nota: PERDIDA_ETAPA_REQUERIDA está seeded como BLOQUEANTE pero el campo
 * etapaPerdida no existe aún en el modelo FunnelFirematOpportunity.
 * El controlador no evalúa esta regla hasta que el campo sea añadido al schema.
 * Mientras tanto puede setearse a IGNORAR en la BD si interfiere.
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

const BASE_RULES: Array<{ regla: string; campo: string; etiqueta: string }> = [
  { regla: 'CLIENTE_REQUERIDO',              campo: 'cliente',             etiqueta: 'Cliente / empresa asociado' },
  { regla: 'RUT_EMPRESA_REQUERIDO',          campo: 'rutEmpresa',          etiqueta: 'RUT empresa' },
  { regla: 'NOMBRE_OPORTUNIDAD_REQUERIDO',   campo: 'nombreOportunidad',   etiqueta: 'Nombre de oportunidad' },
  { regla: 'CONTACTO_REQUERIDO',             campo: 'contacto',            etiqueta: 'Nombre de contacto' },
  { regla: 'TELEFONO_CORREO_REQUERIDO',      campo: 'telefono_correo',     etiqueta: 'Teléfono o correo de contacto' },
  { regla: 'RESPONSABLE_REQUERIDO',          campo: 'responsable',         etiqueta: 'Responsable comercial' },
  { regla: 'UNIDAD_NEGOCIO_REQUERIDA',       campo: 'unidadNegocio',       etiqueta: 'Unidad de negocio' },
  { regla: 'PROXIMA_ACCION_REQUERIDA',       campo: 'proximaAccion',       etiqueta: 'Próxima acción' },
  { regla: 'FECHA_PROXIMA_ACCION_REQUERIDA', campo: 'fechaProximaAccion',  etiqueta: 'Fecha próxima acción' },
];

// Niveles diferenciados para PROSPECTO (etapa temprana)
const NIVELES_PROSPECTO: Record<string, Nivel> = {
  CLIENTE_REQUERIDO:              'BLOQUEANTE',
  RUT_EMPRESA_REQUERIDO:          'ADVERTENCIA',
  NOMBRE_OPORTUNIDAD_REQUERIDO:   'BLOQUEANTE',
  CONTACTO_REQUERIDO:             'ADVERTENCIA',
  TELEFONO_CORREO_REQUERIDO:      'ADVERTENCIA',
  RESPONSABLE_REQUERIDO:          'BLOQUEANTE',
  UNIDAD_NEGOCIO_REQUERIDA:       'BLOQUEANTE',
  PROXIMA_ACCION_REQUERIDA:       'BLOQUEANTE',
  FECHA_PROXIMA_ACCION_REQUERIDA: 'BLOQUEANTE',
};

// Niveles diferenciados para PRIMER_CONTACTO
const NIVELES_PRIMER_CONTACTO: Record<string, Nivel> = {
  CLIENTE_REQUERIDO:              'BLOQUEANTE',
  RUT_EMPRESA_REQUERIDO:          'ADVERTENCIA',
  NOMBRE_OPORTUNIDAD_REQUERIDO:   'BLOQUEANTE',
  CONTACTO_REQUERIDO:             'BLOQUEANTE',
  TELEFONO_CORREO_REQUERIDO:      'BLOQUEANTE',
  RESPONSABLE_REQUERIDO:          'BLOQUEANTE',
  UNIDAD_NEGOCIO_REQUERIDA:       'BLOQUEANTE',
  PROXIMA_ACCION_REQUERIDA:       'BLOQUEANTE',
  FECHA_PROXIMA_ACCION_REQUERIDA: 'BLOQUEANTE',
};

// Las demás etapas: todas las reglas base = BLOQUEANTE
const ETAPAS_TODAS_BLOQUEANTE = [
  'DESARROLLO_COTIZACION',
  'COTIZACION_ENVIADA',
  'ORDEN_CONFIRMADA',
  'GANADA',
  'PERDIDA',
  'POSTERGADA',
  'DESCARTADO',
] as const;

function buildReglas(): Regla[] {
  const reglas: Regla[] = [];

  const addBase = (etapa: string, nivelMap: Record<string, Nivel>) => {
    for (const r of BASE_RULES) {
      reglas.push({
        modulo: 'FIREMAT',
        etapa,
        activo: true,
        nivel: nivelMap[r.regla] ?? 'BLOQUEANTE',
        ...r,
      });
    }
  };

  const allBloqueante: Record<string, Nivel> = Object.fromEntries(
    BASE_RULES.map((r) => [r.regla, 'BLOQUEANTE' as Nivel])
  );

  addBase('PROSPECTO', NIVELES_PROSPECTO);
  addBase('PRIMER_CONTACTO', NIVELES_PRIMER_CONTACTO);
  for (const etapa of ETAPAS_TODAS_BLOQUEANTE) {
    addBase(etapa, allBloqueante);
  }

  // Reglas específicas por etapa de cierre
  reglas.push({
    modulo: 'FIREMAT', etapa: 'GANADA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'GANADA_DOCUMENTO_RESPALDO', campo: 'documentoRespaldo',
    etiqueta: 'Documento de respaldo para oportunidad ganada',
  });
  reglas.push({
    modulo: 'FIREMAT', etapa: 'GANADA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'GANADA_FLUJO_POSTERIOR_REQUERIDO', campo: 'flujoPosterior',
    etiqueta: 'Flujo posterior para oportunidad ganada',
  });

  reglas.push({
    modulo: 'FIREMAT', etapa: 'PERDIDA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'PERDIDA_MOTIVO_REQUERIDO', campo: 'motivoPerdida',
    etiqueta: 'Motivo de pérdida',
  });
  // etapaPerdida no existe en el modelo Firemat aún; seeded para uso futuro
  reglas.push({
    modulo: 'FIREMAT', etapa: 'PERDIDA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'PERDIDA_ETAPA_REQUERIDA', campo: 'etapaPerdida',
    etiqueta: 'Etapa en que se perdió la oportunidad',
  });

  reglas.push({
    modulo: 'FIREMAT', etapa: 'POSTERGADA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'POSTERGADA_MOTIVO_REQUERIDO', campo: 'motivoPostergacion',
    etiqueta: 'Motivo de postergación',
  });
  reglas.push({
    modulo: 'FIREMAT', etapa: 'POSTERGADA', activo: true, nivel: 'BLOQUEANTE',
    regla: 'POSTERGADA_FECHA_REACTIVACION_REQUERIDA', campo: 'fechaReactivacion',
    etiqueta: 'Fecha tentativa de reactivación',
  });

  reglas.push({
    modulo: 'FIREMAT', etapa: 'DESCARTADO', activo: true, nivel: 'BLOQUEANTE',
    regla: 'DESCARTADA_MOTIVO_REQUERIDO', campo: 'motivoDescarte',
    etiqueta: 'Motivo de descarte',
  });

  return reglas;
}

async function main() {
  const reglas = buildReglas();
  console.log(`🌱 Seeding ${reglas.length} reglas de validación FIREMAT por etapa...`);

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

  console.log(`✅ ${reglas.length} reglas de validación FIREMAT cargadas.`);
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
