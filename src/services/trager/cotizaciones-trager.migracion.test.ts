import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

// La migración se prueba en PostgreSQL en memoria: no toca la base de Trager.
const sql = fs
  .readFileSync(path.join(__dirname, '../../../prisma/trager-migrations/20261014180000_cotizaciones_completas.sql'), 'utf8')
  .replace(/^BEGIN;\s*$/m, '')
  .replace(/^COMMIT;\s*$/m, '');

async function baseTrager() {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE "Cliente" (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
    CREATE TABLE contactos_cliente_trager (id SERIAL PRIMARY KEY, "clienteId" INTEGER NOT NULL REFERENCES "Cliente"(id) ON DELETE CASCADE, nombre TEXT NOT NULL);
    CREATE TABLE "Categoria" (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
    CREATE TABLE "Producto" (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, precio DOUBLE PRECISION NOT NULL, "categoriaId" INTEGER NOT NULL REFERENCES "Categoria"(id));
    CREATE TABLE "CotizacionTrager" (id SERIAL PRIMARY KEY, cliente TEXT NOT NULL, estado TEXT NOT NULL DEFAULT 'BORRADOR', total DOUBLE PRECISION NOT NULL DEFAULT 0);
    CREATE TABLE "CotizacionTragerDetalle" (id SERIAL PRIMARY KEY, "cotizacionId" INTEGER NOT NULL REFERENCES "CotizacionTrager"(id) ON DELETE CASCADE,
      "productoId" INTEGER NOT NULL REFERENCES "Producto"(id), cantidad INTEGER NOT NULL, "precioUnitario" DOUBLE PRECISION NOT NULL, subtotal DOUBLE PRECISION NOT NULL);
    CREATE TABLE "FunnelTragerOpportunity" (id SERIAL PRIMARY KEY, cliente TEXT NOT NULL, "productoId" INTEGER, "cotizacionId" INTEGER);
    INSERT INTO "Cliente" (nombre) VALUES ('Constructora');
    INSERT INTO contactos_cliente_trager ("clienteId", nombre) VALUES (1, 'Ana');
    INSERT INTO "Categoria" (nombre) VALUES ('Sellos');
    INSERT INTO "Producto" (nombre, precio, "categoriaId") VALUES ('Masilla', 1000, 1);
    INSERT INTO "CotizacionTrager" (cliente, total) VALUES ('Constructora', 5000);
    INSERT INTO "CotizacionTragerDetalle" ("cotizacionId", "productoId", cantidad, "precioUnitario", subtotal) VALUES (1, 1, 5, 1000, 5000);
    INSERT INTO "FunnelTragerOpportunity" (cliente, "productoId", "cotizacionId") VALUES ('Constructora', 1, 1);
  `);
  return db;
}

test('agrega las columnas de Firemat con sus valores por defecto sin cambiar los datos', async () => {
  const db = await baseTrager();
  try {
    await db.exec(sql);
    const cot = (await db.query('SELECT cliente, total, moneda, "aplicaImpuesto", version, "esActual", "clienteTragerId" FROM "CotizacionTrager"'))
      .rows[0] as Record<string, unknown>;
    assert.deepEqual(cot, {
      cliente: 'Constructora',
      total: 5000,
      moneda: 'CLP',
      aplicaImpuesto: true,
      version: 1,
      esActual: true,
      clienteTragerId: null,
    });
    const det = (await db.query('SELECT "gananciaPct" FROM "CotizacionTragerDetalle"')).rows[0] as { gananciaPct: number };
    assert.equal(det.gananciaPct, 0);
    const prod = (await db.query('SELECT "precioInstalador" FROM "Producto"')).rows[0] as { precioInstalador: number | null };
    assert.equal(prod.precioInstalador, null);
  } finally {
    await db.close();
  }
});

test('se puede aplicar dos veces y las claves dejan en blanco el vínculo al borrar', async () => {
  const db = await baseTrager();
  try {
    await db.exec(sql);
    await db.exec(sql);
    await db.exec('UPDATE "CotizacionTrager" SET "clienteTragerId" = 1, "contactoTragerId" = 1');
    // Borrar la cotización no falla: la oportunidad queda sin cotización vinculada.
    await db.exec('DELETE FROM "CotizacionTrager" WHERE id = 1');
    const opp = (await db.query('SELECT "cotizacionId" FROM "FunnelTragerOpportunity"')).rows[0] as { cotizacionId: number | null };
    assert.equal(opp.cotizacionId, null);
    // Una oportunidad no puede apuntar a un producto inexistente.
    await assert.rejects(db.exec('UPDATE "FunnelTragerOpportunity" SET "productoId" = 99'), /foreign key|violates/i);
  } finally {
    await db.close();
  }
});
