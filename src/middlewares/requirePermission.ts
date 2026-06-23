import { Request, Response, NextFunction } from 'express';
import { getPermisosEfectivos } from '../helpers/permisosEfectivos';

/**
 * Middleware configurable por módulo y acción.
 *
 * Uso:
 *   requirePermission('beck_procesamiento_ingenieria', 'editar')
 *   requirePermission(['beck_registro', 'beck_reportes'], 'ver')  // OR: pasa si tiene cualquiera
 *
 * - Administrador siempre pasa.
 * - Para el resto aplica los permisos efectivos (custom o defaults del rol).
 * - Cuando se pasa un array de módulos, basta con que el usuario tenga acceso a UNO de ellos.
 */
export const requirePermission = (modulo: string | string[], accion: 'ver' | 'editar') => {
  const modulos = Array.isArray(modulo) ? modulo : [modulo];

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId || !req.userRole) {
      res.status(401).json({ success: false, error: 'No autenticado' });
      return;
    }

    if (req.userRole === 'administrador') {
      next();
      return;
    }

    try {
      const permisos = await getPermisosEfectivos(req.userId, req.userRole);

      // Busca el primer módulo que satisfaga la acción requerida
      const permiso = permisos.find((p) => {
        if (!modulos.includes(p.modulo)) return false;
        if (!p.puedeVer) return false;
        if (accion === 'editar' && !p.puedeEditar) return false;
        return true;
      });

      console.log('[requirePermission]', {
        userId: req.userId,
        rol: req.userRole,
        modulos,
        accion,
        permisoEfectivo: permiso ?? null,
      });

      if (!permiso) {
        console.warn('[requirePermission DENIED]', {
          userId: req.userId,
          rol: req.userRole,
          modulos,
          accion,
        });
        const label = modulos.join(' | ');
        const msg = accion === 'editar'
          ? `Sin permiso de edición en: ${label}`
          : `Sin acceso al módulo: ${label}`;
        res.status(403).json({ success: false, error: msg });
        return;
      }

      next();
    } catch (error) {
      console.error('Error al verificar permiso de módulo:', error);
      res.status(500).json({ success: false, error: 'Error al verificar permisos' });
    }
  };
};
