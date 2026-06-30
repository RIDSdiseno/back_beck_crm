export const VISTA_CLIENTE_DEFAULTS = [
  { clave: 'total_obras', titulo: 'Total obras', orden: 1 },
  { clave: 'registros_validados', titulo: 'Registros validados', orden: 2 },
  { clave: 'cantidad_final_total', titulo: 'Cantidad final total', orden: 3 },
  { clave: 'registros_mes', titulo: 'Registros del mes', orden: 4 },
  { clave: 'registros_por_obra', titulo: 'Registros por obra', orden: 5 },
  { clave: 'registros_por_tipo', titulo: 'Registros por tipo', orden: 6 },
  { clave: 'registros_por_piso', titulo: 'Registros por piso', orden: 7 },
  { clave: 'registros_por_fecha', titulo: 'Registros por fecha', orden: 8 },
  { clave: 'obras', titulo: 'Obras', orden: 9 },
] as const;

export type ClaveVistaCliente = typeof VISTA_CLIENTE_DEFAULTS[number]['clave'];

export const VISTA_CLIENTE_CLAVES = new Set<string>(
  VISTA_CLIENTE_DEFAULTS.map((item) => item.clave),
);

type ConfiguracionVistaRow = {
  clave: string;
  visible: boolean;
  tituloPersonalizado: string | null;
  orden: number | null;
};

export type ConfiguracionVistaClienteItem = {
  clave: ClaveVistaCliente;
  visible: boolean;
  titulo: string;
  tituloPersonalizado: string | null;
  orden: number;
};

function buildFromMap(rowsByClave: Map<string, ConfiguracionVistaRow>): ConfiguracionVistaClienteItem[] {
  return VISTA_CLIENTE_DEFAULTS.map((defaultItem) => {
    const row = rowsByClave.get(defaultItem.clave);
    const tituloPersonalizado = row?.tituloPersonalizado?.trim() || null;

    return {
      clave: defaultItem.clave,
      visible: row?.visible ?? true,
      titulo: tituloPersonalizado ?? defaultItem.titulo,
      tituloPersonalizado,
      orden: row?.orden ?? defaultItem.orden,
    };
  }).sort((a, b) => a.orden - b.orden);
}

/**
 * Builds configuration from a single set of rows (backwards-compatible).
 */
export function buildConfiguracionVistaCliente(
  rows: ConfiguracionVistaRow[],
): ConfiguracionVistaClienteItem[] {
  return buildFromMap(new Map(rows.map((row) => [row.clave, row])));
}

/**
 * Merges three layers with priority: usuario > clienteBeck > general > system defaults.
 * Any layer can be empty — missing entries fall through to the next layer.
 */
export function resolveConfiguracionEfectiva(
  usuarioRows: ConfiguracionVistaRow[],
  beckRows: ConfiguracionVistaRow[],
  generalRows: ConfiguracionVistaRow[],
): ConfiguracionVistaClienteItem[] {
  const merged = new Map<string, ConfiguracionVistaRow>();

  for (const row of generalRows) merged.set(row.clave, row);
  for (const row of beckRows) merged.set(row.clave, row);
  for (const row of usuarioRows) merged.set(row.clave, row);

  return buildFromMap(merged);
}
