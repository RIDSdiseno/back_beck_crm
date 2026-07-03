ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "firma_cliente_url" TEXT,
  ADD COLUMN IF NOT EXISTS "pdf_firmado_url" TEXT;
