import assert from 'node:assert/strict';
import { test } from 'node:test';
import { setImmediate as tick } from 'node:timers/promises';
import { InformeJobs } from './informeJobs.service';

test('Los informes son privados, avanzan y expiran una hora después de terminar', async () => {
  let now = 1000;
  const jobs = new InformeJobs(() => now, 3600000);
  const job = jobs.crear('ana', 'Prueba', async avance => { avance(50); return Buffer.from('pdf'); });
  assert.equal(job.estado, 'en_cola');
  assert.equal(jobs.listar('otro').length, 0);
  assert.equal(jobs.obtener('otro', job.id), undefined);
  await tick();
  assert.equal(jobs.listar('ana')[0].estado, 'listo');
  assert.equal(jobs.listar('ana')[0].progreso, 100);
  assert.equal(jobs.obtener('ana', job.id)?.pdf?.toString(), 'pdf');
  assert.equal('pdf' in jobs.listar('ana')[0], false);
  now += 3599999;
  assert.equal(jobs.listar('ana').length, 1);
  now++;
  assert.equal(jobs.obtener('ana', job.id), undefined);
});

test('No permite trabajos simultáneos del mismo usuario y procesa una ficha de trabajo a la vez', async () => {
  const jobs = new InformeJobs();
  let liberar!: (value: Buffer) => void;
  let segundoInicio = false;
  const primero = jobs.crear('ana', 'Primero', () => new Promise(resolve => { liberar = resolve; }));
  assert.throws(() => jobs.crear('ana', 'Duplicado', async () => Buffer.alloc(1)), /Ya tienes/);
  const segundo = jobs.crear('pedro', 'Segundo', async () => { segundoInicio = true; return Buffer.alloc(1); });
  await tick();
  assert.equal(jobs.obtener('ana', primero.id)?.estado, 'generando');
  assert.equal(jobs.obtener('pedro', segundo.id)?.estado, 'en_cola');
  assert.equal(segundoInicio, false);
  liberar(Buffer.alloc(1));
  await tick(); await tick();
  assert.equal(segundoInicio, true);
  assert.equal(jobs.obtener('pedro', segundo.id)?.estado, 'listo');
});

test('Limita la cola para no sobrecargar el servidor', async () => {
  const jobs = new InformeJobs();
  for (let i = 0; i < 5; i++) jobs.crear(String(i), 'Prueba', async () => Buffer.alloc(1));
  assert.throws(() => jobs.crear('6', 'Prueba', async () => Buffer.alloc(1)), /ocupada/);
  for (let i = 0; i < 7; i++) await tick();
});

test('Un fallo libera la cola, permite reintentar y no expone errores internos', async () => {
  const jobs = new InformeJobs();
  const original = console.error;
  console.error = () => {};
  try {
    jobs.crear('ana', 'Error', async () => { throw new Error('secreto interno'); });
    await tick();
    const job = jobs.listar('ana')[0];
    assert.equal(job.estado, 'error');
    assert.equal(job.error?.includes('secreto'), false);
    const nuevo = jobs.crear('ana', 'Nuevo', async () => Buffer.alloc(1));
    await tick();
    assert.equal(jobs.obtener('ana', nuevo.id)?.estado, 'listo');
  } finally { console.error = original; }
});
