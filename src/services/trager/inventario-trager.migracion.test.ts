import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

// La migración se prueba en PostgreSQL en memoria: no toca la base de Trager.
const sql = fs
  .readFileSync(path.join(__dirname, '../../../prisma/trager-migrations/20261014120000_inventario.sql'), 'utf8')
  .replace(/^BEGIN;\s*$/m, '')
  .replace(/^COMMIT;\s*$/m, '');

async function baseTrager() {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE "Categoria" (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
    CREATE TABLE "Producto" (
      id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, sku TEXT UNIQUE, stock INTEGER NOT NULL,
      precio DOUBLE PRECISION NOT NULL, "stockInicial" INTEGER DEFAULT 0, "stockReservado" INTEGER NOT NULL DEFAULT 0,
      "minStock" INTEGER NOT NULL DEFAULT 0, activo BOOLEAN NOT NULL DEFAULT true,
      "categoriaId" INTEGER NOT NULL REFERENCES "Categoria"(id)
    );
    INSERT INTO "Categoria" (nombre) VALUES ('Sellos');
    INSERT INTO "Producto" (nombre, sku, stock, precio, "stockInicial", "categoriaId") VALUES ('Masilla', 'M-1', 12, 1000, 12, 1);
  `);
  return db;
}

test('agrega entradas, salidas y el kardex sin cambiar los productos existentes', async () => {
  const db = await baseTrager();
  try {
    const antes = (await db.query('SELECT id, nombre, sku, stock, "stockInicial" FROM "Producto"')).rows;

    await db.exec(sql);

    const despues = (await db.query('SELECT id, nombre, sku, stock, "stockInicial", entradas, salidas FROM "Producto"'))
      .rows as Record<string, unknown>[];
    assert.deepEqual(
      despues.map(({ entradas: _e, salidas: _s, ...resto }) => resto),
      antes,
    );
    assert.equal(despues[0].entradas, 0);
    assert.equal(despues[0].salidas, 0);

    await db.exec(
      `INSERT INTO "Movimiento" (tipo, cantidad, "stockAnterior", "stockNuevo", "productoId") VALUES ('AJUSTE_MANUAL', 2, 12, 10, 1)`,
    );
    const movimientos = (await db.query('SELECT tipo, "createdAt" FROM "Movimiento"')).rows as {
      tipo: string;
      createdAt: Date;
    }[];
    assert.equal(movimientos[0].tipo, 'AJUSTE_MANUAL');
    assert.ok(movimientos[0].createdAt, 'la fecha se completa sola');
  } finally {
    await db.close();
  }
});

test('no deja borrar un producto que tiene movimientos y se puede aplicar dos veces', async () => {
  const db = await baseTrager();
  try {
    await db.exec(sql);
    await db.exec(sql);
    await db.exec(
      `INSERT INTO "Movimiento" (tipo, cantidad, "stockAnterior", "stockNuevo", "productoId") VALUES ('ENTRADA_INICIAL', 12, 0, 12, 1)`,
    );
    await assert.rejects(db.exec('DELETE FROM "Producto" WHERE id = 1'), /foreign key|violates/i);
  } finally {
    await db.close();
  }
});
