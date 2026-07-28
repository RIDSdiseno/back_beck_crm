ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "nombre_firmante_cliente" VARCHAR(255);
