// Solo Trager. Por defecto informa; --apply aplica en una transacción comprobada.
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

async function main() {
  if (!process.env.TRAGGER_DATABASE_URL) throw new Error('Falta TRAGGER_DATABASE_URL.');
  const pool = new Pool({ connectionString: process.env.TRAGGER_DATABASE_URL });
  const client = await pool.connect();
  let transaccion = false;
  try {
    const resumen = await client.query('SELECT COUNT(*)::int AS productos FROM "Producto"');
    const existe = await client.query(`SELECT to_regclass('"Movimiento"') IS NOT NULL AS existe`);
    console.log('Productos en Trager:', resumen.rows[0].productos, '| Tabla Movimiento ya existe:', existe.rows[0].existe);
    if (!process.argv.includes('--apply')) {
      console.log('Sin cambios. Ejecutar con --apply para aplicar.');
      return;
    }
    await client.query('BEGIN'); transaccion = true;
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query("SET LOCAL statement_timeout = '60s'");
    await client.query('LOCK TABLE "Producto" IN SHARE ROW EXCLUSIVE MODE');
    const columnas = 'id, nombre, sku, stock, "stockInicial", "stockReservado", "minStock", precio, activo';
    const fingerprint = rows => crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
    const anterior = await client.query(`SELECT ${columnas} FROM "Producto" ORDER BY id`);
    const sql = fs.readFileSync(path.join(__dirname, '../prisma/trager-migrations/20261014120000_inventario.sql'), 'utf8')
      .replace(/^BEGIN;\s*$/m, '').replace(/^COMMIT;\s*$/m, '');
    await client.query(sql);
    const posterior = await client.query(`SELECT ${columnas} FROM "Producto" ORDER BY id`);
    if (fingerprint(anterior.rows) !== fingerprint(posterior.rows)) throw new Error('La comprobación detectó cambios en los productos. Se revierte la migración.');
    await client.query('COMMIT'); transaccion = false;
    console.log(JSON.stringify({ migracion: 'inventario_trager', productos: posterior.rows.length, datosOriginalesIntactos: true }));
  } catch (error) {
    if (transaccion) await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); await pool.end(); }
}
main().catch(error => { console.error('No se aplicó la migración:', error.message); process.exitCode = 1; });
