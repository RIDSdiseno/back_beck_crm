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

export type RendimientoPorTrabajador = {
  nombreSellador: string;
  totalRegistros: number;
  cantidadEjecutadaTotal: number;
  rendimientoAcumulado: number;
  rendimientoAcumuladoPct: number;
};

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
  const codigosBeck = Array.from(
    new Set(
      registros
        .map((r) => r.codigoBeck)
        .filter((c): c is string => typeof c === 'string' && c.trim().length > 0),
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

  const obraIds = Array.from(new Set(registros.map((r) => r.obraId)));
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

  const agrupado = new Map<string, {
    totalRegistros: number;
    cantidadEjecutadaTotal: number;
    sumaRendimiento: number;
  }>();

  for (const reg of registros) {
    const itemizado = reg.codigoBeck ? itemizadoPorCodigo.get(reg.codigoBeck) : undefined;
    const override = itemizado ? overrideMap.get(`${reg.obraId}:${itemizado.id}`) : undefined;

    const registroConRendimiento = {
      ...reg,
      obra: itemizado
        ? {
            rendimientoSellosEsperadoDiario:
              override?.rendimientoSellosEsperadoDiario ?? itemizado.rendimientoSellosEsperadoDiario,
            rendimientoReparacionEsperadoDiario:
              override?.rendimientoReparacionEsperadoDiario ?? itemizado.rendimientoReparacionEsperadoDiario,
          }
        : null,
    };

    const { cantidadEjecutada, rendimientoIndividual } = calcularRendimientoIndividual(
      registroConRendimiento as unknown as Record<string, unknown>,
    );
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
