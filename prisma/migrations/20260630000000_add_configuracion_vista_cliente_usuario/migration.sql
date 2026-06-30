CREATE TABLE "configuracion_vista_cliente_usuario" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "usuario_id" UUID NOT NULL,
  "clave" VARCHAR(100) NOT NULL,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "titulo_personalizado" VARCHAR(255),
  "orden" INTEGER,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "configuracion_vista_cliente_usuario_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "configuracion_vista_cliente_usuario_usuario_id_clave_key"
  ON "configuracion_vista_cliente_usuario"("usuario_id", "clave");

CREATE INDEX "configuracion_vista_cliente_usuario_usuario_id_idx"
  ON "configuracion_vista_cliente_usuario"("usuario_id");

CREATE INDEX "configuracion_vista_cliente_usuario_clave_idx"
  ON "configuracion_vista_cliente_usuario"("clave");

ALTER TABLE "configuracion_vista_cliente_usuario"
  ADD CONSTRAINT "configuracion_vista_cliente_usuario_usuario_id_fkey"
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
