// Solo Trager. Por defecto informa; --apply aplica en una transacción comprobada.
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const TABLAS = {
  Producto: 'id, nombre, sku, stock, "stockReservado", precio, activo',
  CotizacionTrager: 'id, numero, cliente, estado, subtotal, descuento, impuesto, total',
  CotizacionTragerDetalle: 'id, "cotizacionId", "productoId", cantidad, "precioUnitario", subtotal',
  FunnelTragerOpportunity: 'id, cliente, etapa, "productoId", "cotizacionId", "montoEstimado"',
};

async function main() {
  if (!process.env.TRAGGER_DATABASE_URL) throw new Error('Falta TRAGGER_DATABASE_URL.');
  const pool = new Pool({ connectionString: process.env.TRAGGER_DATABASE_URL });
  const client = await pool.connect();
  let transaccion = false;
  try {
    for (const tabla of Object.keys(TABLAS)) {
      const r = await client.query(`SELECT COUNT(*)::int AS n FROM "${tabla}"`);
      console.log(`${tabla}: ${r.rows[0].n} filas`);
    }
    // Las claves foráneas fallarían si el funnel apunta a productos o cotizaciones que no existen.
    const huerfanos = await client.query(`SELECT COUNT(*)::int AS n FROM "FunnelTragerOpportunity" f
      WHERE (f."productoId" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "Producto" p WHERE p.id = f."productoId"))
         OR (f."cotizacionId" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "CotizacionTrager" c WHERE c.id = f."cotizacionId"))`);
    console.log('Oportunidades con producto o cotización inexistente:', huerfanos.rows[0].n);
    if (!process.argv.includes('--apply')) {
      console.log('Sin cambios. Ejecutar con --apply para aplicar.');
      return;
    }
    if (huerfanos.rows[0].n > 0) throw new Error('Hay oportunidades con referencias inexistentes; revisar antes de migrar.');
    await client.query('BEGIN'); transaccion = true;
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query("SET LOCAL statement_timeout = '60s'");
    const fingerprint = rows => crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
    const leer = async () => {
      const out = {};
      for (const [tabla, columnas] of Object.entries(TABLAS)) {
        out[tabla] = fingerprint((await client.query(`SELECT ${columnas} FROM "${tabla}" ORDER BY id`)).rows);
      }
      return out;
    };
    const antes = await leer();
    const sql = fs.readFileSync(path.join(__dirname, '../prisma/trager-migrations/20261014180000_cotizaciones_completas.sql'), 'utf8')
      .replace(/^BEGIN;\s*$/m, '').replace(/^COMMIT;\s*$/m, '');
    await client.query(sql);
    const despues = await leer();
    for (const tabla of Object.keys(TABLAS)) {
      if (antes[tabla] !== despues[tabla]) throw new Error(`La comprobación detectó cambios en ${tabla}. Se revierte la migración.`);
    }
    await client.query('COMMIT'); transaccion = false;
    console.log(JSON.stringify({ migracion: 'cotizaciones_completas_trager', datosOriginalesIntactos: true }));
  } catch (error) {
    if (transaccion) await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); await pool.end(); }
}
main().catch(error => { console.error('No se aplicó la migración:', error.message); process.exitCode = 1; });
