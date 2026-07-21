import { prisma } from '../src/config/prisma';
import { migrarRegistro } from './migrar-pdf-firmado';

type Resultado =
  | { registroId: string; codigoBeck: string | null; status: 'ok' }
  | { registroId: string; codigoBeck: string | null; status: 'error'; error: string };

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const registros = await prisma.registroTerreno.findMany({
    where: { pdfFirmadoUrl: { not: null } },
    select: { id: true, codigoBeck: true },
    orderBy: { validadoClienteAt: 'asc' },
  });

  console.log(`Encontrados ${registros.length} registros con pdfFirmadoUrl. Migrando${dryRun ? ' (dry-run)' : ''}...\n`);

  const resultados: Resultado[] = [];

  for (const [idx, r] of registros.entries()) {
    console.log(`\n=== [${idx + 1}/${registros.length}] ${r.id} (${r.codigoBeck ?? 'sin código'}) ===`);
    try {
      await migrarRegistro(r.id, dryRun);
      resultados.push({ registroId: r.id, codigoBeck: r.codigoBeck, status: 'ok' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${r.id}] ERROR: ${message}`);
      resultados.push({ registroId: r.id, codigoBeck: r.codigoBeck, status: 'error', error: message });
    }
  }

  const ok = resultados.filter((r) => r.status === 'ok');
  const fallidos = resultados.filter((r): r is Extract<Resultado, { status: 'error' }> => r.status === 'error');

  console.log('\n\n──────────── RESUMEN ────────────');
  console.log(`Total: ${resultados.length}`);
  console.log(`Migrados correctamente: ${ok.length}`);
  console.log(`Fallidos: ${fallidos.length}`);
  if (fallidos.length > 0) {
    console.log('\nDetalle de fallidos:');
    for (const f of fallidos) {
      console.log(`  - ${f.registroId} (${f.codigoBeck ?? 'sin código'}): ${f.error}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
