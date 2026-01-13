import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

/**
 * Obtener estadísticas del dashboard
 * GET /api/stats/dashboard
 */
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Total de registros de terreno
    const totalRegistros = await prisma.registroTerreno.count();

    // Total de registros procesados
    const registrosProcesados = await prisma.registroTerreno.count({
      where: { procesado: true },
    });

    // Total de registros pendientes
    const registrosPendientes = await prisma.registroTerreno.count({
      where: { procesado: false },
    });

    // Suma de cantidad de sellos
    const totalSellosResult = await prisma.registroTerreno.aggregate({
      _sum: {
        cantidadSellos: true,
      },
    });

    const totalSellos = totalSellosResult._sum.cantidadSellos || 0;

    // Sellos ponderados (suma de total_sellos_calculado)
    const sellosPonderadosResult = await prisma.procesamientoIngenieria.aggregate({
      _sum: {
        totalSellosCalculado: true,
      },
    });

    const sellosPonderados = Number(sellosPonderadosResult._sum.totalSellosCalculado || 0);

    // Total de obras activas
    const obrasActivas = await prisma.obra.count({
      where: { estado: 'activa' },
    });

    // Registros de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const registrosHoy = await prisma.registroTerreno.count({
      where: {
        createdAt: {
          gte: hoy,
          lt: manana,
        },
      },
    });

    // Registros por obra (top 5)
    const registrosPorObra = await prisma.registroTerreno.groupBy({
      by: ['obraId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Obtener nombres de obras
    const obraIds = registrosPorObra.map((r) => r.obraId);
    const obras = await prisma.obra.findMany({
      where: {
        id: {
          in: obraIds,
        },
      },
      select: {
        id: true,
        nombre: true,
        codigo: true,
      },
    });

    const obrasPorRegistros = registrosPorObra.map((r) => {
      const obra = obras.find((o) => o.id === r.obraId);
      return {
        obraId: r.obraId,
        nombre: obra?.nombre || 'Sin nombre',
        codigo: obra?.codigo || '',
        registros: r._count.id,
      };
    });

    res.json({
      totalRegistros,
      registrosProcesados,
      registrosPendientes,
      totalSellos,
      sellosPonderados,
      obrasActivas,
      registrosHoy,
      obrasPorRegistros,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

/**
 * Obtener estadísticas de obras
 * GET /api/stats/obras
 */
export const getObrasStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const obras = await prisma.obra.findMany({
      include: {
        _count: {
          select: {
            registrosTerreno: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const obrasConStats = obras.map((obra) => ({
      id: obra.id,
      nombre: obra.nombre,
      codigo: obra.codigo,
      estado: obra.estado,
      totalRegistros: obra._count.registrosTerreno,
    }));

    res.json(obrasConStats);
  } catch (error) {
    console.error('Error al obtener estadísticas de obras:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de obras' });
  }
};
