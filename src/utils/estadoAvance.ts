// Estado de avance de una obra (hitos con período, normalmente semanales).
//
// Reglas:
// - Entran los registros validados por ingeniería, con su cantidad final (con factores).
// - Cada registro entra en un solo estado de avance: el abierto más antiguo cuyo período
//   termina en o después de la fecha de ejecución. Así, un registro validado después de
//   cerrar su semana pasa al siguiente estado de avance abierto.
// - Al terminar un estado de avance se congelan sus registros y sus líneas (cantidades, PU,
//   moneda y contrato de ese momento); los abiertos se calculan en vivo.
// - Cada tipo de registro (Sellos, Juntas, Tabiquería) se lleva por separado, con su
//   propio contrato por ítem; lo ejecutado se acumula y se descuenta de ese contrato.

export const TIPOS_CONTRATO = ['sello_cortafuego', 'junta_lineal_espuma', 'tabiqueria'] as const;

export type RegistroAvance = {
  id: string;
  fecha: Date;
  tipoRegistro: string;
  codigoBeck: string;
  /** Cantidad final (con factores). */
  cantidad: number;
  /** Cantidad física sin factores: sellos, o metros lineales en juntas. */
  cantidadFisica: number;
};

export type ItemObraAvance = {
  itemizadoOpcionId: string;
  codigoBeck: string | null;
  itemizadoBeck: string | null;
  itemizadoMandante: string | null;
  precioUnitario: number | null;
  moneda: string | null;
};

export type ContratoAvance = { itemizadoOpcionId: string; tipoRegistro: string; cantidadContratada: number };

export type LineaCierre = {
  clave: string;
  tipoRegistro: string;
  itemizadoOpcionId: string | null;
  codigoBeck: string | null;
  itemizadoBeck: string | null;
  itemizadoMandante: string | null;
  precioUnitario: number | null;
  moneda: string | null;
  cantidadContratada: number | null;
  cantidadPeriodo: number;
  /** Lo mismo sin factores (S/F). Opcional en cierres guardados antes de existir. */
  cantidadFisicaPeriodo?: number;
};

export type CierreHito = { lineas: LineaCierre[]; cantidadRegistros: number; registrosAtrasados: number };

export type HitoAvance = {
  id: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  terminado: boolean;
  cierre: CierreHito | null;
};

export type LineaAvance = LineaCierre & {
  cantidadFisicaPeriodo: number;
  cantidadAnterior: number;
  cantidadAcumulada: number;
  saldo: number | null;
  subtotalPeriodo: number | null;
  montoAcumulado: number | null;
  montoContratado: number | null;
};

export type ResultadoHito = {
  lineas: LineaAvance[];
  cantidadRegistros: number;
  registrosAtrasados: number;
  registroIds: string[];
};

const redondear = (n: number) => Math.round(n * 100) / 100;
const claveCodigo = (codigo: string) => codigo.trim().toUpperCase();
const aDia = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

const tienePeriodo = (h: HitoAvance): h is HitoAvance & { fechaDesde: Date; fechaHasta: Date } =>
  h.fechaDesde !== null && h.fechaHasta !== null;

/** Hitos en orden cronológico: primero los que tienen período (por fecha desde), al final los legados. */
export function ordenarHitos<T extends HitoAvance>(hitos: T[]): T[] {
  return [...hitos].sort((a, b) => {
    if (tienePeriodo(a) && tienePeriodo(b)) return aDia(a.fechaDesde) - aDia(b.fechaDesde);
    if (tienePeriodo(a)) return -1;
    if (tienePeriodo(b)) return 1;
    return 0;
  });
}

/**
 * Registros de cada estado de avance abierto. Los registros ya congelados en uno terminado
 * no se reasignan. Devuelve también los que todavía no caen en ningún período.
 */
export function asignarRegistros(
  hitos: HitoAvance[],
  registros: RegistroAvance[],
  registrosCongelados: Set<string>,
): { porHito: Map<string, RegistroAvance[]>; sinEstado: RegistroAvance[] } {
  const abiertos = ordenarHitos(hitos).filter((h) => !h.terminado && tienePeriodo(h)) as (HitoAvance & {
    fechaDesde: Date;
    fechaHasta: Date;
  })[];
  const porHito = new Map<string, RegistroAvance[]>(abiertos.map((h) => [h.id, []]));
  const sinEstado: RegistroAvance[] = [];
  for (const registro of registros) {
    if (registrosCongelados.has(registro.id)) continue;
    const dia = aDia(registro.fecha);
    const destino = abiertos.find((h) => aDia(h.fechaHasta) >= dia);
    if (destino) porHito.get(destino.id)!.push(registro);
    else sinEstado.push(registro);
  }
  return { porHito, sinEstado };
}

const claveLinea = (tipoRegistro: string, itemizadoOpcionId: string | null, codigo: string) =>
  `${tipoRegistro}|${itemizadoOpcionId ?? `codigo:${claveCodigo(codigo)}`}`;

/** Calcula las líneas de cada estado de avance, en orden cronológico, con acumulados y saldo. */
export function calcularEstadoAvance(params: {
  hitos: HitoAvance[];
  registros: RegistroAvance[];
  registrosCongelados: Set<string>;
  items: ItemObraAvance[];
  contratos: ContratoAvance[];
}): { porHito: Map<string, ResultadoHito>; sinEstado: RegistroAvance[] } {
  const { hitos, registros, registrosCongelados, items, contratos } = params;

  const itemPorCodigo = new Map<string, ItemObraAvance>();
  for (const item of items) {
    if (item.codigoBeck && !itemPorCodigo.has(claveCodigo(item.codigoBeck))) {
      itemPorCodigo.set(claveCodigo(item.codigoBeck), item);
    }
  }
  const itemPorId = new Map(items.map((i) => [i.itemizadoOpcionId, i]));
  const contratoPorClave = new Map(
    contratos.map((c) => [claveLinea(c.tipoRegistro, c.itemizadoOpcionId, ''), c.cantidadContratada]),
  );

  // Descripción vigente de cada línea (ítem de la obra, o código sin ítem configurado).
  const lineaBase = (tipoRegistro: string, itemizadoOpcionId: string | null, codigo: string): LineaCierre => {
    const item = itemizadoOpcionId ? itemPorId.get(itemizadoOpcionId) : undefined;
    const clave = claveLinea(tipoRegistro, itemizadoOpcionId, codigo);
    return {
      clave,
      tipoRegistro,
      itemizadoOpcionId,
      codigoBeck: item?.codigoBeck ?? codigo,
      itemizadoBeck: item?.itemizadoBeck ?? null,
      itemizadoMandante: item?.itemizadoMandante ?? null,
      precioUnitario: item?.precioUnitario ?? null,
      moneda: item?.moneda ?? null,
      cantidadContratada: contratoPorClave.get(clave) ?? null,
      cantidadPeriodo: 0,
      cantidadFisicaPeriodo: 0,
    };
  };

  const { porHito: asignados, sinEstado } = asignarRegistros(hitos, registros, registrosCongelados);

  // Líneas del período de cada hito: congeladas si está terminado, en vivo si está abierto.
  const ordenados = ordenarHitos(hitos);
  const periodo = new Map<string, { lineas: Map<string, LineaCierre>; cantidadRegistros: number; atrasados: number; ids: string[] }>();
  const todasLasLineas = new Map<string, LineaCierre>();
  for (const c of contratos) {
    const base = lineaBase(c.tipoRegistro, c.itemizadoOpcionId, '');
    todasLasLineas.set(base.clave, base);
  }

  for (const hito of ordenados) {
    const lineas = new Map<string, LineaCierre>();
    let cantidadRegistros = 0;
    let atrasados = 0;
    const ids: string[] = [];
    if (hito.terminado && hito.cierre) {
      for (const l of hito.cierre.lineas) lineas.set(l.clave, { ...l });
      cantidadRegistros = hito.cierre.cantidadRegistros;
      atrasados = hito.cierre.registrosAtrasados;
    } else {
      for (const r of asignados.get(hito.id) ?? []) {
        const item = itemPorCodigo.get(claveCodigo(r.codigoBeck));
        const clave = claveLinea(r.tipoRegistro, item?.itemizadoOpcionId ?? null, r.codigoBeck);
        const linea = lineas.get(clave) ?? lineaBase(r.tipoRegistro, item?.itemizadoOpcionId ?? null, r.codigoBeck);
        linea.cantidadPeriodo += r.cantidad;
        linea.cantidadFisicaPeriodo = (linea.cantidadFisicaPeriodo ?? 0) + r.cantidadFisica;
        lineas.set(clave, linea);
        cantidadRegistros += 1;
        ids.push(r.id);
        if (hito.fechaDesde && aDia(r.fecha) < aDia(hito.fechaDesde)) atrasados += 1;
      }
    }
    for (const l of lineas.values()) {
      if (!todasLasLineas.has(l.clave)) todasLasLineas.set(l.clave, { ...l, cantidadPeriodo: 0, cantidadFisicaPeriodo: 0 });
    }
    periodo.set(hito.id, { lineas, cantidadRegistros, atrasados, ids });
  }

  // Todas las tablas muestran las mismas líneas (con contrato o con ejecución en algún
  // estado de avance), para que el acumulado y el saldo se lean igual en cada uno.
  const acumulado = new Map<string, number>();
  const resultado = new Map<string, ResultadoHito>();
  for (const hito of ordenados) {
    const datos = periodo.get(hito.id)!;
    const congelado = hito.terminado && hito.cierre !== null;
    const lineas: LineaAvance[] = [];
    for (const [clave, base] of todasLasLineas) {
      const propia = datos.lineas.get(clave);
      // Abierto: PU y contrato vigentes. Terminado: los que quedaron al cerrarlo.
      const vigente = lineaBase(base.tipoRegistro, base.itemizadoOpcionId, base.codigoBeck ?? '');
      const fuente =
        congelado && propia
          ? propia
          : { ...vigente, cantidadPeriodo: propia?.cantidadPeriodo ?? 0, cantidadFisicaPeriodo: propia?.cantidadFisicaPeriodo ?? 0 };
      const cantidadPeriodo = redondear(fuente.cantidadPeriodo);
      const cantidadFisicaPeriodo = redondear(fuente.cantidadFisicaPeriodo ?? 0);
      const cantidadAnterior = redondear(acumulado.get(clave) ?? 0);
      const cantidadAcumulada = redondear(cantidadAnterior + cantidadPeriodo);
      acumulado.set(clave, cantidadAcumulada);
      const pu = fuente.precioUnitario;
      const contratada = fuente.cantidadContratada;
      lineas.push({
        ...fuente,
        cantidadPeriodo,
        cantidadFisicaPeriodo,
        cantidadAnterior,
        cantidadAcumulada,
        saldo: contratada === null ? null : redondear(contratada - cantidadAcumulada),
        subtotalPeriodo: pu === null ? null : redondear(pu * cantidadPeriodo),
        montoAcumulado: pu === null ? null : redondear(pu * cantidadAcumulada),
        montoContratado: pu === null || contratada === null ? null : redondear(pu * contratada),
      });
    }
    lineas.sort(
      (a, b) =>
        a.tipoRegistro.localeCompare(b.tipoRegistro) ||
        (a.codigoBeck ?? '').localeCompare(b.codigoBeck ?? '', 'es', { numeric: true }),
    );
    resultado.set(hito.id, {
      lineas,
      cantidadRegistros: datos.cantidadRegistros,
      registrosAtrasados: datos.atrasados,
      registroIds: datos.ids,
    });
  }

  return { porHito: resultado, sinEstado };
}

/** Lo que se guarda al terminar un estado de avance. */
export function armarCierre(resultado: ResultadoHito): CierreHito {
  return {
    lineas: resultado.lineas
      .filter((l) => l.cantidadPeriodo !== 0)
      .map((l) => ({
        clave: l.clave,
        tipoRegistro: l.tipoRegistro,
        itemizadoOpcionId: l.itemizadoOpcionId,
        codigoBeck: l.codigoBeck,
        itemizadoBeck: l.itemizadoBeck,
        itemizadoMandante: l.itemizadoMandante,
        precioUnitario: l.precioUnitario,
        moneda: l.moneda,
        cantidadContratada: l.cantidadContratada,
        cantidadPeriodo: l.cantidadPeriodo,
        cantidadFisicaPeriodo: l.cantidadFisicaPeriodo,
      })),
    cantidadRegistros: resultado.cantidadRegistros,
    registrosAtrasados: resultado.registrosAtrasados,
  };
}
