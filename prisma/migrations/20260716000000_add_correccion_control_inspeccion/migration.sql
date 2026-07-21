-- Soporte para que el Supervisor (rol jefeobra) corrija un control de
-- inspeccion marcado "no_conforme": texto de correccion por parametro,
-- marca de envio en el control, y fotos de evidencia opcionales por
-- parametro.

-- AlterTable: correccion por parametro
ALTER TABLE "controles_inspeccion_parametros"
  ADD COLUMN "correccion_observacion" TEXT,
  ADD COLUMN "corregido_at" TIMESTAMP(6),
  ADD COLUMN "corregido_por_id" UUID;

ALTER TABLE "controles_inspeccion_parametros"
  ADD CONSTRAINT "fk_controles_inspeccion_parametros_corregido_por"
    FOREIGN KEY ("corregido_por_id") REFERENCES "usuarios"("id");

-- AlterTable: marca de envio de correccion en el control
ALTER TABLE "controles_inspeccion"
  ADD COLUMN "correccion_enviada_at" TIMESTAMP(6),
  ADD COLUMN "correccion_enviada_por_id" UUID;

ALTER TABLE "controles_inspeccion"
  ADD CONSTRAINT "fk_controles_inspeccion_correccion_enviada_por"
    FOREIGN KEY ("correccion_enviada_por_id") REFERENCES "usuarios"("id");

-- CreateTable
CREATE TABLE "fotos_correccion_parametro" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "parametro_id" UUID NOT NULL,
  "url" TEXT NOT NULL,
  "public_id" VARCHAR(255) NOT NULL,
  "nombre_archivo" VARCHAR(255),
  "formato" VARCHAR(50),
  "bytes" INTEGER,
  "subido_por_id" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fotos_correccion_parametro_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "fotos_correccion_parametro"
  ADD CONSTRAINT "fk_fotos_correccion_parametro_parametro"
    FOREIGN KEY ("parametro_id") REFERENCES "controles_inspeccion_parametros"("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_fotos_correccion_parametro_usuario"
    FOREIGN KEY ("subido_por_id") REFERENCES "usuarios"("id");

CREATE INDEX "idx_fotos_correccion_parametro_parametro_id" ON "fotos_correccion_parametro"("parametro_id");
CREATE INDEX "idx_fotos_correccion_parametro_subido_por_id" ON "fotos_correccion_parametro"("subido_por_id");
