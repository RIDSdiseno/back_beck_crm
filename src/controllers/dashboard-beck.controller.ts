import { Request, Response } from 'express';
import { EstadoRegistroTerreno, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { calcularRendimientoPorTrabajador, calcularRendimientoDetallado, ValidacionIngenieriaFiltro, validacionesIngenieriaValidas } from '../services/rendimientoTrabajador.service';
import { getDateRange, rangosRapidosValidos, RangoRapido } from '../helpers/rangoFechas';

type RangoDashboard = RangoRapido;

const rangosValidos: RangoDashboard[] = rangosRapidosValidos;

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

const parseFechaParam = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * GET /api/dashboard/beck/rendimiento-trabajadores
 *
 * Endpoint delgado y dedicado al bloque "Rendimiento por trabajador" del
 * Dashboard Beck. Tiene sus propios filtros (obra, trabajador, rango de
 * fechas, validación de Ingeniería) totalmente independientes de los
 * filtros globales de GET /api/dashboard/beck, para no afectar KPIs,
 * producción por piso ni producción por persona. Reutiliza el 100% de la
 * lógica de cálculo de rendimiento (calcularRendimientoDetallado).
 */
export const getRendimientoTrabajadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = typeof req.query.obraId === 'string' && req.query.obraId.trim() !== ''
      ? req.query.obraId.trim()
      : undefined;
    const trabajador = typeof req.query.trabajador === 'string' && req.query.trabajador.trim() !== ''
      ? req.query.trabajador.trim()
      : undefined;
    const rango = typeof req.query.rango === 'string' && req.query.rango.trim() !== ''
      ? req.query.rango.trim()
      : 'completa';
    const validacionIngenieria = typeof req.query.validacionIngenieria === 'string' && req.query.validacionIngenieria.trim() !== ''
      ? req.query.validacionIngenieria.trim()
      : 'todos';

    if (!rangosValidos.includes(rango as RangoDashboard)) {
      res.status(400).json({ error: 'Rango invalido' });
      return;
    }

    if (!validacionesIngenieriaValidas.includes(validacionIngenieria as ValidacionIngenieriaFiltro)) {
      res.status(400).json({ error: 'Filtro de validacion de Ingenieria invalido' });
      return;
    }

    if (obraId && !isUuid(obraId)) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    if (obraId) {
      const obraExiste = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
      if (!obraExiste) {
        res.status(404).json({ error: 'Obra no encontrada' });
        return;
      }
    }

    const fechaInicioParam = parseFechaParam(req.query.fechaInicio);
    const fechaFinParam = parseFechaParam(req.query.fechaFin);

    let fechaDesde: Date | null;
    let fechaHasta: Date | null;
    let rangoEfectivo: string;

    if (fechaInicioParam && fechaFinParam) {
      fechaDesde = new Date(fechaInicioParam);
      fechaDesde.setHours(0, 0, 0, 0);
      fechaHasta = new Date(fechaFinParam);
      fechaHasta.setHours(23, 59, 59, 999);
      rangoEfectivo = 'personalizado';
    } else {
      const rangoDashboard = rango as RangoDashboard;
      const resuelto = getDateRange(rangoDashboard);
      fechaDesde = resuelto.fechaDesde;
      fechaHasta = resuelto.fechaHasta;
      rangoEfectivo = rangoDashboard;
    }

    const where: Prisma.RegistroTerrenoWhereInput = {};
    if (obraId) where.obraId = obraId;
    if (trabajador) where.nombreSellador = trabajador;
    if (fechaDesde && fechaHasta) where.fecha = { gte: fechaDesde, lte: fechaHasta };

    const [trabajadoresDisponiblesRaw, registros] = await Promise.all([
      prisma.registroTerreno.findMany({
        where: obraId ? { obraId } : undefined,
        distinct: ['nombreSellador'],
        select: { nombreSellador: true },
        orderBy: { nombreSellador: 'asc' },
      }),
      prisma.registroTerreno.findMany({
        where,
        select: {
          fecha: true,
          tipoRegistro: true,
          nombreSellador: true,
          cantidadSellos: true,
          metrosLineales: true,
          codigoBeck: true,
          obraId: true,
          estado: true,
          obra: {
            select: {
              nombre: true,
            },
          },
        },
      }),
    ]);

    const trabajadoresDisponibles = trabajadoresDisponiblesRaw
      .map((r) => r.nombreSellador?.trim())
      .filter((n): n is string => Boolean(n));

    const { trabajadores, detalleCodigos } = await calcularRendimientoDetallado(
      registros,
      validacionIngenieria as ValidacionIngenieriaFiltro,
    );

    res.json({
      filtros: {
        obraId: obraId ?? null,
        trabajador: trabajador ?? null,
        rango: rangoEfectivo,
        fechaDesde: fechaDesde?.toISOString() ?? null,
        fechaHasta: fechaHasta?.toISOString() ?? null,
        validacionIngenieria,
      },
      trabajadoresDisponibles,
      trabajadores,
      detalleCodigos,
    });
  } catch (error) {
    console.error('Error al obtener rendimiento por trabajador:', error);
    res.status(500).json({ error: 'Error al obtener rendimiento por trabajador' });
  }
};
