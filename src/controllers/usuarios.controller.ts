import bcrypt from "bcryptjs";
import { Request, Response } from 'express';
import { RolUsuario } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';
import { ROLES_BECK, ROLES_FIREMAT } from '../helpers/roles';

const esRolValido = (rol: string): rol is RolUsuario => {
  return Object.values(RolUsuario).includes(rol as RolUsuario);
};

const ROLES_ASIGNABLES_INGENIERIA: RolUsuario[] = [
  RolUsuario.terreno,
  RolUsuario.ingenieria,
  RolUsuario.visualizador,
  RolUsuario.vendedor,
  RolUsuario.jefeobra,
];

const esIngenieria = (req: Request): boolean => req.userRole === RolUsuario.ingenieria;

function validarGestionIngenieria(
  req: Request,
  res: Response,
  usuarioObjetivo?: { rol: RolUsuario },
  rolNuevo?: RolUsuario,
): boolean {
  if (!esIngenieria(req)) return true;

  if (usuarioObjetivo?.rol === RolUsuario.administrador) {
    res.status(403).json({ error: 'No tienes permiso para gestionar administradores.' });
    return false;
  }

  if (rolNuevo === RolUsuario.administrador) {
    res.status(403).json({ error: 'Ingeniería no puede asignar rol administrador.' });
    return false;
  }

  if (rolNuevo && !ROLES_ASIGNABLES_INGENIERIA.includes(rolNuevo)) {
    res.status(403).json({ error: 'Ingeniería solo puede asignar roles Beck permitidos.' });
    return false;
  }

  return true;
}

/**
 * GET /api/usuarios
 * Soporta ?empresa=beck|firemat para filtrar por contexto de empresa.
 * Admin ve datos de gestión. Ingenieria solo ve campos seguros para asignación.
 */
export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = req.userRole === 'administrador';
    const empresa = req.query.empresa as string | undefined;
    const rol = typeof req.query.rol === 'string' ? req.query.rol.trim() : '';
    const activoRaw = typeof req.query.activo === 'string' ? req.query.activo.trim().toLowerCase() : '';

    let rolesFilter: RolUsuario[] | undefined;
    if (empresa === 'beck') {
      rolesFilter = ROLES_BECK;
    } else if (empresa === 'firemat') {
      rolesFilter = ROLES_FIREMAT;
    }

    if (rol) {
      if (!esRolValido(rol)) {
        res.status(400).json({ error: 'Rol no valido' });
        return;
      }

      rolesFilter = rolesFilter
        ? rolesFilter.filter((role) => role === rol)
        : [rol as RolUsuario];
    }

    let activo: boolean | undefined;
    if (activoRaw) {
      if (!['true', 'false'].includes(activoRaw)) {
        res.status(400).json({ error: 'Filtro activo invalido' });
        return;
      }
      activo = activoRaw === 'true';
    }

    const where = {
      ...(rolesFilter && { rol: { in: rolesFilter } }),
      ...(activo !== undefined && { activo }),
    };

    const usuarios = await prisma.usuario.findMany({
      where,
      select: isAdmin
        ? {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            activo: true,
            azureId: true,
            createdAt: true,
          }
        : {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            activo: true,
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

export const crearUsuario = async (req: Request, res: Response): Promise <void> => {
  try{
    const { nombre, email, password, rol, activo } = req.body as {
      nombre?: string;
      email?: string;
      password?: string;
      rol?: string;
      activo?: boolean;
    };
    if (!nombre?.trim() || !email?.trim() || !password?.trim() || !rol){
      res.status(400).json({
        error: "Nombre, email, contraseña y rol son obligatorios",
      });
      return;
    }

    if (!password || password.length < 6){
      res.status(400).json({
        error: "La contraseña dene tener almenos 6 caracteres",
      });
      return;
    }
    if (!esRolValido(rol)){
      res.status(400).json({ error: "Rol no válido"});
      return;
    }
    const rolFinal = rol as RolUsuario;

    if (!validarGestionIngenieria(req, res, undefined, rolFinal)) {
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: normalizedEmail },
    });

    if (usuarioExistente) {
      res.status(409).json({
        error: "Ya existe un usuario con ese email",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuarioCreado = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        email: normalizedEmail,
        passwordHash,
        rol: rolFinal,
        activo: activo?? true,
        azureId: null,
      },
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
    await registrarMovimientoCRM({
      usuarioId: req.userId ?? "",
      modulo: "USUARIO",
      tipo: "USUARIO_CREADO",
      entidadId: usuarioCreado.id,
      descripcion: `Se creó usuario ${usuarioCreado.nombre}`,
    });

    res.status(201).json(usuarioCreado);
  }catch (error){
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

/**
 * PUT /api/usuarios/:id
 * Solo administrador e ingenieria
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
    let rolFinal: RolUsuario | undefined;

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

      rolFinal = rol;
    }

    if (!validarGestionIngenieria(req, res, usuarioExistente, rolFinal)) {
      return;
    }

    if (rolFinal !== undefined) {
      data.rol = rolFinal;
    }

    if (typeof activo === 'boolean') {
      if (esIngenieria(req) && !activo && id === req.userId) {
        res.status(403).json({ error: 'No puedes desactivarte a ti mismo.' });
        return;
      }
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

    const adminId = req.userId ?? '';

    if (data.rol !== undefined && data.rol !== usuarioExistente.rol) {
      await registrarMovimientoCRM({
        usuarioId: adminId,
        modulo: 'USUARIO',
        tipo: 'ROL_CAMBIADO',
        entidadId: usuarioActualizado.id,
        descripcion: `Se cambió rol de ${usuarioActualizado.nombre} de ${usuarioExistente.rol} a ${data.rol}`,
        datos: { de: usuarioExistente.rol, a: data.rol },
      });
    }

    if (data.activo !== undefined && data.activo !== usuarioExistente.activo) {
      await registrarMovimientoCRM({
        usuarioId: adminId,
        modulo: 'USUARIO',
        tipo: data.activo ? 'USUARIO_ACTIVADO' : 'USUARIO_DESACTIVADO',
        entidadId: usuarioActualizado.id,
        descripcion: `Se ${data.activo ? 'activó' : 'desactivó'} usuario ${usuarioActualizado.nombre}`,
      });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Soft delete: desactiva usuario
 * Solo administrador e ingenieria
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

    if (!validarGestionIngenieria(req, res, usuarioExistente)) {
      return;
    }

    if (esIngenieria(req) && id === req.userId) {
      res.status(403).json({ error: 'No puedes desactivarte a ti mismo.' });
      return;
    }

    await prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
      },
    });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'USUARIO',
      tipo: 'USUARIO_DESACTIVADO',
      entidadId: id,
      descripcion: `Se desactivó usuario ${usuarioExistente.nombre}`,
    });

    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
