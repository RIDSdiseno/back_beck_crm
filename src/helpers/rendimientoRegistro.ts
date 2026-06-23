// src/helpers/rendimientoRegistro.ts

const TIPOS_SELLOS_JUNTA = ['sello_cortafuego', 'junta_lineal_espuma'];

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Lee un campo numérico aceptando naming camelCase (Prisma) o snake_case (SQL). */
function campo(reg: Record<string, unknown>, camel: string, snake: string): number | null {
  const v = reg[camel] !== undefined ? reg[camel] : reg[snake];
  return toNum(v);
}

/**
 * Lee el rendimiento esperado:
 *  1. Intenta reg.obra[camelKey] (resultado Prisma con include/select de obra)
 *  2. Cae en reg[snakeKey] (resultado SQL flat con JOIN a obras)
 */
function rendEsperado(reg: Record<string, unknown>, camel: string, snake: string): number | null {
  const obra = reg.obra;
  if (obra !== null && obra !== undefined && typeof obra === 'object') {
    const v = (obra as Record<string, unknown>)[camel];
    if (v !== null && v !== undefined) return toNum(v);
  }
  return toNum(reg[snake]);
}

/**
 * Determina la cantidad ejecutada según el tipo de registro.
 *
 * sello_cortafuego : cantidadFinal → cantidadSellosConFactores → cantidadSellos
 * junta_lineal_espuma : metrosLineales
 * tabiqueria : cantidadFinal → cantidadSellos
 */
export function calcularCantidadEjecutada(reg: Record<string, unknown>): number | null {
  const tipo = String(reg.tipoRegistro ?? reg.tipo_registro ?? '');

  if (tipo === 'sello_cortafuego') {
    return (
      campo(reg, 'cantidadFinal', 'cantidad_final') ??
      campo(reg, 'cantidadSellosConFactores', 'cantidad_sellos_con_factores') ??
      campo(reg, 'cantidadSellos', 'cantidad_sellos')
    );
  }

  if (tipo === 'junta_lineal_espuma') {
    return campo(reg, 'metrosLineales', 'metros_lineales');
  }

  if (tipo === 'tabiqueria') {
    return (
      campo(reg, 'cantidadFinal', 'cantidad_final') ??
      campo(reg, 'cantidadSellos', 'cantidad_sellos')
    );
  }

  return null;
}

export type RendimientoResult = {
  cantidadEjecutada: number | null;
  rendimientoIndividual: number | null;
  rendimientoIndividualPct: number | null;
};

/**
 * Calcula rendimientoIndividual para un registro.
 *
 * Fórmula: cantidadEjecutada / rendimientoEsperado
 *
 * - sello_cortafuego / junta_lineal_espuma → usa rendimientoSellosEsperadoDiario
 * - tabiqueria → usa rendimientoReparacionEsperadoDiario
 *
 * Devuelve null si: no hay cantidad ejecutada, no hay rendimiento esperado o es 0.
 */
export function calcularRendimientoIndividual(reg: Record<string, unknown>): RendimientoResult {
  const tipo = String(reg.tipoRegistro ?? reg.tipo_registro ?? '');
  const cantidadEjecutada = calcularCantidadEjecutada(reg);

  if (cantidadEjecutada === null) {
    return { cantidadEjecutada: null, rendimientoIndividual: null, rendimientoIndividualPct: null };
  }

  let rend: number | null = null;

  if (TIPOS_SELLOS_JUNTA.includes(tipo)) {
    rend = rendEsperado(reg, 'rendimientoSellosEsperadoDiario', 'rendimiento_sellos_esperado_diario');
  } else if (tipo === 'tabiqueria') {
    rend = rendEsperado(reg, 'rendimientoReparacionEsperadoDiario', 'rendimiento_reparacion_esperado_diario');
  }

  if (!rend) {
    return { cantidadEjecutada, rendimientoIndividual: null, rendimientoIndividualPct: null };
  }

  const ri = cantidadEjecutada / rend;

  return {
    cantidadEjecutada,
    rendimientoIndividual: Math.round(ri * 10000) / 10000,
    rendimientoIndividualPct: Math.round(ri * 10000) / 100,
  };
}
