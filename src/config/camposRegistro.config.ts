export type ColorCampo = 'verde' | 'azul' | 'rojo';
export type RolCampo = 'jefeobra' | 'trabajador' | 'cliente' | 'ingenieria';

export interface DefinicionCampo {
  campo: string;
  label: string;
  color: ColorCampo;
}

const CAMPOS_AZULES = new Set([
  'eje_alfabetico',
  'eje_numerico',
  'recinto',
  'modulo',
  'holgura',
  'factor_por_holguras',
  'cantidad_sellos_con_factores',
  'cielo_modular',
  'codigoBeck',
  'itemizadoBeck',
  'itemizadoMandante',
  'fechaEjecucionSello',
  'diaSemana',
  'piso',
  'nombreSellador',
  'foto',
  'numeroSello',
  'cantidadSellos',
  'aislacion',
  'cantidad_sellos_aislacion',
  'reparacion_tabique',
  'cantidad_final',
  'folio',
]);

export const CAMPOS_JEFEOBRA: DefinicionCampo[] = [
  { campo: 'tipo_registro', label: 'Tipo de Registro', color: 'verde' },
  { campo: 'codigoBeck', label: 'Codigo BECK', color: 'verde' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'verde' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'azul' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecucion de sello', color: 'verde' },
  { campo: 'diaSemana', label: 'Dia', color: 'verde' },
  { campo: 'piso', label: 'Piso', color: 'verde' },
  { campo: 'eje_alfabetico', label: 'Eje Alfabetico', color: 'azul' },
  { campo: 'eje_numerico', label: 'Eje Numerico', color: 'azul' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'verde' },
  { campo: 'foto', label: 'Foto', color: 'verde' },
  { campo: 'recinto', label: 'Recinto', color: 'azul' },
  { campo: 'modulo', label: 'Modulo o edificio', color: 'azul' },
  { campo: 'numeroSello', label: 'N DEL SELLO', color: 'rojo' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'verde' },
  { campo: 'metros_lineales', label: 'Metros Lineales', color: 'verde' },
  { campo: 'holgura', label: 'Holgura (cm)', color: 'rojo' },
  { campo: 'factor_por_holguras', label: 'Factor por holguras', color: 'rojo' },
  { campo: 'cielo_modular', label: 'Cielo modular', color: 'rojo' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad sellos con factores', color: 'rojo' },
  { campo: 'aislacion', label: 'Aislacion', color: 'rojo' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad sellos aislacion', color: 'rojo' },
  { campo: 'reparacion_tabique', label: 'Reparacion tabique', color: 'rojo' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'rojo' },
  { campo: 'observaciones', label: 'Observaciones', color: 'verde' },
  { campo: 'folio', label: 'FOLIO', color: 'azul' },
];

export const CAMPOS_TRABAJADOR: DefinicionCampo[] = [
  { campo: 'tipo_registro', label: 'Tipo de Registro', color: 'verde' },
  { campo: 'codigoBeck', label: 'Codigo BECK', color: 'rojo' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'verde' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'rojo' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecucion de sello', color: 'verde' },
  { campo: 'diaSemana', label: 'Dia', color: 'verde' },
  { campo: 'piso', label: 'Piso', color: 'verde' },
  { campo: 'eje_alfabetico', label: 'Eje Alfabetico', color: 'azul' },
  { campo: 'eje_numerico', label: 'Eje Numerico', color: 'azul' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'verde' },
  { campo: 'foto', label: 'Foto', color: 'verde' },
  { campo: 'recinto', label: 'Recinto', color: 'azul' },
  { campo: 'modulo', label: 'Modulo o edificio', color: 'azul' },
  { campo: 'numeroSello', label: 'N DEL SELLO', color: 'rojo' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'verde' },
  { campo: 'metros_lineales', label: 'Metros Lineales', color: 'verde' },
  { campo: 'holgura', label: 'Holgura (cm)', color: 'rojo' },
  { campo: 'factor_por_holguras', label: 'Factor por holguras', color: 'rojo' },
  { campo: 'cielo_modular', label: 'Cielo modular', color: 'rojo' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad sellos con factores', color: 'rojo' },
  { campo: 'aislacion', label: 'Aislacion', color: 'rojo' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad sellos aislacion', color: 'rojo' },
  { campo: 'reparacion_tabique', label: 'Reparacion tabique', color: 'rojo' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'rojo' },
  { campo: 'observaciones', label: 'Observaciones', color: 'verde' },
  { campo: 'folio', label: 'FOLIO', color: 'rojo' },
];

export const CAMPOS_CLIENTE: DefinicionCampo[] = [
  { campo: 'codigoBeck', label: 'Codigo BECK', color: 'azul' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'azul' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'azul' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecucion de sello', color: 'azul' },
  { campo: 'diaSemana', label: 'Dia', color: 'azul' },
  { campo: 'piso', label: 'Piso', color: 'azul' },
  { campo: 'eje_alfabetico', label: 'Eje Alfabetico', color: 'azul' },
  { campo: 'eje_numerico', label: 'Eje Numerico', color: 'azul' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'azul' },
  { campo: 'foto', label: 'Foto', color: 'azul' },
  { campo: 'recinto', label: 'Recinto', color: 'azul' },
  { campo: 'modulo', label: 'Modulo o edificio', color: 'azul' },
  { campo: 'numeroSello', label: 'N del sello', color: 'azul' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'azul' },
  { campo: 'holgura', label: 'Separacion (cm)', color: 'azul' },
  { campo: 'factor_por_holguras', label: 'Factor por separacion', color: 'azul' },
  { campo: 'cielo_modular', label: 'Accesibilidad / Cielo modular', color: 'azul' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad de Sellos con Factores (sin reparaciones)', color: 'azul' },
  { campo: 'aislacion', label: 'Aislacion', color: 'azul' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad de Sellos Aislacion', color: 'azul' },
  { campo: 'reparacion_tabique', label: 'Reparacion de tabique (Aplica / No aplica)', color: 'azul' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'azul' },
  { campo: 'folio', label: 'FOLIO', color: 'azul' },
];

// Ingenieria no tiene campos configurables (azul): todo queda fijo en verde u rojo.
// aislacion, cantidad_sellos_aislacion, reparacion_tabique y metros_lineales no fueron
// especificados explicitamente para este rol; se dejan en verde (visible) por ser el
// rol con mayor nivel de detalle tecnico entre los tres.
export const CAMPOS_INGENIERIA: DefinicionCampo[] = [
  { campo: 'tipo_registro', label: 'Tipo de Registro', color: 'verde' },
  { campo: 'codigoBeck', label: 'Codigo BECK', color: 'verde' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'verde' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'verde' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecucion de sello', color: 'verde' },
  { campo: 'diaSemana', label: 'Dia', color: 'verde' },
  { campo: 'piso', label: 'Piso', color: 'verde' },
  { campo: 'eje_alfabetico', label: 'Eje Alfabetico', color: 'verde' },
  { campo: 'eje_numerico', label: 'Eje Numerico', color: 'verde' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'verde' },
  { campo: 'foto', label: 'Foto', color: 'verde' },
  { campo: 'recinto', label: 'Recinto', color: 'verde' },
  { campo: 'modulo', label: 'Modulo o edificio', color: 'verde' },
  { campo: 'numeroSello', label: 'N DEL SELLO', color: 'rojo' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'verde' },
  { campo: 'metros_lineales', label: 'Metros Lineales', color: 'verde' },
  { campo: 'holgura', label: 'Holgura (cm)', color: 'rojo' },
  { campo: 'factor_por_holguras', label: 'Factor por holguras', color: 'rojo' },
  { campo: 'cielo_modular', label: 'Cielo modular', color: 'rojo' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad sellos con factores', color: 'rojo' },
  { campo: 'aislacion', label: 'Aislacion', color: 'verde' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad sellos aislacion', color: 'verde' },
  { campo: 'reparacion_tabique', label: 'Reparacion tabique', color: 'verde' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'verde' },
  { campo: 'observaciones', label: 'Observaciones', color: 'verde' },
  { campo: 'folio', label: 'FOLIO', color: 'verde' },
  { campo: 'rendimientoSellosEsperadoDiario', label: 'Rendimiento Sellos Esperado Diario', color: 'rojo' },
  { campo: 'rendimientoReparacionEsperadoDiario', label: 'Rendimiento Reparacion Esperado Diario', color: 'verde' },
  { campo: 'rendimientoIndividual', label: 'Rendimiento Individual', color: 'verde' },
];

export const CAMPOS_REGISTRO_POR_ROL: Record<RolCampo, DefinicionCampo[]> = {
  jefeobra: CAMPOS_JEFEOBRA,
  trabajador: CAMPOS_TRABAJADOR,
  cliente: CAMPOS_CLIENTE,
  ingenieria: CAMPOS_INGENIERIA,
};

export const CAMPOS_REGISTRO = CAMPOS_JEFEOBRA;

export const CAMPOS_POR_COLOR_POR_ROL: Record<RolCampo, Record<ColorCampo, string[]>> = {
  jefeobra: {
    verde: CAMPOS_JEFEOBRA.filter(c => c.color === 'verde').map(c => c.campo),
    azul: CAMPOS_JEFEOBRA.filter(c => c.color === 'azul' && CAMPOS_AZULES.has(c.campo)).map(c => c.campo),
    rojo: CAMPOS_JEFEOBRA.filter(c => c.color === 'rojo').map(c => c.campo),
  },
  trabajador: {
    verde: CAMPOS_TRABAJADOR.filter(c => c.color === 'verde').map(c => c.campo),
    azul: CAMPOS_TRABAJADOR.filter(c => c.color === 'azul' && CAMPOS_AZULES.has(c.campo)).map(c => c.campo),
    rojo: CAMPOS_TRABAJADOR.filter(c => c.color === 'rojo').map(c => c.campo),
  },
  cliente: {
    verde: CAMPOS_CLIENTE.filter(c => c.color === 'verde').map(c => c.campo),
    azul: CAMPOS_CLIENTE.filter(c => c.color === 'azul' && CAMPOS_AZULES.has(c.campo)).map(c => c.campo),
    rojo: CAMPOS_CLIENTE.filter(c => c.color === 'rojo').map(c => c.campo),
  },
  ingenieria: {
    verde: CAMPOS_INGENIERIA.filter(c => c.color === 'verde').map(c => c.campo),
    azul: CAMPOS_INGENIERIA.filter(c => c.color === 'azul' && CAMPOS_AZULES.has(c.campo)).map(c => c.campo),
    rojo: CAMPOS_INGENIERIA.filter(c => c.color === 'rojo').map(c => c.campo),
  },
};

export const CAMPOS_POR_COLOR = CAMPOS_POR_COLOR_POR_ROL.jefeobra;
export const ROLES_CON_RESTRICCIONES: RolCampo[] = ['jefeobra', 'trabajador', 'cliente', 'ingenieria'];

export function normalizarRolConfiguracion(rol: string): RolCampo | null {
  if (rol === 'supervisor') return 'jefeobra';
  if (rol === 'terreno') return 'trabajador';
  return ROLES_CON_RESTRICCIONES.includes(rol as RolCampo) ? (rol as RolCampo) : null;
}
