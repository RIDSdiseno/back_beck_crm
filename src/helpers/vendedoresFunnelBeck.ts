import { Prisma } from '@prisma/client';
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

export type ReasignacionVendedorAutomaticaResultado = {
  vendedorAnterior: string;
  vendedorNuevo: string;
  motivo: string;
} | null;

/**
 * Reasigna automáticamente el vendedor de una oportunidad del Funnel Beck al
 * usuario que realiza una acción significativa sobre ella (cambio de etapa o
 * guardado de la sección enfocada de la etapa actual), dentro de la MISMA
 * transacción que esa acción principal.
 *
 * Reutiliza el permiso efectivo `beck_funnel.editar` (misma fuente de verdad
 * que getVendedoresFunnelBeckElegibles) en vez de duplicar la validación.
 * Si el usuario no está activo, no tiene el permiso efectivo, o ya es el
 * vendedor actual, no hace nada y devuelve null — nunca lanza, para no
 * hacer fallar la acción principal por esto.
 */
export async function reasignarVendedorAutomaticamente({
  tx,
  oportunidad,
  userId,
  motivo,
}: {
  tx: Prisma.TransactionClient;
  oportunidad: { id: string; nombreProyecto: string; vendedor: string };
  userId: string;
  motivo: string;
}): Promise<ReasignacionVendedorAutomaticaResultado> {
  if (!userId) return null;

  const usuario = await tx.usuario.findUnique({
    where: { id: userId },
    select: { id: true, nombre: true, rol: true, activo: true },
  });
  if (!usuario || !usuario.activo) return null;

  const permisos = await getPermisosEfectivos(usuario.id, usuario.rol);
  const puedeEditarFunnel = permisos.some((p) => p.modulo === 'beck_funnel' && p.puedeEditar);
  if (!puedeEditarFunnel) return null;

  const vendedorNuevo = usuario.nombre?.trim();
  if (!vendedorNuevo) return null;

  const vendedorActual = (oportunidad.vendedor ?? '').trim();
  if (vendedorActual.toLowerCase() === vendedorNuevo.toLowerCase()) return null;

  await tx.operadorBeck.update({
    where: { id: oportunidad.id },
    data: { vendedor: vendedorNuevo },
  });

  await tx.movimientoCRM.create({
    data: {
      usuarioId: userId,
      modulo: 'FUNNEL',
      tipo: 'VENDEDOR_MODIFICADO',
      entidadId: oportunidad.id,
      descripcion: `Se reasignó automáticamente el vendedor de ${oportunidad.nombreProyecto} de "${vendedorActual}" a "${vendedorNuevo}"`,
      datos: {
        vendedorAnterior: vendedorActual || null,
        vendedorNuevo,
        motivo,
        automatico: true,
      },
    },
  });

  return { vendedorAnterior: vendedorActual, vendedorNuevo, motivo };
}
