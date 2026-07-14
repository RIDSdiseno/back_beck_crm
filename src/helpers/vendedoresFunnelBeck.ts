import { prisma } from '../config/prisma';
import { getPermisosEfectivos } from './permisosEfectivos';

export type VendedorFunnelBeckElegible = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

/**
 * Usuarios activos con permiso efectivo para EDITAR beck_funnel (override
 * individual > override de rol > default de código, ver getPermisosEfectivos).
 * No filtra por rol fijo. Fuente única de verdad compartida por:
 *  - GET /api/usuarios/vendedores-funnel-beck (usuarios.controller.ts)
 *  - la validación de PATCH /api/funnel-beck/:id/vendedor (funnelBeck.service.ts)
 * para no duplicar esta lógica en dos lugares.
 */
export async function getVendedoresFunnelBeckElegibles(): Promise<VendedorFunnelBeckElegible[]> {
  const usuarios = await prisma.usuario.findMany({
    where: { activo: true },
    select: { id: true, nombre: true, email: true, rol: true },
  });

  const elegibles: typeof usuarios = [];
  for (const usuario of usuarios) {
    const permisos = await getPermisosEfectivos(usuario.id, usuario.rol);
    const puedeEditarFunnel = permisos.some((p) => p.modulo === 'beck_funnel' && p.puedeEditar);
    if (puedeEditarFunnel) elegibles.push(usuario);
  }

  return elegibles
    .filter((usuario) => usuario.nombre?.trim())
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
