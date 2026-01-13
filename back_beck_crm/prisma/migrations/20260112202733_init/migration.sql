-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('administrador', 'terreno', 'ingenieria', 'visualizador');

-- CreateEnum
CREATE TYPE "EstadoObra" AS ENUM ('activa', 'pausada', 'finalizada');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('nuevo_registro', 'registro_procesado', 'alerta_inventario', 'sistema');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ingreso', 'egreso');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('borrador', 'enviada', 'aprobada', 'rechazada');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoObra" NOT NULL DEFAULT 'activa',
    "creado_por_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemizados" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio_unitario" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "creado_por_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itemizados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_terreno" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "obra_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "dia_semana" VARCHAR(20) NOT NULL,
    "descripcion_material" VARCHAR(500) NOT NULL,
    "modulo" VARCHAR(100) NOT NULL,
    "piso" VARCHAR(50) NOT NULL,
    "eje_numerico" INTEGER NOT NULL,
    "eje_alfabetico" VARCHAR(10) NOT NULL,
    "numero_sello" VARCHAR(100) NOT NULL,
    "cantidad_sellos" INTEGER NOT NULL,
    "nombre_sellador" VARCHAR(255) NOT NULL,
    "holgura" DECIMAL(3,1) NOT NULL,
    "accesibilidad" INTEGER NOT NULL,
    "observaciones" TEXT,
    "fotos_urls" TEXT[],
    "procesado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_terreno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procesamiento_ingenieria" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "registro_terreno_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "itemizado_id" UUID NOT NULL,
    "total_sellos_calculado" DECIMAL(12,2) NOT NULL,
    "notas" TEXT,
    "procesado_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procesamiento_ingenieria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "referencia_id" UUID,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo_producto" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "ubicacion" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "producto_id" UUID NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "usuario_id" UUID NOT NULL,
    "codigo_escaneado" VARCHAR(255),
    "observaciones" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "numero" VARCHAR(50) NOT NULL,
    "cliente" VARCHAR(255) NOT NULL,
    "obra_id" UUID,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'borrador',
    "creado_por_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "obras_codigo_key" ON "obras"("codigo");

-- CreateIndex
CREATE INDEX "obras_codigo_idx" ON "obras"("codigo");

-- CreateIndex
CREATE INDEX "obras_estado_idx" ON "obras"("estado");

-- CreateIndex
CREATE INDEX "obras_creado_por_id_idx" ON "obras"("creado_por_id");

-- CreateIndex
CREATE UNIQUE INDEX "itemizados_codigo_key" ON "itemizados"("codigo");

-- CreateIndex
CREATE INDEX "itemizados_codigo_idx" ON "itemizados"("codigo");

-- CreateIndex
CREATE INDEX "itemizados_creado_por_id_idx" ON "itemizados"("creado_por_id");

-- CreateIndex
CREATE INDEX "registros_terreno_obra_id_idx" ON "registros_terreno"("obra_id");

-- CreateIndex
CREATE INDEX "registros_terreno_usuario_id_idx" ON "registros_terreno"("usuario_id");

-- CreateIndex
CREATE INDEX "registros_terreno_fecha_idx" ON "registros_terreno"("fecha" DESC);

-- CreateIndex
CREATE INDEX "registros_terreno_procesado_idx" ON "registros_terreno"("procesado");

-- CreateIndex
CREATE UNIQUE INDEX "procesamiento_ingenieria_registro_terreno_id_key" ON "procesamiento_ingenieria"("registro_terreno_id");

-- CreateIndex
CREATE INDEX "procesamiento_ingenieria_registro_terreno_id_idx" ON "procesamiento_ingenieria"("registro_terreno_id");

-- CreateIndex
CREATE INDEX "procesamiento_ingenieria_usuario_id_idx" ON "procesamiento_ingenieria"("usuario_id");

-- CreateIndex
CREATE INDEX "procesamiento_ingenieria_itemizado_id_idx" ON "procesamiento_ingenieria"("itemizado_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_idx" ON "notificaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "notificaciones_leido_idx" ON "notificaciones"("leido");

-- CreateIndex
CREATE INDEX "notificaciones_created_at_idx" ON "notificaciones"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "inventario_codigo_producto_key" ON "inventario"("codigo_producto");

-- CreateIndex
CREATE INDEX "inventario_codigo_producto_idx" ON "inventario"("codigo_producto");

-- CreateIndex
CREATE INDEX "inventario_stock_actual_idx" ON "inventario"("stock_actual");

-- CreateIndex
CREATE INDEX "movimientos_inventario_producto_id_idx" ON "movimientos_inventario"("producto_id");

-- CreateIndex
CREATE INDEX "movimientos_inventario_usuario_id_idx" ON "movimientos_inventario"("usuario_id");

-- CreateIndex
CREATE INDEX "movimientos_inventario_created_at_idx" ON "movimientos_inventario"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "cotizaciones_numero_key" ON "cotizaciones"("numero");

-- CreateIndex
CREATE INDEX "cotizaciones_numero_idx" ON "cotizaciones"("numero");

-- CreateIndex
CREATE INDEX "cotizaciones_cliente_idx" ON "cotizaciones"("cliente");

-- CreateIndex
CREATE INDEX "cotizaciones_estado_idx" ON "cotizaciones"("estado");

-- CreateIndex
CREATE INDEX "cotizaciones_creado_por_id_idx" ON "cotizaciones"("creado_por_id");

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemizados" ADD CONSTRAINT "itemizados_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_terreno" ADD CONSTRAINT "registros_terreno_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_terreno" ADD CONSTRAINT "registros_terreno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesamiento_ingenieria" ADD CONSTRAINT "procesamiento_ingenieria_registro_terreno_id_fkey" FOREIGN KEY ("registro_terreno_id") REFERENCES "registros_terreno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesamiento_ingenieria" ADD CONSTRAINT "procesamiento_ingenieria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesamiento_ingenieria" ADD CONSTRAINT "procesamiento_ingenieria_itemizado_id_fkey" FOREIGN KEY ("itemizado_id") REFERENCES "itemizados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "inventario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
