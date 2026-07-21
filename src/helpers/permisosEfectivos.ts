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

  const userMap = new Map(userPermisos.map((p) => [p.modulo, p]));
  const rolMap = new Map(rolPermisos.map((p) => [p.modulo, p]));

  return codeDefaults.map((d) => {
    const u = userMap.get(d.modulo);
    if (u) return { modulo: d.modulo, puedeVer: u.puedeVer, puedeEditar: u.puedeEditar };

    const r = rolMap.get(d.modulo);
    if (r) return { modulo: d.modulo, puedeVer: r.puedeVer, puedeEditar: r.puedeEditar };

    return d;
  });
}
