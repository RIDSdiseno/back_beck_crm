-- Elimina la funcionalidad "Validación Obra" (Jefe de Obra/Supervisor).
-- Auditoría confirmó que quedó incompleta: ningún frontend (CRM web ni app
-- móvil) tiene una interfaz que la accione, por lo que el campo quedaba
-- permanentemente en "pendiente" para todo registro creado después de la
-- migración que lo agregó. Revierte exactamente
-- 20260703000000_add_estado_validacion_obra.

-- DropForeignKey
ALTER TABLE "registros_terreno"
  DROP CONSTRAINT IF EXISTS "registros_terreno_validacion_obra_por_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "registros_terreno_estado_validacion_obra_idx";
DROP INDEX IF EXISTS "registros_terreno_validacion_obra_por_id_idx";

-- AlterTable
ALTER TABLE "registros_terreno"
  DROP COLUMN IF EXISTS "estado_validacion_obra",
  DROP COLUMN IF EXISTS "validacion_obra_por_id",
  DROP COLUMN IF EXISTS "validacion_obra_at",
  DROP COLUMN IF EXISTS "motivo_rechazo_obra";

-- DropEnum
DROP TYPE IF EXISTS "EstadoValidacionObra";
