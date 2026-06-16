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

// Valida clienteBeckId + obraIds para usuarios con rol cliente.
// Retorna null si todo está OK, o { status, error } si falla.
async function validarObrasCliente(
  clienteBeckId: string | undefined,
  obraIds: string[],
): Promise<{ status: number; error: string } | null> {
  if (clienteBeckId) {
    const beck = await prisma.clienteBeck.findUnique({
      where: { id: clienteBeckId },
      select: { id: true },
    });
    if (!beck) return { status: 404, error: 'Cliente Beck no encontrado' };
  }

  if (obraIds.length > 0) {
    const obras = await prisma.obra.findMany({
      where: { id: { in: obraIds } },
      select: { id: true, clienteBeckId: true },
    });

    if (obras.length !== obraIds.length) {
      const encontrados = new Set(obras.map(o => o.id));
      const faltantes = obraIds.filter(id => !encontrados.has(id));
      return { status: 404, error: `Obras no encontradas: ${faltantes.join(', ')}` };
    }

    if (clienteBeckId) {
      const obraAjena = obras.find(o => o.clienteBeckId !== clienteBeckId);
      if (obraAjena) {
        return {
          status: 400,
          error: 'Una o más obras no pertenecen al Cliente Beck seleccionado',
        };
      }
    }
  }

  return null;
}

/**
 * GET /api/usuarios
 * Soporta ?empresa=beck|firemat para filtrar por contexto de empresa.
 * Admin ve datos de gestión. Ingenieria solo ve campos seguros para asignación.
 * Para usuarios con rol cliente (admin only), incluye obras asignadas.
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

    // Para admin: enriquecer usuarios con rol cliente con sus obras asignadas
    if (isAdmin) {
      const clienteIds = usuarios.filter(u => u.rol === RolUsuario.cliente).map(u => u.id);

      if (clienteIds.length > 0) {
        const asignaciones = await prisma.usuarios_obras.findMany({
          where: { usuario_id: { in: clienteIds } },
          select: {
            usuario_id: true,
            obras: {
              select: { id: true, nombre: true, codigo: true, clienteBeckId: true },
            },
          },
        });

        type ObraResumen = { id: string; nombre: string; codigo: string | null; clienteBeckId: string | null };
        const obrasMapByUser = new Map<string, ObraResumen[]>();
        for (const a of asignaciones) {
          const list = obrasMapByUser.get(a.usuario_id) ?? [];
          list.push(a.obras);
          obrasMapByUser.set(a.usuario_id, list);
        }

        const enriched = usuarios.map(u => {
          if (u.rol !== RolUsuario.cliente) return u;
          const obras = obrasMapByUser.get(u.id) ?? [];
          const uniqueClienteBeckIds = [...new Set(
            obras.map(o => o.clienteBeckId).filter((cid): cid is string => cid !== null),
          )];
          return {
            ...u,
            obras,
            cantidadObrasAsignadas: obras.length,
            clienteBeckId: uniqueClienteBeckIds.length === 1 ? uniqueClienteBeckIds[0] : null,
          };
        });

        res.json(enriched);
        return;
      }
    }

    res.json(usuarios);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

/**
 * GET /api/usuarios/:id
 * Detalle completo de un usuario. Para rol cliente incluye obras asignadas y clienteBeckId inferido.
 */
export const obtenerUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
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

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const response: Record<string, unknown> = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      azureId: usuario.azureId,
      createdAt: usuario.createdAt,
    };

    if (usuario.rol === RolUsuario.cliente) {
      const asignaciones = await prisma.usuarios_obras.findMany({
        where: { usuario_id: id },
        select: {
          obras: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              estado: true,
              clienteBeckId: true,
            },
          },
        },
      });

      const obras = asignaciones.map(a => a.obras);
      const uniqueClienteBeckIds = [...new Set(
        obras.map(o => o.clienteBeckId).filter((cid): cid is string => cid !== null),
      )];

      response.obraIds = obras.map(o => o.id);
      response.obras = obras;
      response.cantidadObrasAsignadas = obras.length;
      response.clienteBeckId = uniqueClienteBeckIds.length === 1 ? uniqueClienteBeckIds[0] : null;
    }

    res.json(response);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      activo,
      clienteBeckId,
      obraIds,
    } = req.body as {
      nombre?: string;
      email?: string;
      password?: string;
      rol?: string;
      activo?: boolean;
      clienteBeckId?: string;
      obraIds?: unknown[];
    };

    if (!nombre?.trim() || !email?.trim() || !password?.trim() || !rol) {
      res.status(400).json({
        error: "Nombre, email, contraseña y rol son obligatorios",
      });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    if (!esRolValido(rol)) {
      res.status(400).json({ error: "Rol no válido" });
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

    // Validar clienteBeckId + obraIds solo para rol=cliente
    let obraIdsFinales: string[] = [];
    let beckIdFinal: string | undefined;

    if (rolFinal === RolUsuario.cliente) {
      obraIdsFinales = Array.isArray(obraIds)
        ? obraIds
            .filter((oid): oid is string => typeof oid === 'string' && oid.trim() !== '')
            .map(oid => oid.trim())
        : [];

      beckIdFinal =
        typeof clienteBeckId === 'string' && clienteBeckId.trim()
          ? clienteBeckId.trim()
          : undefined;

      const validationError = await validarObrasCliente(beckIdFinal, obraIdsFinales);
      if (validationError) {
        res.status(validationError.status).json({ error: validationError.error });
        return;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuarioCreado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
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

      if (rolFinal === RolUsuario.cliente && obraIdsFinales.length > 0) {
        await tx.usuarios_obras.createMany({
          data: obraIdsFinales.map(obra_id => ({ usuario_id: usuario.id, obra_id })),
          skipDuplicates: true,
        });
      }

      return usuario;
    });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? "",
      modulo: "USUARIO",
      tipo: "USUARIO_CREADO",
      entidadId: usuarioCreado.id,
      descripcion: `Se creó usuario ${usuarioCreado.nombre}`,
    });

    res.status(201).json(usuarioCreado);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

/**
 * PUT /api/usuarios/:id
 * Solo administrador e ingenieria.
 * Para rol cliente acepta obraIds (sincroniza usuarios_obras en transacción).
 */
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      nombre,
      email,
      rol,
      activo,
      clienteBeckId,
      obraIds,
    } = req.body as {
      nombre?: string;
      email?: string;
      rol?: string;
      activo?: boolean;
      clienteBeckId?: string;
      obraIds?: unknown[];
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

      rolFinal = rol as RolUsuario;
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

    // Sincronizar obras solo si se envía obraIds y el rol es (o pasa a ser) cliente
    const rolEfectivo = (rolFinal ?? usuarioExistente.rol) as RolUsuario;
    const sincronizarObras = Array.isArray(obraIds) && rolEfectivo === RolUsuario.cliente;

    let obraIdsFinales: string[] = [];
    let beckIdFinal: string | undefined;

    if (sincronizarObras) {
      obraIdsFinales = obraIds
        .filter((oid): oid is string => typeof oid === 'string' && oid.trim() !== '')
        .map(oid => oid.trim());

      beckIdFinal =
        typeof clienteBeckId === 'string' && clienteBeckId.trim()
          ? clienteBeckId.trim()
          : undefined;

      const validationError = await validarObrasCliente(beckIdFinal, obraIdsFinales);
      if (validationError) {
        res.status(validationError.status).json({ error: validationError.error });
        return;
      }
    }

    const usuarioActualizado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.update({
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

      if (sincronizarObras) {
        await tx.usuarios_obras.deleteMany({ where: { usuario_id: id } });
        if (obraIdsFinales.length > 0) {
          await tx.usuarios_obras.createMany({
            data: obraIdsFinales.map(obra_id => ({ usuario_id: id, obra_id })),
            skipDuplicates: true,
          });
        }
      }

      return usuario;
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
 * PATCH /api/usuarios/:id/password
 * Cambia la contraseña de un usuario local (sin azureId).
 * Solo administrador e ingenieria.
 */
export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { password, confirmPassword } = req.body as {
      password?: string;
      confirmPassword?: string;
    };

    if (!password || !password.trim()) {
      res.status(400).json({ error: 'La nueva contraseña es obligatoria' });
      return;
    }
    if (!confirmPassword || !confirmPassword.trim()) {
      res.status(400).json({ error: 'La confirmación de contraseña es obligatoria' });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Las contraseñas no coinciden' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    if (usuario.azureId) {
      res.status(400).json({ error: 'No se puede cambiar contraseña de usuarios Microsoft.' });
      return;
    }

    if (!validarGestionIngenieria(req, res, usuario)) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.usuario.update({
      where: { id },
      data: { passwordHash },
    });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'USUARIO',
      tipo: 'PASSWORD_CAMBIADO',
      entidadId: id,
      descripcion: `Se cambió la contraseña del usuario ${usuario.nombre}`,
    });

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
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
