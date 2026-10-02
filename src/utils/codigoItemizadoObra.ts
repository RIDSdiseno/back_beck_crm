// Código propio de un ítem dentro de una obra (configuracion_itemizado_opcion_obra.codigo_personalizado).
// Sirve para obras con un itemizado antiguo cuya numeración no coincide con el catálogo vigente:
// el catálogo conserva su código y la obra muestra y registra el suyo.

export const LARGO_MAXIMO_CODIGO_PERSONALIZADO = 100;

export class ErrorCodigoPersonalizado extends Error {}

/** null = sin código propio (usa el del catálogo). Lanza si el valor no es válido. */
export function normalizarCodigoPersonalizado(valor: unknown): string | null {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== 'string') throw new ErrorCodigoPersonalizado('El código de la obra debe ser texto.');
  const codigo = valor.trim();
  if (codigo.length > LARGO_MAXIMO_CODIGO_PERSONALIZADO) {
    throw new ErrorCodigoPersonalizado(
      `El código de la obra no puede superar ${LARGO_MAXIMO_CODIGO_PERSONALIZADO} caracteres.`,
    );
  }
  return codigo || null;
}

export function codigoEfectivo(
  codigoCatalogo: string | null | undefined,
  codigoPersonalizado: string | null | undefined,
): string | null {
  return codigoPersonalizado?.trim() || codigoCatalogo?.trim() || null;
}

const claveCodigo = (codigo: string) => codigo.trim().toUpperCase();

/**
 * Códigos que se repiten entre los ítems visibles de una obra. Dos ítems visibles con el
 * mismo código son ambiguos: un registro no podría saber a cuál corresponde.
 */
export function buscarCodigosRepetidos(
  items: { visible: boolean; codigoEfectivo: string | null }[],
): string[] {
  const vistos = new Map<string, string>();
  const repetidos = new Set<string>();
  for (const item of items) {
    if (!item.visible || !item.codigoEfectivo) continue;
    const clave = claveCodigo(item.codigoEfectivo);
    if (vistos.has(clave)) repetidos.add(vistos.get(clave) as string);
    else vistos.set(clave, item.codigoEfectivo.trim());
  }
  return [...repetidos].sort((a, b) => a.localeCompare(b, 'es'));
}

export type OpcionCatalogo = { id: string; codigoBeck: string | null; visible: boolean };
export type ConfiguracionObra = { itemizadoOpcionId: string; visible: boolean; codigoPersonalizado: string | null };
export type CambiosItemizado = {
  /** Cambios en la configuración de la obra, por itemizadoOpcionId. */
  obra?: Map<string, { visible?: boolean; codigoPersonalizado?: string | null }>;
  /** Cambios en el catálogo global, por id. */
  catalogo?: Map<string, { visible?: boolean; codigoBeck?: string | null }>;
};

/**
 * Estado resultante de la obra si se aplicaran los cambios: visibilidad y código efectivo
 * de cada opción. Replica la regla del listado: si la obra tiene configuración explícita,
 * manda su `visible`; si no, el `visible` del catálogo.
 */
export function proyectarItemsObra(
  catalogo: OpcionCatalogo[],
  configuraciones: ConfiguracionObra[],
  cambios: CambiosItemizado = {},
): { itemizadoOpcionId: string; visible: boolean; codigoEfectivo: string | null }[] {
  const porOpcion = new Map(configuraciones.map((c) => [c.itemizadoOpcionId, c]));
  return catalogo.map((opcion) => {
    const enCatalogo = { ...opcion, ...cambios.catalogo?.get(opcion.id) };
    const config = porOpcion.get(opcion.id);
    const cambioObra = cambios.obra?.get(opcion.id);
    const tieneConfig = Boolean(config || cambioObra);
    const visible = cambioObra?.visible ?? (config ? config.visible : tieneConfig ? true : enCatalogo.visible);
    const codigoPersonalizado =
      cambioObra && 'codigoPersonalizado' in cambioObra
        ? cambioObra.codigoPersonalizado ?? null
        : config?.codigoPersonalizado ?? null;
    return {
      itemizadoOpcionId: opcion.id,
      visible,
      codigoEfectivo: codigoEfectivo(enCatalogo.codigoBeck, codigoPersonalizado),
    };
  });
}
