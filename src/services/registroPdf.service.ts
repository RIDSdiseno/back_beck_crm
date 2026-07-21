import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';


const PDF_MARGIN = 28;
const PDF_W = 595;
const PDF_H = 842;
const PDF_CONTENT_W = PDF_W - PDF_MARGIN * 2;
const PDF_BOTTOM = PDF_H - PDF_MARGIN;
const SIGNATURE_RESERVED_H = 142;

const BECK_YELLOW = '#f5c400';
const BECK_DARK = '#111827';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';

const ESTADO_COLORS: Record<string, string> = {
  validado: '#16a34a',
  en_revision: '#2563eb',
  rechazado: '#dc2626',
  pendiente: '#d97706',
};

const TITULO_POR_TIPO: Record<string, string> = {
  sello_cortafuego: 'Registro de Sello Cortafuego',
  junta_lineal_espuma: 'Registro de Junta Lineal Espuma',
  tabiqueria: 'Registro de Tabiquería',
  otros: 'Registro de Otros',
};
const CANT_LABEL_POR_TIPO: Record<string, string> = {
  sello_cortafuego: 'Cantidad de sellos',
  junta_lineal_espuma: 'Metros lineales',
  tabiqueria: 'Cantidad',
  otros: 'Cantidad',
};


const formatRegistroDate = (fecha: Date): string =>
  new Intl.DateTimeFormat('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);

const formatDateTime = (fecha: Date | string): string =>
  new Intl.DateTimeFormat('es-CL', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(typeof fecha === 'string' ? new Date(fecha) : fecha);

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function pdfHRule(doc: PDFKit.PDFDocument, color = '#e2e8f0'): void {
  doc
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(PDF_MARGIN, doc.y)
    .lineTo(PDF_W - PDF_MARGIN, doc.y)
    .stroke();
  doc.y += 4;
}

function pdfSectionHeader(doc: PDFKit.PDFDocument, title: string): void {
  doc.y += 3;
  const y = doc.y;
  doc.rect(PDF_MARGIN, y, PDF_CONTENT_W, 14).fill(BECK_DARK);
  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor('#ffffff')
    .text(title, PDF_MARGIN + 7, y + 4, { width: PDF_CONTENT_W - 14, lineBreak: false });
  doc.y = y + 14 + 5;
}

function pdfFieldRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number | null | undefined,
): void {
  const y = doc.y;
  const labelW = 122;
  const valW = PDF_CONTENT_W - labelW;
  const valStr = value == null || value === '' ? '-' : String(value);

  doc.font('Helvetica-Bold').fontSize(7.4).fillColor(TEXT_MUTED)
    .text(label, PDF_MARGIN, y, { width: labelW, lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_DARK)
    .text(valStr, PDF_MARGIN + labelW, y, { width: valW });

  if (doc.y < y + 10) doc.y = y + 10;
}

/**
 * Grilla compacta de 2 columnas para datos tecnicos. La primera mitad se lee
 * de arriba hacia abajo en la columna izquierda y la segunda mitad en la
 * derecha, manteniendo el orden logico y permitiendo wrap dentro de cada celda.
 */
function pdfFieldRowsTwoCol(
  doc: PDFKit.PDFDocument,
  fields: Array<[string, string | number | null | undefined]>,
): void {
  const rowGap = 2;
  const colGap = 14;
  const colW = (PDF_CONTENT_W - colGap) / 2;
  const labelW = 83;
  const valW = colW - labelW - 4;
  const startY = doc.y;
  const rows = Math.ceil(fields.length / 2);

  const rowHeights = Array.from({ length: rows }, (_, row) => {
    const left = fields[row];
    const right = fields[row + rows];
    return Math.max(
      9.5,
      left ? pdfFieldPairHeight(doc, left[0], left[1], labelW, valW) : 0,
      right ? pdfFieldPairHeight(doc, right[0], right[1], labelW, valW) : 0,
    );
  });

  fields.forEach(([label, value], idx) => {
    const col = idx < rows ? 0 : 1;
    const row = idx < rows ? idx : idx - rows;
    const x = PDF_MARGIN + col * (colW + colGap);
    const y = startY + rowHeights.slice(0, row).reduce((sum, h) => sum + h + rowGap, 0);
    const valStr = value == null || value === '' ? '-' : String(value);

    doc.font('Helvetica-Bold').fontSize(6.8).fillColor(TEXT_MUTED)
      .text(label, x, y, { width: labelW });
    doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
      .text(valStr, x + labelW + 4, y, { width: valW });
  });

  doc.y = startY + rowHeights.reduce((sum, h) => sum + h, 0) + rowGap * Math.max(0, rows - 1);
}

function pdfFieldPairHeight(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number | null | undefined,
  labelW: number,
  valW: number,
): number {
  const valStr = value == null || value === '' ? '-' : String(value);
  doc.font('Helvetica-Bold').fontSize(6.8);
  const labelH = doc.heightOfString(label, { width: labelW });
  doc.font('Helvetica').fontSize(7.5);
  const valueH = doc.heightOfString(valStr, { width: valW });
  return Math.max(labelH, valueH);
}


function buildPdfContent(
  doc: PDFKit.PDFDocument,
  registro: any,
  validImages: Buffer[],
  logoBuffer: Buffer | null,
  options: { reserveSignature: boolean; reservedHeight?: number },
): void {
  const regRaw = registro as Record<string, unknown>;
  const esTipo = registro.tipoRegistro;
  const codigoRegistro = registro.codigoBeck ?? `REG-${registro.id.slice(0, 6).toUpperCase()}`;
  const tituloTipo = TITULO_POR_TIPO[esTipo] ?? TITULO_POR_TIPO.sello_cortafuego;
  const cantLabel = CANT_LABEL_POR_TIPO[esTipo] ?? CANT_LABEL_POR_TIPO.sello_cortafuego;
  const esMetrosLineales = esTipo === 'junta_lineal_espuma';
  const cantValor = esMetrosLineales
    ? (regRaw['metrosLineales'] != null ? String(regRaw['metrosLineales']) : '-')
    : String(registro.cantidadSellos);

  doc.rect(0, 0, PDF_W, 5).fill(BECK_YELLOW);
  doc.y = 12;

  const headerY = doc.y;

  if (logoBuffer) {
    doc.image(logoBuffer, PDF_MARGIN, headerY, { height: 32 });
  }
  const textStartX = logoBuffer ? PDF_MARGIN + 46 : PDF_MARGIN;

  doc.font('Helvetica-Bold').fontSize(13).fillColor(BECK_DARK)
    .text('BECK Soluciones', textStartX, headerY, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_MUTED)
    .text('Informe Técnico de Registro', textStartX, headerY + 17, { lineBreak: false });

  const genDate = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date());
  doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
    .text(`Generado: ${genDate}`, PDF_MARGIN, headerY + 27, {
      width: PDF_CONTENT_W,
      align: 'right',
      lineBreak: false,
    });

  doc.y = headerY + 40;
  doc.rect(PDF_MARGIN, doc.y, PDF_CONTENT_W, 1.5).fill(BECK_YELLOW);
  doc.y += 7;

  doc.font('Helvetica-Bold').fontSize(11).fillColor(BECK_DARK)
    .text(tituloTipo);
  doc.y += 1;
  doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_MUTED)
    .text(`Código: ${codigoRegistro}   ·   Fecha ejecución: ${formatRegistroDate(registro.fecha)}`);
  doc.y += 5;

  const estadoColor = ESTADO_COLORS[registro.estado] ?? '#64748b';
  const badgeY = doc.y;
  doc.rect(PDF_MARGIN, badgeY, 96, 13).fill(estadoColor);
  doc.font('Helvetica-Bold').fontSize(7).fillColor('#ffffff')
    .text(
      String(registro.estado).replace(/_/g, ' ').toUpperCase(),
      PDF_MARGIN + 5, badgeY + 3.5,
      { width: 90, lineBreak: false },
    );
  doc.y = badgeY + 18;

  pdfHRule(doc);

  pdfSectionHeader(doc, 'INFORMACIÓN GENERAL');
  pdfFieldRow(doc, 'Código BECK:', codigoRegistro);
  pdfFieldRow(doc, 'Obra:', `${registro.obra.nombre}${registro.obra.codigo ? ` (${registro.obra.codigo})` : ''}`);
  pdfFieldRow(doc, 'Ejecutado por:', `${registro.usuario.nombre} — ${registro.usuario.email}`);
  pdfFieldRow(doc, 'Día semana:', registro.diaSemana);

  pdfHRule(doc);

  pdfSectionHeader(doc, 'DATOS TÉCNICOS');
  pdfFieldRow(doc, 'Descripción material:', registro.descripcionMaterial);

  const camposTecnicos: Array<[string, string | number | null | undefined]> = [
    ['Módulo / Recinto:', registro.modulo],
    ['Piso:', registro.piso],
    ['Eje alfabético:', registro.ejeAlfabetico],
    ['Eje numérico:', registro.ejeNumerico],
    ...(esMetrosLineales ? [] : [['N° de sello:', registro.numeroSello] as [string, string]]),
    [`${cantLabel}:`, cantValor],
    ['Sellador:', registro.nombreSellador],
    ['Holgura:', registro.holgura != null ? registro.holgura.toString() : '-'],
    ['Factor por holguras:', regRaw['factor_por_holguras'] as string | number | null | undefined],
    ['Accesibilidad:', regRaw['accesibilidad'] as string | number | null | undefined],
    ['Cantidad sellos con factores:', regRaw['cantidad_sellos_con_factores'] as string | number | null | undefined],
    ['Aislacion:', regRaw['aislacion'] as string | number | null | undefined],
    ['Cantidad sellos aislacion:', regRaw['cantidad_sellos_aislacion'] as string | number | null | undefined],
    ['Reparacion tabique:', regRaw['reparacion_tabique'] as string | number | null | undefined],
    ['Cantidad final:', regRaw['cantidad_final'] as string | number | null | undefined],
  ];
  pdfFieldRowsTwoCol(doc, camposTecnicos);

  pdfHRule(doc);

  pdfSectionHeader(doc, 'OBSERVACIONES');
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_DARK)
    .text(registro.observaciones || 'Sin observaciones.', PDF_MARGIN, doc.y, {
      width: PDF_CONTENT_W,
    });
  doc.y += 4;

  pdfHRule(doc);

  pdfSectionHeader(doc, 'FOTOGRAFÍAS DE REGISTRO');

  if (validImages.length === 0) {
    doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
      .text('Sin fotos asociadas.', PDF_MARGIN, doc.y);
  } else {
    const gap = 6;
    const cols = validImages.length === 1 ? 1 : 2;
    const rows = Math.ceil(validImages.length / cols);
    const reserve = options.reserveSignature ? (options.reservedHeight ?? SIGNATURE_RESERVED_H) + 6 : 0;
    const availableH = Math.max(18 * rows, PDF_BOTTOM - doc.y - reserve - 2);
    const imgW = cols === 1 ? Math.min(330, PDF_CONTENT_W) : Math.floor((PDF_CONTENT_W - gap) / 2);
    const imgH = Math.max(18, Math.floor((availableH - gap * Math.max(0, rows - 1)) / rows));
    const startY = doc.y;

    validImages.forEach((buf, imgIndex) => {
      const row = Math.floor(imgIndex / cols);
      const col = imgIndex % cols;
      const isAloneInRow = cols === 2 && col === 0 && imgIndex === validImages.length - 1;
      const imgX = cols === 1 || isAloneInRow
        ? PDF_MARGIN + (PDF_CONTENT_W - imgW) / 2
        : PDF_MARGIN + col * (imgW + gap);
      const imgY = startY + row * (imgH + gap);

      try {
        doc.image(buf, imgX, imgY, { fit: [imgW, imgH], align: 'center', valign: 'center' });
      } catch {
        // Imagen no procesable, se omite
      }
    });

    doc.y = startY + rows * imgH + gap * Math.max(0, rows - 1) + 5;
  }
}


export interface SignatureOptions {
  pathData: string;
  canvasWidth: number;
  canvasHeight: number;
  firmadoPor?: string;
  firmadoAt?: Date | string;
  reservedHeight?: number;
  skipRender?: boolean;
}

/**
 * Genera el PDF de un registro como Buffer. Núcleo compartido entre:
 *  - descargarRegistroPdf (sin firma, flujo normal de Ingeniería/Registro)
 *  - validarRegistroCliente (con firma, flujo Vista Cliente)
 *
 * Si se pasa `signatureOptions`, agrega el bloque "VALIDACIÓN DEL CLIENTE" en
 * la misma hoja con la firma dibujada como vector (mismo mecanismo que
 * beck-mobile-backend: doc.save() → translate() → scale() → path() →
 * stroke() → restore()) y el sello institucional, replicando exactamente el
 * layout de la app móvil.
 */
export async function generateRegistroPdfBuffer(
  registro: any,
  signatureOptions?: SignatureOptions,
): Promise<Buffer> {
  const fotoUrls: string[] =
    registro.fotos_registro && registro.fotos_registro.length > 0
      ? registro.fotos_registro.map((f: any) => f.url)
      : (Array.isArray(registro.fotosUrls) ? registro.fotosUrls : []);

  const imageBuffers = await Promise.all(fotoUrls.map(fetchImageBuffer));
  const validImages = imageBuffers.filter((b): b is Buffer => b !== null);

  const logoPath = path.join(process.cwd(), 'public', 'logo-beck.png');
  const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

  let selloBuffer: Buffer | null = null;
  if (signatureOptions?.pathData) {
    try {
      const selloPath = path.join(process.cwd(), 'assets', 'sello-beck.png');
      selloBuffer = fs.readFileSync(selloPath);
    } catch {
      // Sello no disponible — se genera el PDF sin él
    }
  }

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: PDF_MARGIN });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    buildPdfContent(doc, registro, validImages, logoBuffer, {
      reserveSignature: Boolean(signatureOptions?.pathData),
      reservedHeight: signatureOptions?.reservedHeight,
    });

    if (signatureOptions?.pathData && !signatureOptions.skipRender) {
      doc.y += 4;

      pdfSectionHeader(doc, 'VALIDACIÓN DEL CLIENTE');

      const clienteBadgeY = doc.y;
      doc.rect(PDF_MARGIN, clienteBadgeY, 132, 13).fill('#2563eb');
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#ffffff')
        .text('VALIDADO POR CLIENTE', PDF_MARGIN + 6, clienteBadgeY + 3.5, { width: 120, lineBreak: false });
      doc.y = clienteBadgeY + 17;

      pdfFieldRow(doc, 'Firmado por:', signatureOptions.firmadoPor || '-');
      if (signatureOptions.firmadoAt) {
        pdfFieldRow(doc, 'Fecha de firma:', formatDateTime(signatureOptions.firmadoAt));
      }

      doc.y += 5;

      const sigBoxY = doc.y;
      const sigBoxH = Math.max(64, Math.min(78, PDF_BOTTOM - sigBoxY - 4));
      const stampColW = selloBuffer ? 86 : 0;
      const colGap = selloBuffer ? 8 : 0;
      const sigBoxW = PDF_CONTENT_W - stampColW - colGap;
      const sigBoxX = PDF_MARGIN;

      doc.rect(sigBoxX, sigBoxY, sigBoxW, sigBoxH).fill('#f8fafc');
      doc.rect(sigBoxX, sigBoxY, sigBoxW, sigBoxH)
        .strokeColor('#cbd5e1').lineWidth(1).stroke();

      doc.font('Helvetica').fontSize(6.8).fillColor('#94a3b8')
        .text('Firma digital del cliente', sigBoxX + 7, sigBoxY + sigBoxH - 12, { lineBreak: false });

      const padding = 8;
      const availW = sigBoxW - padding * 2;
      const availH = sigBoxH - padding * 2 - 12;
      const scaleX = availW / (signatureOptions.canvasWidth || 1);
      const scaleY = availH / (signatureOptions.canvasHeight || 1);
      const scale = Math.min(scaleX, scaleY);

      const drawW = (signatureOptions.canvasWidth || 1) * scale;
      const drawH = (signatureOptions.canvasHeight || 1) * scale;
      const offsetX = sigBoxX + padding + (availW - drawW) / 2;
      const offsetY = sigBoxY + padding + (availH - drawH) / 2;

      try {
        doc.save()
          .translate(offsetX, offsetY)
          .scale(scale)
          .path(signatureOptions.pathData)
          .strokeColor(BECK_DARK)
          .lineWidth(2.5 / scale)
          .lineCap('round')
          .lineJoin('round')
          .stroke()
          .restore();
      } catch {
        // Si el path falla la caja queda visible pero vacía
      }

      if (selloBuffer) {
        const stampSize = 76;
        const stampColX = PDF_MARGIN + sigBoxW + colGap;
        const stampImgX = stampColX + (stampColW - stampSize) / 2;
        const stampImgY = sigBoxY + (sigBoxH - stampSize) / 2;
        try {
          doc.image(selloBuffer, stampImgX, stampImgY, { fit: [stampSize, stampSize] });
        } catch {
          // Imagen no procesable — continúa sin sello
        }
      }

      doc.y = sigBoxY + sigBoxH + 12;
    }

    doc.end();
  });
}
