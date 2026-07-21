export interface TramoHolgura {
  holguraMax: number;
  factor: number;
}

export interface CalcRegistroInput {
  cantidad_sellos: number;
  holgura: number;
  accesibilidad: unknown;
  aislacion: unknown;
  reparacion_tabique: unknown;
  piso: string;
  tipoRegistro: string;
  tramosHolgura?: TramoHolgura[];
}

export interface CalcRegistroResult {
  factor_por_holguras: number;
  cantidad_sellos_con_factores: number;
  cantidad_sellos_aislacion: number;
  cantidad_final: number;
  aislacion_normalizada: number;
  reparacion_tabique_normalizada: number;
}

/**
 * Tabla de factor por holgura/separación POR DEFECTO. Replica el Excel oficial:
 * la hoja "Juntas" documenta una escala propia para junta_lineal_espuma
 * (separación en lugar de holgura), distinta de la que usan Sello/Tabiquería/Otros.
 * Una obra puede definir sus propios tramos (ver FactorHolguraTramo /
 * factorHolgura.service.ts); estos valores solo aplican mientras la obra no
 * tenga tramos propios para ese tipo de registro.
 */
const TRAMOS_HOLGURA_JUNTA_LINEAL: TramoHolgura[] = [
  { holguraMax: 2, factor: 1 },
  { holguraMax: 3, factor: 1.5 },
  { holguraMax: 4, factor: 2 },
  { holguraMax: 5, factor: 2.5 },
];

const TRAMOS_HOLGURA_GENERICO: TramoHolgura[] = [
  { holguraMax: 2, factor: 1 },
  { holguraMax: 4, factor: 1.2 },
  { holguraMax: 6, factor: 1.4 },
  { holguraMax: 10, factor: 1.8 },
];

export function getTramosHolguraPorDefecto(tipoRegistro: string): TramoHolgura[] {
  return tipoRegistro === 'junta_lineal_espuma'
    ? TRAMOS_HOLGURA_JUNTA_LINEAL
    : TRAMOS_HOLGURA_GENERICO;
}

function resolveHolguraFactor(holgura: number, tramos: TramoHolgura[]): number {
  const ordenados = [...tramos].sort((a, b) => a.holguraMax - b.holguraMax);
  for (const tramo of ordenados) {
    if (holgura <= tramo.holguraMax) return tramo.factor;
  }
  throw new Error('CORREGIR HOLGURA');
}

function resolveAccesibilidadFactor(accesibilidad: unknown): number {
  if (accesibilidad === null || accesibilidad === undefined) return 1;
  if (typeof accesibilidad === 'number' && Number.isFinite(accesibilidad)) return accesibilidad;
  const str = String(accesibilidad).trim();
  const n = parseFloat(str.replace(',', '.'));
  if (!isNaN(n) && Number.isFinite(n)) return n;
  const norm = str.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '');
  if (norm === 'normal') return 1;
  if (norm.includes('cielo') && norm.includes('duro')) return 3;
  if (norm.includes('cielo') && (norm.includes('americano') || norm.includes('estructurado'))) return 2;
  if (norm.includes('gateras')) return 3;
  return 1;
}

function resolveAislacionFactor(aislacion: unknown): number {
  if (aislacion === null || aislacion === undefined || aislacion === '') return 1;
  if (typeof aislacion === 'boolean') return aislacion ? 1.3 : 1;
  if (typeof aislacion === 'number') return aislacion;
  const str = String(aislacion).trim();
  const n = parseFloat(str.replace(',', '.'));
  if (!isNaN(n) && Number.isFinite(n)) return n;
  const upper = str.toUpperCase().normalize('NFD').replace(/\p{Mn}/gu, '');
  if (upper === 'APLICA' || upper === 'SI') return 1.3;
  return 1;
}

function resolveReparacionTabique(reparacion: unknown): boolean {
  if (reparacion === null || reparacion === undefined || reparacion === '') return false;
  if (typeof reparacion === 'boolean') return reparacion;
  if (typeof reparacion === 'number') return reparacion >= 1;
  const str = String(reparacion).trim();
  const n = parseFloat(str);
  if (!isNaN(n)) return n >= 1;
  const upper = str.toUpperCase().normalize('NFD').replace(/\p{Mn}/gu, '');
  return upper === 'APLICA' || upper === 'SI';
}

export function calcularCamposRegistroTerreno(input: CalcRegistroInput): CalcRegistroResult {
  const tramos = input.tramosHolgura ?? getTramosHolguraPorDefecto(input.tipoRegistro);
  const factor_por_holguras = resolveHolguraFactor(input.holgura, tramos);
  const accFactor = resolveAccesibilidadFactor(input.accesibilidad);
  const aislacion_normalizada = resolveAislacionFactor(input.aislacion);
  const aplicaReparacion = resolveReparacionTabique(input.reparacion_tabique);
  const esSotano = input.piso === '-1';

  const cantidad_sellos_con_factores = esSotano
    ? input.cantidad_sellos * factor_por_holguras * accFactor * 1.1
    : input.cantidad_sellos * factor_por_holguras * accFactor;

  const cantidad_sellos_aislacion = aislacion_normalizada;
  const base = cantidad_sellos_con_factores * aislacion_normalizada;

  const cantidad_final = esSotano ? base : (aplicaReparacion ? base + 1 : base);

  return {
    factor_por_holguras,
    cantidad_sellos_con_factores,
    cantidad_sellos_aislacion,
    cantidad_final,
    aislacion_normalizada,
    reparacion_tabique_normalizada: aplicaReparacion ? 1 : 0,
  };
}
