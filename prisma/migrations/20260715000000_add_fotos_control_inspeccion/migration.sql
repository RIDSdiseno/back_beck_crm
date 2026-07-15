-- Agrega soporte para adjuntar entre 1 y 5 fotografias a un control de
-- inspeccion (modulo Ingenieria), replicando el patron de "fotos_registro".

-- CreateTable
CREATE TABLE "fotos_control_inspeccion" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "control_inspeccion_id" UUID NOT NULL,
  "url" TEXT NOT NULL,
  "public_id" VARCHAR(255) NOT NULL,
  "nombre_archivo" VARCHAR(255),
  "formato" VARCHAR(50),
  "bytes" INTEGER,
  "subido_por_id" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fotos_control_inspeccion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fotos_control_inspeccion"
  ADD CONSTRAINT "fk_fotos_control_inspeccion_control"
    FOREIGN KEY ("control_inspeccion_id") REFERENCES "controles_inspeccion"("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_fotos_control_inspeccion_usuario"
    FOREIGN KEY ("subido_por_id") REFERENCES "usuarios"("id");

-- CreateIndex
CREATE INDEX "idx_fotos_control_inspeccion_control_id" ON "fotos_control_inspeccion"("control_inspeccion_id");
CREATE INDEX "idx_fotos_control_inspeccion_subido_por_id" ON "fotos_control_inspeccion"("subido_por_id");
