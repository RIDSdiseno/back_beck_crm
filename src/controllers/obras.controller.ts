// src/controllers/obras.controller.ts
import { Request, Response } from 'express';
import { EstadoObra, EstadoPreparacionItemizado, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';
import {
  TIPOS_REGISTRO_VALIDOS,
  validarTiposRegistroSistema,
} from '../helpers/tiposRegistro';
import { puedeCambiarEmpresa } from '../helpers/puedeCambiarEmpresa';
import { existeItemizadoPropuestoParaObra } from '../services/itemizadoPreparacionObra.service';

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
      region: true,
      comuna: true,
      clienteBeckId: true,
      clienteBeck: {
        select: {
          id: true,
          rut: true,
          razonSocial: true,
          nombreEmpresa: true,
        },
      },
    },
  },
  clienteBeck: {
    select: {
      id: true,
      rut: true,
      razonSocial: true,
      nombreEmpresa: true,
    },
  },
  itemizadoFinalizadoPor: {
    select: {
      id: true,
      nombre: true,
      email: true,
    },
  },
  tiposRegistro: {
    where: { activo: true },
    select: { tipoRegistro: true },
    orderBy: { tipoRegistro: 'asc' },
  },
} satisfies Prisma.ObraInclude;

type ObraConUsuarios = Prisma.ObraGetPayload<{
  include: typeof obraUsuariosInclude;
}>;

type ObraResponse = Omit<ObraConUsuarios, 'usuarios_obras' | 'tiposRegistro'> & {
  usuarios: ObraConUsuarios['usuarios_obras'][number]['usuarios'][];
  funnelBeckId: string | null;
  funnelBeck: ObraConUsuarios['oportunidades'][number] | null;
  tiposRegistro: string[];
};

const formatObraResponse = (obra: ObraConUsuarios): ObraResponse => {
  const { usuarios_obras, ...obraData } = obra;
  const oportunidadVinculada = obra.oportunidades[0] ?? null;
  return {
    ...obraData,
    usuarios: usuarios_obras.map((asignacion) => asignacion.usuarios),
    funnelBeckId: oportunidadVinculada?.id ?? null,
    funnelBeck: oportunidadVinculada,
    tiposRegistro: obra.tiposRegistro.map((t) => t.tipoRegistro),
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
  region?: unknown;
  comuna?: unknown;
  cliente?: unknown;
  estado?: unknown;
  funnelBeckId?: unknown;
  clienteBeckId?: unknown;
};

type ActualizarObraBody = {
  codigo?: unknown;
  nombre?: unknown;
  direccion?: unknown;
  region?: unknown;
  comuna?: unknown;
  cliente?: unknown;
  estado?: unknown;
  funnelBeckId?: unknown;
  clienteBeckId?: unknown;
};

type CambiarEstadoObraBody = {
  estado?: unknown;
};

type AsignarUsuariosObraBody = {
  usuariosIds?: unknown;
  usuarioIds?: unknown;
};

type ActualizarTiposRegistroObraBody = {
  tiposRegistro?: unknown;
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

    const [obra, tiposRegistro] = await Promise.all([
      prisma.obra.findUnique({ where: { id }, include: obraUsuariosInclude }),
      prisma.obraTipoRegistro.findMany({
        where: { obraId: id, activo: true },
        select: { tipoRegistro: true },
        orderBy: { tipoRegistro: 'asc' },
      }),
    ]);

    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    res.json({
      ...formatObraResponse(obra),
      tiposRegistro: tiposRegistro.map((t) => t.tipoRegistro),
    });
  } catch (error) {
    console.error('Error al obtener obra:', error);
    res.status(500).json({ error: 'Error al obtener obra' });
  }
};

export const crearObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, nombre, descripcion, direccion, region, comuna, cliente, estado, funnelBeckId, clienteBeckId } =
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
    const clienteBeckIdFinal =
      typeof clienteBeckId === 'string' && clienteBeckId.trim() ? clienteBeckId.trim() : null;

    let clienteBeckRecord: { razonSocial: string; nombreEmpresa: string | null } | null = null;
    if (clienteBeckIdFinal) {
      clienteBeckRecord = await prisma.clienteBeck.findUnique({
        where: { id: clienteBeckIdFinal },
        select: { razonSocial: true, nombreEmpresa: true },
      });
      if (!clienteBeckRecord) {
        res.status(404).json({ error: 'Cliente Beck no encontrado' });
        return;
      }
    }

    const clienteTexto =
      typeof cliente === 'string'
        ? cliente
        : clienteBeckRecord
          ? (clienteBeckRecord.nombreEmpresa || clienteBeckRecord.razonSocial)
          : undefined;

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
          region: typeof region === 'string' && region.trim() ? region.trim() : undefined,
          comuna: typeof comuna === 'string' && comuna.trim() ? comuna.trim() : undefined,
          cliente: clienteTexto,
          estado: estadoObra,
          creadoPorId: req.userId ?? '',
          ...(clienteBeckIdFinal && { clienteBeckId: clienteBeckIdFinal }),
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
    const { nombre, codigo, direccion, region, comuna, cliente, estado, funnelBeckId, clienteBeckId } = req.body as ActualizarObraBody;

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

    // undefined = no change | null/'' = borrar | 'uuid' = asignar
    let clienteBeckIdUpdate: string | null | undefined = undefined;
    let clienteBeckRecord: { razonSocial: string; nombreEmpresa: string | null } | null = null;
    if (clienteBeckId !== undefined) {
      if (clienteBeckId === null || (typeof clienteBeckId === 'string' && clienteBeckId.trim() === '')) {
        clienteBeckIdUpdate = null;
      } else if (typeof clienteBeckId === 'string') {
        const trimmed = clienteBeckId.trim();
        clienteBeckRecord = await prisma.clienteBeck.findUnique({
          where: { id: trimmed },
          select: { razonSocial: true, nombreEmpresa: true },
        });
        if (!clienteBeckRecord) {
          res.status(404).json({ error: 'Cliente Beck no encontrado' });
          return;
        }
        clienteBeckIdUpdate = trimmed;
      }
    }

    // Check permission if cliente or clienteBeckId is changing
    if (req.userId && req.userRole && req.userRole !== 'administrador') {
      const clienteCambia = typeof cliente === 'string' && cliente !== existente.cliente;
      const clienteBeckCambia = clienteBeckIdUpdate !== undefined && clienteBeckIdUpdate !== existente.clienteBeckId;
      if (clienteCambia || clienteBeckCambia) {
        const puede = await puedeCambiarEmpresa(req.userId, req.userRole, 'beck');
        if (!puede) {
          res.status(403).json({ error: 'No tienes permiso para cambiar la empresa o cliente asociado.' });
          return;
        }
      }
    }

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
          ...(typeof region === 'string' && { region: region.trim() || null }),
          ...(typeof comuna === 'string' && { comuna: comuna.trim() || null }),
          ...(typeof cliente === 'string'
            ? { cliente }
            : clienteBeckRecord
              ? { cliente: clienteBeckRecord.nombreEmpresa || clienteBeckRecord.razonSocial }
              : {}),
          ...(estadoObra !== undefined && { estado: estadoObra }),
          ...(clienteBeckIdUpdate !== undefined && { clienteBeckId: clienteBeckIdUpdate }),
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

export const obtenerTiposRegistroObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const obra = await prisma.obra.findUnique({ where: { id }, select: { id: true } });
    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const tipos = await prisma.obraTipoRegistro.findMany({
      where: { obraId: id, activo: true },
      select: { tipoRegistro: true },
      orderBy: { tipoRegistro: 'asc' },
    });

    res.json({
      obraId: id,
      tiposRegistro: tipos.map((t) => t.tipoRegistro),
    });
  } catch (error) {
    console.error('Error al obtener tipos de registro de obra:', error);
    res.status(500).json({ error: 'Error al obtener tipos de registro' });
  }
};

export const actualizarTiposRegistroObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { tiposRegistro } = req.body as ActualizarTiposRegistroObraBody;

    if (!Array.isArray(tiposRegistro)) {
      res.status(400).json({ error: 'tiposRegistro debe ser un array' });
      return;
    }

    if (!validarTiposRegistroSistema(tiposRegistro)) {
      res.status(400).json({
        error: `Tipos inválidos. Valores permitidos: ${TIPOS_REGISTRO_VALIDOS.join(', ')}`,
      });
      return;
    }

    const obra = await prisma.obra.findUnique({ where: { id }, select: { id: true } });
    if (!obra) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const uniqueTipos = [...new Set(tiposRegistro)];

    await prisma.$transaction(async (tx) => {
      await tx.obraTipoRegistro.deleteMany({ where: { obraId: id } });
      if (uniqueTipos.length > 0) {
        await tx.obraTipoRegistro.createMany({
          data: uniqueTipos.map((tipo) => ({
            obraId: id,
            tipoRegistro: tipo,
            activo: true,
          })),
        });
      }
    });

    res.json({
      obraId: id,
      tiposRegistro: uniqueTipos,
    });
  } catch (error) {
    console.error('Error al actualizar tipos de registro de obra:', error);
    res.status(500).json({ error: 'Error al actualizar tipos de registro' });
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

/**
 * Beck envía la propuesta de itemizado al cliente: PREPARACION → EN_REVISION_CLIENTE.
 * A partir de aquí Beck ya no puede modificar la configuración (ver
 * assertItemizadoObraEditable) y el cliente puede ver/seleccionar/nombrar los
 * itemizados propuestos hasta que confirme (ver confirmarItemizadoCliente en
 * cliente.controller.ts). Exige al menos un itemizado con propuestoAlCliente=true.
 */
export const enviarItemizadoARevisionCliente = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const obraId = req.params.obraId;

    if (typeof obraId !== 'string') {
      res.status(400).json({ error: 'ID de obra invalido' });
      return;
    }

    const existente = await prisma.obra.findUnique({
      where: { id: obraId },
      select: { id: true, estadoPreparacionItemizado: true },
    });

    if (!existente) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    if (existente.estadoPreparacionItemizado === EstadoPreparacionItemizado.EN_REVISION_CLIENTE) {
      res.status(409).json({
        error: 'La propuesta de itemizado ya fue enviada a revisión del cliente.',
      });
      return;
    }

    if (existente.estadoPreparacionItemizado === EstadoPreparacionItemizado.FINALIZADO) {
      res.status(409).json({
        error: 'El itemizado ya fue confirmado y no puede reenviarse.',
      });
      return;
    }

    const tieneItemizadoPropuesto = await existeItemizadoPropuestoParaObra(obraId);
    if (!tieneItemizadoPropuesto) {
      res.status(409).json({
        error: 'No se puede enviar al cliente: la obra no tiene ningún itemizado incluido en la propuesta.',
      });
      return;
    }

    const obra = await prisma.obra.update({
      where: { id: obraId },
      data: {
        estadoPreparacionItemizado: EstadoPreparacionItemizado.EN_REVISION_CLIENTE,
        itemizadoFinalizadoAt: new Date(),
        itemizadoFinalizadoPorId: req.userId ?? '',
      },
      include: obraUsuariosInclude,
    });

    await registrarMovimientoCRM({
      usuarioId: req.userId ?? '',
      modulo: 'OBRA',
      tipo: 'OBRA_EDITADA',
      entidadId: obra.id,
      descripcion: `Se envió a revisión del cliente el itemizado de la obra ${obra.nombre}`,
    });

    res.json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al enviar itemizado a revisión del cliente:', error);
    res.status(500).json({ error: 'Error al enviar itemizado a revisión del cliente' });
  }
};
