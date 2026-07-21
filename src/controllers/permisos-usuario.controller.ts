import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { RolUsuario } from '../types';
import { getPermisosEfectivos } from '../helpers/permisosEfectivos';
import { TODOS_LOS_MODULOS } from '../helpers/permisosPorRol';

export const obtenerPermisosUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.params['id'] as string;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nombre: true, email: true, rol: true },
    });

    if (!usuario) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    const [permisosUsuario, permisosRol, permisosEfectivos] = await Promise.all([
      prisma.permisoUsuarioModulo.findMany({
        where: { usuarioId },
        select: { modulo: true, puedeVer: true, puedeEditar: true, createdAt: true, updatedAt: true },
        orderBy: { modulo: 'asc' },
      }),
      prisma.permisoRolModulo.findMany({
        where: { rol: usuario.rol as any },
        select: { modulo: true, puedeVer: true, puedeEditar: true },
        orderBy: { modulo: 'asc' },
      }),
      getPermisosEfectivos(usuarioId, usuario.rol as RolUsuario),
    ]);

    res.json({
      success: true,
      data: {
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        tienePermisosPersonalizados: permisosUsuario.length > 0,
        permisos: permisosUsuario,   // backward compat
        permisosUsuario,
        permisosRol,
        permisosEfectivos,
      },
    });
  } catch (error) {
    console.error('Error al obtener permisos de usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const actualizarPermisosUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.params['id'] as string;
    const { permisos } = req.body as {
      permisos: { modulo: string; puedeVer: boolean; puedeEditar: boolean }[];
    };

    if (!Array.isArray(permisos)) {
      res.status(400).json({ success: false, error: 'El campo "permisos" debe ser un array' });
      return;
    }

    for (const p of permisos) {
      if (!p.modulo || typeof p.puedeVer !== 'boolean' || typeof p.puedeEditar !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'Cada permiso requiere: modulo (string), puedeVer (boolean), puedeEditar (boolean)',
        });
        return;
      }
      if (!TODOS_LOS_MODULOS.includes(p.modulo)) {
        res.status(400).json({ success: false, error: `Módulo no reconocido: ${p.modulo}` });
        return;
      }
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });

    if (!usuario) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    const results = await Promise.all(
      permisos.map((p) =>
        prisma.permisoUsuarioModulo.upsert({
          where: { usuarioId_modulo: { usuarioId, modulo: p.modulo } },
          update: { puedeVer: p.puedeVer, puedeEditar: p.puedeEditar },
          create: { usuarioId, modulo: p.modulo, puedeVer: p.puedeVer, puedeEditar: p.puedeEditar },
          select: { modulo: true, puedeVer: true, puedeEditar: true },
        }),
      ),
    );

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error al actualizar permisos de usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const obtenerMisPermisos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const userRole = req.userRole!;

    const permisos = await getPermisosEfectivos(userId, userRole);

    res.json({
      success: true,
      data: {
        rol: userRole,
        permisos,
      },
    });
  } catch (error) {
    console.error('Error al obtener mis permisos:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
