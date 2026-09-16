import assert from 'node:assert/strict';
import test from 'node:test';
import {
  correccionDebePasarPorSupervisor,
  ErrorSeleccionItemizado,
  prepararCambioItemizado,
  validarSeleccionItemizado,
} from '../src/utils/seleccionItemizadoRegistro';

const id = '7d1d29d8-3888-4ee0-82d4-443eea0300cb';
const opcion = {
  codigoBeck: 'BECK-01', elementoPasante: 'Tubería metálica', visible: true,
  configuracionesPorObra: [] as { visible: boolean; nombrePersonalizado: string | null }[],
};

test('sin configuración propia usa el catálogo BECK y guarda los campos juntos', () => {
  assert.doesNotThrow(() => validarSeleccionItemizado(id, 'en_revision'));
  assert.deepEqual(prepararCambioItemizado(opcion, 'en_revision'), {
    descripcionMaterial: 'Tubería metálica', itemizadoBeck: 'Tubería metálica',
    codigoBeck: 'BECK-01', itemizadoMandanteTexto: 'Tubería metálica',
    itemizadoMandante: { disconnect: true }, estado: 'en_revision',
  });
});

test('la configuración por obra prevalece sobre visibilidad y nombre global', () => {
  const cambio = prepararCambioItemizado({ ...opcion, visible: false,
    configuracionesPorObra: [{ visible: true, nombrePersonalizado: 'Mandante 02' }],
  }, 'validado');
  assert.equal(cambio.itemizadoMandanteTexto, 'Mandante 02');
  assert.equal(cambio.descripcionMaterial, opcion.elementoPasante);
  assert.equal(cambio.estado, 'en_revision');
});

test('impide seleccionar opciones inexistentes u ocultas para la obra', () => {
  for (const item of [null, { ...opcion, visible: false }, { ...opcion,
    configuracionesPorObra: [{ visible: false, nombrePersonalizado: 'Oculto' }],
  }]) {
    assert.throws(() => prepararCambioItemizado(item, 'en_revision'), ErrorSeleccionItemizado);
  }
});

test('nombre personalizado vacío usa la descripción y código nulo limpia el anterior', () => {
  const cambio = prepararCambioItemizado({ ...opcion, codigoBeck: null,
    configuracionesPorObra: [{ visible: true, nombrePersonalizado: '' }],
  }, 'en_revision');
  assert.equal(cambio.itemizadoMandanteTexto, opcion.elementoPasante);
  assert.equal(cambio.codigoBeck, null);
});

test('rechaza UUID inválido y no permite editar pendientes o históricos rechazados', () => {
  for (const valor of [null, '', 'BECK-01', 42]) {
    assert.throws(() => validarSeleccionItemizado(valor, 'en_revision'), ErrorSeleccionItemizado);
  }
  for (const estado of ['pendiente', 'rechazado']) {
    assert.throws(() => validarSeleccionItemizado(id, estado), { status: 409 });
    assert.throws(() => prepararCambioItemizado(opcion, estado), { status: 409 });
  }
});

test('una copia pendiente sigue exigiendo envío del supervisor; validada puede reabrirse', () => {
  assert.equal(correccionDebePasarPorSupervisor('pendiente', 'en_revision', true), true);
  assert.equal(correccionDebePasarPorSupervisor('rechazado', 'en_revision', true), true);
  assert.equal(correccionDebePasarPorSupervisor('validado', 'en_revision', true), false);
  assert.equal(correccionDebePasarPorSupervisor('en_revision', 'en_revision', true), false);
  assert.equal(correccionDebePasarPorSupervisor('pendiente', undefined, true), false);
});

test('valida los largos antes de guardar sin truncar información', () => {
  assert.throws(() => prepararCambioItemizado({ ...opcion, elementoPasante: '' }, 'en_revision'), ErrorSeleccionItemizado);
  assert.throws(() => prepararCambioItemizado({ ...opcion, elementoPasante: 'x'.repeat(501) }, 'en_revision'), ErrorSeleccionItemizado);
  assert.throws(() => prepararCambioItemizado({ ...opcion,
    configuracionesPorObra: [{ visible: true, nombrePersonalizado: 'x'.repeat(256) }],
  }, 'en_revision'), ErrorSeleccionItemizado);
});
