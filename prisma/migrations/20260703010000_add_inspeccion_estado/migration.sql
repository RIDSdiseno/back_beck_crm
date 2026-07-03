-- Formaliza el estado de inspeccion de Registros de Terreno como maquina de estados explicita.
-- Antes solo existia el booleano "seleccionado_para_inspeccion", que no distinguia entre
-- "enviado a inspeccion, pendiente de que el Supervisor la realice desde la app" y
-- "ya inspeccionado" (lo que permitia, por error, quitar de inspeccion un registro ya inspeccionado).

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "EstadoInspeccion" AS ENUM ('no_enviado', 'en_inspeccion', 'inspeccionado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "inspeccion_estado" "EstadoInspeccion" NOT NULL DEFAULT 'no_enviado';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "registros_terreno_inspeccion_estado_idx"
  ON "registros_terreno"("inspeccion_estado");

-- Backfill: registros con un control de inspeccion ya registrado quedan como "inspeccionado".
UPDATE "registros_terreno" rt
SET "inspeccion_estado" = 'inspeccionado'
WHERE EXISTS (
  SELECT 1 FROM "controles_inspeccion" ci WHERE ci."registro_terreno_id" = rt."id"
);

-- Backfill: registros marcados para inspeccion pero sin control aun quedan "en_inspeccion".
UPDATE "registros_terreno"
SET "inspeccion_estado" = 'en_inspeccion'
WHERE "seleccionado_para_inspeccion" = true
  AND "inspeccion_estado" = 'no_enviado';
