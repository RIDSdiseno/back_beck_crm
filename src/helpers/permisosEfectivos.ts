import { resolverPermisos } from './resolverPermisos';
import { RolUsuario } from '../types';
import { prisma } from '../config/prisma';
import { PERMISOS_POR_ROL, PermisoBase } from './permisosPorRol';

/**
 * Prioridad de permisos efectivos para un usuario:
 *  1. PermisoUsuarioModulo (override individual) — máxima prioridad
 *  2. PermisoRolModulo (configuración del rol) — prioridad media
 *  3. PERMISOS_POR_ROL[rol] (defaults en código) — fallback
 *
 * La resolución es por módulo: cada módulo sigue su propio nivel de prioridad.
 */
export async function getPermisosEfectivos(
  userId: string,
  userRole: RolUsuario,
): Promise<PermisoBase[]> {
  const codeDefaults = PERMISOS_POR_ROL[userRole] ?? [];

  const userPermisos = await prisma.permisoUsuarioModulo.findMany({
    where: { usuarioId: userId },
    select: { modulo: true, puedeVer: true, puedeEditar: true },
  });
  const rolPermisos = await prisma.permisoRolModulo.findMany({
    where: { rol: userRole as any },
    select: { modulo: true, puedeVer: true, puedeEditar: true },
  });

  return resolverPermisos(codeDefaults, rolPermisos, userPermisos);
}
