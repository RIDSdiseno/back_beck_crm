-- AlterEnum
ALTER TYPE "ModuloMovimientoCRM" ADD VALUE 'INVENTARIO';

-- AlterEnum
ALTER TYPE "TipoMovimientoCRM" ADD VALUE 'ASIGNACION_INVENTARIO_CREADA';

-- CreateEnum
CREATE TYPE "TipoInventarioBeck" AS ENUM ('epp', 'implemento', 'herramienta');

-- CreateTable
CREATE TABLE "asignaciones_inventario_beck" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "obra_id" UUID NOT NULL,
    "jefe_obra_id" UUID NOT NULL,
    "asignado_por_id" UUID NOT NULL,
    "tipo_item" "TipoInventarioBeck" NOT NULL,
    "epp_id" UUID,
    "implemento_id" UUID,
    "herramienta_id" UUID,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "observacion" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignaciones_inventario_beck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_obra_id_idx" ON "asignaciones_inventario_beck"("obra_id");

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_jefe_obra_id_idx" ON "asignaciones_inventario_beck"("jefe_obra_id");

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_tipo_item_idx" ON "asignaciones_inventario_beck"("tipo_item");

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_created_at_idx" ON "asignaciones_inventario_beck"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_jefe_obra_id_fkey" FOREIGN KEY ("jefe_obra_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_asignado_por_id_fkey" FOREIGN KEY ("asignado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_epp_id_fkey" FOREIGN KEY ("epp_id") REFERENCES "inventario_beck_epp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_implemento_id_fkey" FOREIGN KEY ("implemento_id") REFERENCES "inventario_beck_implementos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_herramienta_id_fkey" FOREIGN KEY ("herramienta_id") REFERENCES "inventario_beck_herramientas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
