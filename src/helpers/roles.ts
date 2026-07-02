import { RolUsuario } from '@prisma/client';

export type Empresa = 'beck' | 'firemat';

export const ROLES_BECK: RolUsuario[] = [
  RolUsuario.administrador,
  RolUsuario.vendedor,
  RolUsuario.terreno,
  RolUsuario.ingenieria,
  RolUsuario.jefeobra,
  RolUsuario.visualizador,
  RolUsuario.cliente,
];

// Roles que NUNCA deben poder figurar como Vendedor/responsable comercial del Funnel Beck:
// clientes, roles de solo lectura, roles operativos y roles Firemat.
export const ROLES_EXCLUIDOS_COMERCIALES_BECK: RolUsuario[] = [
  RolUsuario.cliente,
  RolUsuario.visualizador,
  RolUsuario.terreno,
  RolUsuario.jefeobra,
  RolUsuario.vendedor_firemat,
  RolUsuario.bodeguero,
  RolUsuario.visualizador_firemat,
];

// Roles Beck habilitados para figurar como Vendedor/responsable comercial del Funnel Beck:
// cualquier rol que no esté explícitamente excluido arriba (hoy: administrador, vendedor, ingenieria).
export const ROLES_COMERCIALES_BECK: RolUsuario[] = Object.values(RolUsuario).filter(
  (rol) => !ROLES_EXCLUIDOS_COMERCIALES_BECK.includes(rol),
);

export const ROLES_FIREMAT: RolUsuario[] = [
  RolUsuario.administrador,
  RolUsuario.vendedor_firemat,
  RolUsuario.bodeguero,
  RolUsuario.visualizador_firemat,
];

// Roles que se pueden crear por contexto — administrador NO creble desde Firemat
export const ROLES_CREABLES_BECK: RolUsuario[] = [
  RolUsuario.administrador,
  RolUsuario.vendedor,
  RolUsuario.terreno,
  RolUsuario.ingenieria,
  RolUsuario.jefeobra,
  RolUsuario.visualizador,
  RolUsuario.cliente,
];

export const ROLES_CREABLES_FIREMAT: RolUsuario[] = [
  RolUsuario.vendedor_firemat,
  RolUsuario.bodeguero,
  RolUsuario.visualizador_firemat,
];

export function getRolesByEmpresa(empresa: Empresa): RolUsuario[] {
  return empresa === 'beck' ? ROLES_BECK : ROLES_FIREMAT;
}

export function getRolesCreablesByEmpresa(empresa: Empresa): RolUsuario[] {
  return empresa === 'beck' ? ROLES_CREABLES_BECK : ROLES_CREABLES_FIREMAT;
}

export function esRolDeEmpresa(rol: RolUsuario, empresa: Empresa): boolean {
  return getRolesByEmpresa(empresa).includes(rol);
}

export function esRolCreableEnEmpresa(rol: RolUsuario, empresa: Empresa): boolean {
  return getRolesCreablesByEmpresa(empresa).includes(rol);
}
