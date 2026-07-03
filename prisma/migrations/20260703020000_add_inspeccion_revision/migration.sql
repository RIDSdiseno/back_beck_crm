-- Permite a Ingenieria (web) validar o rechazar el resultado de una inspeccion
-- ya registrada por el Supervisor (inspeccion_estado = 'inspeccionado').
-- Rechazar devuelve el registro a la cola del supervisor (inspeccion_estado = 'en_inspeccion')
-- guardando el motivo, para que se genere un nuevo control de inspeccion.

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "EstadoRevisionInspeccion" AS ENUM ('pendiente', 'validado', 'rechazado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "inspeccion_revision_estado" "EstadoRevisionInspeccion" NOT NULL DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS "inspeccion_revision_por_id" UUID,
  ADD COLUMN IF NOT EXISTS "inspeccion_revision_at" TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS "motivo_rechazo_inspeccion" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "registros_terreno_inspeccion_revision_estado_idx"
  ON "registros_terreno"("inspeccion_revision_estado");

CREATE INDEX IF NOT EXISTS "registros_terreno_inspeccion_revision_por_id_idx"
  ON "registros_terreno"("inspeccion_revision_por_id");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "registros_terreno"
    ADD CONSTRAINT "registros_terreno_inspeccion_revision_por_id_fkey"
    FOREIGN KEY ("inspeccion_revision_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
