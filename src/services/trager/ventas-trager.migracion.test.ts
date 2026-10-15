import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

// La migración se prueba en PostgreSQL en memoria: no toca la base de Trager.
const sql = fs
  .readFileSync(path.join(__dirname, '../../../prisma/trager-migrations/20261014220000_ventas.sql'), 'utf8')
  .replace(/^BEGIN;\s*$/m, '')
  .replace(/^COMMIT;\s*$/m, '');

test('crea ventas con su detalle, se puede aplicar dos veces y protege el producto vendido', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE "Producto" (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
      INSERT INTO "Producto" (nombre) VALUES ('Masilla');
    `);
    await db.exec(sql);
    await db.exec(sql);
    await db.exec(`INSERT INTO "Venta" ("productoId", cliente, cantidad, precio, total) VALUES (1, 'Constructora', 2, 1000, 2000)`);
    await db.exec(`INSERT INTO "VentaDetalle" ("ventaId", "productoId", cantidad, precio, subtotal) VALUES (1, 1, 2, 1000, 2000)`);
    const venta = (await db.query('SELECT estado, "createdAt" FROM "Venta"')).rows[0] as { estado: string; createdAt: Date };
    assert.equal(venta.estado, 'PROSPECTO');
    assert.ok(venta.createdAt);
    await assert.rejects(db.exec('DELETE FROM "Producto" WHERE id = 1'), /foreign key|violates/i);
  } finally {
    await db.close();
  }
});
