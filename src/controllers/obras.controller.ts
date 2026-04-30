// src/controllers/obras.controller.ts
import { Request, Response } from 'express';
import { EstadoObra, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';

const generarCodigoObra = (nombre: string): string => {
  const year = new Date().getFullYear();
  const palabras = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(' ')
    .filter(Boolean);
  const iniciales = palabras.map((p) => p[0].toUpperCase()).join('');
  return `${iniciales}-${year}`;
};

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

type CrearObraBody = {
  codigo?: unknown;
  nombre?: unknown;
  descripcion?: unknown;
  direccion?: unknown;
  cliente?: unknown;
  estado?: unknown;
};

type ActualizarObraBody = {
  codigo?: unknown;
  nombre?: unknown;
  direccion?: unknown;
  cliente?: unknown;
  estado?: unknown;
};

type CambiarEstadoObraBody = {
  estado?: unknown;
};

type AsignarUsuariosObraBody = {
  usuariosIds?: unknown;
  usuarioIds?: unknown;
};

export const listarObras = async (req: Request, res: Response): Promise<void> => {
  try {
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
    const { codigo, nombre, descripcion, direccion, cliente, estado } =
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

    const codigoBase =
      typeof codigo === 'string' && codigo.trim()
        ? codigo.trim()
        : generarCodigoObra(nombre);
    let codigoFinal = codigoBase;
    let sufijo = 2;
    while (await prisma.obra.findFirst({ where: { codigo: codigoFinal } })) {
      codigoFinal = `${codigoBase}-${sufijo}`;
      sufijo++;
    }

    const obra = await prisma.obra.create({
      data: {
        nombre: nombre.trim(),
        codigo: codigoFinal,
        descripcion: typeof descripcion === 'string' ? descripcion : undefined,
        direccion: typeof direccion === 'string' ? direccion : undefined,
        cliente: typeof cliente === 'string' ? cliente : undefined,
        estado: estadoObra,
        creadoPorId: req.userId ?? '',
      },
      include: obraUsuariosInclude,
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
    const { nombre, codigo, direccion, cliente, estado } = req.body as ActualizarObraBody;

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

    const obra = await prisma.obra.update({
      where: { id },
      data: {
        ...(typeof nombre === 'string' && { nombre: nombre.trim() }),
        ...(typeof codigo === 'string' && { codigo: codigo.trim() }),
        ...(typeof direccion === 'string' && { direccion }),
        ...(typeof cliente === 'string' && { cliente }),
        ...(estadoObra !== undefined && { estado: estadoObra }),
      },
      include: obraUsuariosInclude,
    });

    res.json(formatObraResponse(obra));
  } catch (error) {
    console.error('Error al actualizar obra:', error);

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
