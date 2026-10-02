import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buscarCodigosRepetidos,
  codigoEfectivo,
  ErrorCodigoPersonalizado,
  normalizarCodigoPersonalizado,
  proyectarItemsObra,
} from '../src/utils/codigoItemizadoObra';

// Catálogo vigente del ejemplo de Sótero del Río.
const catalogo = [
  { id: 'op-1-140', codigoBeck: '1-140', visible: false }, // Ø ≤ 110 mm
  { id: 'op-1-141', codigoBeck: '1-141', visible: false }, // Ø ≤ 160 mm
  { id: 'op-1-144', codigoBeck: '1-144', visible: true }, //  Ø ≤ 50 mm, visible por defecto
];

test('normaliza el código propio: recorta, vacío = sin código, rechaza tipos y largos inválidos', () => {
  assert.equal(normalizarCodigoPersonalizado('  1-141 '), '1-141');
  assert.equal(normalizarCodigoPersonalizado('   '), null);
  assert.equal(normalizarCodigoPersonalizado(null), null);
  assert.equal(normalizarCodigoPersonalizado(undefined), null);
  assert.throws(() => normalizarCodigoPersonalizado(141), ErrorCodigoPersonalizado);
  assert.throws(() => normalizarCodigoPersonalizado('x'.repeat(101)), ErrorCodigoPersonalizado);
});

test('el código de la obra manda sobre el del catálogo', () => {
  assert.equal(codigoEfectivo('1-140', '1-141'), '1-141');
  assert.equal(codigoEfectivo('1-140', null), '1-140');
  assert.equal(codigoEfectivo('1-140', '  '), '1-140');
  assert.equal(codigoEfectivo(null, null), null);
});

test('detecta repetidos solo entre visibles, sin distinguir mayúsculas ni espacios', () => {
  assert.deepEqual(buscarCodigosRepetidos([
    { visible: true, codigoEfectivo: '1-141' },
    { visible: true, codigoEfectivo: ' 1-141' },
    { visible: false, codigoEfectivo: '1-140' },
    { visible: true, codigoEfectivo: '1-140' },
    { visible: true, codigoEfectivo: 'ej-196' },
    { visible: true, codigoEfectivo: 'EJ-196' },
  ]), ['1-141', 'ej-196']);
});

test('caso Sótero: renumerar al código antiguo es válido mientras el original no quede visible', () => {
  // La obra usa el 1-140 vigente (Ø ≤ 110) con su código antiguo 1-141; el 1-141 vigente sigue oculto.
  const items = proyectarItemsObra(catalogo, [
    { itemizadoOpcionId: 'op-1-140', visible: true, codigoPersonalizado: '1-141' },
  ]);
  assert.deepEqual(buscarCodigosRepetidos(items), []);
  assert.equal(items.find((i) => i.itemizadoOpcionId === 'op-1-140')?.codigoEfectivo, '1-141');
});

test('caso Sótero: activar el 1-141 vigente en esa obra choca con el código antiguo', () => {
  const items = proyectarItemsObra(
    catalogo,
    [{ itemizadoOpcionId: 'op-1-140', visible: true, codigoPersonalizado: '1-141' }],
    { obra: new Map([['op-1-141', { visible: true }]]) },
  );
  assert.deepEqual(buscarCodigosRepetidos(items), ['1-141']);
});

test('la visibilidad sigue la regla del listado: config explícita manda, si no el catálogo', () => {
  const items = proyectarItemsObra(catalogo, [
    { itemizadoOpcionId: 'op-1-144', visible: false, codigoPersonalizado: null },
  ]);
  assert.equal(items.find((i) => i.itemizadoOpcionId === 'op-1-144')?.visible, false);
  assert.equal(items.find((i) => i.itemizadoOpcionId === 'op-1-141')?.visible, false);
});

test('una config nueva creada solo con código queda visible, como en el guardado', () => {
  const items = proyectarItemsObra(catalogo, [], {
    obra: new Map([['op-1-141', { codigoPersonalizado: '1-143' }]]),
  });
  const item = items.find((i) => i.itemizadoOpcionId === 'op-1-141');
  assert.equal(item?.visible, true);
  assert.equal(item?.codigoEfectivo, '1-143');
});

test('quitar el código propio vuelve al del catálogo y puede generar un repetido', () => {
  const items = proyectarItemsObra(
    catalogo,
    [
      { itemizadoOpcionId: 'op-1-140', visible: true, codigoPersonalizado: '1-144' },
      { itemizadoOpcionId: 'op-1-144', visible: true, codigoPersonalizado: '1-140' },
    ],
    { obra: new Map([['op-1-144', { codigoPersonalizado: null }]]) },
  );
  assert.deepEqual(buscarCodigosRepetidos(items), ['1-144']);
});

test('un cambio del catálogo global también se proyecta sobre la obra', () => {
  const items = proyectarItemsObra(
    catalogo,
    [{ itemizadoOpcionId: 'op-1-140', visible: true, codigoPersonalizado: '1-141' }],
    { catalogo: new Map([['op-1-144', { codigoBeck: '1-141' }]]) }, // 1-144 es visible por defecto
  );
  assert.deepEqual(buscarCodigosRepetidos(items), ['1-141']);
});
