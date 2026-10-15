// Deja las reglas de validación del funnel de Trager desactivadas, igual que las de Firemat.
// Después se activan una por una desde Trager › Configuración › Reglas de Validación.
// Por defecto solo informa; --apply aplica en una transacción y no toca Beck ni Firemat.
// Reversión: UPDATE configuracion_validacion SET activo = true WHERE modulo = 'TRAGER';
require('dotenv').config();
const { Pool } = require('pg');

const resumen = async (client) =>
  (await client.query(`SELECT modulo, COUNT(*)::int AS reglas, COUNT(*) FILTER (WHERE activo)::int AS activas
    FROM configuracion_validacion GROUP BY modulo ORDER BY modulo`)).rows;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  let transaccion = false;
  try {
    const antes = await resumen(client);
    console.table(antes);
    if (!process.argv.includes('--apply')) {
      console.log('Sin cambios. Ejecutar con --apply para desactivar las reglas de Trager.');
      return;
    }
    const otrasAntes = JSON.stringify(antes.filter((r) => r.modulo !== 'TRAGER'));
    const activasTrager = antes.find((r) => r.modulo === 'TRAGER')?.activas ?? 0;
    await client.query('BEGIN'); transaccion = true;
    const r = await client.query(`UPDATE configuracion_validacion SET activo = false, updated_at = NOW()
      WHERE modulo = 'TRAGER' AND activo = true`);
    if (r.rowCount !== activasTrager) throw new Error(`Se esperaban ${activasTrager} reglas y fueron ${r.rowCount}. Se revierte.`);
    const despues = await resumen(client);
    if (JSON.stringify(despues.filter((x) => x.modulo !== 'TRAGER')) !== otrasAntes) {
      throw new Error('Cambiaron reglas de otra plataforma. Se revierte.');
    }
    await client.query('COMMIT'); transaccion = false;
    console.table(despues);
    console.log(JSON.stringify({ reglasTragerDesactivadas: r.rowCount, otrasPlataformasIntactas: true }));
  } catch (error) {
    if (transaccion) await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); await pool.end(); }
}
main().catch((error) => { console.error('No se aplicaron cambios:', error.message); process.exitCode = 1; });
