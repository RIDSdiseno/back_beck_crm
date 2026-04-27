import {
  ModuloMovimientoCRM,
  TipoMovimientoCRM,
  Prisma,
} from '@prisma/client';
import { prisma } from '../config/prisma';

type RegistrarMovimientoCRMInput = {
  usuarioId: string;
  modulo: ModuloMovimientoCRM;
  tipo: TipoMovimientoCRM;
  entidadId?: string | null;
  descripcion: string;
  datos?: Prisma.InputJsonValue | null;
};

type ListarMovimientosCRMParams = {
  modulo?: ModuloMovimientoCRM;
  tipo?: TipoMovimientoCRM;
  usuarioId?: string;
  entidadId?: string;
  limit?: number;
  page?: number;
};

export const registrarMovimientoCRM = async ({
  usuarioId,
  modulo,
  tipo,
  entidadId = null,
  descripcion,
  datos,
}: RegistrarMovimientoCRMInput) => {
  if (!usuarioId) {
    return null;
  }

  if (!descripcion.trim()) {
    return null;
  }

  return prisma.movimientoCRM.create({
    data: {
      usuarioId,
      modulo,
      tipo,
      entidadId,
      descripcion: descripcion.trim(),
      datos: datos ?? Prisma.JsonNull,
    },
  });
};

export const listarMovimientosCRM = async ({
  modulo,
  tipo,
  usuarioId,
  entidadId,
  limit = 50,
  page = 1,
}: ListarMovimientosCRMParams = {}) => {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    ...(modulo && { modulo }),
    ...(tipo && { tipo }),
    ...(usuarioId && { usuarioId }),
    ...(entidadId && { entidadId }),
  };

  const [items, total] = await Promise.all([
    prisma.movimientoCRM.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: safeLimit,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
    }),
    prisma.movimientoCRM.count({ where }),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const getMovimientoCRMById = async (id: string) => {
  return prisma.movimientoCRM.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
        },
      },
    },
  });
};

export const MovimientosCrmService = {
  registrarMovimientoCRM,
  listarMovimientosCRM,
  getMovimientoCRMById,
};