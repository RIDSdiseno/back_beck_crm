// src/controllers/registros-campo.controller.ts
// Endpoints de lectura de registros para roles terreno y jefeobra.
// Aplica sanitización de campos según configuración por rol.
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  adjuntarCodigosBeck,
  adjuntarItemizadosMandante,
  sanitizarRegistroPorRol,
  sanitizarRegistrosPorRol,
} from '../services/configuracionCamposRegistro.service';

const ROLES_CON_RESTRICCIONES = ['terreno', 'trabajador', 'jefeobra'] as const;
type RolRestringido = typeof ROLES_CON_RESTRICCIONES[number];

function tieneRestriccion(rol: string): rol is RolRestringido {
  return ROLES_CON_RESTRICCIONES.includes(rol as RolRestringido);
}

/**
 * GET /api/registros-campo
 * Query params opcionales: obra_id (uuid)
 * - terreno: solo ve sus propios registros
 * - jefeobra: ve todos los de la obra si se pasa obra_id, o todos
 * - admin/ingenieria: ven todo, sin filtrado de campos
 */
export const listarRegistrosCampo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { obra_id } = req.query;
    const usuario_id = req.userId;
    const user_rol = req.userRole ?? 'terreno';

    const where: Prisma.RegistroTerrenoWhereInput = {};

    if (typeof obra_id === 'string') {
      where.obraId = obra_id;
    }

    if (user_rol === 'terreno') {
      where.usuarioId = usuario_id;
    }

    const registros = await prisma.registroTerreno.findMany({
      where,
      include: {
        obra: { select: { id: true, nombre: true, codigo: true } },
        usuario: { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
    });

    const mapped = registros.map(({ fotos_registro, ...reg }) => ({
      ...reg,
      fotosUrls: fotos_registro.map(f => f.url),
      fotoUrl: fotos_registro[0]?.url ?? null,
    })) as Record<string, unknown>[];

    const mappedConCodigo = await adjuntarCodigosBeck(mapped);
    const mappedConItemizado = await adjuntarItemizadosMandante(mappedConCodigo);
    const result = tieneRestriccion(user_rol)
      ? await sanitizarRegistrosPorRol(mappedConItemizado, user_rol, typeof obra_id === 'string' ? obra_id : null)
      : mappedConItemizado;

    res.json(result);
  } catch (error) {
    console.error('Error al listar registros campo:', error);
    res.status(500).json({ error: 'Error al listar registros' });
  }
};

/**
 * GET /api/registros-campo/:id
 * - terreno: solo puede ver su propio registro
 * - jefeobra/admin/ingenieria: cualquier registro
 */
export const obtenerRegistroCampo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario_id = req.userId;
    const user_rol = req.userRole ?? 'terreno';

    const where: Prisma.RegistroTerrenoWhereInput = { id: String(id) };

    if (user_rol === 'terreno') {
      where.usuarioId = usuario_id;
    }

    const registro = await prisma.registroTerreno.findFirst({
      where,
      include: {
        obra: { select: { id: true, nombre: true, codigo: true } },
        usuario: { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });

    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const { fotos_registro, ...reg } = registro;
    const mapped = {
      ...reg,
      fotosUrls: fotos_registro.map(f => f.url),
      fotoUrl: fotos_registro[0]?.url ?? null,
    } as Record<string, unknown>;

    const [mappedConCodigo] = await adjuntarCodigosBeck([mapped]);
    const [mappedConItemizado] = await adjuntarItemizadosMandante([mappedConCodigo]);
    const result = tieneRestriccion(user_rol)
      ? await sanitizarRegistroPorRol(mappedConItemizado, user_rol)
      : mappedConItemizado;

    res.json(result);
  } catch (error) {
    console.error('Error al obtener registro campo:', error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};
