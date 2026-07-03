-- Separa la validacion de obra (Jefe de Obra / Supervisor) del procesamiento de Ingenieria.
-- La columna existente "estado" de registros_terreno sigue representando el
-- estado de Procesamiento Ingenieria (pendiente | en_revision | validado | rechazado).
-- Esta migracion agrega el estado de validacion de obra, previo y separado.

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "EstadoValidacionObra" AS ENUM ('pendiente', 'validado', 'rechazado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "estado_validacion_obra" "EstadoValidacionObra" NOT NULL DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS "validacion_obra_por_id" UUID,
  ADD COLUMN IF NOT EXISTS "validacion_obra_at" TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS "motivo_rechazo_obra" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "registros_terreno_estado_validacion_obra_idx"
  ON "registros_terreno"("estado_validacion_obra");

CREATE INDEX IF NOT EXISTS "registros_terreno_validacion_obra_por_id_idx"
  ON "registros_terreno"("validacion_obra_por_id");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "registros_terreno"
    ADD CONSTRAINT "registros_terreno_validacion_obra_por_id_fkey"
    FOREIGN KEY ("validacion_obra_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Registros ya procesados por Ingenieria (en_revision / validado / rechazado a nivel de
-- procesamiento) fueron necesariamente aprobados por obra bajo el flujo anterior:
-- se marcan como validados en obra para no romper el historial existente.
UPDATE "registros_terreno"
SET "estado_validacion_obra" = 'validado'
WHERE "estado" IN ('en_revision', 'validado', 'rechazado')
  AND "estado_validacion_obra" = 'pendiente';
