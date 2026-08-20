ALTER TABLE "registros_terreno"
ADD COLUMN IF NOT EXISTS "dimensiones" VARCHAR(100);

COMMENT ON COLUMN "registros_terreno"."dimensiones" IS
'Detalle dimensional del itemizado ingresado por el operario.';
