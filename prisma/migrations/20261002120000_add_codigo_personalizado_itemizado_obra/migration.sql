-- Código propio de un ítem dentro de una obra (p. ej. itemizado antiguo de un contrato).
-- Nullable y sin valor por defecto: Postgres lo agrega sin reescribir filas y todas
-- las configuraciones existentes quedan en NULL, es decir, siguen usando el código
-- del catálogo global. Ninguna obra cambia de comportamiento hasta que se cargue uno.
ALTER TABLE "configuracion_itemizado_opcion_obra"
  ADD COLUMN "codigo_personalizado" VARCHAR(100);

-- Reversión: ALTER TABLE "configuracion_itemizado_opcion_obra" DROP COLUMN "codigo_personalizado";
