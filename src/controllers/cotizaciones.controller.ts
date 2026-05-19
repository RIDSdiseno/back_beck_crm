import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { EstadoCotizacion, Prisma } from '@prisma/client';
import { CotizacionError, LineaInput } from '../types/cotizaciones.types';
import * as CotizacionService from '../services/cotizaciones.service';

const PDFDocument = require('pdfkit');

// ─── Helpers de parseo HTTP ───────────────────────────────────────────────────

const getUserId = (req: Request, res: Response): string | null => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    return null;
  }
  return req.userId;
};

const getParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === 'string' && v.trim());
    return first?.trim() ?? null;
  }
  return null;
};

const optStr = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
};

const optText = (value: unknown): string | null => {
  if (value === null) return null;
  return optStr(value);
};

const numVal = (value: unknown, fallback?: number): number | null => {
  if (value === undefined || value === null || value === '') return fallback ?? null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const boolVal = (value: unknown, fallback: boolean): boolean | null => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return null;
};

const dateVal = (value: unknown): Date | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const estadoVal = (value: unknown): EstadoCotizacion | null => {
  if (typeof value !== 'string') return null;
  return Object.values(EstadoCotizacion).includes(value as EstadoCotizacion)
    ? (value as EstadoCotizacion)
    : null;
};

const getAuthUserId = (req: Request): string | null =>
  req.userId ?? null;

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof CotizacionError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json({ success: false, error: 'Ya existe una cotización con ese número' });
    return;
  }
  console.error(error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const canViewGanancia = (req: Request): boolean => req.userRole === 'administrador';

const stripGananciaPctFromRawLineas = (raw: unknown): unknown => {
  if (!Array.isArray(raw)) return raw;

  return raw.map((item) => (
    item && typeof item === 'object'
      ? { ...(item as Record<string, unknown>), gananciaPct: 0 }
      : item
  ));
};

export const maskCotizacionGanancia = <T>(value: T, showGanancia: boolean): T => {
  if (showGanancia) return value;

  if (Array.isArray(value)) {
    return value.map((item) => maskCotizacionGanancia(item, false)) as T;
  }

  if (!value || typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  const masked: Record<string, unknown> = { ...record };

  if (Array.isArray(record.lineas)) {
    masked.lineas = record.lineas.map((linea) => (
      linea && typeof linea === 'object'
        ? { ...(linea as Record<string, unknown>), gananciaPct: 0 }
        : linea
    ));
  }

  return masked as T;
};

// ─── PDF constants & helpers ──────────────────────────────────────────────────

const PDF_MARGIN    = 40;
const PDF_W         = 595;
const PDF_CONTENT_W = PDF_W - PDF_MARGIN * 2; // 515

const BECK_YELLOW = '#f5c400';
const BECK_DARK   = '#111827';
const TEXT_DARK   = '#1e293b';
const TEXT_MUTED  = '#64748b';

const ESTADO_COT_COLORS: Record<string, string> = {
  BORRADOR:  '#64748b',
  ENVIADA:   '#2563eb',
  ACEPTADA:  '#16a34a',
  RECHAZADA: '#dc2626',
  VENCIDA:   '#d97706',
};

// CLP sin decimales: $240.000
const formatCLP = (value: number): string =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPct = (value: number): string =>
  `${new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;

const formatCotDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(date);

function cotHRule(doc: any, color = '#e2e8f0'): void {
  doc.strokeColor(color).lineWidth(0.5)
    .moveTo(PDF_MARGIN, doc.y)
    .lineTo(PDF_W - PDF_MARGIN, doc.y)
    .stroke();
  doc.y += 6;
}

function cotSectionHeader(doc: any, title: string): void {
  doc.y += 4;
  const y = doc.y;
  doc.rect(PDF_MARGIN, y, PDF_CONTENT_W, 18).fill(BECK_DARK);
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff')
    .text(title, PDF_MARGIN + 8, y + 5, { width: PDF_CONTENT_W - 16, lineBreak: false });
  doc.y = y + 18 + 7;
}

function cotFieldRow(
  doc: any,
  label: string,
  value: string | number | null | undefined,
): void {
  const y      = doc.y;
  const labelW = 140;
  const valW   = PDF_CONTENT_W - labelW;
  const valStr = value == null || value === '' ? '-' : String(value);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_MUTED)
    .text(label, PDF_MARGIN, y, { width: labelW, lineBreak: false });
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK)
    .text(valStr, PDF_MARGIN + labelW, y, { width: valW });
  if (doc.y < y + 13) doc.y = y + 13;
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export const createCotizacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const b = req.body as Record<string, unknown>;

    const clienteBeckId = optStr(b.clienteBeckId ?? b.cliente_beck_id);
    const contactoBeckId = optStr(b.contactoBeckId ?? b.contacto_beck_id);

    const clienteNombre = optStr(b.clienteNombre);
    if (!clienteNombre && !clienteBeckId) {
      res.status(400).json({ success: false, error: 'clienteNombre es obligatorio (o proporcionar clienteBeckId)' });
      return;
    }

    const vigencia = dateVal(b.vigencia);
    if (!vigencia) {
      res.status(400).json({ success: false, error: 'vigencia es obligatoria y debe ser una fecha válida' });
      return;
    }

    const descuento = numVal(b.descuento, 0);
    if (descuento === null || descuento < 0 || descuento > 100) {
      res.status(400).json({ success: false, error: 'descuento debe estar entre 0 y 100' });
      return;
    }

    const aplicaImpuesto = boolVal(b.aplicaImpuesto, true);
    if (aplicaImpuesto === null) {
      res.status(400).json({ success: false, error: 'aplicaImpuesto debe ser boolean' });
      return;
    }

    const lineas = CotizacionService.parseLineas(
      canViewGanancia(req) ? b.lineas : stripGananciaPctFromRawLineas(b.lineas),
    );

    const { cotizacion, advertencias } = await CotizacionService.createCotizacion(
      {
        numero: optStr(b.numero),
        clienteNombre,
        obraId: optStr(b.obraId),
        funnelBeckId: optStr(b.funnelBeckId),
        clienteBeckId,
        contactoBeckId,
        descuento,
        aplicaImpuesto,
        vigencia,
        observaciones: optText(b.observaciones),
        lineas,
        total: numVal(b.total) ?? undefined,
      },
      userId,
    );

    res.status(201).json({
      success: true,
      data: maskCotizacionGanancia(cotizacion, canViewGanancia(req)),
      advertencias,
      message: 'Cotización creada',
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCotizaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const data = await CotizacionService.listCotizaciones();
    res.json({ success: true, data: maskCotizacionGanancia(data, canViewGanancia(req)) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCotizacionVersiones = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const data = await CotizacionService.getCotizacionVersiones(id);

    res.json({ success: true, data: maskCotizacionGanancia(data, canViewGanancia(req)) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCotizacionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const data = await CotizacionService.findCotizacion(id);
    res.json({ success: true, data: maskCotizacionGanancia(data, canViewGanancia(req)) });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCotizacion = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const b = req.body as Record<string, unknown>;
    const userId = getAuthUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }
    const has = (key: string) => Object.prototype.hasOwnProperty.call(b, key);

    const hasClienteBeckId = has('clienteBeckId') || has('cliente_beck_id');
    const rawClienteBeckId = has('clienteBeckId') ? b.clienteBeckId : b.cliente_beck_id;
    const hasContactoBeckId = has('contactoBeckId') || has('contacto_beck_id');
    const rawContactoBeckId = has('contactoBeckId') ? b.contactoBeckId : b.contacto_beck_id;

    if (has('clienteNombre') && !optStr(b.clienteNombre)) {
      res.status(400).json({ success: false, error: 'clienteNombre no puede estar vacío' });
      return;
    }

    if (has('vigencia') && !dateVal(b.vigencia)) {
      res.status(400).json({ success: false, error: 'vigencia debe ser una fecha válida' });
      return;
    }

    const descuento = has('descuento') ? numVal(b.descuento) : undefined;
    if (descuento !== undefined && (descuento === null || descuento < 0 || descuento > 100)) {
      res.status(400).json({ success: false, error: 'descuento debe estar entre 0 y 100' });
      return;
    }

    const aplicaImpuesto = has('aplicaImpuesto') ? boolVal(b.aplicaImpuesto, true) : undefined;
    if (aplicaImpuesto === null) {
      res.status(400).json({ success: false, error: 'aplicaImpuesto debe ser boolean' });
      return;
    }

    const estado = has('estado') ? estadoVal(b.estado) : undefined;
    if (estado === null) {
      res.status(400).json({ success: false, error: 'estado no es válido' });
      return;
    }

    const lineas = has('lineas')
      ? CotizacionService.parseLineas(
        canViewGanancia(req) ? b.lineas : stripGananciaPctFromRawLineas(b.lineas),
      )
      : undefined;

    const { cotizacion: data, advertencias } = await CotizacionService.updateCotizacion(
      id,
      {
        ...(has('numero') && { numero: optStr(b.numero) }),
        ...(has('clienteNombre') && { clienteNombre: optStr(b.clienteNombre)! }),
        ...(has('obraId') && { obraId: optStr(b.obraId) }),
        ...(has('funnelBeckId') && { funnelBeckId: optStr(b.funnelBeckId) }),
        ...(hasClienteBeckId && { clienteBeckId: optStr(rawClienteBeckId) }),
        ...(hasContactoBeckId && { contactoBeckId: optStr(rawContactoBeckId) }),
        ...(estado !== undefined && { estado }),
        ...(descuento !== undefined && { descuento }),
        ...(aplicaImpuesto !== undefined && { aplicaImpuesto }),
        ...(has('vigencia') && { vigencia: dateVal(b.vigencia)! }),
        ...(has('observaciones') && { observaciones: optText(b.observaciones) }),
        ...(lineas !== undefined && { lineas }),
        ...(has('total') && { total: numVal(b.total) ?? undefined }),
      },
      userId,
    );

    res.json({
      success: true,
      data: maskCotizacionGanancia(data, canViewGanancia(req)),
      advertencias,
      message: 'Cotización actualizada',
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchCotizacionEstado = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const estado = estadoVal((req.body as Record<string, unknown>).estado);
    if (!estado) {
      res.status(400).json({
        success: false,
        error: `estado debe ser uno de: ${Object.values(EstadoCotizacion).join(', ')}`,
      });
      return;
    }

    const data = await CotizacionService.patchEstado(id, estado, userId);
    res.json({
      success: true,
      data: maskCotizacionGanancia(data, canViewGanancia(req)),
      message: 'Estado actualizado',
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteCotizacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    await CotizacionService.deleteCotizacion(id, userId);
    res.json({ success: true, message: 'Cotización eliminada' });
  } catch (error) {
    handleError(res, error);
  }
};

export const downloadCotizacionPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const cotizacion = await CotizacionService.findCotizacion(id);

    // Precio unitario cliente = costo base + ganancia aplicada
    // El subtotal en DB ya incluye la ganancia — solo corregimos la columna P.UNIT.
    const lineas: LineaInput[] = cotizacion.lineas.map((l) => {
      const precioCosto   = Number(l.precioUnitario);
      const gananciaPct   = Number(l.gananciaPct);
      const precioCliente = Math.round(precioCosto * (1 + gananciaPct / 100));
      return {
        tipoLinea:      l.tipoLinea,
        descripcion:    l.descripcion,
        unidad:         l.unidad,
        cantidad:       Number(l.cantidad),
        precioUnitario: precioCliente,
        gananciaPct:    0,
        subtotal:       Number(l.subtotal),
        orden:          l.orden,
        notasLinea:     l.notasLinea,
      };
    });

    const subtotal      = Number(cotizacion.subtotal);
    const descuentoPct  = Number(cotizacion.descuento);
    const descuentoMonto = Math.round((subtotal * (descuentoPct / 100) + Number.EPSILON) * 100) / 100;
    const impuesto      = Number(cotizacion.impuesto);
    const total         = Number(cotizacion.total);

    const fileName = `cotizacion-${cotizacion.numero ?? cotizacion.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // ── Documento ─────────────────────────────────────────────────────────────
    const doc = new PDFDocument({ size: 'A4', margin: PDF_MARGIN });
    doc.pipe(res);

    // Logo
    const logoPath   = path.join(process.cwd(), 'public', 'logo-beck.png');
    const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

    // ══════════════════════════════════════════════════════════════
    // ENCABEZADO
    // ══════════════════════════════════════════════════════════════

    // Barra amarilla superior
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
      .text('Cotización Comercial', textStartX, headerY + 20, { lineBreak: false });

    // Fecha de generación (derecha)
    const genDate = new Intl.DateTimeFormat('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date());
    doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
      .text(`Generado: ${genDate}`, PDF_MARGIN, headerY + 32, {
        width: PDF_CONTENT_W,
        align: 'right',
        lineBreak: false,
      });

    doc.y = headerY + 50;

    // Línea amarilla separadora
    doc.rect(PDF_MARGIN, doc.y, PDF_CONTENT_W, 1.5).fill(BECK_YELLOW);
    doc.y += 10;

    // ══════════════════════════════════════════════════════════════
    // TÍTULO
    // ══════════════════════════════════════════════════════════════
    doc.font('Helvetica-Bold').fontSize(14).fillColor(BECK_DARK)
      .text('Cotización');
    doc.y += 3;
    doc.font('Helvetica').fontSize(10).fillColor(TEXT_MUTED)
      .text(`N° ${cotizacion.numero ?? 'S/N'}   ·   Fecha: ${formatCotDate(new Date(cotizacion.createdAt))}`);
    doc.y += 8;

    // Badge de estado
    const badgeColor = ESTADO_COT_COLORS[cotizacion.estado] ?? '#64748b';
    const badgeY = doc.y;
    doc.rect(PDF_MARGIN, badgeY, 90, 15).fill(badgeColor);
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
      .text(cotizacion.estado, PDF_MARGIN + 5, badgeY + 4, { width: 80, lineBreak: false });
    doc.y = badgeY + 22;

    cotHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // DATOS DEL CLIENTE
    // ══════════════════════════════════════════════════════════════
    cotSectionHeader(doc, 'DATOS DEL CLIENTE');
    cotFieldRow(doc, 'Cliente:', cotizacion.clienteNombre);
    cotFieldRow(doc, 'N° Cotización:', cotizacion.numero ?? 'Sin número');
    cotFieldRow(doc, 'Fecha emisión:', formatCotDate(new Date(cotizacion.createdAt)));
    cotFieldRow(doc, 'Vigencia hasta:', formatCotDate(new Date(cotizacion.vigencia)));
    cotFieldRow(doc, 'Estado:', cotizacion.estado);
    if (cotizacion.obra) {
      cotFieldRow(doc, 'Obra asociada:', cotizacion.obra.nombre);
    }
    if (cotizacion.observaciones) {
      cotFieldRow(doc, 'Observaciones:', cotizacion.observaciones);
    }

    cotHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // DETALLE
    // ══════════════════════════════════════════════════════════════
    cotSectionHeader(doc, 'DETALLE');

    // Posiciones de columnas (dentro de PDF_MARGIN=40, PDF_W=595)
    const COL_DESC_X  = PDF_MARGIN;        // 40
    const COL_DESC_W  = 240;
    const COL_CANT_X  = PDF_MARGIN + 248;  // 288
    const COL_CANT_W  = 42;
    const COL_PUNIT_X = PDF_MARGIN + 297;  // 337
    const COL_PUNIT_W = 88;
    const COL_SUB_X   = PDF_MARGIN + 392;  // 432
    const COL_SUB_W   = PDF_W - PDF_MARGIN - (PDF_MARGIN + 392); // 123

    const drawTableHeader = (): void => {
      const thY = doc.y;
      doc.rect(PDF_MARGIN, thY, PDF_CONTENT_W, 16).fill(BECK_DARK);
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff');
      doc.text('DESCRIPCIÓN', COL_DESC_X + 4, thY + 4, { width: COL_DESC_W - 4, lineBreak: false });
      doc.text('CANT.', COL_CANT_X, thY + 4, { width: COL_CANT_W, align: 'right', lineBreak: false });
      doc.text('P. UNIT.', COL_PUNIT_X, thY + 4, { width: COL_PUNIT_W, align: 'right', lineBreak: false });
      doc.text('SUBTOTAL', COL_SUB_X, thY + 4, { width: COL_SUB_W - 2, align: 'right', lineBreak: false });
      doc.y = thY + 16;
    };

    drawTableHeader();

    let rowIdx = 0;
    for (const linea of lineas) {
      if (doc.y > 750) {
        doc.addPage();
        doc.y = PDF_MARGIN;
        drawTableHeader();
        rowIdx = 0;
      }

      const rowY = doc.y;
      const rowH = 18;

      // Fondo alternado en filas impares
      if (rowIdx % 2 === 1) {
        doc.rect(PDF_MARGIN, rowY, PDF_CONTENT_W, rowH).fill('#f8fafc');
      }

      doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
      doc.text(linea.descripcion, COL_DESC_X + 4, rowY + 4, { width: COL_DESC_W - 4, lineBreak: false });
      doc.text(String(linea.cantidad), COL_CANT_X, rowY + 4, { width: COL_CANT_W, align: 'right', lineBreak: false });
      doc.text(formatCLP(linea.precioUnitario), COL_PUNIT_X, rowY + 4, { width: COL_PUNIT_W, align: 'right', lineBreak: false });
      doc.text(formatCLP(linea.subtotal), COL_SUB_X, rowY + 4, { width: COL_SUB_W - 2, align: 'right', lineBreak: false });

      doc.y = rowY + rowH;
      rowIdx++;
    }

    // Línea inferior de tabla
    doc.strokeColor('#e2e8f0').lineWidth(0.5)
      .moveTo(PDF_MARGIN, doc.y).lineTo(PDF_W - PDF_MARGIN, doc.y).stroke();
    doc.y += 14;

    // ══════════════════════════════════════════════════════════════
    // TOTALES
    // ══════════════════════════════════════════════════════════════
    const TOT_LABEL_X = 355;
    const TOT_LABEL_W = 100;
    const TOT_VAL_X   = 460;
    const TOT_VAL_W   = PDF_W - PDF_MARGIN - TOT_VAL_X; // 95

    let totY = doc.y;

    const drawTotLine = (label: string, value: string, bold = false): void => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor(TEXT_DARK);
      doc.text(label, TOT_LABEL_X, totY, { width: TOT_LABEL_W, lineBreak: false });
      doc.text(value, TOT_VAL_X, totY, { width: TOT_VAL_W, align: 'right', lineBreak: false });
      totY += 17;
    };

    drawTotLine('Subtotal:', formatCLP(subtotal));
    if (descuentoPct > 0) {
      drawTotLine(`Descuento (${formatPct(descuentoPct)}):`, `-${formatCLP(descuentoMonto)}`);
    }
    if (impuesto > 0) {
      drawTotLine('IVA (19%):', formatCLP(impuesto));
    }

    // Separador antes del total
    doc.strokeColor('#e2e8f0').lineWidth(0.5)
      .moveTo(TOT_LABEL_X, totY - 4).lineTo(PDF_W - PDF_MARGIN, totY - 4).stroke();
    totY += 4;

    drawTotLine('TOTAL:', formatCLP(total), true);

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF:', error);
  }
};
