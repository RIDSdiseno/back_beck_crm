import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ordenarInforme, resumenInforme, type RegistroResumen } from './resumenInforme';

const base: RegistroResumen = { id: '1', usuarioId: 'u1', nombreSellador: 'Ana',
  piso: '2', cantidadSellos: 3, metrosLineales: null, tipoRegistro: 'sello_cortafuego',
  numeroSello: '10', fecha: new Date('2026-10-14T00:00:00Z') };
test('El resumen cuenta únicamente la selección y mantiene separadas las unidades', () => {
  const resumen = resumenInforme([base,
    { ...base, id: '2', tipoRegistro: 'junta_lineal_espuma', metrosLineales: 4.5, cantidadSellos: 999 },
    { ...base, id: '3', tipoRegistro: 'tabiqueria', cantidadSellos: 7, piso: '10', usuarioId: 'u2', nombreSellador: 'Pedro' },
  ]);
  assert.deepEqual(resumen.total, { registros: 3, sellos: 3, tabiqueria: 7, juntasMl: 4.5, otros: 0 });
  assert.deepEqual(resumen.pisos.map(p => p.nombre), ['2', '10']);
  assert.equal(resumen.responsables[0].registros, 2);
});
test('Ordena piso y sello de manera numérica y fecha sin modificar la selección', () => {
  const registros = [base, { ...base, id: '2', piso: '10', numeroSello: '2', fecha: new Date('2026-10-13T00:00:00Z') }];
  assert.equal(ordenarInforme(registros, 'piso')[0].id, '1');
  assert.equal(ordenarInforme(registros, 'sello')[0].id, '2');
  assert.equal(ordenarInforme(registros, 'fecha')[0].id, '2');
  assert.equal(registros[0].id, '1');
});
