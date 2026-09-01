-- AlterEnum
ALTER TYPE "TipoMovimientoCRM" ADD VALUE 'ASIGNACION_INVENTARIO_DEVUELTA';

-- CreateEnum
CREATE TYPE "EstadoAsignacionInventario" AS ENUM ('asignado', 'devuelto');

-- AlterTable
ALTER TABLE "asignaciones_inventario_beck"
  ADD COLUMN "estado" "EstadoAsignacionInventario" NOT NULL DEFAULT 'asignado',
  ADD COLUMN "devuelto_at" TIMESTAMP(6),
  ADD COLUMN "devuelto_por_id" UUID;

-- CreateIndex
CREATE INDEX "asignaciones_inventario_beck_estado_idx" ON "asignaciones_inventario_beck"("estado");

-- AddForeignKey
ALTER TABLE "asignaciones_inventario_beck" ADD CONSTRAINT "asignaciones_inventario_beck_devuelto_por_id_fkey" FOREIGN KEY ("devuelto_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
