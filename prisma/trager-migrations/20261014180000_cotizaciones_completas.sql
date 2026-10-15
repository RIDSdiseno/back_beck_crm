-- Paridad de Trager con Firemat en Productos, Cotizaciones y Funnel.
-- Misma estructura que Firemat. Solo agrega columnas y claves foráneas: no modifica datos.
BEGIN;

-- Productos: precio para instaladores.
ALTER TABLE "Producto" ADD COLUMN IF NOT EXISTS "precioInstalador" DOUBLE PRECISION;

-- Cotizaciones: versiones, moneda, IVA opcional, cliente/contacto vinculados y seguimiento.
ALTER TABLE "CotizacionTrager"
  ADD COLUMN IF NOT EXISTS "clienteTragerId" INTEGER,
  ADD COLUMN IF NOT EXISTS "contactoTragerId" INTEGER,
  ADD COLUMN IF NOT EXISTS "telefono" TEXT,
  ADD COLUMN IF NOT EXISTS "correo" TEXT,
  ADD COLUMN IF NOT EXISTS "cargo" TEXT,
  ADD COLUMN IF NOT EXISTS "moneda" TEXT NOT NULL DEFAULT 'CLP',
  ADD COLUMN IF NOT EXISTS "aplicaImpuesto" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "probabilidadCierre" INTEGER,
  ADD COLUMN IF NOT EXISTS "comentariosCliente" TEXT,
  ADD COLUMN IF NOT EXISTS "objeciones" TEXT,
  ADD COLUMN IF NOT EXISTS "motivoPerdida" TEXT,
  ADD COLUMN IF NOT EXISTS "motivoPostergacion" TEXT,
  ADD COLUMN IF NOT EXISTS "fechaReactivacion" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "esActual" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "cotizacionBaseId" INTEGER;

-- Detalle de cotización: % de ganancia por línea (visible solo para administradores).
ALTER TABLE "CotizacionTragerDetalle" ADD COLUMN IF NOT EXISTS "gananciaPct" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Claves foráneas (las columnas del funnel ya existían, sin clave).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CotizacionTrager_clienteTragerId_fkey') THEN
    ALTER TABLE "CotizacionTrager" ADD CONSTRAINT "CotizacionTrager_clienteTragerId_fkey"
      FOREIGN KEY ("clienteTragerId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CotizacionTrager_contactoTragerId_fkey') THEN
    ALTER TABLE "CotizacionTrager" ADD CONSTRAINT "CotizacionTrager_contactoTragerId_fkey"
      FOREIGN KEY ("contactoTragerId") REFERENCES contactos_cliente_trager("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FunnelTragerOpportunity_productoId_fkey') THEN
    ALTER TABLE "FunnelTragerOpportunity" ADD CONSTRAINT "FunnelTragerOpportunity_productoId_fkey"
      FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FunnelTragerOpportunity_cotizacionId_fkey') THEN
    ALTER TABLE "FunnelTragerOpportunity" ADD CONSTRAINT "FunnelTragerOpportunity_cotizacionId_fkey"
      FOREIGN KEY ("cotizacionId") REFERENCES "CotizacionTrager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;

-- Reversión:
-- ALTER TABLE "FunnelTragerOpportunity" DROP CONSTRAINT "FunnelTragerOpportunity_cotizacionId_fkey",
--   DROP CONSTRAINT "FunnelTragerOpportunity_productoId_fkey";
-- ALTER TABLE "CotizacionTrager" DROP CONSTRAINT "CotizacionTrager_contactoTragerId_fkey",
--   DROP CONSTRAINT "CotizacionTrager_clienteTragerId_fkey";
-- ALTER TABLE "CotizacionTragerDetalle" DROP COLUMN "gananciaPct";
-- ALTER TABLE "CotizacionTrager" DROP COLUMN "clienteTragerId", DROP COLUMN "contactoTragerId", DROP COLUMN "telefono",
--   DROP COLUMN "correo", DROP COLUMN "cargo", DROP COLUMN "moneda", DROP COLUMN "aplicaImpuesto",
--   DROP COLUMN "probabilidadCierre", DROP COLUMN "comentariosCliente", DROP COLUMN "objeciones",
--   DROP COLUMN "motivoPerdida", DROP COLUMN "motivoPostergacion", DROP COLUMN "fechaReactivacion",
--   DROP COLUMN "version", DROP COLUMN "esActual", DROP COLUMN "cotizacionBaseId";
-- ALTER TABLE "Producto" DROP COLUMN "precioInstalador";
