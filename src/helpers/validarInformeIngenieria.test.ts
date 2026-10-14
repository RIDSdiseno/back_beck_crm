import assert from 'node:assert/strict';
import { test } from 'node:test';
import { seleccionInformeValida } from './validarInformeIngenieria';
const registro = { id: '1', obraId: 'obra-1', estado: 'validado', cargaCompleta: true };

test('Acepta únicamente registros validados y completos de la misma obra', () => {
  assert.equal(seleccionInformeValida(['1'], [registro]), true);
  for (const estado of ['pendiente', 'en_revision', 'rechazado']) {
    assert.equal(seleccionInformeValida(['1'], [{ ...registro, estado }]), false);
  }
  assert.equal(seleccionInformeValida(['1'], [{ ...registro, cargaCompleta: false }]), false);
  assert.equal(seleccionInformeValida(['1', '2'], [registro, { ...registro, id: '2', obraId: 'otra' }]), false);
});
test('Rechaza vacíos, faltantes, duplicados y más de 50 registros', () => {
  assert.equal(seleccionInformeValida([], []), false);
  assert.equal(seleccionInformeValida(['1'], []), false);
  assert.equal(seleccionInformeValida(['1', '1'], [registro, registro]), false);
  const registros = Array.from({ length: 51 }, (_, i) => ({ ...registro, id: String(i) }));
  assert.equal(seleccionInformeValida(registros.map(r => r.id), registros), false);
  assert.equal(seleccionInformeValida(registros.slice(0, 50).map(r => r.id), registros.slice(0, 50)), true);
});
