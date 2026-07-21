import { PDFDocument } from 'pdf-lib';
const pdfParse = require('pdf-parse');
import { prisma } from '../src/config/prisma';
import { uploadFileDetailed } from '../src/config/cloudinary';
import { generateRegistroPdfBuffer } from '../src/services/registroPdf.service';

function safeCloudinaryPublicId(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'registro';
}

function pdfFirmadoPublicId(codigoBeck: string, registroId: string): string {
  return `${safeCloudinaryPublicId(codigoBeck)}-firmado-${registroId.slice(0, 8)}`;
}

async function fetchPdfBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar el PDF viejo: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

type MarcaTexto = { page: number; y: number };

/**
 * Ubica, en el PDF viejo, el borde SUPERIOR del bloque (texto "VALIDACIÓN DEL
 * CLIENTE", inicio de la barra negra de sección) y el borde INFERIOR (texto
 * "Firma digital del cliente", que queda pegado al fondo de la caja de firma).
 * Con ambos anclajes reales evitamos asumir que el bloque llega hasta el borde
 * de la página — en el formato legacy de 2 páginas el bloque está arriba de la
 * página 2, con harto espacio en blanco abajo que NO hay que incluir.
 */
async function encontrarBloqueValidacion(pdfBytes: Buffer): Promise<{
  pageIndex: number; topY: number; bottomY: number; pageCount: number;
}> {
  const validacionHits: MarcaTexto[] = [];
  const firmaHits: MarcaTexto[] = [];
  let pageNum = 0;

  await pdfParse(pdfBytes, {
    pagerender: (pageData: any) => {
      pageNum++;
      const myPage = pageNum;
      return pageData.getTextContent().then((tc: any) => {
        for (const item of tc.items) {
          if (typeof item.str !== 'string') continue;
          const upper = item.str.toUpperCase();
          if (upper.includes('VALIDACI')) validacionHits.push({ page: myPage, y: item.transform[5] });
          if (upper.includes('FIRMA') && upper.includes('CLIENTE')) firmaHits.push({ page: myPage, y: item.transform[5] });
        }
        return '';
      });
    },
  });

  if (validacionHits.length === 0) {
    throw new Error('No se encontró el texto "VALIDACIÓN DEL CLIENTE" en el PDF viejo');
  }
  const top = validacionHits[validacionHits.length - 1];

  const firmaEnMismaPagina = firmaHits.filter((h) => h.page === top.page);
  if (firmaEnMismaPagina.length === 0) {
    throw new Error('No se encontró el texto "Firma digital del cliente" en el PDF viejo (no se puede acotar el borde inferior del bloque)');
  }
  const bottom = firmaEnMismaPagina[firmaEnMismaPagina.length - 1];

  return { pageIndex: top.page - 1, topY: top.y, bottomY: bottom.y, pageCount: pageNum };
}

export async function migrarRegistro(registroId: string, dryRun: boolean): Promise<void> {
  const registro = await prisma.registroTerreno.findUnique({
    where: { id: registroId },
    include: {
      obra: { select: { id: true, nombre: true, codigo: true, cliente: true } },
      usuario: { select: { id: true, nombre: true, email: true, rol: true } },
      fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
    },
  });

  if (!registro) throw new Error(`Registro ${registroId} no encontrado`);
  if (!registro.pdfFirmadoUrl) throw new Error(`Registro ${registroId} no tiene pdfFirmadoUrl`);

  console.log(`[${registroId}] descargando PDF viejo...`);
  const oldBytes = await fetchPdfBuffer(registro.pdfFirmadoUrl);

  console.log(`[${registroId}] ubicando el bloque de validación en el PDF viejo...`);
  const { pageIndex, topY, bottomY, pageCount } = await encontrarBloqueValidacion(oldBytes);
  console.log(`[${registroId}] encontrado en página ${pageIndex + 1}/${pageCount}, topY=${topY.toFixed(1)}, bottomY=${bottomY.toFixed(1)}`);

  const oldPdf = await PDFDocument.load(oldBytes);
  const oldPage = oldPdf.getPages()[pageIndex];

  const cropTop = Math.min(oldPage.getHeight(), topY + 20);
  const cropBottom = Math.max(0, bottomY - 30);
  const cropHeight = cropTop - cropBottom;
  console.log(`[${registroId}] alto del bloque a reutilizar: ${cropHeight.toFixed(1)}pt`);

  console.log(`[${registroId}] generando PDF nuevo (layout actual, reservando espacio para el bloque real)...`);
  const freshBytes = await generateRegistroPdfBuffer(registro, {
    pathData: 'M0 0',
    canvasWidth: 10,
    canvasHeight: 10,
    reservedHeight: cropHeight,
    skipRender: true,
  });

  const freshPdf = await PDFDocument.load(freshBytes);
  const freshPage = freshPdf.getPages()[0];
  const pageW = freshPage.getWidth();
  const pageH = freshPage.getHeight();

  const outPdf = await PDFDocument.create();
  const outPage = outPdf.addPage([pageW, pageH]);

  const embeddedFresh = await outPdf.embedPage(freshPage);
  outPage.drawPage(embeddedFresh, { x: 0, y: 0, width: pageW, height: pageH });

  const embeddedOld = await outPdf.embedPage(oldPage, {
    left: 0,
    bottom: cropBottom,
    right: oldPage.getWidth(),
    top: cropTop,
  });
  outPage.drawPage(embeddedOld, { x: 0, y: 34, width: pageW, height: cropHeight });

  const outBytes = Buffer.from(await outPdf.save());
  console.log(`[${registroId}] PDF compuesto generado (${outBytes.length} bytes)`);

  if (dryRun) {
    const fs = await import('fs');
    const outPath = `./migracion-preview-${registroId}.pdf`;
    fs.writeFileSync(outPath, outBytes);
    console.log(`[${registroId}] DRY RUN: guardado en ${outPath}, no se sube ni se actualiza la BD`);
    return;
  }

  const codigoBeck = registro.codigoBeck ?? `REG-${registroId.slice(0, 6).toUpperCase()}`;
  console.log(`[${registroId}] subiendo a Cloudinary...`);
  const uploadResult = await uploadFileDetailed(outBytes, 'beck/pdfs-firmados', {
    resourceType: 'raw',
    publicId: pdfFirmadoPublicId(codigoBeck, registroId),
  });

  await prisma.registroTerreno.update({
    where: { id: registroId },
    data: { pdfFirmadoUrl: uploadResult.secure_url },
  });

  console.log(`[${registroId}] listo. Nuevo pdfFirmadoUrl: ${uploadResult.secure_url}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const registroId = args.find((a) => !a.startsWith('--'));

  if (!registroId) {
    console.error('Uso: npx tsx scripts/migrar-pdf-firmado.ts <registroId> [--dry-run]');
    process.exit(1);
  }

  await migrarRegistro(registroId, dryRun);
  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
