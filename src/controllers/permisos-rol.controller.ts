import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { RolUsuario } from '../types';
import { PERMISOS_POR_ROL, TODOS_LOS_MODULOS } from '../helpers/permisosPorRol';

const ROLES_CONFIGURABLES: RolUsuario[] = [
  'administrador',
  'vendedor',
  'terreno',
  'ingenieria',
  'visualizador',
  'jefeobra',
  'cliente',
  'vendedor_firemat',
  'bodeguero',
  'visualizador_firemat',
];

function esRolValido(rol: string): rol is RolUsuario {
  return ROLES_CONFIGURABLES.includes(rol as RolUsuario);
}

export const listarRoles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [usuariosPorRol, permisosConfiguradosPorRol] = await Promise.all([
      prisma.usuario.groupBy({ by: ['rol'], _count: { id: true } }),
      prisma.permisoRolModulo.groupBy({ by: ['rol'], _count: { id: true } }),
    ]);

    const usuariosMap = new Map(usuariosPorRol.map((u) => [u.rol as string, u._count.id]));
    const permisosMap = new Map(permisosConfiguradosPorRol.map((p) => [p.rol as string, p._count.id]));

    const data = ROLES_CONFIGURABLES.map((rol) => ({
      rol,
      totalUsuarios: usuariosMap.get(rol) ?? 0,
      permisosConfigurados: permisosMap.get(rol) ?? 0,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al listar roles:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const obtenerPermisosRol = async (req: Request, res: Response): Promise<void> => {
  try {
    const rol = req.params['rol'] as string;

    if (!esRolValido(rol)) {
      res.status(400).json({ success: false, error: `Rol no válido: ${rol}` });
      return;
    }

    const codeDefaults = PERMISOS_POR_ROL[rol];

    const [permisosDB, usuarios] = await Promise.all([
      prisma.permisoRolModulo.findMany({
        where: { rol: rol as any },
        select: { modulo: true, puedeVer: true, puedeEditar: true },
        orderBy: { modulo: 'asc' },
      }),
      prisma.usuario.findMany({
        where: { rol: rol as any },
        select: { id: true, nombre: true, email: true, activo: true },
        orderBy: { nombre: 'asc' },
      }),
    ]);

    const usuariosConPermisos =
      usuarios.length > 0
        ? await prisma.permisoUsuarioModulo.findMany({
            where: { usuarioId: { in: usuarios.map((u) => u.id) } },
            select: { usuarioId: true },
            distinct: ['usuarioId'],
          })
        : [];

    const conPermisosSet = new Set(usuariosConPermisos.map((p) => p.usuarioId));

    const dbMap = new Map(permisosDB.map((p) => [p.modulo, p]));
    const permisosEfectivos = codeDefaults.map((d) => {
      const db = dbMap.get(d.modulo);
      return db ? { modulo: d.modulo, puedeVer: db.puedeVer, puedeEditar: db.puedeEditar } : d;
    });

    const dbProcesamiento = dbMap.get('beck_procesamiento_ingenieria');
    const efectivoProcesamiento = permisosEfectivos.find((p) => p.modulo === 'beck_procesamiento_ingenieria');
    console.log('[AUDIT] GET permisos rol BD', {
      rol,
      procesamiento_en_BD: dbProcesamiento ?? 'NO_RECORD',
      procesamiento_efectivo: efectivoProcesamiento ?? 'NOT_FOUND',
    });

    res.json({
      success: true,
      data: {
        rol,
        tienePermisosConfigurados: permisosDB.length > 0,
        permisosConfigurados: permisosDB,
        permisosEfectivos,
        usuarios: usuarios.map((u) => ({
          ...u,
          tienePermisosPersonalizados: conPermisosSet.has(u.id),
        })),
      },
    });
  } catch (error) {
    console.error('Error al obtener permisos de rol:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const actualizarPermisosRol = async (req: Request, res: Response): Promise<void> => {
  try {
    const rol = req.params['rol'] as string;
    const { permisos } = req.body as {
      permisos: { modulo: string; puedeVer: boolean; puedeEditar: boolean }[];
    };

    console.log('[AUDIT] PUT permisos rol', {
      rol,
      totalPermisos: Array.isArray(permisos) ? permisos.length : 'NO_ARRAY',
      procesamiento: Array.isArray(permisos)
        ? permisos.find((p) => p.modulo === 'beck_procesamiento_ingenieria')
        : 'N/A',
    });

    if (!esRolValido(rol)) {
      res.status(400).json({ success: false, error: `Rol no válido: ${rol}` });
      return;
    }

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

    const results = await Promise.all(
      permisos.map(async (p) => {
        const result = await prisma.permisoRolModulo.upsert({
          where: { rol_modulo: { rol: rol as any, modulo: p.modulo } },
          update: { puedeVer: p.puedeVer, puedeEditar: p.puedeEditar },
          create: { rol: rol as any, modulo: p.modulo, puedeVer: p.puedeVer, puedeEditar: p.puedeEditar },
          select: { modulo: true, puedeVer: true, puedeEditar: true },
        });
        if (p.modulo === 'beck_procesamiento_ingenieria') {
          console.log('[AUDIT] upsert beck_procesamiento_ingenieria', {
            input: { puedeVer: p.puedeVer, puedeEditar: p.puedeEditar },
            saved: { puedeVer: result.puedeVer, puedeEditar: result.puedeEditar },
          });
        }
        return result;
      }),
    );

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error al actualizar permisos de rol:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const listarUsuariosDeRol = async (req: Request, res: Response): Promise<void> => {
  try {
    const rol = req.params['rol'] as string;

    if (!esRolValido(rol)) {
      res.status(400).json({ success: false, error: `Rol no válido: ${rol}` });
      return;
    }

    const usuarios = await prisma.usuario.findMany({
      where: { rol: rol as any },
      select: { id: true, nombre: true, email: true, activo: true },
      orderBy: { nombre: 'asc' },
    });

    const usuariosConPermisos =
      usuarios.length > 0
        ? await prisma.permisoUsuarioModulo.findMany({
            where: { usuarioId: { in: usuarios.map((u) => u.id) } },
            select: { usuarioId: true },
            distinct: ['usuarioId'],
          })
        : [];

    const conPermisosSet = new Set(usuariosConPermisos.map((p) => p.usuarioId));

    res.json({
      success: true,
      data: usuarios.map((u) => ({
        ...u,
        tienePermisosPersonalizados: conPermisosSet.has(u.id),
      })),
    });
  } catch (error) {
    console.error('Error al listar usuarios de rol:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
