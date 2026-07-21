import { prisma } from '../config/prisma';
import { calcularRendimientoIndividual } from '../helpers/rendimientoRegistro';

export type RegistroParaRendimiento = {
  tipoRegistro: string;
  nombreSellador: string;
  cantidadSellos: number;
  metrosLineales: number | null;
  codigoBeck: string | null;
  obraId: string;
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
