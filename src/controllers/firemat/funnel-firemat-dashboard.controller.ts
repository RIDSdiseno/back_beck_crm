import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

const ETAPAS_TODAS = [
  'PROSPECTO',
  'PRIMER_CONTACTO',
  'DESARROLLO_COTIZACION',
  'COTIZACION_ENVIADA',
  'ORDEN_CONFIRMADA',
  'GANADA',
  'PERDIDA',
  'POSTERGADA',
  'DESCARTADO',
] as const;

type EtapaFiremat = (typeof ETAPAS_TODAS)[number];

const ETAPAS_CERRADAS: string[] = ['GANADA', 'PERDIDA', 'POSTERGADA', 'DESCARTADO'];
const ETAPAS_CERRADAS_SET = new Set<string>(ETAPAS_CERRADAS);

const ETAPAS_FUNNEL: EtapaFiremat[] = [
  'PROSPECTO',
  'PRIMER_CONTACTO',
  'DESARROLLO_COTIZACION',
  'COTIZACION_ENVIADA',
  'ORDEN_CONFIRMADA',
  'GANADA',
];

const ETAPA_LABELS: Record<EtapaFiremat, string> = {
  PROSPECTO:              'Prospecto',
  PRIMER_CONTACTO:        'Primer contacto',
  DESARROLLO_COTIZACION:  'Desarrollo cotización',
  COTIZACION_ENVIADA:     'Cotización enviada',
  ORDEN_CONFIRMADA:       'Orden confirmada',
  GANADA:                 'Ganada',
  PERDIDA:                'Perdida',
  POSTERGADA:             'Postergada',
  DESCARTADO:             'Descartado',
};

function endOfDay(d: Date): Date {
  const r = new Date(d); r.setHours(23, 59, 59, 999); return r;
}
function startOfDay(d: Date): Date {
  const r = new Date(d); r.setHours(0, 0, 0, 0); return r;
}
function isActiva(etapa: string): boolean {
  return !ETAPAS_CERRADAS_SET.has(etapa);
}

type OppRow = {
  id: number;
  cliente: string;
  nombreOportunidad: string | null;
  responsable: string | null;
  etapa: string;
  montoEstimado: number;
  updatedAt: Date;
  createdAt: Date;
  fechaProximaAccion: Date | null;
  fechaCierre: Date | null;
  fechaProbableCierre: Date | null;
  probabilidadCierre: number | null;
  probabilidad: number | null;
  motivoPerdida: string | null;
  motivoPostergacion: string | null;
  motivoDescarte: string | null;
  proximaAccion: string | null;
  origen: string | null;
  unidadNegocio: string | null;
  tipoCliente: string | null;
};

function agruparMonto(
  items: OppRow[],
  getKey: (o: OppRow) => string,
): Array<{ cantidad: number; monto: number; [k: string]: unknown }> {
  const m = new Map<string, { cantidad: number; monto: number }>();
  for (const o of items) {
    const key = getKey(o);
    const e = m.get(key) ?? { cantidad: 0, monto: 0 };
    e.cantidad++;
    e.monto += o.montoEstimado;
    m.set(key, e);
  }
  return Array.from(m.entries())
    .map(([k, s]) => ({ _k: k, ...s }))
    .sort((a, b) => b.monto - a.monto);
}

function agruparCantidad(
  items: OppRow[],
  getKey: (o: OppRow) => string,
): Array<{ _k: string; cantidad: number }> {
  const m = new Map<string, number>();
  for (const o of items) {
    const key = getKey(o);
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return Array.from(m.entries())
    .map(([_k, cantidad]) => ({ _k, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

function agruparMotivos(
  items: OppRow[],
  campo: 'motivoPerdida' | 'motivoPostergacion' | 'motivoDescarte',
): Array<{ motivo: string; cantidad: number }> {
  const m = new Map<string, number>();
  for (const o of items) {
    const key = (o[campo] ?? '').trim() || 'SIN_MOTIVO';
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return Array.from(m.entries())
    .map(([motivo, cantidad]) => ({ motivo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

export async function getDashboardFunnelFiremat(req: Request, res: Response): Promise<void> {
  try {
    const {
      unidadNegocio,
      responsable,
      origen,
      tipoCliente,
      tipoOportunidad,
      etapa,
      cliente,
      proyecto,
      estado,
      productoId,
      fechaIngresoDesde,
      fechaIngresoHasta,
      fechaCierreDesde,
      fechaCierreHasta,
    } = req.query;

    const rawDias = String(req.query.diasSinSeguimiento ?? '');
    const parsedDias = parseInt(rawDias, 10);
    const diasSinSeguimiento = Math.max(1, isNaN(parsedDias) ? 7 : parsedDias);

    // ── Filtro base ───────────────────────────────────────────────────────────
    const where: Prisma.FunnelFirematOpportunityWhereInput = {};

    if (typeof unidadNegocio === 'string' && unidadNegocio.trim()) {
      where.unidadNegocio = unidadNegocio.trim();
    }
    if (typeof responsable === 'string' && responsable.trim()) {
      where.responsable = { contains: responsable.trim(), mode: 'insensitive' };
    }
    if (typeof origen === 'string' && origen.trim()) {
      where.origen = origen.trim();
    }
    if (typeof tipoCliente === 'string' && tipoCliente.trim()) {
      where.tipoCliente = tipoCliente.trim();
    }
    if (typeof tipoOportunidad === 'string' && tipoOportunidad.trim()) {
      where.tipoOportunidad = tipoOportunidad.trim();
    }
    if (typeof etapa === 'string' && etapa.trim()) {
      where.etapa = etapa.trim();
    }
    if (typeof cliente === 'string' && cliente.trim()) {
      where.cliente = { contains: cliente.trim(), mode: 'insensitive' };
    }
    if (typeof proyecto === 'string' && proyecto.trim()) {
      where.nombreOportunidad = { contains: proyecto.trim(), mode: 'insensitive' };
    }
    if (typeof productoId === 'string' && productoId.trim()) {
      const pid = parseInt(productoId, 10);
      if (!isNaN(pid) && pid > 0) where.productoId = pid;
    }

    // estado solo si etapa no está ya fijado
    const estadoParam = typeof estado === 'string' ? estado.trim().toLowerCase() : '';
    if (!where.etapa && estadoParam) {
      if (estadoParam === 'activa') {
        where.etapa = { notIn: ETAPAS_CERRADAS };
      } else if (estadoParam === 'ganada')     { where.etapa = 'GANADA';    }
      else if (estadoParam === 'perdida')      { where.etapa = 'PERDIDA';   }
      else if (estadoParam === 'postergada')   { where.etapa = 'POSTERGADA'; }
      else if (estadoParam === 'descartada')   { where.etapa = 'DESCARTADO'; }
      else if (estadoParam === 'cerrada')      { where.etapa = { in: ETAPAS_CERRADAS }; }
    }

    if (
      (typeof fechaIngresoDesde === 'string' && fechaIngresoDesde) ||
      (typeof fechaIngresoHasta === 'string' && fechaIngresoHasta)
    ) {
      const f: { gte?: Date; lte?: Date } = {};
      if (typeof fechaIngresoDesde === 'string' && fechaIngresoDesde) f.gte = startOfDay(new Date(fechaIngresoDesde));
      if (typeof fechaIngresoHasta === 'string' && fechaIngresoHasta) f.lte = endOfDay(new Date(fechaIngresoHasta));
      where.createdAt = f;
    }

    if (
      (typeof fechaCierreDesde === 'string' && fechaCierreDesde) ||
      (typeof fechaCierreHasta === 'string' && fechaCierreHasta)
    ) {
      const f: { gte?: Date; lte?: Date } = {};
      if (typeof fechaCierreDesde === 'string' && fechaCierreDesde) f.gte = startOfDay(new Date(fechaCierreDesde));
      if (typeof fechaCierreHasta === 'string' && fechaCierreHasta) f.lte = endOfDay(new Date(fechaCierreHasta));
      where.fechaProbableCierre = f;
    }

    // ── Consulta principal ────────────────────────────────────────────────────
    const opps: OppRow[] = await firematPrisma.funnelFirematOpportunity.findMany({
      where,
      select: {
        id:                 true,
        cliente:            true,
        nombreOportunidad:  true,
        responsable:        true,
        etapa:              true,
        montoEstimado:      true,
        updatedAt:          true,
        createdAt:          true,
        fechaProximaAccion: true,
        fechaCierre:        true,
        fechaProbableCierre:true,
        probabilidadCierre: true,
        probabilidad:       true,
        motivoPerdida:      true,
        motivoPostergacion: true,
        motivoDescarte:     true,
        proximaAccion:      true,
        origen:             true,
        unidadNegocio:      true,
        tipoCliente:        true,
      },
    });

    // ── Sets por estado ───────────────────────────────────────────────────────
    const activasSet     = opps.filter(o => isActiva(o.etapa));
    const ganadasSet     = opps.filter(o => o.etapa === 'GANADA');
    const perdidasSet    = opps.filter(o => o.etapa === 'PERDIDA');
    const postergadasSet = opps.filter(o => o.etapa === 'POSTERGADA');
    const descartadasSet = opps.filter(o => o.etapa === 'DESCARTADO');

    // ── KPIs ──────────────────────────────────────────────────────────────────
    const totalOportunidades       = opps.length;
    const oportunidadesActivas     = activasSet.length;
    const oportunidadesGanadas     = ganadasSet.length;
    const oportunidadesPerdidas    = perdidasSet.length;
    const oportunidadesPostergadas = postergadasSet.length;
    const oportunidadesDescartadas = descartadasSet.length;

    const pipelineTotal = activasSet.reduce((s, o) => s + o.montoEstimado, 0);
    const montoGanado   = ganadasSet.reduce((s, o) => s + o.montoEstimado, 0);
    const montoPerdido  = perdidasSet.reduce((s, o) => s + o.montoEstimado, 0);

    const denomTasa = oportunidadesGanadas + oportunidadesPerdidas;
    const tasaCierre = denomTasa > 0
      ? Number(((oportunidadesGanadas / denomTasa) * 100).toFixed(2))
      : 0;

    const recompraCount = opps.filter(o => o.origen?.toLowerCase() === 'recompra').length;
    const tasaRecompraFiremat = totalOportunidades > 0
      ? Number(((recompraCount / totalOportunidades) * 100).toFixed(2))
      : 0;

    // ── Distribución estado ───────────────────────────────────────────────────
    const distribucionEstado = {
      activas:     oportunidadesActivas,
      ganadas:     oportunidadesGanadas,
      perdidas:    oportunidadesPerdidas,
      postergadas: oportunidadesPostergadas,
      descartadas: oportunidadesDescartadas,
    };

    // ── Por etapa ─────────────────────────────────────────────────────────────
    const porEtapa = Object.fromEntries(
      ETAPAS_TODAS.map(e => {
        const g = opps.filter(o => o.etapa === e);
        return [e, { cantidad: g.length, monto: g.reduce((s, o) => s + o.montoEstimado, 0) }];
      }),
    );

    // ── Ranking responsables ──────────────────────────────────────────────────
    const respMap = new Map<string, {
      total: number; ganadas: number; perdidas: number;
      postergadas: number; activas: number; montoTotal: number; montoGanado: number;
    }>();
    for (const o of opps) {
      const key = o.responsable || 'Sin asignar';
      if (!respMap.has(key)) {
        respMap.set(key, { total: 0, ganadas: 0, perdidas: 0, postergadas: 0, activas: 0, montoTotal: 0, montoGanado: 0 });
      }
      const e = respMap.get(key)!;
      e.total++;
      e.montoTotal += o.montoEstimado;
      if (o.etapa === 'GANADA')          { e.ganadas++;     e.montoGanado += o.montoEstimado; }
      else if (o.etapa === 'PERDIDA')    { e.perdidas++;    }
      else if (o.etapa === 'POSTERGADA') { e.postergadas++; }
      else if (isActiva(o.etapa))        { e.activas++;     }
    }
    const rankingResponsables = Array.from(respMap.entries())
      .map(([responsable, s]) => ({ responsable, ...s }))
      .sort((a, b) => b.montoTotal - a.montoTotal);

    // ── Sin seguimiento (query separada) ──────────────────────────────────────
    const ahora = new Date();
    const limiteUpdatedAt = new Date(ahora);
    limiteUpdatedAt.setDate(limiteUpdatedAt.getDate() - diasSinSeguimiento);

    const whereSinSeg: Prisma.FunnelFirematOpportunityWhereInput = {
      ...where,
      etapa:     { notIn: ETAPAS_CERRADAS },
      updatedAt: { lt: limiteUpdatedAt },
    };

    const [sinSegList, totalSinSeguimiento] = await Promise.all([
      firematPrisma.funnelFirematOpportunity.findMany({
        where: whereSinSeg,
        orderBy: { updatedAt: 'asc' },
        take: 20,
        select: {
          id:                 true,
          cliente:            true,
          nombreOportunidad:  true,
          responsable:        true,
          etapa:              true,
          updatedAt:          true,
          fechaProximaAccion: true,
          montoEstimado:      true,
        },
      }),
      firematPrisma.funnelFirematOpportunity.count({ where: whereSinSeg }),
    ]);

    // ── Próximas acciones ─────────────────────────────────────────────────────
    const hoyStart = startOfDay(new Date());
    const hoyEnd   = endOfDay(new Date());
    const manana   = new Date(hoyStart); manana.setDate(manana.getDate() + 1);
    const en7Dias  = new Date(hoyStart); en7Dias.setDate(en7Dias.getDate() + 7); en7Dias.setHours(23, 59, 59, 999);

    const activasConAccion = activasSet.filter(o => o.fechaProximaAccion !== null);
    const proximasAcciones = {
      vencidas:      activasConAccion.filter(o => o.fechaProximaAccion! < hoyStart).length,
      hoy:           activasConAccion.filter(o => o.fechaProximaAccion! >= hoyStart && o.fechaProximaAccion! <= hoyEnd).length,
      proximos7Dias: activasConAccion.filter(o => o.fechaProximaAccion! >= manana && o.fechaProximaAccion! <= en7Dias).length,
    };

    // ── Prospectos ────────────────────────────────────────────────────────────
    const hace7Dias  = new Date(ahora); hace7Dias.setDate(hace7Dias.getDate() - 7);
    const hace30Dias = new Date(ahora); hace30Dias.setDate(hace30Dias.getDate() - 30);
    const prospectosSet = opps.filter(o => o.etapa === 'PROSPECTO');

    const origenProspRaw  = agruparCantidad(prospectosSet, o => o.origen || 'SIN_ORIGEN');
    const respProspRaw    = agruparCantidad(prospectosSet, o => o.responsable || 'SIN_RESPONSABLE');

    const prospectos = {
      nuevosSemana:    prospectosSet.filter(o => o.createdAt >= hace7Dias).length,
      nuevosMes:       prospectosSet.filter(o => o.createdAt >= hace30Dias).length,
      porOrigen:       origenProspRaw.map(({ _k: origen, cantidad }) => ({ origen, cantidad })),
      porResponsable:  respProspRaw.map(({ _k: responsable, cantidad }) => ({ responsable, cantidad })),
    };

    // ── Pipeline avanzado ─────────────────────────────────────────────────────
    const ppRespRaw     = agruparMonto(activasSet, o => o.responsable   || 'SIN_RESPONSABLE');
    const ppUnidadRaw   = agruparMonto(activasSet, o => o.unidadNegocio || 'SIN_UNIDAD');
    const ppOrigenRaw   = agruparMonto(activasSet, o => o.origen        || 'SIN_ORIGEN');
    const ppTipoCliRaw  = agruparMonto(activasSet, o => o.tipoCliente   || 'SIN_TIPO_CLIENTE');
    const ppClienteRaw  = agruparMonto(activasSet, o => o.cliente       || 'SIN_CLIENTE');

    const pipelineAvanzado = {
      porResponsable:   ppRespRaw.map(({ _k: responsable, cantidad, monto }) => ({ responsable, cantidad, monto })),
      porUnidadNegocio: ppUnidadRaw.map(({ _k: unidadNegocio, cantidad, monto }) => ({ unidadNegocio, cantidad, monto })),
      porOrigen:        ppOrigenRaw.map(({ _k: origen, cantidad, monto }) => ({ origen, cantidad, monto })),
      porTipoCliente:   ppTipoCliRaw.map(({ _k: tipoCliente, cantidad, monto }) => ({ tipoCliente, cantidad, monto })),
      porCliente:       ppClienteRaw.slice(0, 10).map(({ _k: cliente, cantidad, monto }) => ({ cliente, cantidad, monto })),
      porProyecto: [...activasSet]
        .sort((a, b) => b.montoEstimado - a.montoEstimado)
        .slice(0, 10)
        .map(o => ({
          proyecto:    o.nombreOportunidad,
          cliente:     o.cliente,
          responsable: o.responsable || 'SIN_RESPONSABLE',
          etapa:       o.etapa,
          monto:       o.montoEstimado,
        })),
    };

    // ── Forecast 30 / 60 / 90 días ────────────────────────────────────────────
    const hoyF = startOfDay(new Date());
    const fin30 = endOfDay(new Date(hoyF)); fin30.setDate(fin30.getDate() + 30);
    const fin60 = endOfDay(new Date(hoyF)); fin60.setDate(fin60.getDate() + 60);
    const fin90 = endOfDay(new Date(hoyF)); fin90.setDate(fin90.getDate() + 90);

    function calcForecast(hasta: Date) {
      const sub = activasSet.filter(
        o => o.fechaProbableCierre !== null &&
             o.fechaProbableCierre >= hoyF &&
             o.fechaProbableCierre <= hasta,
      );
      return {
        cantidad: sub.length,
        monto:    sub.reduce((s, o) => s + o.montoEstimado, 0),
        montoPonderado: Math.round(
          sub.reduce((s, o) => {
            const prob = o.probabilidadCierre ?? o.probabilidad ?? 50;
            return s + o.montoEstimado * (prob / 100);
          }, 0),
        ),
      };
    }

    const forecast = {
      dias30: calcForecast(fin30),
      dias60: calcForecast(fin60),
      dias90: calcForecast(fin90),
    };

    // ── Ganadas: mes actual y últimos 12 meses ────────────────────────────────
    const ahoraG    = new Date();
    const anoActual = ahoraG.getFullYear();
    const mesActual = ahoraG.getMonth();

    const montoGanadoMesActual = ganadasSet
      .filter(o => {
        if (!o.fechaCierre) return false;
        const f = new Date(o.fechaCierre);
        return f.getFullYear() === anoActual && f.getMonth() === mesActual;
      })
      .reduce((s, o) => s + o.montoEstimado, 0);

    const hace12Meses = new Date(ahoraG);
    hace12Meses.setMonth(hace12Meses.getMonth() - 12);
    hace12Meses.setDate(1);
    hace12Meses.setHours(0, 0, 0, 0);

    const mesesMap = new Map<string, { cantidad: number; monto: number }>();
    for (const o of ganadasSet) {
      if (!o.fechaCierre) continue;
      const f = new Date(o.fechaCierre);
      if (f < hace12Meses) continue;
      const mesKey = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`;
      const e = mesesMap.get(mesKey) ?? { cantidad: 0, monto: 0 };
      e.cantidad++;
      e.monto += o.montoEstimado;
      mesesMap.set(mesKey, e);
    }
    const montoGanadoUltimos12Meses = Array.from(mesesMap.entries())
      .map(([mes, s]) => ({ mes, ...s }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    // ── Motivos ───────────────────────────────────────────────────────────────
    const motivos = {
      perdida:      agruparMotivos(perdidasSet,    'motivoPerdida'),
      postergacion: agruparMotivos(postergadasSet, 'motivoPostergacion'),
      descarte:     agruparMotivos(descartadasSet, 'motivoDescarte'),
    };

    // ── Riesgo comercial ──────────────────────────────────────────────────────
    const DIAS_DETENIDAS = 7;
    const limiteDetenidas = new Date();
    limiteDetenidas.setDate(limiteDetenidas.getDate() - DIAS_DETENIDAS);

    const detenidas = activasSet
      .filter(o => o.updatedAt < limiteDetenidas)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    const sinProximaAccion = activasSet.filter(
      o => !o.proximaAccion?.trim() || !o.fechaProximaAccion,
    );

    const riesgoComercial = {
      oportunidadesDetenidas: {
        total:             detenidas.length,
        diasSinMovimiento: DIAS_DETENIDAS,
        items: detenidas.slice(0, 10).map(o => ({
          id:                o.id,
          cliente:           o.cliente,
          nombreOportunidad: o.nombreOportunidad,
          responsable:       o.responsable || 'SIN_RESPONSABLE',
          etapa:             o.etapa,
          updatedAt:         o.updatedAt.toISOString(),
          monto:             o.montoEstimado,
        })),
      },
      oportunidadesSinProximaAccion: {
        total: sinProximaAccion.length,
        items: [...sinProximaAccion]
          .sort((a, b) => b.montoEstimado - a.montoEstimado)
          .slice(0, 10)
          .map(o => ({
            id:                o.id,
            cliente:           o.cliente,
            nombreOportunidad: o.nombreOportunidad,
            responsable:       o.responsable || 'SIN_RESPONSABLE',
            etapa:             o.etapa,
            monto:             o.montoEstimado,
          })),
      },
    };

    // ── Conversión por etapa ──────────────────────────────────────────────────
    const etapasCant = ETAPAS_FUNNEL.map(e => opps.filter(o => o.etapa === e).length);

    const conversionEtapas = {
      etapas: ETAPAS_FUNNEL.map((e, i) => ({
        etapa:                e,
        label:                ETAPA_LABELS[e],
        cantidad:             etapasCant[i],
        porcentajeSobreTotal: totalOportunidades > 0
          ? Number(((etapasCant[i] / totalOportunidades) * 100).toFixed(1))
          : 0,
      })),
      transiciones: ETAPAS_FUNNEL.slice(0, -1).map((desde, i) => {
        const hasta         = ETAPAS_FUNNEL[i + 1];
        const cantDesde     = etapasCant.slice(i).reduce((s, c) => s + c, 0);
        const cantHasta     = etapasCant.slice(i + 1).reduce((s, c) => s + c, 0);
        return {
          desde,
          hasta,
          desdeLabel:    ETAPA_LABELS[desde],
          hastaLabel:    ETAPA_LABELS[hasta],
          cantidadDesde: cantDesde,
          cantidadHasta: cantHasta,
          tasaConversion: cantDesde > 0
            ? Number(((cantHasta / cantDesde) * 100).toFixed(1))
            : 0,
        };
      }),
    };

    // ── Tiempos promedio desde historial_etapas_firemat ───────────────────────
    let tiempoPromedioDesarrolloCotizacion = 0;
    let tiempoPromedioCotizacionEnviada    = 0;

    if (opps.length > 0) {
      const oppIds = opps.map(o => o.id);
      const historial = await firematPrisma.historialEtapaFiremat.findMany({
        where: { oportunidadId: { in: oppIds } },
        select: { oportunidadId: true, etapaNueva: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const histPorOpp = new Map<number, Array<{ etapaNueva: string; createdAt: Date }>>();
      for (const h of historial) {
        if (!histPorOpp.has(h.oportunidadId)) histPorOpp.set(h.oportunidadId, []);
        histPorOpp.get(h.oportunidadId)!.push({ etapaNueva: h.etapaNueva, createdAt: h.createdAt });
      }

      function calcAvgDias(desdeEtapa: string, hastaEtapa: string): number {
        const tiempos: number[] = [];
        for (const [, entries] of histPorOpp) {
          const eDe  = entries.find(e => e.etapaNueva === desdeEtapa);
          const eHas = entries.find(e => e.etapaNueva === hastaEtapa && (!eDe || e.createdAt > eDe.createdAt));
          if (eDe && eHas) {
            tiempos.push((eHas.createdAt.getTime() - eDe.createdAt.getTime()) / 86400000);
          }
        }
        return tiempos.length > 0
          ? Number((tiempos.reduce((s, d) => s + d, 0) / tiempos.length).toFixed(1))
          : 0;
      }

      tiempoPromedioDesarrolloCotizacion = calcAvgDias('PRIMER_CONTACTO', 'DESARROLLO_COTIZACION');
      tiempoPromedioCotizacionEnviada    = calcAvgDias('DESARROLLO_COTIZACION', 'COTIZACION_ENVIADA');
    }

    // ── Respuesta ─────────────────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        kpis: {
          totalOportunidades,
          oportunidadesActivas,
          oportunidadesGanadas,
          oportunidadesPerdidas,
          oportunidadesPostergadas,
          oportunidadesDescartadas,
          pipelineTotal,
          montoGanado,
          montoPerdido,
          tasaCierre,
          tasaRecompraFiremat,
        },
        distribucionEstado,
        porEtapa,
        rankingResponsables,
        sinSeguimiento: {
          total: totalSinSeguimiento,
          diasSinSeguimiento,
          items: sinSegList,
        },
        proximasAcciones,
        prospectos,
        pipelineAvanzado,
        forecast,
        ganadas: {
          montoGanadoMesActual,
          montoGanadoUltimos12Meses,
        },
        motivos,
        riesgoComercial,
        conversionEtapas,
        tiemposPromedio: {
          tiempoPromedioDesarrolloCotizacion,
          tiempoPromedioCotizacionEnviada,
        },
      },
    });
  } catch (error) {
    console.error('Error en getDashboardFunnelFiremat:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}
