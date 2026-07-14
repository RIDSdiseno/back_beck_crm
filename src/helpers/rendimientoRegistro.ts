// src/helpers/rendimientoRegistro.ts

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
 * Replica el Excel oficial ("Rendimiento individual" = Cantidad cruda / esperado):
 * siempre la cantidad CRUDA ingresada por el trabajador, nunca la "cantidad final"
 * (que ya trae aplicados los factores de holgura/accesibilidad/aislación/reparación).
 *
 * junta_lineal_espuma : metrosLineales (ya es la medida cruda, no tiene variante "final")
 * sello_cortafuego / tabiqueria / otros : cantidadSellos (cruda)
 */
export function calcularCantidadEjecutada(reg: Record<string, unknown>): number | null {
  const tipo = String(reg.tipoRegistro ?? reg.tipo_registro ?? '');

  if (tipo === 'junta_lineal_espuma') {
    return campo(reg, 'metrosLineales', 'metros_lineales');
  }

  if (tipo === 'sello_cortafuego' || tipo === 'tabiqueria' || tipo === 'otros') {
    return campo(reg, 'cantidadSellos', 'cantidad_sellos');
  }

  return null;
}

/**
 * Determina qué campo de rendimiento esperado corresponde según el tipo de registro,
 * replicando la fórmula condicional del Excel oficial (hojas "Sellos"/"Juntas"):
 * =IF(OR(Tipo="Sello",Tipo="Junta"), Cantidad/RendSellosEsperado, Cantidad/RendReparacionEsperado)
 *
 * sello_cortafuego / junta_lineal_espuma → rendimientoSellosEsperadoDiario
 * tabiqueria / otros (reparación)        → rendimientoReparacionEsperadoDiario
 */
function claveRendimientoEsperado(tipo: string): { camel: string; snake: string } {
  if (tipo === 'tabiqueria' || tipo === 'otros') {
    return {
      camel: 'rendimientoReparacionEsperadoDiario',
      snake: 'rendimiento_reparacion_esperado_diario',
    };
  }

  return {
    camel: 'rendimientoSellosEsperadoDiario',
    snake: 'rendimiento_sellos_esperado_diario',
  };
}

export type RendimientoResult = {
  cantidadEjecutada: number | null;
  rendimientoIndividual: number | null;
  rendimientoIndividualPct: number | null;
};

/**
 * Calcula rendimientoIndividual para un registro.
 *
 * Fórmula: cantidadEjecutada (cruda) / rendimientoEsperado (según tipo, ver
 * claveRendimientoEsperado) — replica exactamente el Excel oficial de rendimientos.
 *
 * Devuelve null si: no hay cantidad ejecutada, no hay rendimiento esperado o es 0.
 */
export function calcularRendimientoIndividual(reg: Record<string, unknown>): RendimientoResult {
  const cantidadEjecutada = calcularCantidadEjecutada(reg);

  if (cantidadEjecutada === null) {
    return { cantidadEjecutada: null, rendimientoIndividual: null, rendimientoIndividualPct: null };
  }

  const tipo = String(reg.tipoRegistro ?? reg.tipo_registro ?? '');
  const { camel, snake } = claveRendimientoEsperado(tipo);
  const rend = rendEsperado(reg, camel, snake);

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
