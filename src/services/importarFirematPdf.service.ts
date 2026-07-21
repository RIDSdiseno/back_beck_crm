import pdfParse from 'pdf-parse';


export interface ProductoExtraido {
  sku: string;
  descripcion: string;
  disponibilidad: string | null;
  formato: string | null;
  cantidadCaja: string | null;
  precioUsd: number | null;
  precioClp: number | null;
  precioSugerido: number | null;
  categoria: string | null;
}

export interface ItemInventarioExtraido {
  sku: string;
  descripcion: string | null;
  stockInicial: number | null;
  salidas: number | null;
  fechaUltimaSalida: string | null;
  entradas: number | null;
  fechaUltimaEntrada: string | null;
  total: number | null;
}


/**
 * Valid FIREMAT SKUs:
 *   - 4 to 6 digit numbers: 50250, 66309, 11000
 *   - Special pattern:      093X-V  (3-4 digits + 1-2 letters + dash + 1-3 chars)
 */
export function esSkuValido(token: string): boolean {
  if (/^\d{4,6}$/.test(token)) return true;
  if (/^\d{3,4}[A-Z]{1,2}-[A-Z0-9]{1,3}$/i.test(token)) return true;
  return false;
}


const VALOR_NULO_RE = /^(n[_\/]?a|a[\s_]pedido|#[\s\S]*|valor[\s\S]*|-{1,3}|s\/d|sd)$/i;

function esValorNulo(raw: string): boolean {
  return VALOR_NULO_RE.test(raw.trim());
}

/**
 * Converts Chilean-formatted numbers to JS floats.
 *   442.900  → 442900   (dot as thousands separator)
 *   37,82    → 37.82    (comma as decimal)
 *   1.442,50 → 1442.50  (dot=thousands, comma=decimal)
 */
export function normalizarNumeroChileno(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || esValorNulo(trimmed)) return null;

  let s = trimmed;
  const hasDot   = s.includes('.');
  const hasComma = s.includes(',');

  if (hasDot && hasComma) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasDot && !hasComma) {
    const parts = s.split('.');
    if (parts[parts.length - 1].length === 3) s = s.replace(/\./g, '');
  } else if (!hasDot && hasComma) {
    s = s.replace(',', '.');
  }

  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}


const LINEAS_IGNORAR = new Set([
  'SKU', 'DESCRIPCIÓN', 'DESCRIPCION', 'DISPONIBILIDAD', 'FORMATO',
  'CANTIDAD', 'PRECIO', 'USD', 'CLP', 'SUGERIDO',
  'CANTIDAD X CAJA', 'PRECIO USD', 'PRECIO CLP', 'PRECIO SUGERIDO',
  'LISTA DE PRECIOS', 'LISTA DE PRECIOS FIREMAT',
  'FIRE STOPPING', 'CINTAS Y ROLLOS', 'TENMAT', 'OTROS',
]);

/** Returns true for header rows, section titles and empty lines that should be skipped. */
function esLineaIgnorable(linea: string): boolean {
  const trim = linea.trim();
  if (trim.length === 0) return true;
  if (LINEAS_IGNORAR.has(trim.toUpperCase())) return true;
  if (/^[A-ZÁÉÍÓÚÑ\s\/\-·]{4,80}$/.test(trim) && !/\d{4,}/.test(trim)) return true;
  return false;
}


/** Replaces multi-word field values with underscore-joined tokens so they survive split(). */
const SKUS_TRIM_TEX = new Set([
  '093X-V',
  '9250',
  '9260',
  '9265',
  '9270',
  '9275',
  '9280',
  '9284',
  '9285',
  '9420',
]);

const PREFIJOS_DESCRIPCION_TRIM_TEX = new Map<string, RegExp>([
  ['093X-V', /^Fire\s+Rated/i],
  ['9250', /^1-Hour\s+Fire\s+Bead/i],
  ['9260', /^2\s+Hour\s+Fire\s+Bead/i],
  ['9265', /^Fire\s+Gasket\s+\.5/i],
  ['9270', /^Fire\s+Gasket\s+1"/i],
  ['9275', /^Fire\s+Gasket\s+1\.5"/i],
  ['9280', /^Hot\s+Rod\s+XL/i],
  ['9284', /^Hotrod\s+Type\s+X\s+1\/2"x1"/i],
  ['9285', /^Hotrod\s+Type\s+X/i],
  ['9420', /^Sound\s+Gasket/i],
]);

function separarSkuInicial(linea: string): string {
  const trim = linea.trim();

  for (const [sku, descripcionRe] of PREFIJOS_DESCRIPCION_TRIM_TEX) {
    if (!trim.startsWith(sku)) continue;
    const resto = trim.slice(sku.length).trimStart();
    if (descripcionRe.test(resto)) {
      return `${sku} ${resto}`;
    }
  }

  const skuSeparado = trim.match(/^(\d{4,6}|\d{3,4}[A-Z]{1,2}-[A-Z0-9]{1,3})(?:\s+)(.*)$/i);
  if (skuSeparado) return `${skuSeparado[1]} ${skuSeparado[2]}`;

  return trim;
}

export function preSepararColumnasPdf(linea: string): string {
  let separada = separarSkuInicial(linea).replace(/\s+/g, ' ').trim();

  separada = separada
    .replace(/(En\s*stock|A\s*pedido|Sin\s*stock|Stock\s*limitado|Stock)/gi, ' $1 ')
    .replace(/(N\/A)(?=\d)/gi, '$1 ')
    .replace(/(A\s+pedido)(?=A\s+pedido)/gi, '$1 ')
    .replace(/(#¡?VALOR!)(?=#¡?VALOR!)/gi, '$1 ')
    .replace(/(\d+,\d{2})(?=\d{1,3}(?:\.\d{3})+)/g, '$1 ')
    .replace(/(\d{1,3}(?:\.\d{3})+)(?=\d{1,3}(?:\.\d{3})+)/g, '$1 ');

  const tokens = separada.split(/\s+/);
  const preciosClp = tokens
    .map(t => (/^\d{1,3}(?:\.\d{3})+$/.test(t) ? normalizarNumeroChileno(t) : null))
    .filter((n): n is number => n !== null);
  const referenciasUsd = preciosClp.map(precio => precio / 1000);

  const separarCantidadUsd = (token: string): string => {
    const decimal = token.match(/^(.+?\D)(\d+),(\d{2})$/);
    if (decimal) {
      const [, formato, enteros, decimales] = decimal;

      if (enteros.length <= 2) {
        return `${formato} 1 ${enteros},${decimales}`;
      }

      let mejorCorte = 1;
      let mejorDiferencia = Number.POSITIVE_INFINITY;

      for (let corte = 1; corte < enteros.length; corte++) {
        const cantidad = Number(enteros.slice(0, corte));
        const usdEnteros = enteros.slice(corte);
        if (usdEnteros.length > 1 && usdEnteros.startsWith('0')) continue;
        const usd = Number(`${usdEnteros}.${decimales}`);
        if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > 999) continue;

        const diferencia = referenciasUsd.length === 0
          ? Math.abs(cantidad - 1)
          : Math.min(...referenciasUsd.map(referencia => Math.abs(usd - referencia)));
        if (diferencia < mejorDiferencia) {
          mejorDiferencia = diferencia;
          mejorCorte = corte;
        }
      }

      return `${formato} ${enteros.slice(0, mejorCorte)} ${enteros.slice(mejorCorte)},${decimales}`;
    }

    const valorNulo = token.match(/^(.+?)(\d+)(N\/A|#¡?VALOR!)$/i);
    if (valorNulo) {
      const [, formatoBase, digitos, nulo] = valorNulo;
      if (digitos.length === 1) return `${formatoBase} ${digitos} ${nulo}`;
      return `${formatoBase}${digitos.slice(0, -1)} ${digitos.slice(-1)} ${nulo}`;
    }

    return token;
  };

  return tokens.map(separarCantidadUsd).join(' ').replace(/\s+/g, ' ').trim();
}

function normalizarMultipalabras(linea: string): string {
  return linea
    .replace(/en\s+stock/gi,       'En_stock')
    .replace(/a\s+pedido/gi,       'A_pedido')
    .replace(/sin\s+stock/gi,      'Sin_stock')
    .replace(/stock\s+limitado/gi, 'Stock_limitado')
    .replace(/n\/a/gi,             'N_A')
    .replace(/#[^\s]*/g,           'VALOR_ERR')
    // Standalone "Stock" (not already inside En_stock / Sin_stock / Stock_limitado)
    // After the multi-word patterns above, remaining \bstock\b is truly standalone.
    // Using \w lookbehind/lookahead: "_" is \w so "En_stock" won't re-match.
    .replace(/(?<!\w)stock(?!\w)/gi, 'En_stock');
}

const DISP_TOKENS_LC = new Set([
  'en_stock', 'a_pedido', 'sin_stock', 'stock_limitado',
  'disponible', 'agotado', 'consultar',
]);

function esTokenDisponibilidad(t: string): boolean {
  return DISP_TOKENS_LC.has(t.toLowerCase());
}

/** Restores underscore-joined tokens to their display form. */
function restaurar(t: string): string {
  return t
    .replace(/_/g, ' ')
    .replace(/N A/g, 'N/A')
    .replace(/VALOR ERR/g, '#¡VALOR!');
}


function rawDePrecio(t: string): string {
  return t.replace(/N_A/g, 'n/a').replace(/VALOR_ERR/g, '#valor');
}

function esPrecioToken(t: string): boolean {
  const r = rawDePrecio(t);
  return normalizarNumeroChileno(r) !== null || esValorNulo(r);
}


const PALABRAS_DESC_INVALIDAS = new Set([
  'type', 'rod', 'gasket', 'fire', 'rated', 'expansion', 'coil', 'wrap',
  'usd', 'clp', 'stock', 'precio', 'formato', 'descripcion', 'descripción',
  'disponibilidad', 'cantidad', 'caja', 'otros', 'cintas', 'rollos',
  'tenmat', 'lista', 'precios', 'sugerido', 'stopping',
]);

function esDescripcionValida(desc: string): boolean {
  if (!desc || desc.trim().length < 3) return false;
  const lower = desc.trim().toLowerCase();
  if (!lower.includes(' ') && PALABRAS_DESC_INVALIDAS.has(lower)) return false;
  return true;
}


interface ParseLineResult {
  prod?: ProductoExtraido;
  omitida: boolean;
  razon?: string;
}

function extraerFormatoYCantidad(midTokens: string[]): {
  formato: string;
  cantidadCaja: string;
} {
  const restaurados = midTokens.map(restaurar);
  const ultimo = restaurados[restaurados.length - 1];

  if (!ultimo) {
    return { formato: '-', cantidadCaja: '1' };
  }

  const anterior = restaurados[restaurados.length - 2];
  let cantidadInicio = -1;

  if (/^\d+[A-Z]*\/[A-Z0-9]+$/i.test(ultimo)) {
    cantidadInicio = restaurados.length - 1;
  } else if (/^\d+(?:[.,]\d+)?$/.test(ultimo)) {
    cantidadInicio =
      anterior && /^caja$/i.test(anterior)
        ? restaurados.length - 2
        : restaurados.length - 1;
  } else if (/^(und|uni)$/i.test(ultimo)) {
    cantidadInicio =
      anterior && /^\d+(?:[.,]\d+)?$/.test(anterior)
        ? restaurados.length - 2
        : restaurados.length - 1;
  } else if (
    anterior &&
    /^\d+(?:[.,]\d+)?$/.test(anterior) &&
    /^(oz|kg|g|lb|ml|l|lts?|unidades?)$/i.test(ultimo)
  ) {
    cantidadInicio = restaurados.length - 2;
  }

  if (cantidadInicio === -1) {
    return {
      formato: restaurados.join(' ') || '-',
      cantidadCaja: '1',
    };
  }

  return {
    formato: restaurados.slice(0, cantidadInicio).join(' ') || '-',
    cantidadCaja: restaurados.slice(cantidadInicio).join(' '),
  };
}

/**
 * Parses a single product line from the price list.
 *
 * Expected column order (right-to-left):
 *   ... DISPONIBILIDAD FORMATO CANTIDAD PRECIO_USD PRECIO_CLP PRECIO_SUGERIDO
 *
 * Example:
 *   50250 5GAL MC C70 CABLE COATING GREY En stock 18,92 lts 1 442,85 442.900 615.200
 *   093X-V Fire Rated 093 V Expansion A pedido 3m 20 37,05 12.350 37.050
 */
export function parsearLineaProducto(
  linea: string,
  categoriaActual: string | null,
  numLinea: number,
): ParseLineResult {
  const lineaNorm = normalizarMultipalabras(preSepararColumnasPdf(linea));
  const tokens    = lineaNorm.split(/\s+/).filter(t => t.length > 0);

  if (tokens.length < 2) {
    return { omitida: true, razon: `Línea ${numLinea}: pocos tokens (${tokens.length})` };
  }

  const sku = tokens[0];
  if (!esSkuValido(sku)) {
    return { omitida: true, razon: `Línea ${numLinea}: SKU inválido "${sku}"` };
  }

  let idx = tokens.length - 1;
  const preciosRaw: string[] = [];
  while (idx >= 1 && preciosRaw.length < 3 && esPrecioToken(tokens[idx])) {
    preciosRaw.unshift(tokens[idx--]);
  }

  const precios = [null, null, null] as Array<number | null>;
  const offset = 3 - preciosRaw.length;
  preciosRaw.forEach((t, i) => {
    precios[offset + i] = normalizarNumeroChileno(rawDePrecio(t));
  });
  const [precioUsd, precioClp, precioSugerido] = precios;

  let dispIdx = -1;
  for (let i = idx; i >= 1; i--) {
    if (esTokenDisponibilidad(tokens[i])) {
      dispIdx = i;
      break;
    }
  }

  let disponibilidad = 'A pedido';
  let formatoStr = '-';
  let cantidadCaja = '1';
  let descripcionFin = idx + 1;

  if (dispIdx !== -1) {
    disponibilidad = restaurar(tokens[dispIdx]);
    descripcionFin = dispIdx;

    const midTokens = tokens.slice(dispIdx + 1, idx + 1);

    const campos = extraerFormatoYCantidad(midTokens);
    formatoStr = campos.formato;
    cantidadCaja = campos.cantidadCaja;
  } else {
    descripcionFin = idx + 1;
  }

  const descripcion = tokens
    .slice(1, descripcionFin)
    .map(t => t.replace(/_/g, ' '))
    .join(' ')
    .trim();

  if (!esDescripcionValida(descripcion)) {
    return {
      omitida: true,
      razon: `Línea ${numLinea}: descripción inválida "${descripcion}" (SKU=${sku})`,
    };
  }

  return {
    omitida: false,
    prod: {
      sku,
      descripcion,
      disponibilidad,
      formato: formatoStr,
      cantidadCaja,
      precioUsd,
      precioClp,
      precioSugerido,
      categoria: categoriaActual,
    },
  };
}


function extraerCategoria(linea: string): string | null {
  const m = linea.match(/^(?:categor[ií]a|secci[oó]n|grupo|familia|linea)[:\s]+(.+)$/i);
  return m ? m[1].trim() : null;
}


export async function parsearListaPreciosPdf(buffer: Buffer): Promise<{
  productos: ProductoExtraido[];
  advertencias: string[];
  noTexto: boolean;
}> {
  let pdfData: { text: string };

  try {
    pdfData = await pdfParse(buffer);
  } catch (err) {
    return {
      productos: [],
      advertencias: [`Error al leer el PDF: ${(err as Error).message}`],
      noTexto: true,
    };
  }

  const text = pdfData.text ?? '';

  console.log('[PDF-IMPORT] Texto extraído (primeros 800 chars):\n', text.substring(0, 800));
  console.log('[PDF-IMPORT] Total caracteres extraídos:', text.length);

  if (text.trim().length < 50) {
    return { productos: [], advertencias: [], noTexto: true };
  }

  const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let headerIndex = -1;
  for (let i = 0; i < Math.min(lineas.length, 30); i++) {
    const upper = lineas[i].toUpperCase();
    if (upper.includes('SKU') && upper.includes('PRECIO')) {
      headerIndex = i;
      break;
    }
  }

  const productos:    ProductoExtraido[] = [];
  const advertencias: string[]           = [];
  let categoriaActual: string | null     = null;
  let candidatas = 0;

  for (let i = 0; i < lineas.length; i++) {
    if (i <= headerIndex) continue;

    const linea = lineas[i];
    if (esLineaIgnorable(linea)) continue;

    const cat = extraerCategoria(linea);
    if (cat) { categoriaActual = cat; continue; }

    const lineaPreSeparada = preSepararColumnasPdf(linea);
    const primerToken = lineaPreSeparada.split(/\s+/)[0] ?? '';
    if (!esSkuValido(primerToken)) continue;

    candidatas++;

    const result = parsearLineaProducto(linea, categoriaActual, i + 1);

    if (result.omitida) {
      const razon = result.razon ?? `Linea ${i + 1}: motivo no informado`;
      advertencias.push(razon);
      console.warn('[PDF-IMPORT] Linea descartada:', {
        linea,
        sku: primerToken || null,
        motivo: razon,
      });
    } else if (result.prod) {
      productos.push(result.prod);
      if (SKUS_TRIM_TEX.has(result.prod.sku)) {
        console.log('[PDF-IMPORT] TRIM-TEX verificado:', result.prod);
      }
      if (productos.length <= 15) {
        const {
          sku,
          descripcion,
          disponibilidad,
          formato,
          cantidadCaja,
          precioUsd,
          precioClp,
          precioSugerido,
        } = result.prod;
        console.log('[PDF-IMPORT] Linea parseada:', {
          sku,
          descripcion,
          disponibilidad,
          formato,
          cantidadCaja,
          precioUsd,
          precioClp,
          precioSugerido,
        });
      }
    }
  }

  console.log(
    `[PDF-IMPORT] Resultado: ${candidatas} candidatas → ${productos.length} productos válidos, ` +
    `${advertencias.length} advertencias`,
  );

  if (productos.length === 0) {
    advertencias.push('No se encontraron productos válidos con el formato esperado.');
  }

  return { productos, advertencias, noTexto: false };
}


const DATE_RE = /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/;

/**
 * Inserts spaces at column-boundary concatenation points common in inventory PDFs.
 *   Letter → digit:           GREY10       → GREY 10
 *   Digit → DD/MM/YYYY:       520/04/2025  → 5 20/04/2025
 *   DD/MM/YYYY(4y) → digit:   15/03/20258  → 15/03/2025 8
 */
export function preSepararColumnasInventarioPdf(linea: string): string {
  let s = linea.replace(/\s+/g, ' ').trim();
  s = s.replace(/([A-Za-záéíóúñÁÉÍÓÚÑ])(\d)/g, '$1 $2');
  s = s.replace(/(\d)(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/g, '$1 $2');
  s = s.replace(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})(\d)/g, '$1 $2');
  return s;
}

function parsearLineaInventario(tokens: string[]): ItemInventarioExtraido | null {
  if (tokens.length < 2) return null;

  const sku = tokens[0];
  if (!esSkuValido(sku)) return null;

  let totalIdx = tokens.length - 1;
  while (
    totalIdx > 0 &&
    (normalizarNumeroChileno(tokens[totalIdx]) === null || DATE_RE.test(tokens[totalIdx]))
  ) {
    totalIdx--;
  }
  if (totalIdx === 0) return null;

  const total  = normalizarNumeroChileno(tokens[totalIdx]);
  const middle = tokens.slice(1, totalIdx);

  let splitIdx = 0;
  while (splitIdx < middle.length && /^[A-Za-záéíóúñÁÉÍÓÚÑ]/.test(middle[splitIdx])) {
    splitIdx++;
  }

  const descripcion = splitIdx > 0 ? middle.slice(0, splitIdx).join(' ') : null;
  const datos       = middle.slice(splitIdx);

  const numeros: number[] = [];
  const fechas:  string[] = [];

  for (const t of datos) {
    if (DATE_RE.test(t)) {
      fechas.push(t);
    } else {
      const n = normalizarNumeroChileno(t);
      if (n !== null) numeros.push(n);
    }
  }

  return {
    sku,
    descripcion,
    stockInicial:        numeros[0] ?? null,
    salidas:             numeros[1] ?? null,
    fechaUltimaSalida:   fechas[0]  ?? null,
    entradas:            numeros[2] ?? null,
    fechaUltimaEntrada:  fechas[1]  ?? null,
    total,
  };
}

export async function parsearInventarioPdf(buffer: Buffer): Promise<{
  items: ItemInventarioExtraido[];
  advertencias: string[];
  noTexto: boolean;
  candidatas: number;
}> {
  let pdfData: { text: string };

  try {
    pdfData = await pdfParse(buffer);
  } catch (err) {
    return {
      items: [],
      advertencias: [`Error al leer el PDF: ${(err as Error).message}`],
      noTexto: true,
      candidatas: 0,
    };
  }

  const text = pdfData.text ?? '';

  console.log('[PDF-INV] Texto extraído (primeros 800 chars):\n', text.substring(0, 800));
  console.log('[PDF-INV] Total caracteres extraídos:', text.length);

  if (text.trim().length < 50) {
    return { items: [], advertencias: [], noTexto: true, candidatas: 0 };
  }

  const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const items:        ItemInventarioExtraido[] = [];
  const advertencias: string[]                 = [];
  let candidatas = 0;

  let headerIndex = -1;
  for (let i = 0; i < Math.min(lineas.length, 30); i++) {
    const upper = lineas[i].toUpperCase();
    if (upper.includes('SKU') && (upper.includes('TOTAL') || upper.includes('STOCK'))) {
      headerIndex = i;
      break;
    }
  }

  for (let i = headerIndex + 1; i < lineas.length; i++) {
    const linea    = lineas[i];
    if (esLineaIgnorable(linea)) continue;

    const lineaSep    = preSepararColumnasInventarioPdf(linea);
    const tokens      = lineaSep.split(/\s+/).filter(t => t.length > 0);
    const primerToken = tokens[0] ?? '';
    if (!esSkuValido(primerToken)) continue;

    candidatas++;

    const item = parsearLineaInventario(tokens);

    if (!item || item.total === null) {
      const warn = `SKU "${primerToken}": total no encontrado, fila omitida.`;
      advertencias.push(warn);
      console.warn('[PDF-INV] Fila omitida:', { sku: primerToken, lineaSep });
      continue;
    }

    items.push(item);
  }

  console.log(
    `[PDF-INV] Candidatas: ${candidatas} | Parseadas OK: ${items.length} | ` +
    `Omitidas: ${candidatas - items.length} | Advertencias: ${advertencias.length}`,
  );

  if (items.length > 0) {
    const muestra = items.slice(0, 10).map(it => ({ sku: it.sku, total: it.total }));
    console.log('[PDF-INV] Primeras', muestra.length, 'filas parseadas:', muestra);
  }

  if (items.length === 0) {
    advertencias.push('No se encontraron ítems de inventario válidos con el formato esperado.');
  }

  return { items, advertencias, noTexto: false, candidatas };
}
