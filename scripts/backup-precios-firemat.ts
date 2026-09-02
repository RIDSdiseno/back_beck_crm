import fs from "fs";
import path from "path";
import { firematPrisma } from "../src/config/firematPrisma";

async function main() {
  const productos = await firematPrisma.producto.findMany({
    orderBy: { id: "asc" },
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(
    "C:/Users/RIDS/Downloads",
    `backup-precios-firemat-${timestamp}.json`
  );

  fs.writeFileSync(outPath, JSON.stringify(productos, null, 2), "utf-8");

  console.log(`Backup guardado: ${outPath}`);
  console.log(`Total productos respaldados: ${productos.length}`);

  await firematPrisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
