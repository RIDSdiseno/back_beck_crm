-- AlterTable
ALTER TABLE "asignaciones_inventario_beck"
  ADD COLUMN "trabajador_id" UUID,
  ADD COLUMN "reasignado_at" TIMESTAMP(6);

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_trabajador_id_idx" ON "asignaciones_inventario_beck"("trabajador_id");

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_trabajador_id_fkey" FOREIGN KEY ("trabajador_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
