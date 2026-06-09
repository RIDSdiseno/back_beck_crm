import { Request, Response } from 'express';
import { Prisma, EtapaFunnelBeck, EstadoCierreFunnel, FuenteLeadFunnel } from '@prisma/client';
import { prisma } from '../config/prisma';

const ETAPAS_ORDEN: EtapaFunnelBeck[] = [
  'prospecto_identificado',
  'visita_levantamiento',
  'cotizacion_elaborada',
  'cotizacion_enviada',
  'en_negociacion',
  'documentacion_venta',
  'cerrada',
];

const ETAPA_BECK_LABELS: Record<EtapaFunnelBeck, string> = {
  prospecto_identificado: 'Prospecto identificado',
  visita_levantamiento:   'Visita / levantamiento',
  cotizacion_elaborada:   'Cotización elaborada',
  cotizacion_enviada:     'Cotización enviada',
  en_negociacion:         'En negociación',
  documentacion_venta:    'Documentación venta',
  cerrada:                'Cerrada',
};

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toNum(val: Prisma.Decimal | number | null | undefined, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  return Number(val);
}

function isActiva(opp: { estadoCierre: EstadoCierreFunnel | null; etapa: EtapaFunnelBeck }): boolean {
  return (
    opp.etapa !== 'cerrada' &&
    opp.estadoCierre !== 'ganada' &&
    opp.estadoCierre !== 'perdida' &&
    opp.estadoCierre !== 'postergada'
  );
}

export async function getDashboardFunnelBeck(req: Request, res: Response): Promise<void> {
  try {
    const {
      unidadNegocio,
      vendedor,
      origen,
      tipoCliente,
      tipoOportunidad,
      etapa,
      cliente,
      proyecto,
      estado,
      fechaIngresoDesde,
      fechaIngresoHasta,
      fechaCierreDesde,
      fechaCierreHasta,
    } = req.query;

    const rawDias = String(req.query.diasSinSeguimiento ?? '');
    const parsedDias = parseInt(rawDias, 10);
    const diasSinSeguimiento = Math.max(1, isNaN(parsedDias) ? 7 : parsedDias);

    // ── Filtro base ────────────────────────────────────────────────────────────
    const where: Prisma.OperadorBeckWhereInput = {};

    if (typeof unidadNegocio === 'string' && unidadNegocio.trim()) {
      where.unidadNegocio = unidadNegocio.trim();
    }
    if (typeof vendedor === 'string' && vendedor.trim()) {
      where.vendedor = vendedor.trim();
    }
    if (typeof origen === 'string' && origen.trim()) {
      where.fuenteLead = origen.trim() as FuenteLeadFunnel;
    }
    if (typeof tipoCliente === 'string' && tipoCliente.trim()) {
      where.tipoCliente = tipoCliente.trim();
    }
    if (typeof tipoOportunidad === 'string' && tipoOportunidad.trim()) {
      where.tipoOportunidad = tipoOportunidad.trim();
    }
    if (typeof etapa === 'string' && etapa.trim()) {
      where.etapa = etapa.trim() as EtapaFunnelBeck;
    }
    if (typeof cliente === 'string' && cliente.trim()) {
      where.empresa = { contains: cliente.trim(), mode: 'insensitive' };
    }
    if (typeof proyecto === 'string' && proyecto.trim()) {
      where.nombreProyecto = { contains: proyecto.trim(), mode: 'insensitive' };
    }
    const estadoParam = typeof estado === 'string' ? estado.trim().toLowerCase() : '';

    if (estadoParam === 'activa') {
      where.estadoCierre = null;
      if (!where.etapa) {
        where.etapa = { not: 'cerrada' };
      }
    } else if (estadoParam === 'ganada' || estadoParam === 'perdida' || estadoParam === 'postergada') {
      where.estadoCierre = estadoParam as EstadoCierreFunnel;
    } else if (estadoParam === 'cerrada') {
      where.estadoCierre = { in: ['ganada', 'perdida', 'postergada'] as EstadoCierreFunnel[] };
    }
    // 'descartada' y cualquier valor desconocido: se ignora sin producir error

    // Fecha ingreso → createdAt
    if (
      (typeof fechaIngresoDesde === 'string' && fechaIngresoDesde) ||
      (typeof fechaIngresoHasta === 'string' && fechaIngresoHasta)
    ) {
      const createdAtFilter: { gte?: Date; lte?: Date } = {};
      if (typeof fechaIngresoDesde === 'string' && fechaIngresoDesde) {
        createdAtFilter.gte = startOfDay(new Date(fechaIngresoDesde));
      }
      if (typeof fechaIngresoHasta === 'string' && fechaIngresoHasta) {
        createdAtFilter.lte = endOfDay(new Date(fechaIngresoHasta));
      }
      where.createdAt = createdAtFilter;
    }

    // Fecha cierre → fechaProbableCierre
    if (
      (typeof fechaCierreDesde === 'string' && fechaCierreDesde) ||
      (typeof fechaCierreHasta === 'string' && fechaCierreHasta)
    ) {
      const fechaCierreFilter: { gte?: Date; lte?: Date } = {};
      if (typeof fechaCierreDesde === 'string' && fechaCierreDesde) {
        fechaCierreFilter.gte = startOfDay(new Date(fechaCierreDesde));
      }
      if (typeof fechaCierreHasta === 'string' && fechaCierreHasta) {
        fechaCierreFilter.lte = endOfDay(new Date(fechaCierreHasta));
      }
      where.fechaProbableCierre = fechaCierreFilter;
    }

    // ── Consulta principal ─────────────────────────────────────────────────────
    const opps = await prisma.operadorBeck.findMany({
      where,
      select: {
        id: true,
        nombreProyecto: true,
        empresa: true,
        vendedor: true,
        etapa: true,
        estadoCierre: true,
        valorClp: true,
        montoFinalGanado: true,
        updatedAt: true,
        createdAt: true,
        fechaProximaAccion: true,
        fechaCierre: true,
        fuenteLead: true,
        unidadNegocio: true,
        tipoCliente: true,
        fechaProbableCierre: true,
        probabilidadCierre: true,
        motivoPerdida: true,
        motivoPostergacion: true,
        proximaAccion: true,
        esReactivacion: true,
      },
    });

    // ── Categorías ─────────────────────────────────────────────────────────────
    const activasSet     = opps.filter(isActiva);
    const ganadasSet     = opps.filter(o => o.estadoCierre === 'ganada');
    const perdidasSet    = opps.filter(o => o.estadoCierre === 'perdida');
    const postergadasSet = opps.filter(o => o.estadoCierre === 'postergada');

    // ── KPIs ───────────────────────────────────────────────────────────────────
    const totalOportunidades       = opps.length;
    const oportunidadesActivas     = activasSet.length;
    const oportunidadesGanadas     = ganadasSet.length;
    const oportunidadesPerdidas    = perdidasSet.length;
    const oportunidadesPostergadas = postergadasSet.length;

    const pipelineTotalClp = activasSet.reduce((s, o) => s + toNum(o.valorClp), 0);
    const montoGanadoClp   = ganadasSet.reduce((s, o) => s + toNum(o.montoFinalGanado ?? o.valorClp), 0);
    const montoPerdidoClp  = perdidasSet.reduce((s, o) => s + toNum(o.valorClp), 0);

    const denominadorTasa = oportunidadesGanadas + oportunidadesPerdidas;
    const tasaCierre = denominadorTasa > 0
      ? Number(((oportunidadesGanadas / denominadorTasa) * 100).toFixed(2))
      : 0;

    const clientesReactivados = opps.filter(o => o.esReactivacion).length;

    // ── Distribución por estado (para gráfico circular) ────────────────────────
    const distribucionEstado = {
      activas:     oportunidadesActivas,
      ganadas:     oportunidadesGanadas,
      perdidas:    oportunidadesPerdidas,
      postergadas: oportunidadesPostergadas,
    };

    // ── Oportunidades por etapa ────────────────────────────────────────────────
    const porEtapa = Object.fromEntries(
      ETAPAS_ORDEN.map(e => {
        const grupo = opps.filter(o => o.etapa === e);
        return [
          e,
          {
            cantidad: grupo.length,
            montoClp: grupo.reduce((s, o) => s + toNum(o.valorClp), 0),
          },
        ];
      }),
    );

    // ── Ranking por vendedor ───────────────────────────────────────────────────
    const vendedoresMap = new Map<
      string,
      {
        total: number;
        ganadas: number;
        perdidas: number;
        postergadas: number;
        activas: number;
        montoTotalClp: number;
        montoGanadoClp: number;
      }
    >();

    for (const o of opps) {
      const key = o.vendedor || 'Sin asignar';
      if (!vendedoresMap.has(key)) {
        vendedoresMap.set(key, {
          total: 0,
          ganadas: 0,
          perdidas: 0,
          postergadas: 0,
          activas: 0,
          montoTotalClp: 0,
          montoGanadoClp: 0,
        });
      }
      const entry = vendedoresMap.get(key)!;
      entry.total++;
      entry.montoTotalClp += toNum(o.valorClp);
      if (o.estadoCierre === 'ganada') {
        entry.ganadas++;
        entry.montoGanadoClp += toNum(o.montoFinalGanado ?? o.valorClp);
      } else if (o.estadoCierre === 'perdida') {
        entry.perdidas++;
      } else if (o.estadoCierre === 'postergada') {
        entry.postergadas++;
      } else {
        entry.activas++;
      }
    }

    const rankingVendedores = Array.from(vendedoresMap.entries())
      .map(([v, stats]) => ({ vendedor: v, ...stats }))
      .sort((a, b) => b.montoTotalClp - a.montoTotalClp);

    // ── Sin seguimiento ────────────────────────────────────────────────────────
    const ahora = new Date();
    const limiteUpdatedAt = new Date(ahora);
    limiteUpdatedAt.setDate(limiteUpdatedAt.getDate() - diasSinSeguimiento);

    const whereSinSeg: Prisma.OperadorBeckWhereInput = {
      ...where,
      etapa: { not: 'cerrada' },
      estadoCierre: null,
      updatedAt: { lt: limiteUpdatedAt },
    };

    const [sinSegList, totalSinSeguimiento] = await Promise.all([
      prisma.operadorBeck.findMany({
        where: whereSinSeg,
        orderBy: { updatedAt: 'asc' },
        take: 20,
        select: {
          id: true,
          nombreProyecto: true,
          empresa: true,
          vendedor: true,
          etapa: true,
          updatedAt: true,
          fechaProximaAccion: true,
          valorClp: true,
        },
      }),
      prisma.operadorBeck.count({ where: whereSinSeg }),
    ]);

    // ── KPIs de Prospectos ────────────────────────────────────────────────────
    const ahora2 = new Date();
    const hace7Dias  = new Date(ahora2); hace7Dias.setDate(hace7Dias.getDate() - 7);
    const hace30Dias = new Date(ahora2); hace30Dias.setDate(hace30Dias.getDate() - 30);

    const prospectosSet = opps.filter(o => o.etapa === 'prospecto_identificado');

    const nuevosSemana = prospectosSet.filter(o => o.createdAt >= hace7Dias).length;
    const nuevosMes    = prospectosSet.filter(o => o.createdAt >= hace30Dias).length;

    const origenMap = new Map<string, number>();
    for (const o of prospectosSet) {
      const key = o.fuenteLead ?? 'SIN_ORIGEN';
      origenMap.set(key, (origenMap.get(key) ?? 0) + 1);
    }
    const porOrigen = Array.from(origenMap.entries())
      .map(([origen, cantidad]) => ({ origen, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    const respMap = new Map<string, number>();
    for (const o of prospectosSet) {
      const key = o.vendedor || 'SIN_RESPONSABLE';
      respMap.set(key, (respMap.get(key) ?? 0) + 1);
    }
    const porResponsable = Array.from(respMap.entries())
      .map(([vendedor, cantidad]) => ({ vendedor, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // ── Pipeline Avanzado (solo activas: etapa !== cerrada, estadoCierre = null) ─
    const pipelineRespMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of activasSet) {
      const key = o.vendedor || 'SIN_RESPONSABLE';
      const e = pipelineRespMap.get(key) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.valorClp);
      pipelineRespMap.set(key, e);
    }
    const pipelinePorResponsable = Array.from(pipelineRespMap.entries())
      .map(([vendedor, s]) => ({ vendedor, ...s }))
      .sort((a, b) => b.montoClp - a.montoClp);

    const pipelineUnidadMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of activasSet) {
      const key = o.unidadNegocio || 'SIN_UNIDAD';
      const e = pipelineUnidadMap.get(key) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.valorClp);
      pipelineUnidadMap.set(key, e);
    }
    const pipelinePorUnidadNegocio = Array.from(pipelineUnidadMap.entries())
      .map(([unidadNegocio, s]) => ({ unidadNegocio, ...s }))
      .sort((a, b) => b.montoClp - a.montoClp);

    const pipelineOrigenMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of activasSet) {
      const key = o.fuenteLead ?? 'SIN_ORIGEN';
      const e = pipelineOrigenMap.get(key) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.valorClp);
      pipelineOrigenMap.set(key, e);
    }
    const pipelinePorOrigen = Array.from(pipelineOrigenMap.entries())
      .map(([origen, s]) => ({ origen, ...s }))
      .sort((a, b) => b.montoClp - a.montoClp);

    const pipelineTipoClienteMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of activasSet) {
      const key = o.tipoCliente || 'SIN_TIPO_CLIENTE';
      const e = pipelineTipoClienteMap.get(key) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.valorClp);
      pipelineTipoClienteMap.set(key, e);
    }
    const pipelinePorTipoCliente = Array.from(pipelineTipoClienteMap.entries())
      .map(([tipoCliente, s]) => ({ tipoCliente, ...s }))
      .sort((a, b) => b.montoClp - a.montoClp);

    const pipelineClienteMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of activasSet) {
      const key = o.empresa || 'SIN_CLIENTE';
      const e = pipelineClienteMap.get(key) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.valorClp);
      pipelineClienteMap.set(key, e);
    }
    const pipelinePorCliente = Array.from(pipelineClienteMap.entries())
      .map(([cliente, s]) => ({ cliente, ...s }))
      .sort((a, b) => b.montoClp - a.montoClp)
      .slice(0, 10);

    const pipelinePorProyecto = [...activasSet]
      .sort((a, b) => toNum(b.valorClp) - toNum(a.valorClp))
      .slice(0, 10)
      .map(o => ({
        proyecto: o.nombreProyecto,
        cliente:  o.empresa,
        vendedor: o.vendedor || 'SIN_RESPONSABLE',
        etapa:    o.etapa,
        montoClp: toNum(o.valorClp),
      }));

    // ── Motivos ────────────────────────────────────────────────────────────────
    function agruparMotivos(
      items: { motivoPerdida?: string | null; motivoPostergacion?: string | null }[],
      campo: 'motivoPerdida' | 'motivoPostergacion',
    ): { motivo: string; cantidad: number }[] {
      const map = new Map<string, number>();
      for (const o of items) {
        const key = (o[campo] ?? '').trim() || 'SIN_MOTIVO';
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return Array.from(map.entries())
        .map(([motivo, cantidad]) => ({ motivo, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);
    }

    const motivosPerdida      = agruparMotivos(perdidasSet, 'motivoPerdida');
    const motivosPostergacion = agruparMotivos(postergadasSet, 'motivoPostergacion');

    // ── Riesgo comercial ───────────────────────────────────────────────────────
    const DIAS_DETENIDAS = 7;
    const limiteDetenidas = new Date();
    limiteDetenidas.setDate(limiteDetenidas.getDate() - DIAS_DETENIDAS);

    const detenidas = activasSet
      .filter(o => o.updatedAt < limiteDetenidas)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    const detenidasItems = detenidas.slice(0, 10).map(o => ({
      id:             o.id,
      nombreProyecto: o.nombreProyecto,
      empresa:        o.empresa,
      vendedor:       o.vendedor || 'SIN_RESPONSABLE',
      etapa:          o.etapa,
      updatedAt:      o.updatedAt.toISOString(),
      valorClp:       toNum(o.valorClp),
    }));

    const sinProximaAccion = activasSet.filter(
      o => !o.proximaAccion?.trim() || !o.fechaProximaAccion,
    );

    const sinProximaAccionItems = [...sinProximaAccion]
      .sort((a, b) => toNum(b.valorClp) - toNum(a.valorClp))
      .slice(0, 10)
      .map(o => ({
        id:             o.id,
        nombreProyecto: o.nombreProyecto,
        empresa:        o.empresa,
        vendedor:       o.vendedor || 'SIN_RESPONSABLE',
        etapa:          o.etapa,
        valorClp:       toNum(o.valorClp),
      }));

    // ── Forecast 30 / 60 / 90 días ────────────────────────────────────────────
    const hoyF = startOfDay(new Date());
    const fin30 = endOfDay(new Date(hoyF)); fin30.setDate(fin30.getDate() + 30);
    const fin60 = endOfDay(new Date(hoyF)); fin60.setDate(fin60.getDate() + 60);
    const fin90 = endOfDay(new Date(hoyF)); fin90.setDate(fin90.getDate() + 90);

    function calcForecast(hasta: Date) {
      const subset = activasSet.filter(
        o => o.fechaProbableCierre !== null &&
             o.fechaProbableCierre >= hoyF &&
             o.fechaProbableCierre <= hasta,
      );
      return {
        cantidad: subset.length,
        montoClp: subset.reduce((s, o) => s + toNum(o.valorClp), 0),
        montoPonderadoClp: Math.round(
          subset.reduce((s, o) => {
            const prob = o.probabilidadCierre !== null ? Number(o.probabilidadCierre) : 50;
            return s + toNum(o.valorClp) * (prob / 100);
          }, 0),
        ),
      };
    }

    const forecast = {
      dias30: calcForecast(fin30),
      dias60: calcForecast(fin60),
      dias90: calcForecast(fin90),
    };

    // ── Ganadas: mes actual y últimos 12 meses ─────────────────────────────────
    const ahoraG = new Date();
    const anoActual = ahoraG.getFullYear();
    const mesActual = ahoraG.getMonth();

    const montoGanadoMesActualClp = ganadasSet
      .filter(o => {
        if (!o.fechaCierre) return false;
        const f = new Date(o.fechaCierre);
        return f.getFullYear() === anoActual && f.getMonth() === mesActual;
      })
      .reduce((s, o) => s + toNum(o.montoFinalGanado ?? o.valorClp), 0);

    const hace12Meses = new Date(ahoraG);
    hace12Meses.setMonth(hace12Meses.getMonth() - 12);
    hace12Meses.setDate(1);
    hace12Meses.setHours(0, 0, 0, 0);

    const mesesMap = new Map<string, { cantidad: number; montoClp: number }>();
    for (const o of ganadasSet) {
      if (!o.fechaCierre) continue;
      const f = new Date(o.fechaCierre);
      if (f < hace12Meses) continue;
      const mesKey = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`;
      const e = mesesMap.get(mesKey) ?? { cantidad: 0, montoClp: 0 };
      e.cantidad++;
      e.montoClp += toNum(o.montoFinalGanado ?? o.valorClp);
      mesesMap.set(mesKey, e);
    }
    const montoGanadoUltimos12Meses = Array.from(mesesMap.entries())
      .map(([mes, s]) => ({ mes, ...s }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    // ── Conversión por etapa ──────────────────────────────────────────────────
    // Aproximación: sin historial de transiciones, se usa distribución acumulada actual.
    // cantidadDesde = opps en esa etapa + todas las posteriores (embudo hacia adelante).
    const etapasCantidad = ETAPAS_ORDEN.map(e => opps.filter(o => o.etapa === e).length);

    const conversionEtapas = {
      etapas: ETAPAS_ORDEN.map((e, i) => ({
        etapa:                e,
        label:                ETAPA_BECK_LABELS[e],
        cantidad:             etapasCantidad[i],
        porcentajeSobreTotal: totalOportunidades > 0
          ? Number(((etapasCantidad[i] / totalOportunidades) * 100).toFixed(1))
          : 0,
      })),
      transiciones: ETAPAS_ORDEN.slice(0, -1).map((desde, i) => {
        const hasta          = ETAPAS_ORDEN[i + 1];
        const cantidadDesde  = etapasCantidad.slice(i).reduce((s, c) => s + c, 0);
        const cantidadHasta  = etapasCantidad.slice(i + 1).reduce((s, c) => s + c, 0);
        return {
          desde,
          hasta,
          desdeLabel:      ETAPA_BECK_LABELS[desde],
          hastaLabel:      ETAPA_BECK_LABELS[hasta],
          cantidadDesde,
          cantidadHasta,
          tasaConversion:  cantidadDesde > 0
            ? Number(((cantidadHasta / cantidadDesde) * 100).toFixed(1))
            : 0,
        };
      }),
    };

    // ── Próximas acciones (desde dataset principal, solo activas) ─────────────
    const hoyStart = startOfDay(new Date());
    const hoyEnd   = endOfDay(new Date());
    const manana   = new Date(hoyStart);
    manana.setDate(manana.getDate() + 1);
    const en7Dias  = new Date(hoyStart);
    en7Dias.setDate(en7Dias.getDate() + 7);
    en7Dias.setHours(23, 59, 59, 999);

    const activasConAccion = activasSet.filter(o => o.fechaProximaAccion !== null);

    const accionesVencidas      = activasConAccion.filter(o => o.fechaProximaAccion! < hoyStart).length;
    const accionesHoy           = activasConAccion.filter(o => o.fechaProximaAccion! >= hoyStart && o.fechaProximaAccion! <= hoyEnd).length;
    const accionesProximos7Dias = activasConAccion.filter(o => o.fechaProximaAccion! >= manana && o.fechaProximaAccion! <= en7Dias).length;

    res.json({
      success: true,
      data: {
        kpis: {
          totalOportunidades,
          oportunidadesActivas,
          oportunidadesGanadas,
          oportunidadesPerdidas,
          oportunidadesPostergadas,
          clientesReactivados,
          pipelineTotalClp,
          montoGanadoClp,
          montoPerdidoClp,
          tasaCierre,
        },
        distribucionEstado,
        porEtapa,
        rankingVendedores,
        sinSeguimiento: {
          totalSinSeguimiento,
          diasSinSeguimiento,
          oportunidadesSinSeguimiento: sinSegList.map(o => ({
            ...o,
            valorClp: toNum(o.valorClp),
          })),
        },
        proximasAcciones: {
          accionesVencidas,
          accionesHoy,
          accionesProximos7Dias,
        },
        prospectos: {
          nuevosSemana,
          nuevosMes,
          porOrigen,
          porResponsable,
        },
        pipelineAvanzado: {
          porResponsable:    pipelinePorResponsable,
          porUnidadNegocio:  pipelinePorUnidadNegocio,
          porOrigen:         pipelinePorOrigen,
          porTipoCliente:    pipelinePorTipoCliente,
          porCliente:        pipelinePorCliente,
          porProyecto:       pipelinePorProyecto,
        },
        forecast,
        ganadas: {
          montoGanadoMesActualClp,
          montoGanadoUltimos12Meses,
        },
        motivos: {
          perdida:      motivosPerdida,
          postergacion: motivosPostergacion,
          descarte:     [],
        },
        riesgoComercial: {
          oportunidadesDetenidas: {
            total:             detenidas.length,
            diasSinMovimiento: DIAS_DETENIDAS,
            items:             detenidasItems,
          },
          oportunidadesSinProximaAccion: {
            total: sinProximaAccion.length,
            items: sinProximaAccionItems,
          },
        },
        conversionEtapas,
      },
    });
  } catch (error) {
    console.error('Error en getDashboardFunnelBeck:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}
