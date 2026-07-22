import { prisma } from '../config/prisma';
import { calcularRendimientoIndividual } from '../helpers/rendimientoRegistro';

export type RegistroParaRendimiento = {
  tipoRegistro: string;
  nombreSellador: string;
  cantidadSellos: number;
  metrosLineales: number | null;
  codigoBeck: string | null;
  obraId: string;
  estado?: string;
  obra?: { nombre: string } | null;
  fecha?: Date;
};

export type ValidacionIngenieriaFiltro = 'todos' | 'validados' | 'no_validados' | 'pendiente' | 'en_revision' | 'rechazado';

export const validacionesIngenieriaValidas: ValidacionIngenieriaFiltro[] = [
  'todos',
  'validados',
  'no_validados',
  'pendiente',
  'en_revision',
  'rechazado',
];

const cumpleValidacion = (estado: string | undefined, filtro: ValidacionIngenieriaFiltro): boolean => {
  if (filtro === 'todos') return true;
  if (filtro === 'validados') return estado === 'validado';
  if (filtro === 'no_validados') return estado !== 'validado';
  return estado === filtro;
};

export type RendimientoTrabajadorDetalle = {
  nombreSellador: string;
  totalRegistros: number;
  registrosValidados: number;
  registrosNoValidados: number;
  cantidadEjecutadaTotal: number;
  cantidadEsperadaTotal: number;
  rendimientoAcumulado: number;
  rendimientoAcumuladoPct: number;
  codigosTrabajados: number;
};

export type DetalleCodigoBeck = {
  obraId: string;
  obraNombre: string;
  codigoBeck: string;
  itemizadoBeck: string;
  cantidadEjecutada: number;
  cantidadEsperada: number;
  cumplimientoPct: number | null;
  totalRegistros: number;
};

type RendimientoEsperado = {
  rendimientoSellosEsperadoDiario: number | null;
  rendimientoReparacionEsperadoDiario: number | null;
};

type RegistroBaseRendimiento = {
  tipoRegistro?: string | null;
  tipo_registro?: string | null;
  cantidadSellos?: number | string | null;
  cantidad_sellos?: number | string | null;
  metrosLineales?: number | string | null;
  metros_lineales?: number | string | null;
  codigoBeck?: string | null;
  codigo_beck?: string | null;
  obraId?: string | null;
  obra_id?: string | null;
  obra?: Record<string, unknown> | null;
};

export type RendimientoPorTrabajador = {
  nombreSellador: string;
  totalRegistros: number;
  cantidadEjecutadaTotal: number;
  rendimientoAcumulado: number;
  rendimientoAcumuladoPct: number;
};

function getCodigoBeck(reg: RegistroBaseRendimiento): string | null {
  const value = reg.codigoBeck ?? reg.codigo_beck ?? null;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function getObraId(reg: RegistroBaseRendimiento): string | null {
  const value = reg.obraId ?? reg.obra_id ?? null;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

async function resolverRendimientosEsperados(
  registros: RegistroBaseRendimiento[],
): Promise<Map<string, RendimientoEsperado>> {
  const codigosBeck = Array.from(
    new Set(
      registros
        .map(getCodigoBeck)
        .filter((c): c is string => c !== null),
    ),
  );

  const itemizados = codigosBeck.length > 0
    ? await prisma.itemizadoOpcion.findMany({
        where: { codigoBeck: { in: codigosBeck } },
        select: {
          id: true,
          codigoBeck: true,
          rendimientoSellosEsperadoDiario: true,
          rendimientoReparacionEsperadoDiario: true,
        },
      })
    : [];

  const itemizadoPorCodigo = new Map(
    itemizados.filter((i) => i.codigoBeck).map((i) => [i.codigoBeck as string, i]),
  );

  const obraIds = Array.from(
    new Set(
      registros
        .map(getObraId)
        .filter((id): id is string => id !== null),
    ),
  );
  const itemizadoIds = Array.from(new Set(itemizados.map((i) => i.id)));

  const overrides = obraIds.length > 0 && itemizadoIds.length > 0
    ? await prisma.configuracionItemizadoOpcionObra.findMany({
        where: { obraId: { in: obraIds }, itemizadoOpcionId: { in: itemizadoIds } },
        select: {
          obraId: true,
          itemizadoOpcionId: true,
          rendimientoSellosEsperadoDiario: true,
          rendimientoReparacionEsperadoDiario: true,
        },
      })
    : [];

  const overrideMap = new Map(overrides.map((o) => [`${o.obraId}:${o.itemizadoOpcionId}`, o]));
  const result = new Map<string, RendimientoEsperado>();

  for (const reg of registros) {
    const codigoBeck = getCodigoBeck(reg);
    const obraId = getObraId(reg);
    if (!codigoBeck || !obraId) continue;

    const itemizado = itemizadoPorCodigo.get(codigoBeck);
    if (!itemizado) continue;

    const override = overrideMap.get(`${obraId}:${itemizado.id}`);
    result.set(`${obraId}:${codigoBeck}`, {
      rendimientoSellosEsperadoDiario:
        override?.rendimientoSellosEsperadoDiario ?? itemizado.rendimientoSellosEsperadoDiario,
      rendimientoReparacionEsperadoDiario:
        override?.rendimientoReparacionEsperadoDiario ?? itemizado.rendimientoReparacionEsperadoDiario,
    });
  }

  return result;
}

export async function adjuntarRendimientoRegistros<T extends RegistroBaseRendimiento>(
  registros: T[],
): Promise<Array<T & {
  cantidadEjecutada: number | null;
  rendimientoIndividual: number | null;
  rendimientoIndividualPct: number | null;
  rendimientoEsperado: number | null;
}>> {
  if (registros.length === 0) return [];

  const rendimientosPorRegistro = await resolverRendimientosEsperados(registros);

  return registros.map((reg) => {
    const codigoBeck = getCodigoBeck(reg);
    const obraId = getObraId(reg);
    const rendimientoEsperado = codigoBeck && obraId
      ? rendimientosPorRegistro.get(`${obraId}:${codigoBeck}`) ?? null
      : null;
    const obra = {
      ...(reg.obra && typeof reg.obra === 'object' ? reg.obra : {}),
      rendimientoSellosEsperadoDiario:
        rendimientoEsperado?.rendimientoSellosEsperadoDiario ?? null,
      rendimientoReparacionEsperadoDiario:
        rendimientoEsperado?.rendimientoReparacionEsperadoDiario ?? null,
    };
    const registroConRendimientoEsperado = {
      ...reg,
      obra,
      rendimientoSellosEsperadoDiario: obra.rendimientoSellosEsperadoDiario,
      rendimientoReparacionEsperadoDiario: obra.rendimientoReparacionEsperadoDiario,
    };
    const rendimiento = calcularRendimientoIndividual(
      registroConRendimientoEsperado as unknown as Record<string, unknown>,
    );

    return {
      ...registroConRendimientoEsperado,
      ...rendimiento,
    };
  });
}

/**
 * Agrupa registros por nombreSellador y suma su rendimientoIndividual, resolviendo
 * el rendimiento esperado (Sellos/Reparación) por obra cuando existe override en
 * ConfiguracionItemizadoOpcionObra, cayendo al valor global de ItemizadoOpcion si no.
 *
 * Compartido entre GET /api/registros/rendimiento-acumulado y el dashboard Beck
 * para no duplicar la lógica de resolución de rendimiento esperado.
 */
export async function calcularRendimientoPorTrabajador(
  registros: RegistroParaRendimiento[],
): Promise<RendimientoPorTrabajador[]> {
  const agrupado = new Map<string, {
    totalRegistros: number;
    cantidadEjecutadaTotal: number;
    sumaRendimiento: number;
  }>();
  const registrosConRendimiento = await adjuntarRendimientoRegistros(registros);

  for (const reg of registrosConRendimiento) {
    const { cantidadEjecutada, rendimientoIndividual } = reg;
    if (rendimientoIndividual === null) continue;

    const sellador = reg.nombreSellador?.trim() || 'Sin asignar';
    const acc = agrupado.get(sellador) ?? { totalRegistros: 0, cantidadEjecutadaTotal: 0, sumaRendimiento: 0 };

    acc.totalRegistros += 1;
    acc.cantidadEjecutadaTotal += cantidadEjecutada ?? 0;
    acc.sumaRendimiento += rendimientoIndividual;

    agrupado.set(sellador, acc);
  }

  return Array.from(agrupado.entries()).map(([nombreSellador, data]) => ({
    nombreSellador,
    totalRegistros: data.totalRegistros,
    cantidadEjecutadaTotal: data.cantidadEjecutadaTotal,
    rendimientoAcumulado: Math.round(data.sumaRendimiento * 10000) / 10000,
    rendimientoAcumuladoPct: Math.round(data.sumaRendimiento * 10000) / 100,
  }));
}

function buildItemizadoLabel(item: {
  tipo: string | null;
  elementoPasante: string | null;
  elementoPenetra: string | null;
  materialidad: string | null;
} | undefined, codigoBeck: string): string {
  if (!item) return codigoBeck;
  const partes = [item.tipo, item.elementoPasante, item.elementoPenetra, item.materialidad].filter(
    (p): p is string => Boolean(p && p.trim()),
  );
  return partes.length > 0 ? partes.join(' · ') : codigoBeck;
}

/**
 * Calcula el detalle enriquecido para el bloque "Rendimiento por trabajador"
 * del Dashboard Beck: agrupación por trabajador (con desglose de validación
 * de Ingenieria) y agrupación por Código BECK. Reutiliza adjuntarRendimientoRegistros
 * / calcularRendimientoIndividual — NO cambia la fórmula de rendimiento existente.
 *
 * `registros` debe venir SIN filtrar por estado (todas las validaciones), para
 * que registrosValidados/registrosNoValidados reflejen siempre el desglose
 * completo, independiente de `validacionIngenieria` (que solo determina qué
 * subconjunto alimenta los totales/gráficos activos).
 */
export async function calcularRendimientoDetallado(
  registros: RegistroParaRendimiento[],
  validacionIngenieria: ValidacionIngenieriaFiltro = 'todos',
): Promise<{ trabajadores: RendimientoTrabajadorDetalle[]; detalleCodigos: DetalleCodigoBeck[] }> {
  const enriquecidos = await adjuntarRendimientoRegistros(registros);
  const computables = enriquecidos.filter((r) => r.rendimientoIndividual !== null);
  const activos = computables.filter((r) => cumpleValidacion(r.estado, validacionIngenieria));

  const validacionPorTrabajador = new Map<string, { validados: number; noValidados: number }>();
  for (const reg of computables) {
    const sellador = reg.nombreSellador?.trim() || 'Sin asignar';
    const acc = validacionPorTrabajador.get(sellador) ?? { validados: 0, noValidados: 0 };
    if (reg.estado === 'validado') acc.validados += 1;
    else acc.noValidados += 1;
    validacionPorTrabajador.set(sellador, acc);
  }

  const agrupadoTrabajador = new Map<string, {
    totalRegistros: number;
    cantidadEjecutadaTotal: number;
    sumaRendimiento: number;
    codigos: Set<string>;
  }>();

  for (const reg of activos) {
    const { cantidadEjecutada, rendimientoIndividual, codigoBeck } = reg;
    const sellador = reg.nombreSellador?.trim() || 'Sin asignar';
    const acc = agrupadoTrabajador.get(sellador) ?? {
      totalRegistros: 0,
      cantidadEjecutadaTotal: 0,
      sumaRendimiento: 0,
      codigos: new Set<string>(),
    };

    acc.totalRegistros += 1;
    acc.cantidadEjecutadaTotal += cantidadEjecutada ?? 0;
    acc.sumaRendimiento += rendimientoIndividual ?? 0;
    if (codigoBeck) acc.codigos.add(codigoBeck);

    agrupadoTrabajador.set(sellador, acc);
  }

  // El rendimiento esperado diario se aplica UNA VEZ por (fecha + trabajador + obra +
  // Código BECK), nunca una vez por registro: si un trabajador tiene varios registros
  // el mismo día para el mismo código en la misma obra, siguen siendo un solo día de
  // cupo esperado, no N días. Se agrupa primero a este nivel diario y recién ahí se
  // suma cantidadEjecutada/cantidadEsperada — evita "multiplicar" el esperado por la
  // cantidad de registros que un trabajador haya cargado ese día.
  const gruposDiarios = new Map<string, {
    nombreSellador: string;
    obraId: string;
    obraNombre: string;
    codigoBeck: string;
    cantidadEjecutada: number;
    cantidadEsperada: number;
    totalRegistros: number;
  }>();

  for (const reg of activos) {
    const codigoBeck = reg.codigoBeck;
    if (!codigoBeck) continue;
    const sellador = reg.nombreSellador?.trim() || 'Sin asignar';
    const fechaStr = reg.fecha instanceof Date
      ? reg.fecha.toISOString().slice(0, 10)
      : String(reg.fecha).slice(0, 10);
    const clave = `${fechaStr}:${sellador}:${reg.obraId}:${codigoBeck}`;

    const grupo = gruposDiarios.get(clave) ?? {
      nombreSellador: sellador,
      obraId: reg.obraId,
      obraNombre: reg.obra?.nombre?.trim() || 'Sin obra',
      codigoBeck,
      cantidadEjecutada: 0,
      cantidadEsperada: reg.rendimientoEsperado ?? 0,
      totalRegistros: 0,
    };

    grupo.cantidadEjecutada += reg.cantidadEjecutada ?? 0;
    grupo.totalRegistros += 1;
    gruposDiarios.set(clave, grupo);
  }

  const esperadoPorTrabajador = new Map<string, number>();
  for (const grupo of gruposDiarios.values()) {
    esperadoPorTrabajador.set(
      grupo.nombreSellador,
      (esperadoPorTrabajador.get(grupo.nombreSellador) ?? 0) + grupo.cantidadEsperada,
    );
  }

  const trabajadores: RendimientoTrabajadorDetalle[] = Array.from(agrupadoTrabajador.entries()).map(
    ([nombreSellador, data]) => {
      const validacion = validacionPorTrabajador.get(nombreSellador) ?? { validados: 0, noValidados: 0 };
      return {
        nombreSellador,
        totalRegistros: data.totalRegistros,
        registrosValidados: validacion.validados,
        registrosNoValidados: validacion.noValidados,
        cantidadEjecutadaTotal: data.cantidadEjecutadaTotal,
        cantidadEsperadaTotal: esperadoPorTrabajador.get(nombreSellador) ?? 0,
        rendimientoAcumulado: Math.round(data.sumaRendimiento * 10000) / 10000,
        rendimientoAcumuladoPct: Math.round(data.sumaRendimiento * 10000) / 100,
        codigosTrabajados: data.codigos.size,
      };
    },
  );

  // Se agrupa por (obraId + codigoBeck), nunca solo por codigoBeck: el rendimiento
  // esperado puede tener overrides distintos por obra (ConfiguracionItemizadoOpcionObra),
  // así que mezclar obras en una sola fila sumaría configuraciones distintas sin avisar.
  // Parte de los grupos diarios ya armados (no de `activos` directamente), para que el
  // esperado también quede aplicado una vez por día dentro de cada código/obra.
  const agrupadoCodigo = new Map<string, {
    obraId: string;
    obraNombre: string;
    codigoBeck: string;
    cantidadEjecutada: number;
    cantidadEsperada: number;
    totalRegistros: number;
  }>();
  for (const grupo of gruposDiarios.values()) {
    const clave = `${grupo.obraId}:${grupo.codigoBeck}`;
    const acc = agrupadoCodigo.get(clave) ?? {
      obraId: grupo.obraId,
      obraNombre: grupo.obraNombre,
      codigoBeck: grupo.codigoBeck,
      cantidadEjecutada: 0,
      cantidadEsperada: 0,
      totalRegistros: 0,
    };
    acc.cantidadEjecutada += grupo.cantidadEjecutada;
    acc.cantidadEsperada += grupo.cantidadEsperada;
    acc.totalRegistros += grupo.totalRegistros;
    agrupadoCodigo.set(clave, acc);
  }

  const codigos = Array.from(new Set(Array.from(agrupadoCodigo.values()).map((d) => d.codigoBeck)));
  const itemizados = codigos.length > 0
    ? await prisma.itemizadoOpcion.findMany({
        where: { codigoBeck: { in: codigos } },
        select: { codigoBeck: true, tipo: true, elementoPasante: true, elementoPenetra: true, materialidad: true },
      })
    : [];
  const itemizadoPorCodigo = new Map(
    itemizados.filter((i) => i.codigoBeck).map((i) => [i.codigoBeck as string, i]),
  );

  const detalleCodigos: DetalleCodigoBeck[] = Array.from(agrupadoCodigo.values()).map((data) => ({
    obraId: data.obraId,
    obraNombre: data.obraNombre,
    codigoBeck: data.codigoBeck,
    itemizadoBeck: buildItemizadoLabel(itemizadoPorCodigo.get(data.codigoBeck), data.codigoBeck),
    cantidadEjecutada: data.cantidadEjecutada,
    cantidadEsperada: data.cantidadEsperada,
    cumplimientoPct: data.cantidadEsperada > 0
      ? Math.round((data.cantidadEjecutada / data.cantidadEsperada) * 10000) / 100
      : null,
    totalRegistros: data.totalRegistros,
  }));

  return { trabajadores, detalleCodigos };
}
