import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parametrosPdfs, PDF_FIRMADO_WHERE, leerPdfOriginal, urlPublicaPdfPermitida } from '../src/utils/pdfsFirmados';

test('pagina en servidor, filtra firmas existentes y permite obras y firmantes', () => {
  const id = '12345678-1234-1234-1234-123456789012';
  const p = parametrosPdfs({ page: '3', limit: '50', obraId: id, firmanteId: id, search: 'REG-ddbe9a' });
  assert.equal(p.page, 3);
  assert.equal(p.limit, 50);
  assert.deepEqual(p.where.AND, PDF_FIRMADO_WHERE.AND);
  assert.equal(p.where.validadoCliente, true);
  assert.equal(p.where.obraId, id);
  assert.equal(p.where.validadoClientePorId, id);
  assert.ok(JSON.stringify(p.where).includes('ddbe9a00-0000-0000-0000-000000000000'));
  assert.ok(!JSON.stringify(p.where).includes('nombreSellador'));
});

test('rango de firmas incluye desde y excluye el inicio del día siguiente', () => {
  const p = parametrosPdfs({ desde: '2026-09-25T03:00:00.000Z', hasta: '2026-09-26T03:00:00.000Z' });
  assert.deepEqual(p.where.validadoClienteAt, { gte: new Date('2026-09-25T03:00:00.000Z'), lt: new Date('2026-09-26T03:00:00.000Z') });
});

test('rechaza filtros malformados y tamaños ilimitados', () => {
  for (const query of [{ page: '-1' }, { limit: '101' }, { obraId: 'no-uuid' }, { search: ['x'] },
    { desde: '2026-02-30T00:00:00.000Z' }, { desde: '2026-09-26T03:00:00.000Z', hasta: '2026-09-25T03:00:00.000Z' }]) {
    assert.throws(() => parametrosPdfs(query), { status: 400 });
  }
});

test('solo permite las URLs de Cloudinary de nuestra cuenta', () => {
  assert.equal(urlPublicaPdfPermitida('https://res.cloudinary.com/beck/raw/upload/test.pdf', 'beck'), 'https://res.cloudinary.com/beck/raw/upload/test.pdf');
  for (const url of ['http://127.0.0.1/a', 'https://res.cloudinary.com/otra/raw/test.pdf',
    'https://res.cloudinary.com.ejemplo.com/beck/a', 'https://user@res.cloudinary.com/beck/a']) {
    assert.throws(() => urlPublicaPdfPermitida(url, 'beck'));
  }
});

test('devuelve exactamente los bytes originales, sin compactar ni regenerar', async () => {
  const original = Buffer.from('%PDF-1.7\nFirma original de prueba\n%%EOF');
  const bytes = await leerPdfOriginal('https://example.test/pdf', async (_url, options) => {
    assert.equal(options?.redirect, 'error');
    return new Response(original, { headers: { 'content-type': 'application/pdf' } });
  });
  assert.deepEqual(bytes, original);
});

test('maneja archivos ausentes, inválidos y demasiado grandes sin generar reemplazo', async () => {
  await assert.rejects(leerPdfOriginal('test', async () => new Response('', { status: 404 })), { status: 404 });
  await assert.rejects(leerPdfOriginal('test', async () => new Response('<html>Error</html>')), { status: 502 });
  await assert.rejects(leerPdfOriginal('test', async () => new Response('%PDF-', { headers: { 'content-length': String(26 * 1024 * 1024) } })), { status: 413 });
});

test('API: acceso exclusivo, paginación, metadatos y descarga privada original', async (t) => {
  // No usar conexiones ni servicios reales durante las pruebas.
  process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:1/test';
  process.env.JWT_SECRET = 'secreto-exclusivo-de-pruebas-pdf';
  process.env.CLOUDINARY_CLOUD_NAME = 'beck-test';
  process.env.CLOUDINARY_API_KEY = 'test';
  process.env.CLOUDINARY_API_SECRET = 'test';
  const { prisma } = await import('../src/config/prisma');
  const { default: express } = await import('express');
  const { default: jwt } = await import('jsonwebtoken');
  const { default: router } = await import('../src/routes/pdfsFirmados.routes');
  let rol = 'administrador';
  let activo = true;
  let referencia: string | null = 'beck/pdfs-firmados/prueba.pdf';
  const id = 'ddbe9aaa-1234-1234-1234-123456789012';
  // Los delegates de Prisma son proxies, no métodos con descriptor propio.
  const mockMethod = (target: any, key: string, implementation: (...args: any[]) => any) => {
    const original = target[key];
    const fn = t.mock.fn(implementation);
    target[key] = fn;
    t.after(() => { target[key] = original; });
    return fn;
  };
  mockMethod(prisma.usuario, 'findUnique', async () => ({ id: 'usuario', rol, activo }));
  const listing = mockMethod(prisma.registroTerreno, 'findMany', async () => [{
    id, nombreFirmanteCliente: 'Nombre al firmar', validadoClientePor: { nombre: 'Nombre actual', email: 'prueba@example.test' },
  }]);
  const count = mockMethod(prisma.registroTerreno, 'count', async () => 250);
  mockMethod(prisma.registroTerreno, 'findFirst', async () => referencia ? { pdfFirmadoUrl: referencia } : null);
  mockMethod(prisma.obra, 'findMany', async () => []);
  mockMethod(prisma.usuario, 'findMany', async () => []);
  mockMethod(prisma, '$transaction', async (queries: Promise<unknown>[]) => Promise.all(queries));
  const original = Buffer.from('%PDF-1.7\nDocumento firmado de prueba\n%%EOF');
  const realFetch = globalThis.fetch;
  const external = t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    if (String(url).startsWith('https://')) return new Response(original);
    return realFetch(url, options);
  });
  const app = express();
  app.use('/pdfs', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  const root = `http://127.0.0.1:${address.port}/pdfs`;
  const token = jwt.sign({ userId: 'usuario', rol: 'administrador' }, process.env.JWT_SECRET);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    assert.equal((await realFetch(root)).status, 401);
    for (const role of ['cliente', 'jefeobra', 'terreno', 'visualizador', 'bodeguero', 'vendedor', 'vendedor_firemat', 'visualizador_firemat']) {
      rol = role;
      for (const path of ['', '/filtros', `/${id}/archivo`]) assert.equal((await realFetch(root + path, { headers })).status, 403);
    }
    for (const role of ['administrador', 'ingenieria']) {
      rol = role;
      const response = await realFetch(`${root}?page=3&limit=25&search=0042`, { headers });
      assert.equal(response.status, 200);
      const data = (await response.json()).data;
      assert.equal(data.total, 250);
      assert.equal(data.items[0].firmante, 'Nombre al firmar');
      assert.equal(data.items[0].nombreHistorico, true);
      assert.equal(data.items[0].pdfFirmadoUrl, undefined);
      assert.equal((await realFetch(root + '/filtros', { headers })).status, 200);
    }
    const args = listing.mock.calls.at(-1)!.arguments[0];
    assert.equal(args.skip, 50);
    assert.equal(args.take, 25);
    assert.deepEqual(count.mock.calls.at(-1)!.arguments[0].where, args.where);
    for (const suffix of ['', '?download=true']) {
      const response = await realFetch(`${root}/${id}/archivo${suffix}`, { headers });
      assert.equal(response.status, 200);
      assert.ok(response.headers.get('content-disposition')?.startsWith(suffix ? 'attachment' : 'inline'));
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), original);
    }
    assert.ok(external.mock.calls.some(call => String(call.arguments[0]).startsWith('https://api.cloudinary.com/')));
    referencia = null;
    assert.equal((await realFetch(`${root}/${id}/archivo`, { headers })).status, 404);
    assert.equal((await realFetch(`${root}?obraId=invalido`, { headers })).status, 400);
    activo = false;
    assert.equal((await realFetch(root, { headers })).status, 403);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  }
});
