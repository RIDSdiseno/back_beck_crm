-- Aplicar únicamente en la base de Trager (TRAGGER_DATABASE_URL).
-- Migración aditiva: conserva IDs y los tres campos originales de contacto.
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';
ALTER TABLE "Cliente"
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  ADD COLUMN IF NOT EXISTS direccion TEXT,
  ADD COLUMN IF NOT EXISTS razon_social TEXT,
  ADD COLUMN IF NOT EXISTS nombre_empresa TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS comuna TEXT,
  ADD COLUMN IF NOT EXISTS "tipoCliente" TEXT,
  ADD COLUMN IF NOT EXISTS canal_venta TEXT,
  ADD COLUMN IF NOT EXISTS observaciones TEXT;

CREATE TABLE IF NOT EXISTS contactos_cliente_trager (
  id SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL REFERENCES "Cliente"(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cargo TEXT,
  telefono TEXT,
  correo TEXT,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  observaciones TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS contactos_cliente_trager_clienteId_idx ON contactos_cliente_trager ("clienteId");
CREATE INDEX IF NOT EXISTS contactos_cliente_trager_correo_idx ON contactos_cliente_trager (correo);
-- Un solo contacto principal activo por cliente, incluso ante solicitudes simultáneas.
CREATE UNIQUE INDEX IF NOT EXISTS contactos_cliente_trager_principal_activo_idx
  ON contactos_cliente_trager ("clienteId") WHERE principal AND activo;

INSERT INTO contactos_cliente_trager
  ("clienteId", nombre, telefono, correo, principal, activo, observaciones, "createdAt", "updatedAt")
SELECT c.id, COALESCE(NULLIF(BTRIM(c."contactoNombre"), ''), 'Contacto anterior'),
  c."contactoTelefono", c."contactoCorreo", TRUE, TRUE,
  'Contacto conservado desde la estructura anterior de Trager.', c."createdAt", c."updatedAt"
FROM "Cliente" c
WHERE (NULLIF(BTRIM(c."contactoNombre"), '') IS NOT NULL
  OR NULLIF(BTRIM(c."contactoTelefono"), '') IS NOT NULL
  OR NULLIF(BTRIM(c."contactoCorreo"), '') IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM contactos_cliente_trager t WHERE t."clienteId" = c.id);
COMMIT;
