import fs from 'node:fs';
import path from 'node:path';
import PDFKit from 'pdfkit';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import type { ResumenInforme, TotalesInforme } from '../helpers/resumenInforme';

export interface FichaInforme { id: string; numeroSello: string; pdf: Buffer }
export interface DatosInforme {
  cliente?: string; destinatario?: string; fotoPortada?: Buffer; resumen?: ResumenInforme;
  titulo: string; introduccion: string; conclusion: string;
  obra: string; responsable: string; periodo: string; fichas: FichaInforme[];
}

function pagina(logo: Buffer, render: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFKit({ size: 'A4', margins: { top: 100, bottom: 55, left: 42, right: 42 } });
    const chunks: Buffer[] = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const encabezado = () => {
      doc.rect(0, 0, 595, 7).fill('#f5c400');
      doc.image(logo, 42, 26, { fit: [42, 42] });
      doc.font('Helvetica-Bold').fontSize(17).fillColor('#111827').text('BECK Soluciones', 96, 30);
      doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('Informe técnico de registros', 96, 54);
      doc.x = 42; doc.y = 100;
      doc.font('Helvetica').fontSize(11).fillColor('#1e293b');
    };
    encabezado();
    doc.on('pageAdded', encabezado);
    try { render(doc); doc.end(); } catch (error) { doc.destroy(); reject(error); }
  });
}

export async function generarInformeIngenieria(data: DatosInforme): Promise<Buffer> {
  const logo = fs.readFileSync(path.join(process.cwd(), 'public', 'logo-beck.png'));
  const portada = await pagina(logo, doc => {
    doc.y = 115;
    doc.font('Helvetica-Bold').fontSize(28).text(data.titulo, { width: 511 });
    doc.moveDown().fontSize(18).text(data.obra);
    doc.font('Helvetica').fontSize(11);
    if (data.cliente) doc.moveDown().text('Cliente: ' + data.cliente);
    if (data.destinatario) doc.moveDown().text('Dirigido a: ' + data.destinatario);
    doc.moveDown().font('Helvetica').fontSize(12)
      .text('Período de ejecución: ' + data.periodo)
      .moveDown().text('Registros validados incluidos: ' + data.fichas.length)
      .moveDown().text('Generado por: ' + data.responsable)
      .moveDown().text('Fecha de emisión: ' + new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', dateStyle: 'long' }).format(new Date()));
    if (data.fotoPortada) {
      if (doc.y > 540) doc.addPage();
      doc.image(data.fotoPortada, 42, doc.y + 20, { fit: [511, 200], align: 'center', valign: 'center' });
    }
  });
  const seccion = (titulo: string, texto: string) => pagina(logo, doc => {
    doc.font('Helvetica-Bold').fontSize(20).text(titulo).moveDown();
    doc.font('Helvetica').fontSize(11).text(texto, { width: 511, lineGap: 5 });
  });
  const introduccion = await seccion('Introducción', data.introduccion);
  const conclusion = await seccion('Conclusión', data.conclusion);
  const resumen = data.resumen ? await pagina(logo, doc => {
    const n = (valor: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor);
    const cifras = (total: TotalesInforme) => `${total.registros} registros · ${n(total.sellos)} sellos · ${n(total.tabiqueria)} unidades de tabiquería · ${n(total.juntasMl)} ml de juntas`;
    doc.font('Helvetica-Bold').fontSize(20).text('Resumen ejecutivo').moveDown();
    doc.font('Helvetica').fontSize(10)
      .text('Alcance: únicamente los registros validados seleccionados para este informe. Cantidades ejecutadas sin factores; no representa el avance total de la obra.')
      .moveDown().text('Período de ejecución: ' + data.periodo).moveDown();
    doc.font('Helvetica-Bold').text(cifras(data.resumen!.total)).moveDown();
    if (data.resumen!.total.otros) doc.font('Helvetica').text('Otros tipos: ' + data.resumen!.total.otros + ' registros (sin sumar cantidades de distinta unidad).');
    for (const [titulo, grupos] of [['Producción por piso', data.resumen!.pisos], ['Producción por responsable', data.resumen!.responsables]] as const) {
      doc.moveDown();
      if (doc.y > 700) doc.addPage();
      doc.font('Helvetica-Bold').fontSize(14).text(titulo).moveDown(.6);
      for (const grupo of grupos) {
        doc.font('Helvetica-Bold').fontSize(10);
        const alturaNombre = doc.heightOfString(grupo.nombre, { width: 511 });
        doc.font('Helvetica').fontSize(9);
        const altura = alturaNombre + doc.heightOfString(cifras(grupo), { width: 511, lineGap: 3 }) + 16;
        if (doc.y + altura > 775) {
          doc.addPage();
          doc.font('Helvetica-Bold').fontSize(14).text(titulo + ' (continuación)').moveDown(.6);
        }
        doc.font('Helvetica-Bold').fontSize(10).text(grupo.nombre);
        doc.font('Helvetica').fontSize(9).text(cifras(grupo), { lineGap: 3 }).moveDown(.8);
      }
    }
  }) : undefined;
  const documentos = await Promise.all([portada, introduccion, ...data.fichas.map(f => f.pdf), conclusion].map(pdf => PDFDocument.load(pdf)));
  const docResumen = resumen ? await PDFDocument.load(resumen) : undefined;
  const paginasIndice = Math.ceil((data.fichas.length + 2 + (docResumen ? 1 : 0)) / 18);
  const inicioIntroduccion = documentos[0].getPageCount() + 1;
  const inicioResumen = inicioIntroduccion + documentos[1].getPageCount();
  const inicioIndice = inicioResumen + (docResumen?.getPageCount() ?? 0);
  let actual = inicioIndice + paginasIndice;
  const entradas = [{ texto: 'Introducción', pagina: inicioIntroduccion }];
  if (docResumen) entradas.push({ texto: 'Resumen ejecutivo', pagina: inicioResumen });
  data.fichas.forEach((ficha, i) => {
    entradas.push({ texto: 'REG-' + ficha.id.slice(0, 6).toUpperCase() + ' · Sello ' + ficha.numeroSello, pagina: actual });
    actual += documentos[i + 2].getPageCount();
  });
  entradas.push({ texto: 'Conclusión', pagina: actual });
  const enlaces: { indice: number; y: number; destino: number }[] = [];
  const indice = await pagina(logo, doc => {
    for (let i = 0; i < entradas.length; i++) {
      if (i % 18 === 0) {
        if (i) doc.addPage();
        doc.font('Helvetica-Bold').fontSize(20).text('Índice').moveDown();
      }
      const y = doc.y;
      enlaces.push({ indice: Math.floor(i / 18), y, destino: entradas[i].pagina });
      doc.font('Helvetica').fontSize(10).text(entradas[i].texto, 42, y, { width: 440, height: 28, ellipsis: true });
      doc.text(String(entradas[i].pagina), 500, y, { width: 50, align: 'right' });
      doc.y = y + 32; doc.x = 42;
    }
  });
  const salida = await PDFDocument.create();
  const orden = [documentos[0], documentos[1], ...(docResumen ? [docResumen] : []), await PDFDocument.load(indice), ...documentos.slice(2)];
  for (const documento of orden) {
    const paginas = await salida.copyPages(documento, documento.getPageIndices());
    paginas.forEach(p => salida.addPage(p));
  }
  // Reduce ligeramente el contenido para reservar un pie sin tapar las fichas.
  const final = await PDFDocument.create();
  const fuente = await final.embedFont(StandardFonts.Helvetica);
  const paginas = await final.embedPages(salida.getPages());
  paginas.forEach((page, i) => {
    const hoja = final.addPage([595, 842]);
    const scale = Math.min(575 / page.width, 800 / page.height);
    hoja.drawPage(page, { x: (595 - page.width * scale) / 2, y: 32, xScale: scale, yScale: scale });
    hoja.drawText('BECK Soluciones', { x: 28, y: 15, size: 8, font: fuente, color: rgb(.35, .4, .45) });
    hoja.drawText(`Página ${i + 1} de ${paginas.length}`, { x: 465, y: 15, size: 8, font: fuente });
  });
  // Crear los enlaces después de incrustar las páginas; así sobreviven al ajuste del pie.
  for (const enlace of enlaces) {
    const pageIndex = inicioIndice - 1 + enlace.indice;
    const original = paginas[pageIndex];
    const scale = Math.min(575 / original.width, 800 / original.height);
    const x = (595 - original.width * scale) / 2;
    const hoja = final.getPage(pageIndex);
    const anotacion = final.context.obj({
      Type: 'Annot', Subtype: 'Link',
      Rect: [x + 42 * scale, 32 + (original.height - enlace.y - 28) * scale,
        x + 550 * scale, 32 + (original.height - enlace.y) * scale],
      Border: [0, 0, 0],
      A: { S: 'GoTo', D: [final.getPage(enlace.destino - 1).ref, 'Fit'] },
    });
    hoja.node.addAnnot(final.context.register(anotacion));
  }
  final.setTitle(data.titulo); final.setAuthor(data.responsable);
  return Buffer.from(await final.save());
}
