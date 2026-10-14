import fs from 'node:fs';
import { resumenInforme } from '../helpers/resumenInforme';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PDFDocument, StandardFonts, PDFArray, PDFDict, PDFName, PDFRef } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import { generarInformeIngenieria } from './informeIngenieria.service';
import { generateRegistroPdfBuffer } from './registroPdf.service';

test('Informe con portada, índice multipágina, fichas y numeración real', async () => {
  const ficha = await PDFDocument.create();
  const font = await ficha.embedFont(StandardFonts.Helvetica);
  ficha.addPage().drawText('FICHA ORIGINAL', { x: 40, y: 700, font });
  ficha.addPage().drawText('FOTO SEGUNDA PAGINA', { x: 40, y: 700, font });
  const buffer = Buffer.from(await ficha.save());
  const pdf = await generarInformeIngenieria({
    titulo: 'Informe de prueba', introduccion: 'Introducción de prueba.',
    conclusion: 'Conclusión de prueba.', obra: 'Obra de prueba (01)',
    responsable: 'Ingeniería', periodo: '01-10-2026 al 14-10-2026',
    fichas: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1).padStart(6, '0') + '-0000-0000-0000-000000000000',
      numeroSello: String(i + 1), pdf: buffer,
    })),
  });
  assert.equal((await PDFDocument.load(pdf)).getPageCount(), 45);
  const result = await pdfParse(pdf);
  assert.match(result.text, /Informe de prueba/);
  assert.match(result.text, /REG-000001 · Sello 1\s*5/);
  assert.match(result.text, /REG-000020 · Sello 20\s*43/);
  assert.match(result.text, /Conclusión\s*45/);
  assert.match(result.text, /Página 45 de 45/);
  assert.equal((result.text.match(/FICHA ORIGINAL/g) ?? []).length, 20);
});

test('Una fotografía no disponible impide emitir un informe incompleto', async () => {
  await assert.rejects(generateRegistroPdfBuffer({
    fotos_registro: [{ url: 'data:text/plain,esto-no-es-una-foto' }],
    id: '00000100-0000-0000-0000-000000000000', tipoRegistro: 'sello_cortafuego',
    fecha: new Date('2026-10-13T00:00:00Z'), obra: { nombre: 'Prueba', codigo: '01' },
    usuario: { nombre: 'Prueba', email: 'prueba@example.com' },
  }, undefined, { strictImages: true }), /fotografía/);
});


test('Resumen, portada y enlaces apuntan a páginas válidas incluso con texto largo', async () => {
  const ficha = await PDFDocument.create(); ficha.addPage().drawText('Ficha de prueba');
  const fichaBuffer = Buffer.from(await ficha.save());
  const registros = Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1).padStart(6, '0'), usuarioId: String(i), nombreSellador: 'Operario ' + i,
    tipoRegistro: i % 2 ? 'sello_cortafuego' : 'junta_lineal_espuma',
    cantidadSellos: 1, metrosLineales: 2.5, piso: String(i), numeroSello: String(i),
    fecha: new Date('2026-10-13T00:00:00Z'),
  }));
  const pdf = await generarInformeIngenieria({
    titulo: 'Informe ejecutivo de prueba', obra: 'Obra de ejemplo', responsable: 'Ingeniería',
    cliente: 'Cliente de ejemplo', destinatario: 'Inspección técnica',
    fotoPortada: fs.readFileSync('public/logo-beck.png'),
    introduccion: 'Antecedentes de ejecución. '.repeat(150), conclusion: 'Fin del informe.',
    periodo: '13-10-2026 al 13-10-2026', resumen: resumenInforme(registros),
    fichas: registros.map(r => ({ id: r.id, numeroSello: r.numeroSello, pdf: fichaBuffer })),
  });
  const texto = await pdfParse(pdf);
  assert.match(texto.text, /Cliente de ejemplo/);
  assert.match(texto.text, /Inspección técnica/);
  assert.match(texto.text, /25 sellos/);
  assert.match(texto.text, /62,5 ml de juntas/);
  assert.match(texto.text, /Producción por piso/);
  assert.match(texto.text, /Producción por responsable/);
  const doc = await PDFDocument.load(pdf);
  let links = 0;
  const destinos: number[] = [];
  for (const page of doc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i++) {
      const annot = annots.lookup(i, PDFDict);
      const action = annot.lookup(PDFName.of('A'), PDFDict);
      const dest = action.lookup(PDFName.of('D'), PDFArray);
      const ref = dest.get(0) as PDFRef;
      const target = doc.getPages().findIndex(p => p.ref.toString() === ref.toString());
      assert.ok(target >= 0);
      destinos.push(target + 1);
      links++;
    }
  }
  assert.equal(links, 53);
  assert.equal(destinos[destinos.length - 1], doc.getPageCount());
  const primeraFicha = /REG-000001 · Sello 0\s*(\d+)/.exec(texto.text);
  assert.ok(primeraFicha);
  assert.equal(Number(primeraFicha[1]), destinos[2]);
});

test('Fotografías grandes añaden páginas sin cambiar el PDF compacto por defecto', async () => {
  const foto = 'data:image/png;base64,' + fs.readFileSync('public/logo-beck.png').toString('base64');
  const registro = {
    id: '00000100-0000-0000-0000-000000000000', tipoRegistro: 'sello_cortafuego',
    fecha: new Date('2026-10-13T00:00:00Z'), obra: { nombre: 'Prueba', codigo: '01' },
    usuario: { nombre: 'Prueba', email: 'prueba@example.com' }, fotosUrls: [foto, foto],
    numeroSello: '12', cantidadSellos: 1, estado: 'validado',
  };
  const compacto = await generateRegistroPdfBuffer(registro, undefined, { strictImages: true });
  const grande = await generateRegistroPdfBuffer(registro, undefined, { strictImages: true, tamanoFotos: 'grande' });
  assert.equal((await PDFDocument.load(compacto)).getPageCount(), 1);
  assert.equal((await PDFDocument.load(grande)).getPageCount(), 3);
});
