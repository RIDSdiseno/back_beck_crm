-- Ciclo de recepción y devolución del inventario móvil BECK.
ALTER TABLE "asignaciones_inventario_beck"
  ADD COLUMN "asignacion_origen_id" UUID,
  ADD COLUMN "recepcion_confirmada_at" TIMESTAMP(6),
  ADD COLUMN "recepcion_confirmada_por_id" UUID,
  ADD COLUMN "devolucion_solicitada_at" TIMESTAMP(6),
  ADD COLUMN "devolucion_solicitada_por_id" UUID,
  ADD COLUMN "devolucion_motivo" TEXT,
  ADD COLUMN "devolucion_recibida_at" TIMESTAMP(6),
  ADD COLUMN "devolucion_recibida_por_id" UUID;

ALTER TABLE "asignaciones_inventario_beck"
  ADD CONSTRAINT "asignaciones_inventario_beck_cantidad_positiva_check"
    CHECK ("cantidad" > 0),
  ADD CONSTRAINT "asignaciones_inventario_beck_item_unico_check"
    CHECK (num_nonnulls("epp_id", "implemento_id", "herramienta_id") = 1),
  ADD CONSTRAINT "asignaciones_inventario_beck_recepcion_par_check"
    CHECK (("recepcion_confirmada_at" IS NULL) = ("recepcion_confirmada_por_id" IS NULL)),
  ADD CONSTRAINT "asignaciones_inventario_beck_devolucion_solicitada_par_check"
    CHECK (("devolucion_solicitada_at" IS NULL) = ("devolucion_solicitada_por_id" IS NULL)),
  ADD CONSTRAINT "asignaciones_inventario_beck_devolucion_recibida_par_check"
    CHECK (("devolucion_recibida_at" IS NULL) = ("devolucion_recibida_por_id" IS NULL));

CREATE INDEX "asignaciones_inventario_beck_asignacion_origen_id_idx"
  ON "asignaciones_inventario_beck"("asignacion_origen_id");
CREATE INDEX "asignaciones_inventario_beck_devolucion_solicitada_at_idx"
  ON "asignaciones_inventario_beck"("devolucion_solicitada_at");

ALTER TABLE "asignaciones_inventario_beck"
  ADD CONSTRAINT "asignaciones_inventario_beck_asignacion_origen_id_fkey"
    FOREIGN KEY ("asignacion_origen_id") REFERENCES "asignaciones_inventario_beck"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "asignaciones_inventario_beck_recepcion_confirmada_por_id_fkey"
    FOREIGN KEY ("recepcion_confirmada_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "asignaciones_inventario_beck_devolucion_solicitada_por_id_fkey"
    FOREIGN KEY ("devolucion_solicitada_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "asignaciones_inventario_beck_devolucion_recibida_por_id_fkey"
    FOREIGN KEY ("devolucion_recibida_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "trazabilidad_inventario_beck" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "asignacion_id" UUID NOT NULL,
  "obra_id" UUID NOT NULL,
  "actor_id" UUID NOT NULL,
  "jefe_obra_id" UUID NOT NULL,
  "trabajador_id" UUID,
  "accion" VARCHAR(60) NOT NULL,
  "cantidad" INTEGER NOT NULL,
  "detalle" TEXT,
  "datos" JSONB,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "trazabilidad_inventario_beck_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "trazabilidad_inventario_beck_cantidad_positiva_check" CHECK ("cantidad" > 0)
);

CREATE INDEX "trazabilidad_inventario_beck_asignacion_created_at_idx"
  ON "trazabilidad_inventario_beck"("asignacion_id", "created_at" DESC);
CREATE INDEX "trazabilidad_inventario_beck_obra_created_at_idx"
  ON "trazabilidad_inventario_beck"("obra_id", "created_at" DESC);
CREATE INDEX "trazabilidad_inventario_beck_actor_id_idx"
  ON "trazabilidad_inventario_beck"("actor_id");
CREATE INDEX "trazabilidad_inventario_beck_trabajador_id_idx"
  ON "trazabilidad_inventario_beck"("trabajador_id");

ALTER TABLE "trazabilidad_inventario_beck"
  ADD CONSTRAINT "trazabilidad_inventario_beck_asignacion_id_fkey"
    FOREIGN KEY ("asignacion_id") REFERENCES "asignaciones_inventario_beck"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "trazabilidad_inventario_beck_obra_id_fkey"
    FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "trazabilidad_inventario_beck_actor_id_fkey"
    FOREIGN KEY ("actor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "trazabilidad_inventario_beck_jefe_obra_id_fkey"
    FOREIGN KEY ("jefe_obra_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "trazabilidad_inventario_beck_trabajador_id_fkey"
    FOREIGN KEY ("trabajador_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Reconstrucción mínima de la historia anterior a esta migración. Los eventos cuyo
-- actor exacto no existía en el esquema anterior quedan explícitamente marcados como inferidos.
INSERT INTO "trazabilidad_inventario_beck" (
  "asignacion_id", "obra_id", "actor_id", "jefe_obra_id", "trabajador_id",
  "accion", "cantidad", "detalle", "datos", "created_at"
)
SELECT
  "id", "obra_id", "asignado_por_id", "jefe_obra_id", NULL,
  'ASIGNADO_SUPERVISOR', "cantidad", 'Asignación histórica a supervisor',
  jsonb_build_object('origen', 'migracion', 'inferido', false), "created_at"
FROM "asignaciones_inventario_beck";

INSERT INTO "trazabilidad_inventario_beck" (
  "asignacion_id", "obra_id", "actor_id", "jefe_obra_id", "trabajador_id",
  "accion", "cantidad", "detalle", "datos", "created_at"
)
SELECT
  "id", "obra_id", "jefe_obra_id", "jefe_obra_id", "trabajador_id",
  'ASIGNADO_OPERARIO', "cantidad", 'Entrega histórica a operario',
  jsonb_build_object('origen', 'migracion', 'inferido', true), COALESCE("reasignado_at", "created_at")
FROM "asignaciones_inventario_beck"
WHERE "trabajador_id" IS NOT NULL;

INSERT INTO "trazabilidad_inventario_beck" (
  "asignacion_id", "obra_id", "actor_id", "jefe_obra_id", "trabajador_id",
  "accion", "cantidad", "detalle", "datos", "created_at"
)
SELECT
  "id", "obra_id", COALESCE("devuelto_por_id", "jefe_obra_id"), "jefe_obra_id", "trabajador_id",
  'DEVUELTO_BODEGA', "cantidad", 'Devolución histórica a bodega',
  jsonb_build_object('origen', 'migracion', 'inferido', "devuelto_por_id" IS NULL), COALESCE("devuelto_at", "created_at")
FROM "asignaciones_inventario_beck"
WHERE "estado" = 'devuelto';
