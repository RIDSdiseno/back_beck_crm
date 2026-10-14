import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';
import { PGlite } from '@electric-sql/pglite';
import { conContactoPrincipal } from './clientes-trager.compatibilidad';
import { buildClienteData, buildContactoData, procesarRut, validarBoolean } from './clientes-trager.validation';
import { importarFilasClientesTrager } from './importar-clientes-trager';
import { parseFileToRows } from '../../utils/importClientes';

const ejemplo = { RUT: '12.345.678-5', Nombre: 'Cliente de prueba', 'Razón Social': 'Empresa de prueba',
  'Nombre Empresa': 'Empresa', Teléfono: '+56912345678', Email: 'CONTACTO@EJEMPLO.CL',
  Región: 'Región Metropolitana', Comuna: 'Providencia', Dirección: 'Calle 123',
  'Tipo Cliente': 'Cliente final', 'Canal Venta': 'Venta directa' };

function repositorio() {
  const filas: Array<Record<string, unknown>> = [];
  return { filas, existeRut: async (rut: string) => filas.some(f => f.rut === rut),
    crear: async (data: Parameters<Parameters<typeof importarFilasClientesTrager>[1]['crear']>[0]) => {
      filas.push(data);
      return { id: filas.length, nombre: data.nombre, rut: data.rut, razonSocial: data.razonSocial ?? null };
    } };
}

test('El formulario acepta los mismos 12 campos y conserva las validaciones de Trager', () => {
  const data = buildClienteData({ nombre: ' Ejemplo ', rut: '123456785', email: 'TEST@EMPRESA.CL',
    telefono: '+56 9 1234 5678', direccion: ' Calle ', razonSocial: ' Razón ', nombreEmpresa: ' Empresa ',
    region: ' Región ', comuna: ' Comuna ', tipoCliente: 'Constructora', canalVenta: 'Venta directa', activo: true });
  assert.equal(Object.keys(data).length, 12);
  assert.equal(data.rut, '12.345.678-5');
  assert.equal(data.email, 'test@empresa.cl');
  assert.equal(data.telefono, '56912345678');
  assert.equal(data.tipoCliente, 'constructora');
  assert.equal(data.canalVenta, 'venta_directa');
  assert.throws(() => procesarRut('12.345.678-9'), /verificador/);
  assert.throws(() => buildClienteData({ nombre: '' }), /nombre/);
  assert.throws(() => buildClienteData({ nombre: 'x', email: 'correo incorrecto' }), /Correo/);
  assert.throws(() => buildClienteData({ nombre: 'x', tipoCliente: '__proto__' }), /inválido/);
  assert.throws(() => validarBoolean('false'), /estado/);
});

test('Contactos independientes y campos opcionales se pueden vaciar sin tocar otros datos', () => {
  assert.deepEqual(buildClienteData({ nombreEmpresa: null, tipoCliente: null, canalVenta: null }, true), {
    nombreEmpresa: null, tipoCliente: null, canalVenta: null,
  });
  assert.equal(buildContactoData({ nombre: ' Ana ', correo: 'ANA@EMPRESA.CL', principal: true }).nombre, 'Ana');
  assert.throws(() => buildContactoData({ nombre: '' }), /nombre/);
  assert.deepEqual(buildContactoData({ activo: false }, true), { activo: false });
});

test('Importa las 11 columnas, omite RUT repetidos sin sobrescribir y comunica errores por fila', async () => {
  const repo = repositorio();
  const result = await importarFilasClientesTrager([
    ejemplo,
    { ...ejemplo, RUT: '12345678-5', Nombre: 'No debe sobrescribir' },
    { ...ejemplo, RUT: null },
    { ...ejemplo, RUT: '12.345.678-9' },
    {},
  ], repo);
  assert.equal(result.totalProcesados, 4);
  assert.equal(result.totalCreados, 1);
  assert.equal(result.totalDuplicados, 1);
  assert.equal(result.totalErrores, 2);
  assert.equal(result.duplicadosOmitidos[0].fila, 3);
  assert.deepEqual(result.errores.map(e => e.fila), [4, 5]);
  assert.equal(repo.filas[0].nombre, 'Cliente de prueba');
  assert.equal(repo.filas[0].activo, true);
  assert.equal(repo.filas[0].region, ejemplo.Región);
  const segundo = await importarFilasClientesTrager([ejemplo], repo);
  assert.equal(segundo.totalDuplicados, 1);
  assert.equal(repo.filas.length, 1);
});

test('Evita duplicados concurrentes y rechaza archivos sin columnas reconocidas o demasiado grandes', async () => {
  const repo = repositorio();
  repo.crear = async () => { throw Object.assign(new Error('Duplicado'), { code: 'P2002' }); };
  const result = await importarFilasClientesTrager([ejemplo], repo);
  assert.equal(result.totalDuplicados, 1);
  assert.equal(result.totalErrores, 0);
  await assert.rejects(importarFilasClientesTrager([{ columna: 'desconocida' }], repo), /encabezados/);
  await assert.rejects(importarFilasClientesTrager(Array(5001).fill(ejemplo), repo), /5.000/);
});

test('Lee XLSX y CSV y respeta las filas vacías para reportar el número real de error', async () => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['RUT', 'Nombre'], ['12.345.678-5', 'Ejemplo'], [], ['', 'Sin RUT']]), 'Clientes Trager');
  const rows = parseFileToRows(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }), 'clientes.xlsx', true);
  const result = await importarFilasClientesTrager(rows, repositorio());
  assert.equal(result.totalCreados, 1);
  assert.equal(result.errores[0].fila, 4);
  const csv = parseFileToRows(Buffer.from('RUT,Nombre\n12.345.678-5,Ejemplo'), 'clientes.csv', true);
  assert.equal((await importarFilasClientesTrager(csv, repositorio())).totalCreados, 1);
});

test('La migración conserva clientes y contactos originales, es repetible y limita el contacto principal', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE "Cliente" (
      id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, rut TEXT UNIQUE,
      "contactoNombre" TEXT, "contactoTelefono" TEXT, "contactoCorreo" TEXT,
      activo BOOLEAN NOT NULL DEFAULT TRUE, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
    INSERT INTO "Cliente" (nombre, rut, "contactoNombre", "contactoTelefono", "contactoCorreo")
      VALUES ('Empresa anterior', '12.345.678-5', 'Ana', '+56912345678', 'ana@empresa.cl');
    INSERT INTO "Cliente" (nombre, activo) VALUES ('Sin contacto', FALSE);
    INSERT INTO "Cliente" (nombre, "contactoCorreo") VALUES ('Contacto sin nombre', 'otro@empresa.cl');`);
    const columnas = 'id, nombre, rut, "contactoNombre", "contactoTelefono", "contactoCorreo", activo, "createdAt", "updatedAt"';
    const before = (await db.query(`SELECT ${columnas} FROM "Cliente" ORDER BY id`)).rows;
    const sql = fs.readFileSync(path.join(process.cwd(), 'prisma/trager-migrations/20261014000000_clientes_completos.sql'), 'utf8');
    await db.exec(sql);
    await db.exec(sql);
    assert.deepEqual((await db.query(`SELECT ${columnas} FROM "Cliente" ORDER BY id`)).rows, before);
    const contactos = (await db.query<{ nombre: string; correo: string; principal: boolean }>('SELECT * FROM contactos_cliente_trager ORDER BY id')).rows;
    assert.equal(contactos.length, 2);
    assert.equal(contactos[0].nombre, 'Ana');
    assert.equal(contactos[0].correo, 'ana@empresa.cl');
    assert.equal(contactos[0].principal, true);
    assert.equal(contactos[1].nombre, 'Contacto anterior');
    await assert.rejects(db.query(`INSERT INTO contactos_cliente_trager ("clienteId", nombre, principal) VALUES (1, 'Otro principal', TRUE)`), /duplicate key/);
    await db.query(`INSERT INTO contactos_cliente_trager ("clienteId", nombre, principal) VALUES (1, 'Otro contacto', FALSE)`);
    await db.query(`UPDATE "Cliente" SET razon_social='Razón', nombre_empresa='Empresa', email='empresa@ejemplo.cl', telefono='12345678', direccion='Dirección', region='Región', comuna='Comuna', "tipoCliente"='constructora', canal_venta='venta_directa' WHERE id=1`);
    assert.equal((await db.query('SELECT * FROM "Cliente" WHERE id=1')).rows.length, 1);
  } finally { await db.close(); }
});

test('Funnel y Cotizaciones reciben el contacto principal activo, no un contacto desactivado', () => {
  const cliente = { email: 'empresa@ejemplo.cl', telefono: '12345678', contactoNombre: 'Anterior',
    contactoTelefono: '999999999', contactoCorreo: 'anterior@ejemplo.cl', contactos: [
      { nombre: 'Inactivo', telefono: null, correo: null, activo: false, principal: true },
      { nombre: 'Secundario', telefono: null, correo: null, activo: true, principal: false },
      { nombre: 'Principal', telefono: '912345678', correo: 'principal@ejemplo.cl', activo: true, principal: true },
    ] };
  assert.equal(conContactoPrincipal(cliente).contactoNombre, 'Principal');
  assert.equal(conContactoPrincipal(cliente).contactoCorreo, 'principal@ejemplo.cl');
  assert.equal(conContactoPrincipal({ ...cliente, contactos: cliente.contactos.slice(0, 1) }).contactoNombre, null);
  assert.equal(conContactoPrincipal({ ...cliente, contactos: [] }).contactoNombre, 'Anterior');
  assert.equal(conContactoPrincipal({ ...cliente, contactoNombre: null, contactoTelefono: null, contactoCorreo: null, contactos: [] }).contactoCorreo, 'empresa@ejemplo.cl');
});
