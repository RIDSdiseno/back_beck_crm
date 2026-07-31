ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "carga_completa" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS "registros_terreno_carga_completa_created_at_idx"
  ON "registros_terreno"("carga_completa", "created_at");

COMMENT ON COLUMN "registros_terreno"."carga_completa" IS
  'Indica que la creación móvil terminó y que existe al menos una fotografía persistida.';
