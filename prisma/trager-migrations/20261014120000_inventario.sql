-- Inventario de Trager: entradas/salidas por producto y kardex de movimientos.
-- Misma estructura que Firemat. Solo agrega columnas y una tabla nueva: no modifica datos.
BEGIN;

ALTER TABLE "Producto"
  ADD COLUMN IF NOT EXISTS "entradas" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "salidas" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "fechaUltimaEntrada" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "fechaUltimaSalida" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "Movimiento" (
  "id" SERIAL NOT NULL,
  "tipo" TEXT NOT NULL,
  "cantidad" INTEGER NOT NULL,
  "stockAnterior" INTEGER NOT NULL,
  "stockNuevo" INTEGER NOT NULL,
  "motivo" TEXT,
  "documento" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "productoId" INTEGER NOT NULL,
  "userId" INTEGER,
  CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Movimiento_productoId_fkey" FOREIGN KEY ("productoId")
    REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Movimiento_productoId_idx" ON "Movimiento"("productoId");
CREATE INDEX IF NOT EXISTS "Movimiento_createdAt_idx" ON "Movimiento"("createdAt");

COMMIT;

-- Reversión:
-- DROP TABLE "Movimiento";
-- ALTER TABLE "Producto" DROP COLUMN "entradas", DROP COLUMN "salidas",
--   DROP COLUMN "fechaUltimaEntrada", DROP COLUMN "fechaUltimaSalida";
