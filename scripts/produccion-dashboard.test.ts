import assert from 'node:assert/strict';
import { test } from 'node:test';
import { idsProduccionVigente } from '../src/utils/produccionDashboard';

const version = (id: string, registroOrigenId: string | null = null, estado = 'pendiente', dia = 1, cargaCompleta = true) => ({
  id, registroOrigenId, estado, cargaCompleta, createdAt: new Date(Date.UTC(2026, 8, dia)),
});

test('excluye rechazados e incompletos y conserva los otros estados', () => {
  assert.deepEqual([...idsProduccionVigente([
    version('pendiente'), version('revision', null, 'en_revision'),
    version('validado', null, 'validado'), version('rechazado', null, 'rechazado'),
    version('incompleto', null, 'pendiente', 1, false),
  ])].sort(), ['pendiente', 'revision', 'validado']);
});

test('cuenta una sola copia y utiliza su cantidad corregida', () => {
  const registros = [
    { ...version('original', null, 'rechazado'), cantidad: 5 },
    { ...version('copia', 'original', 'pendiente', 2), cantidad: 4 },
  ];
  const ids = idsProduccionVigente(registros);
  assert.equal(registros.filter(r => ids.has(r.id)).reduce((s, r) => s + r.cantidad, 0), 4);
});

test('resuelve cadenas y ramificaciones sin depender del orden recibido', () => {
  const registros = [version('c', 'b', 'validado', 4), version('b', 'a', 'pendiente', 2),
    version('a'), version('rama', 'a', 'pendiente', 3)];
  assert.deepEqual([...idsProduccionVigente(registros)], ['c']);
  assert.deepEqual([...idsProduccionVigente([...registros].reverse())], ['c']);
});

test('no recupera una versión anterior cuando la vigente está rechazada', () => {
  assert.equal(idsProduccionVigente([version('a'), version('b', 'a', 'rechazado', 2)]).size, 0);
});

test('no cuenta el original al filtrar un período que excluye la copia vigente', () => {
  const original = version('a');
  const ids = idsProduccionVigente([original, version('b', 'a', 'pendiente', 2)]);
  assert.equal([original].filter(r => ids.has(r.id)).length, 0);
});

test('mantiene trabajos independientes aunque su sello coincida y resuelve orígenes ausentes', () => {
  assert.deepEqual([...idsProduccionVigente([version('a'), version('b'), version('c', 'ausente')])].sort(), ['a', 'b', 'c']);
});

test('un borrador incompleto no reemplaza la versión completa', () => {
  assert.deepEqual([...idsProduccionVigente([version('a'), version('b', 'a', 'pendiente', 2, false)])], ['a']);
});
