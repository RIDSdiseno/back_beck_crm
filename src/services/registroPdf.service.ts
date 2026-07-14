import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

// ─── Constantes de layout (idénticas a las ya usadas en descargarRegistroPdf) ──

const PDF_MARGIN = 40;
const PDF_W = 595;
const PDF_CONTENT_W = PDF_W - PDF_MARGIN * 2;

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

// ─── Helpers ────────────────────────────────────────────────────────────────────

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
  doc.y += 6;
}

function pdfSectionHeader(doc: PDFKit.PDFDocument, title: string): void {
  doc.y += 4;
  const y = doc.y;
  doc.rect(PDF_MARGIN, y, PDF_CONTENT_W, 18).fill(BECK_DARK);
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor('#ffffff')
    .text(title, PDF_MARGIN + 8, y + 5, { width: PDF_CONTENT_W - 16, lineBreak: false });
  doc.y = y + 18 + 7;
}

function pdfFieldRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number | null | undefined,
): void {
  const y = doc.y;
  const labelW = 140;
  const valW = PDF_CONTENT_W - labelW;
  const valStr = value == null || value === '' ? '-' : String(value);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_MUTED)
    .text(label, PDF_MARGIN, y, { width: labelW, lineBreak: false });
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK)
    .text(valStr, PDF_MARGIN + labelW, y, { width: valW });

  if (doc.y < y + 13) doc.y = y + 13;
}

// ─── Contenido base del PDF (idéntico al que ya generaba descargarRegistroPdf) ─

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPdfContent(doc: PDFKit.PDFDocument, registro: any, validImages: Buffer[], logoBuffer: Buffer | null): void {
  const regRaw = registro as Record<string, unknown>;
  const esTipo = registro.tipoRegistro;
  const codigoRegistro = registro.codigoBeck ?? `REG-${registro.id.slice(0, 6).toUpperCase()}`;
  const tituloTipo = TITULO_POR_TIPO[esTipo] ?? TITULO_POR_TIPO.sello_cortafuego;
  const cantLabel = CANT_LABEL_POR_TIPO[esTipo] ?? CANT_LABEL_POR_TIPO.sello_cortafuego;
  const esMetrosLineales = esTipo === 'junta_lineal_espuma';
  const cantValor = esMetrosLineales
    ? (regRaw['metrosLineales'] != null ? String(regRaw['metrosLineales']) : '-')
    : String(registro.cantidadSellos);

  // ══════════════════════════════════════════════════════════════
  // ENCABEZADO
  // ══════════════════════════════════════════════════════════════
  doc.rect(0, 0, PDF_W, 5).fill(BECK_YELLOW);
  doc.y = 14;

  const headerY = doc.y;

  if (logoBuffer) {
    doc.image(logoBuffer, PDF_MARGIN, headerY, { height: 38 });
  }
  const textStartX = logoBuffer ? PDF_MARGIN + 52 : PDF_MARGIN;

  doc.font('Helvetica-Bold').fontSize(15).fillColor(BECK_DARK)
    .text('BECK Soluciones', textStartX, headerY, { lineBreak: false });
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED)
    .text('Informe Técnico de Registro', textStartX, headerY + 20, { lineBreak: false });

  const genDate = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date());
  doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
    .text(`Generado: ${genDate}`, PDF_MARGIN, headerY + 32, {
      width: PDF_CONTENT_W,
      align: 'right',
      lineBreak: false,
    });

  doc.y = headerY + 50;
  doc.rect(PDF_MARGIN, doc.y, PDF_CONTENT_W, 1.5).fill(BECK_YELLOW);
  doc.y += 10;

  // ══════════════════════════════════════════════════════════════
  // TÍTULO
  // ══════════════════════════════════════════════════════════════
  doc.font('Helvetica-Bold').fontSize(14).fillColor(BECK_DARK)
    .text(tituloTipo);
  doc.y += 3;
  doc.font('Helvetica').fontSize(10).fillColor(TEXT_MUTED)
    .text(`Código: ${codigoRegistro}   ·   Fecha ejecución: ${formatRegistroDate(registro.fecha)}`);
  doc.y += 8;

  const estadoColor = ESTADO_COLORS[registro.estado] ?? '#64748b';
  const badgeY = doc.y;
  doc.rect(PDF_MARGIN, badgeY, 100, 15).fill(estadoColor);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
    .text(
      String(registro.estado).replace(/_/g, ' ').toUpperCase(),
      PDF_MARGIN + 5, badgeY + 4,
      { width: 90, lineBreak: false },
    );
  doc.y = badgeY + 22;

  pdfHRule(doc);

  // ══════════════════════════════════════════════════════════════
  // INFORMACIÓN GENERAL
  // ══════════════════════════════════════════════════════════════
  pdfSectionHeader(doc, 'INFORMACIÓN GENERAL');
  pdfFieldRow(doc, 'Código BECK:', codigoRegistro);
  pdfFieldRow(doc, 'Obra:', `${registro.obra.nombre}${registro.obra.codigo ? ` (${registro.obra.codigo})` : ''}`);
  pdfFieldRow(doc, 'Ejecutado por:', `${registro.usuario.nombre} — ${registro.usuario.email}`);
  pdfFieldRow(doc, 'Día semana:', registro.diaSemana);

  pdfHRule(doc);

  // ══════════════════════════════════════════════════════════════
  // DATOS TÉCNICOS
  // ══════════════════════════════════════════════════════════════
  pdfSectionHeader(doc, 'DATOS TÉCNICOS');
  pdfFieldRow(doc, 'Descripción material:', registro.descripcionMaterial);
  pdfFieldRow(doc, 'Módulo / Recinto:', registro.modulo);
  pdfFieldRow(doc, 'Piso:', registro.piso);
  pdfFieldRow(doc, 'Eje alfabético:', registro.ejeAlfabetico);
  pdfFieldRow(doc, 'Eje numérico:', registro.ejeNumerico);
  if (!esMetrosLineales) {
    pdfFieldRow(doc, 'N° de sello:', registro.numeroSello);
  }
  pdfFieldRow(doc, `${cantLabel}:`, cantValor);
  pdfFieldRow(doc, 'Sellador:', registro.nombreSellador);
  pdfFieldRow(doc, 'Holgura:', registro.holgura != null ? registro.holgura.toString() : '-');
  pdfFieldRow(doc, 'Factor por holguras:', regRaw['factor_por_holguras'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Accesibilidad:', regRaw['accesibilidad'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Cantidad sellos con factores:', regRaw['cantidad_sellos_con_factores'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Aislacion:', regRaw['aislacion'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Cantidad sellos aislacion:', regRaw['cantidad_sellos_aislacion'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Reparacion tabique:', regRaw['reparacion_tabique'] as string | number | null | undefined);
  pdfFieldRow(doc, 'Cantidad final:', regRaw['cantidad_final'] as string | number | null | undefined);

  pdfHRule(doc);

  // ══════════════════════════════════════════════════════════════
  // OBSERVACIONES
  // ══════════════════════════════════════════════════════════════
  pdfSectionHeader(doc, 'OBSERVACIONES');
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK)
    .text(registro.observaciones || 'Sin observaciones.', PDF_MARGIN, doc.y, {
      width: PDF_CONTENT_W,
    });
  doc.y += 6;

  pdfHRule(doc);

  // ══════════════════════════════════════════════════════════════
  // FOTOGRAFÍAS
  // ══════════════════════════════════════════════════════════════
  pdfSectionHeader(doc, 'FOTOGRAFÍAS DE REGISTRO');

  if (validImages.length === 0) {
    doc.font('Helvetica').fontSize(9).fillColor('#94a3b8')
      .text('Sin fotos asociadas.', PDF_MARGIN, doc.y);
  } else {
    const imgW = Math.floor((PDF_CONTENT_W - 10) / 2);
    const imgH = 175;
    const gap = 10;
    let rowY = doc.y + 4;
    let colIdx = 0;

    validImages.forEach((buf, imgIndex) => {
      if (colIdx === 0 && rowY + imgH > 800) {
        doc.addPage();
        rowY = PDF_MARGIN;
      }

      const isAloneInRow = colIdx === 0 && imgIndex === validImages.length - 1;
      const imgX = isAloneInRow
        ? PDF_MARGIN + (PDF_CONTENT_W - imgW) / 2
        : PDF_MARGIN + colIdx * (imgW + gap);

      try {
        doc.image(buf, imgX, rowY, { fit: [imgW, imgH] });
      } catch {
        // Imagen no procesable, se omite
      }

      colIdx++;
      if (colIdx >= 2) {
        colIdx = 0;
        rowY += imgH + 10;
      }
    });

    doc.y = rowY + (colIdx > 0 ? imgH : 0) + 12;
  }
}

// ─── Firma del cliente (portado literalmente de beck-mobile-backend) ──────────

export interface SignatureOptions {
  pathData: string;
  canvasWidth: number;
  canvasHeight: number;
  firmadoPor?: string;
  firmadoAt?: Date | string;
}

/**
 * Genera el PDF de un registro como Buffer. Núcleo compartido entre:
 *  - descargarRegistroPdf (sin firma, flujo normal de Ingeniería/Registro)
 *  - validarRegistroCliente (con firma, flujo Vista Cliente)
 *
 * Si se pasa `signatureOptions`, agrega una página final "VALIDACIÓN DEL
 * CLIENTE" con la firma dibujada como vector (mismo mecanismo que
 * beck-mobile-backend: doc.save() → translate() → scale() → path() →
 * stroke() → restore()) y el sello institucional, replicando exactamente el
 * layout de la app móvil.
 */
export async function generateRegistroPdfBuffer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registro: any,
  signatureOptions?: SignatureOptions,
): Promise<Buffer> {
  const fotoUrls: string[] =
    registro.fotos_registro && registro.fotos_registro.length > 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? registro.fotos_registro.map((f: any) => f.url)
      : (Array.isArray(registro.fotosUrls) ? registro.fotosUrls : []);

  const imageBuffers = await Promise.all(fotoUrls.map(fetchImageBuffer));
  const validImages = imageBuffers.filter((b): b is Buffer => b !== null);

  const logoPath = path.join(process.cwd(), 'public', 'logo-beck.png');
  const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

  // Sello institucional — solo se necesita cuando se firma (misma condición que en beck-mobile-backend)
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

    buildPdfContent(doc, registro, validImages, logoBuffer);

    // ── Sección de firma cliente (si aplica) ─────────────────────────────────
    if (signatureOptions?.pathData) {
      // Nueva página dedicada para la firma — evita que doc.y desbordado rompa el layout
      doc.addPage();
      doc.rect(0, 0, PDF_W, 5).fill(BECK_YELLOW);
      doc.y = 18;

      pdfSectionHeader(doc, 'VALIDACIÓN DEL CLIENTE');

      // Badge azul "VALIDADO POR CLIENTE"
      const clienteBadgeY = doc.y;
      doc.rect(PDF_MARGIN, clienteBadgeY, 138, 16).fill('#2563eb');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text('VALIDADO POR CLIENTE', PDF_MARGIN + 6, clienteBadgeY + 5, { width: 126, lineBreak: false });
      doc.y = clienteBadgeY + 24;

      pdfFieldRow(doc, 'Firmado por:', signatureOptions.firmadoPor || '-');
      if (signatureOptions.firmadoAt) {
        pdfFieldRow(doc, 'Fecha de firma:', formatDateTime(signatureOptions.firmadoAt));
      }

      doc.y += 18;

      // Layout: caja de firma (izquierda) + sello (derecha, si existe)
      const sigBoxY = doc.y;
      const sigBoxH = 180;
      const stampColW = selloBuffer ? 160 : 0;
      const colGap = selloBuffer ? 12 : 0;
      const sigBoxW = PDF_CONTENT_W - stampColW - colGap;
      const sigBoxX = PDF_MARGIN;

      // ── Caja de firma ─────────────────────────────────────────────────────
      doc.rect(sigBoxX, sigBoxY, sigBoxW, sigBoxH).fill('#f8fafc');
      doc.rect(sigBoxX, sigBoxY, sigBoxW, sigBoxH)
        .strokeColor('#cbd5e1').lineWidth(1).stroke();

      doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
        .text('Firma digital del cliente', sigBoxX + 8, sigBoxY + sigBoxH - 17, { lineBreak: false });

      // Escalar y dibujar la firma dentro del box
      const padding = 16;
      const availW = sigBoxW - padding * 2;
      const availH = sigBoxH - padding * 2 - 20;
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

      // ── Sello (columna derecha) ────────────────────────────────────────────
      if (selloBuffer) {
        const stampSize = 150;
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
