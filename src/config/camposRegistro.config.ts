export type ColorCampo = 'verde' | 'azul' | 'rojo';
export type RolCampo = 'jefeobra' | 'trabajador';

export interface DefinicionCampo {
  campo: string;
  label: string;
  color: ColorCampo;
}

const CAMPOS_AZULES = new Set([
  'cielo_modular',
  'aislacion',
  'reparacion_tabique',
]);

export const CAMPOS_JEFEOBRA: DefinicionCampo[] = [
  { campo: 'codigoBeck', label: 'Código BECK', color: 'verde' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'verde' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'verde' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecución de sello', color: 'verde' },
  { campo: 'diaSemana', label: 'Día', color: 'verde' },
  { campo: 'piso', label: 'Piso', color: 'verde' },
  { campo: 'ejeAlfabetico', label: 'Eje Alfabético', color: 'verde' },
  { campo: 'ejeNumerico', label: 'Eje Numérico', color: 'verde' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'verde' },
  { campo: 'foto', label: 'Foto', color: 'verde' },
  { campo: 'recinto', label: 'Recinto', color: 'verde' },
  { campo: 'moduloEdificio', label: 'Módulo o edificio', color: 'verde' },
  { campo: 'numeroSello', label: 'N° DEL SELLO', color: 'verde' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'verde' },
  { campo: 'holgura', label: 'Holgura (cm)', color: 'verde' },
  { campo: 'factor_por_holguras', label: 'Factor por holguras', color: 'verde' },
  { campo: 'cielo_modular', label: 'Cielo modular', color: 'azul' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad sellos con factores', color: 'verde' },
  { campo: 'aislacion', label: 'Aislación', color: 'azul' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad sellos aislación', color: 'verde' },
  { campo: 'reparacion_tabique', label: 'Reparación tabique', color: 'azul' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'verde' },
  { campo: 'observaciones', label: 'Observaciones', color: 'verde' },
  { campo: 'folio', label: 'FOLIO', color: 'verde' },
];

export const CAMPOS_TRABAJADOR: DefinicionCampo[] = [
  { campo: 'codigoBeck', label: 'Código BECK', color: 'rojo' },
  { campo: 'itemizadoBeck', label: 'Itemizado BECK', color: 'verde' },
  { campo: 'itemizadoMandante', label: 'Itemizado Mandante', color: 'rojo' },
  { campo: 'fechaEjecucionSello', label: 'Fecha ejecución de sello', color: 'verde' },
  { campo: 'diaSemana', label: 'Día', color: 'verde' },
  { campo: 'piso', label: 'Piso', color: 'verde' },
  { campo: 'ejeAlfabetico', label: 'Eje Alfabético', color: 'verde' },
  { campo: 'ejeNumerico', label: 'Eje Numérico', color: 'verde' },
  { campo: 'nombreSellador', label: 'Nombre sellador', color: 'verde' },
  { campo: 'foto', label: 'Foto', color: 'verde' },
  { campo: 'recinto', label: 'Recinto', color: 'verde' },
  { campo: 'moduloEdificio', label: 'Módulo o edificio', color: 'verde' },
  { campo: 'numeroSello', label: 'N° DEL SELLO', color: 'verde' },
  { campo: 'cantidadSellos', label: 'Cantidad de Sellos', color: 'verde' },
  { campo: 'holgura', label: 'Holgura (cm)', color: 'verde' },
  { campo: 'factor_por_holguras', label: 'Factor por holguras', color: 'rojo' },
  { campo: 'cielo_modular', label: 'Cielo modular', color: 'azul' },
  { campo: 'cantidad_sellos_con_factores', label: 'Cantidad sellos con factores', color: 'rojo' },
  { campo: 'aislacion', label: 'Aislación', color: 'azul' },
  { campo: 'cantidad_sellos_aislacion', label: 'Cantidad sellos aislación', color: 'rojo' },
  { campo: 'reparacion_tabique', label: 'Reparación tabique', color: 'azul' },
  { campo: 'cantidad_final', label: 'Cantidad final', color: 'rojo' },
  { campo: 'observaciones', label: 'Observaciones', color: 'verde' },
  { campo: 'folio', label: 'FOLIO', color: 'rojo' },
];

export const CAMPOS_REGISTRO_POR_ROL: Record<RolCampo, DefinicionCampo[]> = {
  jefeobra: CAMPOS_JEFEOBRA,
  trabajador: CAMPOS_TRABAJADOR,
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
};

export const CAMPOS_POR_COLOR = CAMPOS_POR_COLOR_POR_ROL.jefeobra;
export const ROLES_CON_RESTRICCIONES: RolCampo[] = ['jefeobra', 'trabajador'];

export function normalizarRolConfiguracion(rol: string): RolCampo | null {
  if (rol === 'terreno') return 'trabajador';
  return ROLES_CON_RESTRICCIONES.includes(rol as RolCampo) ? (rol as RolCampo) : null;
}
