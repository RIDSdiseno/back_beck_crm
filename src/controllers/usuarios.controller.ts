import { Request, Response } from 'express';
import { RolUsuario } from '@prisma/client';
import { prisma } from '../config/prisma';

const esRolValido = (rol: string): rol is RolUsuario => {
  return Object.values(RolUsuario).includes(rol as RolUsuario);
};

/**
 * GET /api/usuarios
 * Solo admin
 */
export const listarUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        azureId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

/**
 * PUT /api/usuarios/:id
 * Solo admin
 */
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { nombre, email, rol, activo } = req.body as {
      nombre?: string;
      email?: string;
      rol?: string;
      activo?: boolean;
    };

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const data: {
      nombre?: string;
      email?: string;
      rol?: RolUsuario;
      activo?: boolean;
    } = {};

    if (typeof nombre === 'string' && nombre.trim()) {
      data.nombre = nombre.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.toLowerCase().trim();

      const otroUsuario = await prisma.usuario.findUnique({
        where: { email: normalizedEmail },
      });

      if (otroUsuario && otroUsuario.id !== id) {
        res.status(409).json({ error: 'Ya existe otro usuario con ese email' });
        return;
      }

      data.email = normalizedEmail;
    }

    if (typeof rol === 'string') {
      if (!esRolValido(rol)) {
        res.status(400).json({ error: 'Rol no válido' });
        return;
      }

      data.rol = rol;
    }

    if (typeof activo === 'boolean') {
      data.activo = activo;
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        azureId: true,
        createdAt: true,
      },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Soft delete: desactiva usuario
 * Solo admin
 */
export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    await prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
      },
    });

    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};