-- Migración: desactivar todos los itemizados existentes y limpiar configuraciones por obra.
--
-- 1. Desactiva todos los registros existentes en itemizado_opciones.
--    Los nuevos registros ya parten con visible = false gracias al @default(false) del schema.
--
-- 2. Elimina todas las configuraciones de itemizado_opcion_obra para que ninguna obra
--    conserve activaciones anteriores.

UPDATE "itemizado_opciones"
SET "visible" = false;

DELETE FROM "configuracion_itemizado_opcion_obra";
