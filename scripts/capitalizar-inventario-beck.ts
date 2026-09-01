import { prisma } from "../src/config/prisma";

function capitalizar(value: string): string {
  const v = value.trim();
  if (!v) return v;
  return v.charAt(0).toLocaleUpperCase("es-CL") + v.slice(1);
}

async function main() {
  let totalActualizados = 0;

  const epp = await prisma.inventarioBeckEpp.findMany({ select: { id: true, item: true } });
  for (const row of epp) {
    const nuevo = capitalizar(row.item);
    if (nuevo !== row.item) {
      await prisma.inventarioBeckEpp.update({ where: { id: row.id }, data: { item: nuevo } });
      console.log(`[EPP] "${row.item}" -> "${nuevo}"`);
      totalActualizados++;
    }
  }

  const implementos = await prisma.inventarioBeckImplemento.findMany({ select: { id: true, item: true } });
  for (const row of implementos) {
    const nuevo = capitalizar(row.item);
    if (nuevo !== row.item) {
      await prisma.inventarioBeckImplemento.update({ where: { id: row.id }, data: { item: nuevo } });
      console.log(`[Implemento] "${row.item}" -> "${nuevo}"`);
      totalActualizados++;
    }
  }

  const herramientas = await prisma.inventarioBeckHerramienta.findMany({ select: { id: true, nombre: true } });
  for (const row of herramientas) {
    const nuevo = capitalizar(row.nombre);
    if (nuevo !== row.nombre) {
      await prisma.inventarioBeckHerramienta.update({ where: { id: row.id }, data: { nombre: nuevo } });
      console.log(`[Herramienta] "${row.nombre}" -> "${nuevo}"`);
      totalActualizados++;
    }
  }

  console.log(`\nTotal registros actualizados: ${totalActualizados}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
