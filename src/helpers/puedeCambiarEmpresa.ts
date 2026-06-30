import { RolUsuario } from '../types';
import { getPermisosEfectivos } from './permisosEfectivos';

export async function puedeCambiarEmpresa(
  userId: string,
  userRole: RolUsuario,
  modulo: 'beck' | 'firemat',
): Promise<boolean> {
  if (userRole === 'administrador') return true;

  const moduloPermiso = modulo === 'beck' ? 'beck_cambiar_empresa' : 'firemat_cambiar_empresa';
  const permisos = await getPermisosEfectivos(userId, userRole);
  const permiso = permisos.find((p) => p.modulo === moduloPermiso);
  return !!(permiso && (permiso.puedeVer || permiso.puedeEditar));
}
