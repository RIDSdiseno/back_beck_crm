CREATE TABLE "inventario_beck_epp" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "sku" VARCHAR(100),
  "item" VARCHAR(255) NOT NULL,
  "modelo_marca" VARCHAR(255),
  "unidad_medida" VARCHAR(100),
  "talla" VARCHAR(100),
  "color" VARCHAR(100),
  "stock_inicial" INTEGER NOT NULL DEFAULT 0,
  "entrada" INTEGER NOT NULL DEFAULT 0,
  "salida" INTEGER NOT NULL DEFAULT 0,
  "saldo" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inventario_beck_epp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventario_beck_implementos" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "sku" VARCHAR(100),
  "item" VARCHAR(255) NOT NULL,
  "modelo_marca" VARCHAR(255),
  "cantidad" INTEGER NOT NULL DEFAULT 0,
  "unidad_medida" VARCHAR(100),
  "talla_medida" VARCHAR(100),
  "color" VARCHAR(100),
  "ubicacion" VARCHAR(255),
  "fecha" DATE,
  "salida" INTEGER NOT NULL DEFAULT 0,
  "saldo" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inventario_beck_implementos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventario_beck_herramientas" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "nombre" VARCHAR(255) NOT NULL,
  "marca" VARCHAR(150),
  "modelo" VARCHAR(150),
  "categoria" VARCHAR(150),
  "sku" VARCHAR(100),
  "ubicacion" VARCHAR(255),
  "fecha" DATE,
  "encargado" VARCHAR(255),
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inventario_beck_herramientas_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inventario_beck_epp_sku_idx" ON "inventario_beck_epp"("sku");
CREATE INDEX "inventario_beck_epp_item_idx" ON "inventario_beck_epp"("item");
CREATE INDEX "inventario_beck_epp_modelo_marca_idx" ON "inventario_beck_epp"("modelo_marca");
CREATE INDEX "inventario_beck_epp_talla_idx" ON "inventario_beck_epp"("talla");
CREATE INDEX "inventario_beck_epp_color_idx" ON "inventario_beck_epp"("color");
CREATE INDEX "inventario_beck_epp_activo_idx" ON "inventario_beck_epp"("activo");

CREATE INDEX "inventario_beck_implementos_sku_idx" ON "inventario_beck_implementos"("sku");
CREATE INDEX "inventario_beck_implementos_item_idx" ON "inventario_beck_implementos"("item");
CREATE INDEX "inventario_beck_implementos_modelo_marca_idx" ON "inventario_beck_implementos"("modelo_marca");
CREATE INDEX "inventario_beck_implementos_talla_medida_idx" ON "inventario_beck_implementos"("talla_medida");
CREATE INDEX "inventario_beck_implementos_color_idx" ON "inventario_beck_implementos"("color");
CREATE INDEX "inventario_beck_implementos_ubicacion_idx" ON "inventario_beck_implementos"("ubicacion");
CREATE INDEX "inventario_beck_implementos_activo_idx" ON "inventario_beck_implementos"("activo");

CREATE INDEX "inventario_beck_herramientas_sku_idx" ON "inventario_beck_herramientas"("sku");
CREATE INDEX "inventario_beck_herramientas_nombre_idx" ON "inventario_beck_herramientas"("nombre");
CREATE INDEX "inventario_beck_herramientas_marca_idx" ON "inventario_beck_herramientas"("marca");
CREATE INDEX "inventario_beck_herramientas_modelo_idx" ON "inventario_beck_herramientas"("modelo");
CREATE INDEX "inventario_beck_herramientas_categoria_idx" ON "inventario_beck_herramientas"("categoria");
CREATE INDEX "inventario_beck_herramientas_ubicacion_idx" ON "inventario_beck_herramientas"("ubicacion");
CREATE INDEX "inventario_beck_herramientas_encargado_idx" ON "inventario_beck_herramientas"("encargado");
CREATE INDEX "inventario_beck_herramientas_activo_idx" ON "inventario_beck_herramientas"("activo");
