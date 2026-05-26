// src/controllers/obras.controller.ts
import { Request, Response } from 'express';
import { EstadoObra, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';

const estadosObraValidos: EstadoObra[] = [
  EstadoObra.activa,
  EstadoObra.inactiva,
  EstadoObra.pausada,
  EstadoObra.finalizada,
];

const obraUsuariosInclude = {
  usuarios_obras: {
    select: {
      usuarios: {
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
        },
      },
    },
  },
  oportunidades: {
    select: {
      id: true,
      nombreProyecto: true,
      empresa: true,
      estadoCierre: true,
      montoFinalGanado: true,
      fechaCierre: true,
    },
  },
} satisfies Prisma.ObraInclude;

type ObraConUsuarios = Prisma.ObraGetPayload<{
  include: typeof obraUsuariosInclude;
}>;

type ObraResponse = Omit<ObraConUsuarios, 'usuarios_obras'> & {
  usuarios: ObraConUsuarios['usuarios_obras'][number]['usuarios'][];
};

const formatObraResponse = (obra: ObraConUsuarios): ObraResponse => {
  const { usuarios_obras, ...obraData } = obra;
  return {
    ...obraData,
    usuarios: usuarios_obras.map((asignacion) => asignacion.usuarios),
  };
};

const parseEstadoObra = (estado: unknown): EstadoObra | undefined => {
  if (typeof estado !== 'string') return undefined;
  return estadosObraValidos.includes(estado as EstadoObra)
    ? (estado as EstadoObra)
    : undefined;
};

const unirNombres = (nombres: string[]): string => {
  if (nombres.length <= 1) {
    return nombres[0] ?? '';
  }

  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
};

type CrearObraBody = {
  codigo?: unknown;
  nombre?: unknown;
  descripcion?: unknown;
  direccion?: unknown;
  cliente?: unknown;
  estado?: unknown;
  funnelBeckId?: unknown;
};

type ActualizarObraBody = {
  codigo?: unknown;
  nombre?: unknown;
  direccion?: unknown;
  cliente?: unknown;
  estado?: unknown;
  funnelBeckId?: unknown;
};

type CambiarEstadoObraBody = {
  estado?: unknown;
};

type AsignarUsuariosObraBody = {
  usuariosIds?: unknown;
  usuarioIds?: unknown;
};

const getFunnelBeckId = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const sendFunnelBeckLinkError = (res: Response, error: unknown): boolean => {
  if (!(error instanceof Error)) return false;

  if (error.message === 'La oportunidad no existe.') {
    res.status(404).json({ error: error.message });
    return true;
  }

  if (
    error.message === 'Solo se pueden vincular obras a oportunidades ganadas.' ||
    error.message === 'La oportunidad ya está vinculada a otra obra.'
  ) {
    res.status(400).json({ error: error.message });
    return true;
  }

  return false;
};

export const listarObras = async (req: Request, res: Response): Promise<void> => {
  try {
    const rol = req.userRole;

    // Terreno y jefeobra siempre ven solo obras activas, sin filtro manual
    if (rol === 'terreno' || rol === 'jefeobra') {
      const obras = await prisma.obra.findMany({
        where: { estado: EstadoObra.activa },
        include: obraUsuariosInclude,
        orderBy: { createdAt: 'desc' },
      });
      res.json(obras.map(formatObraResponse));
      return;
    }

    const estado =
      typeof req.query.estado === 'string' ? req.query.estado : undefined;
    const activa =
      typeof req.query.activa === 'string' ? req.query.activa : undefined;

    let whereEstado: EstadoObra | undefined;

    const estadoFiltro = parseEstadoObra(estado);
    if (estadoFiltro) {
      whereEstado = estadoFiltro;
    } else if (activa === 'true') {
      whereEstado = EstadoObra.activa;
    }

    const obras = await prisma.obra.findMany({
      where: whereEstado ? { estado: whereEstado } : undefined,
      include: obraUsuariosInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json(obras.map(formatObraResponse));
  } catch (error) {
    console.error('Error al listar obras:', error);
    res.status(500).json({ error: 'Error al listar obras' });
  }
};

export const obtenerObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de obra invalido' });
      return;
    }

    const obra = await prisma.obra.findUnique({
      where: { id },
      include: obraUsuariosInclude,
    });

    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    res.json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al obtener obra:', error);
    res.status(500).json({ error: 'Error al obtener obra' });
  }
};

export const crearObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, nombre, descripcion, direccion, cliente, estado, funnelBeckId } =
      req.body as CrearObraBody;

    if (typeof nombre !== 'string' || !nombre.trim()) {
      res.status(400).json({ error: 'Faltan campos obligatorios: nombre' });
      return;
    }

    const estadoObra = estado === undefined ? EstadoObra.activa : parseEstadoObra(estado);
    if (!estadoObra) {
      res.status(400).json({ error: 'Estado invalido' });
      return;
    }

    const codigoFinal =
      typeof codigo === 'string' && codigo.trim() ? codigo.trim() : null;
    const oportunidadId = getFunnelBeckId(funnelBeckId);

    const obra = await prisma.$transaction(async (tx) => {
      if (oportunidadId) {
        const oportunidad = await tx.operadorBeck.findUnique({
          where: { id: oportunidadId },
          select: { id: true, estadoCierre: true, obraId: true },
        });

        if (!oportunidad) throw new Error('La oportunidad no existe.');
        if (oportunidad.estadoCierre !== 'ganada') {
          throw new Error('Solo se pueden vincular obras a oportunidades ganadas.');
        }
        if (oportunidad.obraId) {
          throw new Error('La oportunidad ya está vinculada a otra obra.');
        }
      }

      const obraCreada = await tx.obra.create({
        data: {
          nombre: nombre.trim(),
          codigo: codigoFinal,
          descripcion: typeof descripcion === 'string' ? descripcion : undefined,
          direccion: typeof direccion === 'string' ? direccion : undefined,
          cliente: typeof cliente === 'string' ? cliente : undefined,
          estado: estadoObra,
          creadoPorId: req.userId ?? '',
        },
      });

      if (oportunidadId) {
        await tx.operadorBeck.update({
          where: { id: oportunidadId },
          data: { obraId: obraCreada.id },
        });
      }

      return tx.obra.findUniqueOrThrow({
        where: { id: obraCreada.id },
        include: obraUsuariosInclude,
      });
    });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'OBRA',
      tipo: 'OBRA_CREADA',
      entidadId: obra.id,
      descripcion: `Se creó obra ${obra.nombre}`,
    });

    res.status(201).json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al crear obra:', error);

    if (sendFunnelBeckLinkError(res, error)) return;

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(400).json({ error: 'El código de obra ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al crear obra' });
  }
};

export const actualizarObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { nombre, codigo, direccion, cliente, estado, funnelBeckId } = req.body as ActualizarObraBody;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de obra invalido' });
      return;
    }

    const existente = await prisma.obra.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const estadoObra = estado === undefined ? undefined : parseEstadoObra(estado);
    if (estado !== undefined && !estadoObra) {
      res.status(400).json({ error: 'Estado invalido' });
      return;
    }

    const oportunidadId = getFunnelBeckId(funnelBeckId);

    const obra = await prisma.$transaction(async (tx) => {
      if (oportunidadId) {
        const oportunidad = await tx.operadorBeck.findUnique({
          where: { id: oportunidadId },
          select: { id: true, estadoCierre: true, obraId: true },
        });

        if (!oportunidad) throw new Error('La oportunidad no existe.');
        if (oportunidad.estadoCierre !== 'ganada') {
          throw new Error('Solo se pueden vincular obras a oportunidades ganadas.');
        }
        if (oportunidad.obraId && oportunidad.obraId !== id) {
          throw new Error('La oportunidad ya está vinculada a otra obra.');
        }
      }

      const obraActualizada = await tx.obra.update({
        where: { id },
        data: {
          ...(typeof nombre === 'string' && { nombre: nombre.trim() }),
          ...(codigo !== undefined && {
            codigo: typeof codigo === 'string' && codigo.trim() ? codigo.trim() : null,
          }),
          ...(typeof direccion === 'string' && { direccion }),
          ...(typeof cliente === 'string' && { cliente }),
          ...(estadoObra !== undefined && { estado: estadoObra }),
        },
      });

      if (oportunidadId) {
        await tx.operadorBeck.update({
          where: { id: oportunidadId },
          data: { obraId: id },
        });
      }

      return tx.obra.findUniqueOrThrow({
        where: { id: obraActualizada.id },
        include: obraUsuariosInclude,
      });
    });

    const cambios: string[] = [];

    if (existente.nombre !== obra.nombre) {
      cambios.push(`el nombre de la obra de "${existente.nombre}" a "${obra.nombre}"`);
    }

    if (existente.codigo !== obra.codigo) {
      cambios.push(`el código de "${existente.codigo}" a "${obra.codigo}"`);
    }

    if ((existente.direccion ?? '') !== (obra.direccion ?? '')) {
      cambios.push(
        `la dirección de "${existente.direccion ?? 'Sin dirección'}" a "${
          obra.direccion ?? 'Sin dirección'
        }"`
      );
    }

    if ((existente.cliente ?? '') !== (obra.cliente ?? '')) {
      cambios.push(
        `el cliente de "${existente.cliente ?? 'Sin cliente'}" a "${
          obra.cliente ?? 'Sin cliente'
        }"`
      );
    }

    if (existente.estado !== obra.estado) {
      cambios.push(`el estado de "${existente.estado}" a "${obra.estado}"`);
    }

    const descripcionMovimiento =
      cambios.length > 0
        ? `Se modificó ${cambios.join(', ')} en la obra ${obra.nombre}`
        : `Se modificó obra ${obra.nombre}`;

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'OBRA',
      tipo: 'OBRA_EDITADA',
      entidadId: obra.id,
      descripcion: descripcionMovimiento,
      datos: {
        antes: {
          nombre: existente.nombre,
          codigo: existente.codigo,
          direccion: existente.direccion,
          cliente: existente.cliente,
          estado: existente.estado,
        },
        despues: {
          nombre: obra.nombre,
          codigo: obra.codigo,
          direccion: obra.direccion,
          cliente: obra.cliente,
          estado: obra.estado,
        },
      },
    });

    res.json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al actualizar obra:', error);

    if (sendFunnelBeckLinkError(res, error)) return;

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(400).json({ error: 'El código de obra ya existe' });
      return;
    }

    res.status(500).json({ error: 'Error al actualizar obra' });
  }
};

export const cambiarEstadoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { estado } = req.body as CambiarEstadoObraBody;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de obra invalido' });
      return;
    }

    const estadoObra = parseEstadoObra(estado);
    if (!estadoObra) {
      res.status(400).json({
        error: 'Estado invalido. Debe ser: activa, inactiva, pausada o finalizada',
      });
      return;
    }

    const existente = await prisma.obra.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const obra = await prisma.obra.update({
      where: { id },
      data: { estado: estadoObra },
      include: obraUsuariosInclude,
    });

    res.json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al cambiar estado de obra:', error);
    res.status(500).json({ error: 'Error al cambiar estado de obra' });
  }
};

export const eliminarObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existente = await prisma.obra.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const registrosCount = await prisma.registroTerreno.count({
      where: { obraId: id },
    });

    if (registrosCount > 0) {
      res.status(400).json({
        error: 'No se puede eliminar la obra porque tiene registros asociados',
      });
      return;
    }

    await prisma.obra.delete({ where: { id } });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'OBRA',
      tipo: 'OBRA_ELIMINADA',
      entidadId: id,
      descripcion: `Se eliminó obra ${existente.nombre}`,
      datos: {
        nombre: existente.nombre,
        codigo: existente.codigo,
        estado: existente.estado,
      },
    });

    res.json({ mensaje: 'Obra eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar obra:', error);
    res.status(500).json({ error: 'Error al eliminar obra' });
  }
};

export const asignarUsuariosObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { usuariosIds, usuarioIds } = req.body as AsignarUsuariosObraBody;
    const idsPayload = usuariosIds ?? usuarioIds;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de obra invalido' });
      return;
    }

    if (!Array.isArray(idsPayload) || !idsPayload.every((value) => typeof value === 'string')) {
      res.status(400).json({ error: 'usuariosIds debe ser un array de strings' });
      return;
    }

    const obra = await prisma.obra.findUnique({ where: { id } });
    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const uniqueIds = [...new Set(idsPayload)];
    const usuariosExistentes = await prisma.usuario.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true },
    });
    const usuariosExistentesIds = new Set(usuariosExistentes.map((usuario) => usuario.id));
    const usuariosInvalidos = uniqueIds.filter((usuarioId) => !usuariosExistentesIds.has(usuarioId));

    if (usuariosInvalidos.length > 0) {
      res.status(400).json({
        error: 'Uno o mas usuarios no existen',
        usuariosInvalidos,
      });
      return;
    }

    const asignacionesPrevias = await prisma.usuarios_obras.findMany({
      where: { obra_id: id },
      select: { usuario_id: true },
    });
    const idsPrevios = asignacionesPrevias.map((asignacion) => asignacion.usuario_id);
    const idsPreviosSet = new Set(idsPrevios);
    const uniqueIdsSet = new Set(uniqueIds);
    const idsAgregados = uniqueIds.filter((usuarioId) => !idsPreviosSet.has(usuarioId));
    const idsRemovidos = idsPrevios.filter((usuarioId) => !uniqueIdsSet.has(usuarioId));

    const usuariosMovimientoIds = [...new Set([...idsAgregados, ...idsRemovidos])];
    const usuariosMovimiento = await prisma.usuario.findMany({
      where: { id: { in: usuariosMovimientoIds } },
      select: { id: true, nombre: true },
    });
    const nombresPorId = new Map(
      usuariosMovimiento.map((usuario) => [usuario.id, usuario.nombre])
    );
    const nombresAgregados = idsAgregados.map(
      (usuarioId) => nombresPorId.get(usuarioId) ?? usuarioId
    );
    const nombresRemovidos = idsRemovidos.map(
      (usuarioId) => nombresPorId.get(usuarioId) ?? usuarioId
    );
    const accionesMovimiento: string[] = [];

    if (nombresAgregados.length > 0) {
      accionesMovimiento.push(`Se asignó a ${unirNombres(nombresAgregados)}`);
    }

    if (nombresRemovidos.length > 0) {
      const prefijo = accionesMovimiento.length > 0 ? 'se quitó' : 'Se quitó';
      accionesMovimiento.push(`${prefijo} a ${unirNombres(nombresRemovidos)}`);
    }

    const descripcionMovimiento =
      `${accionesMovimiento.join(' y ')} ${
        idsAgregados.length === 0 && idsRemovidos.length > 0 ? 'de' : 'en'
      } la obra ${obra.nombre}`;

    await prisma.$transaction(async (tx) => {
      await tx.usuarios_obras.deleteMany({ where: { obra_id: id } });
      if (uniqueIds.length > 0) {
        await tx.usuarios_obras.createMany({
          data: uniqueIds.map((usuarioId) => ({
            usuario_id: usuarioId,
            obra_id: id,
          })),
          skipDuplicates: true,
        });
      }
    });

    if (idsAgregados.length > 0 || idsRemovidos.length > 0) {
      await registrarMovimientoCRM({
        usuarioId: req.userId ?? '',
        modulo: 'OBRA',
        tipo: 'OBRA_EDITADA',
        entidadId: id,
        descripcion: descripcionMovimiento,
        datos: {
          obraId: id,
          agregados: idsAgregados,
          removidos: idsRemovidos,
          usuariosActuales: uniqueIds,
        },
      });
    }

    const obraActualizada = await prisma.obra.findUnique({
      where: { id },
      include: obraUsuariosInclude,
    });

    if (!obraActualizada) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    res.json(formatObraResponse(obraActualizada));
  } catch (error) {
    console.error('Error al asignar usuarios a obra:', error);
    res.status(500).json({ error: 'Error al asignar usuarios' });
  }
};

export const listarUsuariosObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const obra = await prisma.obra.findUnique({ where: { id } });
    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const asignaciones = await prisma.usuarios_obras.findMany({
      where: { obra_id: id },
      select: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            activo: true,
          },
        },
      },
    });

    const usuarios = asignaciones.map((a) => a.usuarios);

    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios de obra:', error);
    res.status(500).json({ error: 'Error al listar usuarios de obra' });
  }
};

export const misObras = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId ?? '';
    const rol = req.userRole;

    // Terreno y jefeobra ven todas las obras activas sin depender de usuarios_obras
    if (rol === 'terreno' || rol === 'jefeobra') {
      const obras = await prisma.obra.findMany({
        where: { estado: EstadoObra.activa },
        orderBy: { createdAt: 'desc' },
      });
      res.json(obras);
      return;
    }

    const asignaciones = await prisma.usuarios_obras.findMany({
      where: { usuario_id: userId },
      select: { obras: true },
    });

    const obras = asignaciones.map((a) => a.obras);

    res.json(obras);
  } catch (error) {
    console.error('Error al obtener mis obras:', error);
    res.status(500).json({ error: 'Error al obtener mis obras' });
  }
};
