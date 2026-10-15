-- Roles propios de Trager, equivalentes a los de Firemat.
-- Solo agrega valores al tipo: ningún usuario existente cambia de rol.
-- La app Expo no los admite (su backend rechaza en el login los roles que no son de Beck o Firemat).
ALTER TYPE "RolUsuario" ADD VALUE IF NOT EXISTS 'vendedor_trager';
ALTER TYPE "RolUsuario" ADD VALUE IF NOT EXISTS 'bodeguero_trager';
ALTER TYPE "RolUsuario" ADD VALUE IF NOT EXISTS 'visualizador_trager';
