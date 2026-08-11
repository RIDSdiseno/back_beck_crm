-- Elimina la columna huerfana "cielo_modular" en registros_terreno.
-- Fue agregada por 20260527000000_expand_registros_terreno_campos_excel
-- y rellenada una vez via COALESCE(cielo_modular, accesibilidad), pero
-- nunca se mapeo en el schema de Prisma ni se volvio a leer/escribir por
-- ningun controlador: el valor vive unicamente en la columna "accesibilidad".

-- AlterTable
ALTER TABLE "registros_terreno"
  DROP COLUMN IF EXISTS "cielo_modular";
