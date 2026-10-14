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
    const resumen = await client.query('SELECT COUNT(*)::int AS clientes FROM "Cliente"');
    console.log('Clientes existentes en Trager:', resumen.rows[0].clientes);
    if (!process.argv.includes('--apply')) {
      console.log('Sin cambios. Ejecutar con --apply después de las pruebas.');
      return;
    }
    await client.query('BEGIN'); transaccion = true;
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query("SET LOCAL statement_timeout = '60s'");
    await client.query('LOCK TABLE "Cliente" IN SHARE ROW EXCLUSIVE MODE');
    const columnas = 'id, nombre, rut, "contactoNombre", "contactoTelefono", "contactoCorreo", activo, "createdAt", "updatedAt"';
    const fingerprint = rows => crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
    const anterior = await client.query(`SELECT ${columnas} FROM "Cliente" ORDER BY id`);
    const sql = fs.readFileSync(path.join(__dirname, '../prisma/trager-migrations/20261014000000_clientes_completos.sql'), 'utf8')
      .replace(/^BEGIN;\s*$/m, '').replace(/^COMMIT;\s*$/m, '');
    await client.query(sql);
    const posterior = await client.query(`SELECT ${columnas} FROM "Cliente" ORDER BY id`);
    if (fingerprint(anterior.rows) !== fingerprint(posterior.rows)) throw new Error('La comprobación detectó cambios en datos originales. Se revierte la migración.');
    const faltantes = await client.query(`SELECT COUNT(*)::int AS cantidad FROM "Cliente" c
      WHERE (NULLIF(BTRIM(c."contactoNombre"),'') IS NOT NULL OR NULLIF(BTRIM(c."contactoCorreo"),'') IS NOT NULL OR NULLIF(BTRIM(c."contactoTelefono"),'') IS NOT NULL)
      AND NOT EXISTS (SELECT 1 FROM contactos_cliente_trager t WHERE t."clienteId"=c.id)`);
    if (faltantes.rows[0].cantidad !== 0) throw new Error('Faltan contactos anteriores por conservar. Se revierte la migración.');
    const contactos = await client.query('SELECT COUNT(*)::int AS cantidad FROM contactos_cliente_trager');
    await client.query('COMMIT'); transaccion = false;
    console.log(JSON.stringify({ migracion: 'clientes_completos_trager', clientesAntes: anterior.rows.length,
      clientesDespues: posterior.rows.length, datosOriginalesIntactos: true, contactos: contactos.rows[0].cantidad }));
  } catch (error) {
    if (transaccion) await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); await pool.end(); }
}
main().catch(error => { console.error('No se aplicó la migración:', error.message); process.exitCode = 1; });
