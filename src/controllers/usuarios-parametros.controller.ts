import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { RolUsuario } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';
import {
  Empresa,
  getRolesByEmpresa,
  esRolDeEmpresa,
  esRolCreableEnEmpresa,
} from '../helpers/roles';

const esRolValido = (rol: string): rol is RolUsuario =>
  Object.values(RolUsuario).includes(rol as RolUsuario);

const ROLES_ASIGNABLES_INGENIERIA: RolUsuario[] = [
  RolUsuario.terreno,
  RolUsuario.ingenieria,
  RolUsuario.visualizador,
  RolUsuario.vendedor,
  RolUsuario.jefeobra,
];

const esIngenieria = (req: Request): boolean => req.userRole === RolUsuario.ingenieria;
const esJefeObra = (req: Request): boolean => req.userRole === RolUsuario.jefeobra;
const esRolRestringido = (req: Request): boolean => esIngenieria(req) || esJefeObra(req);

function validarGestionIngenieria(
  req: Request,
  res: Response,
  usuarioObjetivo?: { rol: RolUsuario },
  rolNuevo?: RolUsuario,
): boolean {
  if (!esRolRestringido(req)) return true;

  if (usuarioObjetivo?.rol === RolUsuario.administrador) {
    res.status(403).json({ success: false, error: 'No tienes permiso para gestionar administradores.' });
    return false;
  }

  if (rolNuevo === RolUsuario.administrador) {
    res.status(403).json({ success: false, error: 'No puedes asignar rol administrador.' });
    return false;
  }

  if (rolNuevo && !ROLES_ASIGNABLES_INGENIERIA.includes(rolNuevo)) {
    res.status(403).json({ success: false, error: 'Solo puedes asignar roles Beck permitidos.' });
    return false;
  }

  return true;
}

/**
 * GET /api/beck/usuarios-parametros
 * GET /api/firemat/usuarios-parametros
 * Lista usuarios del contexto de empresa indicado (empresa inyectada por middleware de ruta)
 */
export const listarUsuariosParametros = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresa = req.empresaContexto as Empresa;
    const rolesEmpresa = getRolesByEmpresa(empresa);

    const usuarios = await prisma.usuario.findMany({
      where: { rol: { in: rolesEmpresa } },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        azureId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ success: false, error: 'Error al listar usuarios' });
  }
};

/**
 * POST /api/beck/usuarios-parametros
 * POST /api/firemat/usuarios-parametros
 * Crea usuario validando que el rol corresponda al contexto de empresa
 */
export const crearUsuarioParametros = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresa = req.empresaContexto as Empresa;
    const { nombre, email, password, rol, activo } = req.body as {
      nombre?: string;
      email?: string;
      password?: string;
      rol?: string;
      activo?: boolean;
    };

    if (!nombre?.trim() || !email?.trim() || !password?.trim() || !rol) {
      res.status(400).json({
        success: false,
        error: 'Nombre, email, contraseña y rol son obligatorios',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    if (!esRolValido(rol)) {
      res.status(400).json({ success: false, error: 'Rol no válido' });
      return;
    }

    if (!esRolCreableEnEmpresa(rol as RolUsuario, empresa)) {
      res.status(400).json({
        success: false,
        error: 'El rol no corresponde a la empresa seleccionada',
      });
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
      res.status(409).json({ success: false, error: 'Ya existe un usuario con ese email' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuarioCreado = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        email: normalizedEmail,
        passwordHash,
        rol: rolFinal,
        activo: activo ?? true,
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
      usuarioId: req.userId ?? '',
      modulo: 'USUARIO',
      tipo: 'USUARIO_CREADO',
      entidadId: usuarioCreado.id,
      descripcion: `Se creó usuario ${usuarioCreado.nombre} en contexto ${empresa}`,
    });

    res.status(201).json({ success: true, data: usuarioCreado });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ success: false, error: 'Error al crear usuario' });
  }
};

/**
 * PUT /api/beck/usuarios-parametros/:id
 * PUT /api/firemat/usuarios-parametros/:id
 * Actualiza usuario validando que el nuevo rol pertenezca al contexto de empresa
 */
export const actualizarUsuarioParametros = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresa = req.empresaContexto as Empresa;
    const id = req.params.id as string;
    const { nombre, email, rol, activo } = req.body as {
      nombre?: string;
      email?: string;
      rol?: string;
      activo?: boolean;
    };

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExistente) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    const data: { nombre?: string; email?: string; rol?: RolUsuario; activo?: boolean } = {};
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
        res.status(409).json({ success: false, error: 'Ya existe otro usuario con ese email' });
        return;
      }

      data.email = normalizedEmail;
    }

    if (typeof rol === 'string') {
      if (!esRolValido(rol)) {
        res.status(400).json({ success: false, error: 'Rol no válido' });
        return;
      }

      rolFinal = rol as RolUsuario;

      if (!esRolDeEmpresa(rolFinal, empresa)) {
        res.status(400).json({
          success: false,
          error: 'El rol no corresponde a la empresa seleccionada',
        });
        return;
      }

    }

    if (!validarGestionIngenieria(req, res, usuarioExistente, rolFinal)) {
      return;
    }

    if (rolFinal !== undefined) {
      data.rol = rolFinal;
    }

    if (typeof activo === 'boolean') {
      if (esRolRestringido(req) && !activo && id === req.userId) {
        res.status(403).json({ success: false, error: 'No puedes desactivarte a ti mismo.' });
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

    res.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar usuario' });
  }
};

/**
 * DELETE /api/beck/usuarios-parametros/:id
 * DELETE /api/firemat/usuarios-parametros/:id
 * Soft delete — solo administrador (validado por JWT en middleware)
 */
export const eliminarUsuarioParametros = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExistente) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    if (!validarGestionIngenieria(req, res, usuarioExistente)) {
      return;
    }

    if (esRolRestringido(req) && id === req.userId) {
      res.status(403).json({ success: false, error: 'No puedes desactivarte a ti mismo.' });
      return;
    }

    await prisma.usuario.update({ where: { id }, data: { activo: false } });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'USUARIO',
      tipo: 'USUARIO_DESACTIVADO',
      entidadId: id,
      descripcion: `Se desactivó usuario ${usuarioExistente.nombre}`,
    });

    res.json({ success: true, message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
  }
};
