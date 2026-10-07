import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  armarCierre,
  calcularEstadoAvance,
  type HitoAvance,
  type ItemObraAvance,
  type RegistroAvance,
} from '../src/utils/estadoAvance';

const d = (s: string) => new Date(`${s}T00:00:00.000Z`);

const items: ItemObraAvance[] = [
  { itemizadoOpcionId: 'op-171', codigoBeck: '1-171', itemizadoBeck: 'Tubería metálica Ø ≤ 50', itemizadoMandante: 'Pasada 50', precioUnitario: 0.5, moneda: 'UF' },
  { itemizadoOpcionId: 'op-172', codigoBeck: '1-172', itemizadoBeck: 'Tubería metálica Ø ≤ 110', itemizadoMandante: null, precioUnitario: null, moneda: null },
];

const semana1: HitoAvance = { id: 'h1', fechaDesde: d('2026-08-03'), fechaHasta: d('2026-08-09'), terminado: false, cierre: null };
const semana2: HitoAvance = { id: 'h2', fechaDesde: d('2026-08-10'), fechaHasta: d('2026-08-16'), terminado: false, cierre: null };

const reg = (id: string, fecha: string, codigo: string, cantidad: number, tipo = 'sello_cortafuego'): RegistroAvance => ({
  id, fecha: d(fecha), tipoRegistro: tipo, codigoBeck: codigo, cantidad, cantidadFisica: Math.floor(cantidad),
});

const linea = (r: ReturnType<typeof calcularEstadoAvance>, hito: string, clave: string) =>
  r.porHito.get(hito)!.lineas.find((l) => l.clave === clave)!;

test('cada registro entra en el estado de avance de su semana, con su cantidad final', () => {
  const r = calcularEstadoAvance({
    hitos: [semana2, semana1],
    registros: [reg('a', '2026-08-04', '1-171', 1.2), reg('b', '2026-08-11', '1-171', 2), reg('c', '2026-08-30', '1-171', 5)],
    registrosCongelados: new Set(),
    items,
    contratos: [],
  });
  assert.equal(linea(r, 'h1', 'sello_cortafuego|op-171').cantidadPeriodo, 1.2);
  assert.equal(linea(r, 'h2', 'sello_cortafuego|op-171').cantidadPeriodo, 2);
  assert.equal(linea(r, 'h2', 'sello_cortafuego|op-171').cantidadAnterior, 1.2);
  assert.equal(linea(r, 'h2', 'sello_cortafuego|op-171').cantidadAcumulada, 3.2);
  assert.equal(linea(r, 'h2', 'sello_cortafuego|op-171').subtotalPeriodo, 1);
  // Sin factores (S/F) junto a la cantidad final (C/F).
  assert.equal(linea(r, 'h1', 'sello_cortafuego|op-171').cantidadFisicaPeriodo, 1);
  // Ejecutado después del último período: todavía sin estado de avance.
  assert.deepEqual(r.sinEstado.map((x) => x.id), ['c']);
});

test('un registro validado después de cerrar su semana pasa al siguiente estado de avance', () => {
  // Semana 1 se cerró con el registro "a"; después se validó "tarde", ejecutado en la semana 1.
  const cerrada: HitoAvance = {
    ...semana1,
    terminado: true,
    cierre: {
      cantidadRegistros: 1,
      registrosAtrasados: 0,
      lineas: [{ clave: 'sello_cortafuego|op-171', tipoRegistro: 'sello_cortafuego', itemizadoOpcionId: 'op-171', codigoBeck: '1-171', itemizadoBeck: 'x', itemizadoMandante: null, precioUnitario: 0.5, moneda: 'UF', cantidadContratada: null, cantidadPeriodo: 1 }],
    },
  };
  const r = calcularEstadoAvance({
    hitos: [cerrada, semana2],
    registros: [reg('a', '2026-08-04', '1-171', 1), reg('tarde', '2026-08-05', '1-171', 3)],
    registrosCongelados: new Set(['a']),
    items,
    contratos: [],
  });
  assert.equal(linea(r, 'h1', 'sello_cortafuego|op-171').cantidadPeriodo, 1);
  assert.equal(linea(r, 'h2', 'sello_cortafuego|op-171').cantidadPeriodo, 3);
  assert.equal(r.porHito.get('h2')!.registrosAtrasados, 1);
  assert.deepEqual(r.porHito.get('h2')!.registroIds, ['tarde']);
});

test('el estado de avance terminado conserva el PU y el contrato con que se cerró', () => {
  const cerrada: HitoAvance = {
    ...semana1,
    terminado: true,
    cierre: {
      cantidadRegistros: 1,
      registrosAtrasados: 0,
      lineas: [{ clave: 'sello_cortafuego|op-171', tipoRegistro: 'sello_cortafuego', itemizadoOpcionId: 'op-171', codigoBeck: '1-171', itemizadoBeck: 'x', itemizadoMandante: null, precioUnitario: 0.4, moneda: 'UF', cantidadContratada: 10, cantidadPeriodo: 4 }],
    },
  };
  const r = calcularEstadoAvance({
    hitos: [cerrada, semana2],
    registros: [reg('b', '2026-08-12', '1-171', 2)],
    registrosCongelados: new Set(['a']),
    items, // PU vigente 0.5
    contratos: [{ itemizadoOpcionId: 'op-171', tipoRegistro: 'sello_cortafuego', cantidadContratada: 20 }],
  });
  const l1 = linea(r, 'h1', 'sello_cortafuego|op-171');
  assert.equal(l1.precioUnitario, 0.4);
  assert.equal(l1.subtotalPeriodo, 1.6);
  assert.equal(l1.saldo, 6);
  const l2 = linea(r, 'h2', 'sello_cortafuego|op-171');
  assert.equal(l2.precioUnitario, 0.5);
  assert.equal(l2.cantidadAcumulada, 6);
  assert.equal(l2.saldo, 14);
  assert.equal(l2.montoContratado, 10);
});

test('Sellos y Tabiquería llevan contratos y acumulados separados para el mismo código', () => {
  const r = calcularEstadoAvance({
    hitos: [semana1],
    registros: [reg('s', '2026-08-04', '1-171', 3), reg('t', '2026-08-04', '1-171', 2, 'tabiqueria')],
    registrosCongelados: new Set(),
    items,
    contratos: [
      { itemizadoOpcionId: 'op-171', tipoRegistro: 'sello_cortafuego', cantidadContratada: 10 },
      { itemizadoOpcionId: 'op-171', tipoRegistro: 'tabiqueria', cantidadContratada: 5 },
    ],
  });
  assert.equal(linea(r, 'h1', 'sello_cortafuego|op-171').saldo, 7);
  assert.equal(linea(r, 'h1', 'tabiqueria|op-171').saldo, 3);
});

test('un ítem con contrato y sin ejecución aparece con saldo completo; sin PU no se valoriza', () => {
  const r = calcularEstadoAvance({
    hitos: [semana1],
    registros: [],
    registrosCongelados: new Set(),
    items,
    contratos: [{ itemizadoOpcionId: 'op-172', tipoRegistro: 'sello_cortafuego', cantidadContratada: 8 }],
  });
  const l = linea(r, 'h1', 'sello_cortafuego|op-172');
  assert.equal(l.saldo, 8);
  assert.equal(l.subtotalPeriodo, null);
});

test('un código que no está en el itemizado de la obra igual se muestra, sin valorizar', () => {
  const r = calcularEstadoAvance({
    hitos: [semana1],
    registros: [reg('x', '2026-08-04', '9-999', 1)],
    registrosCongelados: new Set(),
    items,
    contratos: [],
  });
  const l = linea(r, 'h1', 'sello_cortafuego|codigo:9-999');
  assert.equal(l.cantidadPeriodo, 1);
  assert.equal(l.itemizadoOpcionId, null);
  assert.equal(l.subtotalPeriodo, null);
});

test('el cierre guarda solo las líneas con cantidad en el período', () => {
  const r = calcularEstadoAvance({
    hitos: [semana1],
    registros: [reg('a', '2026-08-04', '1-171', 1)],
    registrosCongelados: new Set(),
    items,
    contratos: [{ itemizadoOpcionId: 'op-172', tipoRegistro: 'sello_cortafuego', cantidadContratada: 8 }],
  });
  const cierre = armarCierre(r.porHito.get('h1')!);
  assert.deepEqual(cierre.lineas.map((l) => l.clave), ['sello_cortafuego|op-171']);
  assert.equal(cierre.cantidadRegistros, 1);
});
