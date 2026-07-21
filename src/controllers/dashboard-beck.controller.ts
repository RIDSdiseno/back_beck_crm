import { Request, Response } from 'express';
import { EstadoRegistroTerreno, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { calcularRendimientoPorTrabajador } from '../services/rendimientoTrabajador.service';

type RangoDashboard = 'hoy' | 'semana' | 'mes' | 'completa';

const rangosValidos: RangoDashboard[] = ['hoy', 'semana', 'mes', 'completa'];

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const getDateRange = (rango: RangoDashboard): { fechaDesde: Date | null; fechaHasta: Date | null } => {
  const now = new Date();

  if (rango === 'completa') {
    return { fechaDesde: null, fechaHasta: null };
  }

  if (rango === 'hoy') {
    return {
      fechaDesde: startOfDay(now),
      fechaHasta: endOfDay(now),
    };
  }

  if (rango === 'semana') {
    const fechaDesde = startOfDay(now);
    fechaDesde.setDate(fechaDesde.getDate() - 6);

    return {
      fechaDesde,
      fechaHasta: endOfDay(now),
    };
  }

  return {
    fechaDesde: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    fechaHasta: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
};

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const normalizeNombreSellador = (nombreSellador: string): string => nombreSellador.trim() || 'Sin sellador';
const normalizePiso = (piso: string): string => piso.trim() || 'Sin piso';

export const getDashboardBeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' && req.query.obraId.trim() !== ''
      ? req.query.obraId.trim()
      : undefined;
    const rango = typeof req.query.rango === 'string' && req.query.rango.trim() !== ''
      ? req.query.rango.trim()
      : 'completa';

    if (!rangosValidos.includes(rango as RangoDashboard)) {
      res.status(400).json({ error: 'Rango invalido' });
      return;
    }

    if (obraId && !isUuid(obraId)) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const rangoDashboard = rango as RangoDashboard;
    const { fechaDesde, fechaHasta } = getDateRange(rangoDashboard);

    if (obraId) {
      const obraExiste = await prisma.obra.findUnique({
        where: { id: obraId },
        select: { id: true },
      });

      if (!obraExiste) {
        res.status(404).json({ error: 'Obra no encontrada' });
        return;
      }
    }

    const where: Prisma.RegistroTerrenoWhereInput = {};

    if (obraId) {
      where.obraId = obraId;
    }

    if (fechaDesde && fechaHasta) {
      where.fecha = {
        gte: fechaDesde,
        lte: fechaHasta,
      };
    }

    const [obras, registros] = await Promise.all([
      prisma.obra.findMany({
        where: obraId ? { id: obraId } : undefined,
        select: {
          id: true,
          nombre: true,
          codigo: true,
          estado: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      }),
      prisma.registroTerreno.findMany({
        where,
        select: {
          id: true,
          fecha: true,
          piso: true,
          nombreSellador: true,
          cantidadSellos: true,
          metrosLineales: true,
          factorPorHolguras: true,
          accesibilidad: true,
          cantidadSellosConFactores: true,
          aislacion: true,
          cantidadSellosAislacion: true,
          reparacionTabique: true,
          cantidadFinal: true,
          estado: true,
          tipoRegistro: true,
          createdAt: true,
          codigoBeck: true,
          obraId: true,
          obra: {
            select: {
              nombre: true,
            },
          },
        },
        orderBy: [
          { fecha: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
    ]);

    const produccionPorPiso = new Map<string, { piso: string; sellos: number; metrosLineales: number; registros: number }>();
    const produccionPorPersona = new Map<string, { nombreSellador: string; sellos: number; metrosLineales: number; registros: number }>();
    const pisosConRegistros = new Set<string>();
    const selladoresDistintos = new Set<string>();

    const kpis = {
      sellosEjecutados: 0,
      metrosLineales: 0,
      registrosPendientes: 0,
      registrosEnRevision: 0,
      registrosValidados: 0,
      registrosRechazados: 0,
      pisosConRegistros: 0,
      selladoresDistintos: 0,
    };

    registros.forEach((registro) => {
      const piso = normalizePiso(registro.piso);
      const nombreSellador = normalizeNombreSellador(registro.nombreSellador);
      const esMetrosLineales = registro.tipoRegistro === 'junta_lineal_espuma';
      const sellos = esMetrosLineales ? 0 : registro.cantidadSellos;
      const metrosLineales = esMetrosLineales ? registro.metrosLineales ?? 0 : 0;

      kpis.sellosEjecutados += sellos;
      kpis.metrosLineales += metrosLineales;

      if (registro.estado === EstadoRegistroTerreno.pendiente) kpis.registrosPendientes += 1;
      if (registro.estado === EstadoRegistroTerreno.en_revision) kpis.registrosEnRevision += 1;
      if (registro.estado === EstadoRegistroTerreno.validado) kpis.registrosValidados += 1;
      if (registro.estado === EstadoRegistroTerreno.rechazado) kpis.registrosRechazados += 1;

      pisosConRegistros.add(piso);
      selladoresDistintos.add(nombreSellador);

      const pisoStats = produccionPorPiso.get(piso) ?? { piso, sellos: 0, metrosLineales: 0, registros: 0 };
      pisoStats.sellos += sellos;
      pisoStats.metrosLineales += metrosLineales;
      pisoStats.registros += 1;
      produccionPorPiso.set(piso, pisoStats);

      const personaStats = produccionPorPersona.get(nombreSellador) ?? {
        nombreSellador,
        sellos: 0,
        metrosLineales: 0,
        registros: 0,
      };
      personaStats.sellos += sellos;
      personaStats.metrosLineales += metrosLineales;
      personaStats.registros += 1;
      produccionPorPersona.set(nombreSellador, personaStats);
    });

    kpis.pisosConRegistros = pisosConRegistros.size;
    kpis.selladoresDistintos = selladoresDistintos.size;

    const rendimientoPorTrabajador = await calcularRendimientoPorTrabajador(registros);

    res.json({
      obras,
      filtros: {
        obraId: obraId ?? null,
        rango: rangoDashboard,
        fechaDesde: fechaDesde?.toISOString() ?? null,
        fechaHasta: fechaHasta?.toISOString() ?? null,
      },
      kpis,
      produccionPorPiso: Array.from(produccionPorPiso.values()),
      produccionPorPersona: Array.from(produccionPorPersona.values()),
      rendimientoPorTrabajador,
      ultimosRegistros: registros.slice(0, 10).map((registro) => ({
        id: registro.id,
        fecha: registro.fecha,
        obra: registro.obra.nombre,
        piso: registro.piso,
        nombreSellador: registro.nombreSellador,
        cantidadSellos: registro.cantidadSellos,
        metrosLineales: registro.metrosLineales ?? 0,
        factor_por_holguras: registro.factorPorHolguras,
        accesibilidad: registro.accesibilidad,
        cielo_modular: registro.accesibilidad,
        cantidad_sellos_con_factores: registro.cantidadSellosConFactores,
        aislacion: registro.aislacion,
        cantidad_sellos_aislacion: registro.cantidadSellosAislacion,
        reparacion_tabique: registro.reparacionTabique,
        cantidad_final: registro.cantidadFinal,
        estado: registro.estado,
        tipoRegistro: registro.tipoRegistro,
      })),
    });
  } catch (error) {
    console.error('Error al obtener dashboard Beck:', error);
    res.status(500).json({ error: 'Error al obtener dashboard Beck' });
  }
};
