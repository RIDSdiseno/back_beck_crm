-- Permite configurar por obra el factor de Aislacion (cuando aplica y
-- cuando no aplica), igual que ya existe para Accesibilidad y Holguras.
-- Antes ambos valores estaban fijos en el codigo (1.3 y 1).

-- CreateTable
CREATE TABLE IF NOT EXISTS "factor_aislacion_obra" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "obra_id" UUID NOT NULL,
    "aplica" BOOLEAN NOT NULL,
    "factor" DECIMAL(6,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factor_aislacion_obra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "factor_aislacion_obra_obra_id_idx" ON "factor_aislacion_obra"("obra_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "factor_aislacion_obra_obra_id_aplica_key" ON "factor_aislacion_obra"("obra_id", "aplica");

-- AddForeignKey (solo si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'factor_aislacion_obra_obra_id_fkey'
  ) THEN
    ALTER TABLE "factor_aislacion_obra"
      ADD CONSTRAINT "factor_aislacion_obra_obra_id_fkey"
      FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
