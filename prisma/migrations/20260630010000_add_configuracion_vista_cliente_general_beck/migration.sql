-- CreateTable (IF NOT EXISTS — tabla general puede ya existir si se creó manualmente)
CREATE TABLE IF NOT EXISTS "configuracion_vista_cliente_general" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "clave" VARCHAR(100) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "titulo_personalizado" VARCHAR(255),
    "orden" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_vista_cliente_general_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "configuracion_vista_cliente_beck" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cliente_beck_id" UUID NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "titulo_personalizado" VARCHAR(255),
    "orden" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_vista_cliente_beck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS "configuracion_vista_cliente_general_clave_key" ON "configuracion_vista_cliente_general"("clave");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "configuracion_vista_cliente_beck_cliente_beck_id_idx" ON "configuracion_vista_cliente_beck"("cliente_beck_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "configuracion_vista_cliente_beck_clave_idx" ON "configuracion_vista_cliente_beck"("clave");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "configuracion_vista_cliente_beck_cliente_beck_id_clave_key" ON "configuracion_vista_cliente_beck"("cliente_beck_id", "clave");

-- AddForeignKey (solo si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'configuracion_vista_cliente_beck_cliente_beck_id_fkey'
  ) THEN
    ALTER TABLE "configuracion_vista_cliente_beck"
      ADD CONSTRAINT "configuracion_vista_cliente_beck_cliente_beck_id_fkey"
      FOREIGN KEY ("cliente_beck_id") REFERENCES "clientes_beck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
