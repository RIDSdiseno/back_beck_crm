-- Ventas de Trager: misma estructura que Firemat (Venta y su detalle).
-- Solo crea tablas nuevas: no modifica datos.
BEGIN;

CREATE TABLE IF NOT EXISTS "Venta" (
  "id" SERIAL NOT NULL,
  "productoId" INTEGER NOT NULL,
  "cliente" TEXT NOT NULL,
  "contacto" TEXT,
  "cantidad" INTEGER NOT NULL,
  "precio" DOUBLE PRECISION NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'PROSPECTO',
  "responsable" TEXT,
  "fechaCierre" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fechaProximaAccion" TIMESTAMP(3),
  "origen" TEXT,
  "probabilidad" DOUBLE PRECISION,
  "proximaAccion" TEXT,
  CONSTRAINT "Venta_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Venta_productoId_fkey" FOREIGN KEY ("productoId")
    REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Venta_createdAt_idx" ON "Venta"("createdAt");

CREATE TABLE IF NOT EXISTS "VentaDetalle" (
  "id" SERIAL NOT NULL,
  "ventaId" INTEGER NOT NULL,
  "productoId" INTEGER NOT NULL,
  "cantidad" INTEGER NOT NULL,
  "precio" DOUBLE PRECISION NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "VentaDetalle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VentaDetalle_ventaId_fkey" FOREIGN KEY ("ventaId")
    REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "VentaDetalle_productoId_fkey" FOREIGN KEY ("productoId")
    REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "VentaDetalle_ventaId_idx" ON "VentaDetalle"("ventaId");

COMMIT;

-- Reversión:
-- DROP TABLE "VentaDetalle";
-- DROP TABLE "Venta";
