-- Estado de avance por obra: contrato total por ítem y tipo de registro, y cierre congelado.

-- Cantidad contratada de cada ítem de la obra, por tipo de registro (Sellos, Juntas,
-- Tabiquería): un mismo código puede tener contratos distintos en cada tipo.
CREATE TABLE "contrato_itemizado_obra" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "obra_id" UUID NOT NULL,
  "itemizado_opcion_id" UUID NOT NULL,
  "tipo_registro" VARCHAR(50) NOT NULL,
  "cantidad_contratada" DECIMAL(14,2) NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contrato_itemizado_obra_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "contrato_itemizado_obra_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "contrato_itemizado_obra_itemizado_opcion_id_fkey" FOREIGN KEY ("itemizado_opcion_id") REFERENCES "itemizado_opciones"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "contrato_itemizado_obra_obra_id_itemizado_opcion_id_tipo_registro_key"
  ON "contrato_itemizado_obra"("obra_id", "itemizado_opcion_id", "tipo_registro");
CREATE INDEX "contrato_itemizado_obra_obra_id_idx" ON "contrato_itemizado_obra"("obra_id");

-- Registros que quedaron incluidos en un estado de avance terminado. Un registro entra
-- en un solo estado de avance: los validados después del cierre pasan al siguiente.
CREATE TABLE "hito_obra_registro" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "hito_id" UUID NOT NULL,
  "registro_id" UUID NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hito_obra_registro_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "hito_obra_registro_hito_id_fkey" FOREIGN KEY ("hito_id") REFERENCES "hitos_obra"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "hito_obra_registro_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "registros_terreno"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "hito_obra_registro_registro_id_key" ON "hito_obra_registro"("registro_id");
CREATE INDEX "hito_obra_registro_hito_id_idx" ON "hito_obra_registro"("hito_id");

-- Líneas del estado de avance tal como quedaron al terminarlo (cantidades, PU, moneda y
-- contrato de ese momento). NULL mientras está abierto: se calcula en vivo.
ALTER TABLE "hitos_obra" ADD COLUMN "cierre" JSONB;

-- Reversión:
-- ALTER TABLE "hitos_obra" DROP COLUMN "cierre";
-- DROP TABLE "hito_obra_registro";
-- DROP TABLE "contrato_itemizado_obra";
