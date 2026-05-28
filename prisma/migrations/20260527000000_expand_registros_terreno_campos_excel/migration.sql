-- Campos requeridos por la nueva plantilla de registros.
-- Se conservan las columnas historicas usadas por las aplicaciones actuales.
ALTER TABLE "registros_terreno"
  ADD COLUMN IF NOT EXISTS "itemizado_beck" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "itemizado_mandante" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "foto_url" TEXT,
  ADD COLUMN IF NOT EXISTS "recinto" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "factor_por_holguras" DECIMAL(6, 2),
  ADD COLUMN IF NOT EXISTS "cielo_modular" INTEGER,
  ADD COLUMN IF NOT EXISTS "cantidad_sellos_con_factores" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "aislacion" DECIMAL(6, 2),
  ADD COLUMN IF NOT EXISTS "cantidad_sellos_aislacion" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "reparacion_tabique" DECIMAL(6, 2),
  ADD COLUMN IF NOT EXISTS "cantidad_final" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "folio" VARCHAR(100);

-- Copiar equivalencias existentes sin sobreescribir datos ya cargados.
UPDATE "registros_terreno"
SET
  "itemizado_beck" = COALESCE("itemizado_beck", "descripcion_material"),
  "itemizado_mandante" = COALESCE("itemizado_mandante", "itemizado_sacyr"),
  "recinto" = COALESCE("recinto", "modulo"),
  "factor_por_holguras" = COALESCE(
    "factor_por_holguras",
    CASE
      WHEN "holgura" IN (1.2, 1.4, 1.8) THEN "holgura"
      ELSE 1
    END
  ),
  "cielo_modular" = COALESCE("cielo_modular", "accesibilidad"),
  "folio" = COALESCE("folio", "numero_sello");

UPDATE "registros_terreno"
SET
  "cantidad_sellos_con_factores" = COALESCE(
    "cantidad_sellos_con_factores",
    "cantidad_sellos" * "factor_por_holguras"
  ),
  "cantidad_final" = COALESCE(
    "cantidad_final",
    "cantidad_sellos" * "factor_por_holguras"
  );

UPDATE "registros_terreno" AS rt
SET "foto_url" = COALESCE(
  NULLIF(rt."fotos_urls"[1], ''),
  (
    SELECT f."url"
    FROM "fotos_registro" AS f
    WHERE f."registro_id" = rt."id"
    ORDER BY f."created_at" ASC
    LIMIT 1
  )
)
WHERE rt."foto_url" IS NULL;

COMMENT ON COLUMN "registros_terreno"."itemizado_beck" IS
  'Nombre nuevo para el valor historicamente almacenado en descripcion_material.';
COMMENT ON COLUMN "registros_terreno"."itemizado_mandante" IS
  'Nombre nuevo para el valor historicamente almacenado en itemizado_sacyr.';
