import { Prisma, TipoIndicadorEconomico } from "@prisma/client";
import { prisma } from "../config/prisma";

export type IndicadorTipo = "UF" | "USD";

export interface IndicadorResponse {
  valor: number;
  fecha: string;
}

type CacheEntry = IndicadorResponse & {
  lastFetch: number;
};

const cache: Record<string, CacheEntry | undefined> = {};
const CACHE_TIME = 1000 * 60 * 60 * 12;

const round4 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 10000) / 10000;

const toDecimal = (value: number): Prisma.Decimal =>
  new Prisma.Decimal(round4(value).toFixed(4));

export const getFallbackIndicador = (): IndicadorResponse => ({
  valor: 35000,
  fecha: new Date().toISOString(),
});

const normalizeTipo = (tipo: string): IndicadorTipo => {
  const normalized = String(tipo || "").trim().toUpperCase();

  if (normalized === "UF" || normalized === "USD") {
    return normalized;
  }

  throw new Error("Tipo de indicador inválido. Debe ser UF o USD.");
};

const setCache = (tipo: IndicadorTipo, data: IndicadorResponse): void => {
  cache[tipo] = {
    ...data,
    lastFetch: Date.now(),
  };
};

const getCache = (
  tipo: IndicadorTipo,
  allowExpired = false,
): IndicadorResponse | null => {
  const entry = cache[tipo];

  if (!entry) {
    return null;
  }

  if (!allowExpired && Date.now() - entry.lastFetch > CACHE_TIME) {
    return null;
  }

  return {
    valor: entry.valor,
    fecha: entry.fecha,
  };
};

const fetchUf = async (): Promise<IndicadorResponse> => {
  const response = await fetch("https://mindicador.cl/api/uf");

  if (!response.ok) {
    throw new Error("Error al obtener UF desde API externa.");
  }

  const data = (await response.json()) as {
    serie?: Array<{
      valor?: number;
      fecha?: string;
    }>;
  };

  const serie = Array.isArray(data.serie) ? data.serie[0] : null;

  if (!serie || typeof serie.valor !== "number") {
    throw new Error("La respuesta de UF no contiene un valor válido.");
  }

  return {
    valor: round4(serie.valor),
    fecha: serie.fecha ?? new Date().toISOString(),
  };
};

const fetchUsd = async (): Promise<IndicadorResponse> => {
  const response = await fetch("https://open.er-api.com/v6/latest/USD");

  if (!response.ok) {
    throw new Error("Error al obtener USD desde API externa.");
  }

  const data = (await response.json()) as {
    rates?: {
      CLP?: number;
    };
    time_last_update_utc?: string;
  };

  if (typeof data.rates?.CLP !== "number") {
    throw new Error("La respuesta de USD no contiene CLP válido.");
  }

  return {
    valor: round4(data.rates.CLP),
    fecha: data.time_last_update_utc
      ? new Date(data.time_last_update_utc).toISOString()
      : new Date().toISOString(),
  };
};

const fetchIndicadorFromApi = async (
  tipo: IndicadorTipo,
): Promise<IndicadorResponse> => {
  if (tipo === "UF") {
    return fetchUf();
  }

  return fetchUsd();
};

const saveIndicadorInDb = async (
  tipo: IndicadorTipo,
  data: IndicadorResponse,
): Promise<void> => {
  await prisma.indicadorEconomico.upsert({
    where: {
      tipo: tipo as TipoIndicadorEconomico,
    },
    create: {
      tipo: tipo as TipoIndicadorEconomico,
      valor: toDecimal(data.valor),
      fecha: new Date(data.fecha),
    },
    update: {
      valor: toDecimal(data.valor),
      fecha: new Date(data.fecha),
    },
  });
};

const getIndicadorFromDb = async (
  tipo: IndicadorTipo,
): Promise<IndicadorResponse | null> => {
  const indicador = await prisma.indicadorEconomico.findFirst({
    where: {
      tipo: tipo as TipoIndicadorEconomico,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!indicador) {
    return null;
  }

  return {
    valor: Number(indicador.valor),
    fecha: indicador.fecha.toISOString(),
  };
};

export async function getIndicador(tipo: IndicadorTipo): Promise<IndicadorResponse> {
  const normalizedTipo = normalizeTipo(tipo);
  const cached = getCache(normalizedTipo);

  if (cached) {
    return cached;
  }

  try {
    const data = await fetchIndicadorFromApi(normalizedTipo);
    setCache(normalizedTipo, data);
    await saveIndicadorInDb(normalizedTipo, data);
    return data;
  } catch (error) {
    console.error(`Error obteniendo indicador ${normalizedTipo}:`, error);

    const fromDb = await getIndicadorFromDb(normalizedTipo);
    if (fromDb) {
      setCache(normalizedTipo, fromDb);
      return fromDb;
    }

    const fromCache = getCache(normalizedTipo, true);
    if (fromCache) {
      return fromCache;
    }

    return getFallbackIndicador();
  }
}

export const getUfActual = async (): Promise<IndicadorResponse> =>
  getIndicador("UF");

export const getDolarMercado = async (): Promise<IndicadorResponse> =>
  getIndicador("USD");
