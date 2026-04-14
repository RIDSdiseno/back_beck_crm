export interface UFResponse {
  valor: number;
  fecha: string;
}

export type IndicadorResponse = UFResponse;

// =======================
// 🟢 CACHE UF (1 hora)
// =======================
let ufCache: UFResponse | null = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 60;

// =======================
// 🟢 CACHE USD (12 horas)
// =======================
let dolarCache: IndicadorResponse | null = null;
let lastFetchDolar = 0;

const CACHE_TIME_DOLAR = 1000 * 60 * 60 * 12;

// =======================
// 📊 UF
// =======================
export const getUfActual = async (): Promise<UFResponse> => {
  try {
    const now = Date.now();

    if (ufCache && now - lastFetch < CACHE_TIME) {
      return ufCache;
    }

    const response = await fetch("https://mindicador.cl/api");

    if (!response.ok) {
      throw new Error("Error al obtener indicadores desde mindicador");
    }

    const data = (await response.json()) as {
      uf?: {
        valor?: number;
        fecha?: string;
      };
    };

    if (!data.uf || typeof data.uf.valor !== "number") {
      throw new Error("La respuesta no contiene UF válida");
    }

    const result: UFResponse = {
      valor: data.uf.valor,
      fecha: data.uf.fecha ?? new Date().toISOString(),
    };

    ufCache = result;
    lastFetch = now;

    return result;
  } catch (error) {
    console.error("Error en getUfActual:", error);

    if (ufCache) {
      return ufCache;
    }

    throw new Error("No se pudo obtener el valor de la UF");
  }
};

// =======================
// 💵 USD (con cache)
// =======================
export const getDolarMercado = async (): Promise<IndicadorResponse> => {
  try {
    const now = Date.now();

    // 🔁 cache activo
    if (dolarCache && now - lastFetchDolar < CACHE_TIME_DOLAR) {
      return dolarCache;
    }

    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("Error al obtener el valor del dólar de mercado");
    }

    const data = (await response.json()) as {
      rates?: {
        CLP?: number;
      };
    };

    if (typeof data.rates?.CLP !== "number") {
      throw new Error("La respuesta no contiene un valor válido para CLP");
    }

    const result: IndicadorResponse = {
      valor: Math.round(data.rates.CLP * 100) / 100,
      fecha: new Date().toISOString(),
    };

    // 💾 guardar cache
    dolarCache = result;
    lastFetchDolar = now;

    return result;
  } catch (error) {
    console.error("Error en getDolarMercado:", error);

    // 🛟 fallback si falla la API
    if (dolarCache) {
      return dolarCache;
    }

    throw new Error("No se pudo obtener el valor del dólar de mercado");
  }
};