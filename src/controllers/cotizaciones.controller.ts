import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { EstadoCotizacion, Prisma } from '@prisma/client';
import { CotizacionError, LineaInput } from '../types/cotizaciones.types';
import * as CotizacionService from '../services/cotizaciones.service';
import { puedeCambiarEmpresa } from '../helpers/puedeCambiarEmpresa';

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

const BECK_RUT       = '76.695.302-6';
const BECK_DIRECCION = 'Jorge Alessandri 180, galpón 4, La Reina';
const BORDER_COLOR   = '#e2e8f0';
const ROW_ALT        = '#f8fafc';

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
    const responsableId = optStr(b.responsableId ?? b.responsable_id);

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
        responsableId,
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
    const hasResponsableId = has('responsableId') || has('responsable_id');
    const rawResponsableId = has('responsableId') ? b.responsableId : b.responsable_id;

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

    // Check permission if client fields are changing
    if (req.userId && req.userRole && req.userRole !== 'administrador') {
      if (has('clienteNombre') || hasClienteBeckId || hasContactoBeckId) {
        const existing = await CotizacionService.findCotizacion(id);
        const clienteNombreCambia = has('clienteNombre') && optStr(b.clienteNombre) !== existing.clienteNombre;
        const clienteBeckCambia = hasClienteBeckId && optStr(rawClienteBeckId) !== existing.clienteBeckId;
        const contactoBeckCambia = hasContactoBeckId && optStr(rawContactoBeckId) !== existing.contactoBeckId;
        if (clienteNombreCambia || clienteBeckCambia || contactoBeckCambia) {
          const puede = await puedeCambiarEmpresa(req.userId, req.userRole, 'beck');
          if (!puede) {
            res.status(403).json({ success: false, error: 'No tienes permiso para cambiar la empresa o cliente asociado.' });
            return;
          }
        }
      }
    }

    const { cotizacion: data, advertencias } = await CotizacionService.updateCotizacion(
      id,
      {
        ...(has('numero') && { numero: optStr(b.numero) }),
        ...(has('clienteNombre') && { clienteNombre: optStr(b.clienteNombre)! }),
        ...(has('obraId') && { obraId: optStr(b.obraId) }),
        ...(has('funnelBeckId') && { funnelBeckId: optStr(b.funnelBeckId) }),
        ...(hasClienteBeckId && { clienteBeckId: optStr(rawClienteBeckId) }),
        ...(hasContactoBeckId && { contactoBeckId: optStr(rawContactoBeckId) }),
        ...(hasResponsableId && { responsableId: optStr(rawResponsableId) }),
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

    const val = (v: unknown): string => {
      if (v == null) return '—';
      const s = String(v).trim();
      return s.length > 0 ? s : '—';
    };

    const badgeColor = ESTADO_COT_COLORS[cotizacion.estado] ?? '#64748b';

    // ══════════════════════ A) ENCABEZADO ══════════════════════

    doc.rect(0, 0, PDF_W, 4).fill(BECK_YELLOW);

    const HDR_TOP    = 14;
    const RBOX_X     = 348;
    const RBOX_W     = PDF_W - PDF_MARGIN - RBOX_X; // 207
    const RBOX_H     = 76;
    const RBOX_HDRH  = 15;

    // Bloque empresa (izquierda)
    if (logoBuffer) {
      doc.image(logoBuffer, PDF_MARGIN, HDR_TOP + 2, { height: 34 });
    }
    const CMP_X = logoBuffer ? PDF_MARGIN + 48 : PDF_MARGIN;

    doc.font('Helvetica-Bold').fontSize(13).fillColor(BECK_DARK)
      .text('BECK Soluciones', CMP_X, HDR_TOP, { lineBreak: false });
    doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_MUTED)
      .text(`RUT: ${BECK_RUT}`,  CMP_X, HDR_TOP + 16, { lineBreak: false })
      .text(BECK_DIRECCION,       CMP_X, HDR_TOP + 26, { width: RBOX_X - CMP_X - 10, lineBreak: false })
      .text('Correo: —',          CMP_X, HDR_TOP + 36, { lineBreak: false })
      .text('Teléfono: —',        CMP_X, HDR_TOP + 46, { lineBreak: false });

    // Recuadro cotización (derecha)
    doc.lineWidth(0.8).rect(RBOX_X, HDR_TOP - 1, RBOX_W, RBOX_H).stroke(BORDER_COLOR);
    doc.rect(RBOX_X, HDR_TOP - 1, RBOX_W, RBOX_HDRH).fill(BECK_DARK);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
      .text('COTIZACIÓN', RBOX_X, HDR_TOP + 2, { width: RBOX_W, align: 'center', lineBreak: false });

    const BLX = RBOX_X + 6;
    const BVX = RBOX_X + 76;
    const BVW = RBOX_W - 82;

    const rLine = (label: string, value: string, y: number): void => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(TEXT_MUTED)
        .text(label, BLX, y, { width: 68, lineBreak: false });
      doc.font('Helvetica').fontSize(8).fillColor(TEXT_DARK)
        .text(value, BVX, y, { width: BVW, lineBreak: false });
    };
    rLine('N°:',       val(cotizacion.numero),                       HDR_TOP + 20);
    rLine('Emisión:',  formatCotDate(new Date(cotizacion.createdAt)), HDR_TOP + 32);
    rLine('Vigencia:', formatCotDate(new Date(cotizacion.vigencia)),  HDR_TOP + 44);

    const BDGE_Y = HDR_TOP + 57;
    doc.rect(RBOX_X + 6, BDGE_Y, RBOX_W - 12, 13).fill(badgeColor);
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#ffffff')
      .text(cotizacion.estado, RBOX_X + 6, BDGE_Y + 3,
        { width: RBOX_W - 12, align: 'center', lineBreak: false });

    doc.y = HDR_TOP + RBOX_H + 4;

    // Línea separadora amarilla
    doc.rect(PDF_MARGIN, doc.y, PDF_CONTENT_W, 1.5).fill(BECK_YELLOW);
    doc.y += 8;

    // ══════════════════════ B+C) BLOQUES DE INFORMACIÓN ══════════════════════

    const BINFO_TOP = doc.y;
    const BINFO_LX  = PDF_MARGIN;
    const BINFO_LW  = 254;
    const BINFO_RX  = PDF_MARGIN + BINFO_LW + 7;
    const BINFO_RW  = PDF_W - PDF_MARGIN - BINFO_RX;
    const BI_HDR_H  = 16;
    const BI_ROW_H  = 14;
    const BI_ROWS   = 6;
    const BI_BODY_H = BI_ROWS * BI_ROW_H + 8;
    const BI_TOTAL  = BI_HDR_H + BI_BODY_H;

    const drawInfoBox = (
      bx: number,
      bw: number,
      title: string,
      rows: Array<[string, string]>,
    ): void => {
      doc.rect(bx, BINFO_TOP, bw, BI_HDR_H).fill(BECK_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text(title, bx + 6, BINFO_TOP + 4, { width: bw - 12, lineBreak: false });
      doc.lineWidth(0.5).rect(bx, BINFO_TOP + BI_HDR_H, bw, BI_BODY_H).stroke(BORDER_COLOR);
      const kw = 82;
      const vw = bw - kw - 14;
      let ry = BINFO_TOP + BI_HDR_H + 5;
      for (const [key, value] of rows) {
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(TEXT_MUTED)
          .text(key, bx + 6, ry, { width: kw, lineBreak: false });
        doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK)
          .text(value, bx + kw + 6, ry, { width: vw, lineBreak: false });
        ry += BI_ROW_H;
      }
    };

    const cRut   = val(cotizacion.clienteBeck?.rut);
    const cNom   = val(cotizacion.contactoBeck?.nombre);
    const cEmail = val(cotizacion.contactoBeck?.correo ?? cotizacion.clienteBeck?.correo);
    const cTel   = val(cotizacion.contactoBeck?.telefono ?? cotizacion.clienteBeck?.telefono);
    const cObra  = val(cotizacion.obra?.nombre);

    drawInfoBox(BINFO_LX, BINFO_LW, 'DATOS DEL CLIENTE', [
      ['Cliente:',         cotizacion.clienteNombre],
      ['RUT:',             cRut],
      ['Contacto:',        cNom],
      ['Correo:',          cEmail],
      ['Teléfono:',        cTel],
      ['Obra / Proyecto:', cObra],
    ]);

    drawInfoBox(BINFO_RX, BINFO_RW, 'DATOS DE COTIZACIÓN', [
      ['Responsable:',   val(cotizacion.responsable?.nombre)],
      ['Fecha emisión:', formatCotDate(new Date(cotizacion.createdAt))],
      ['Vigencia:',      formatCotDate(new Date(cotizacion.vigencia))],
      ['Estado:',        cotizacion.estado],
      ['Versión:',       String(cotizacion.version ?? 1)],
      ['Moneda:',        'CLP'],
    ]);

    doc.y = BINFO_TOP + BI_TOTAL + 10;

    // ══════════════════════ D) TABLA DE DETALLE ══════════════════════

    const TC_NUM  = { x: PDF_MARGIN,       w: 22  };
    const TC_DESC = { x: PDF_MARGIN + 22,  w: 218 };
    const TC_CANT = { x: PDF_MARGIN + 240, w: 40  };
    const TC_PUN  = { x: PDF_MARGIN + 280, w: 95  };
    const TC_SUB  = { x: PDF_MARGIN + 375, w: 140 };

    const drawTableHeader = (): void => {
      const ty = doc.y;
      doc.rect(PDF_MARGIN, ty, PDF_CONTENT_W, 17).fill(BECK_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff');
      doc.text('#',            TC_NUM.x  + 3, ty + 4, { width: TC_NUM.w,               lineBreak: false });
      doc.text('DESCRIPCIÓN',  TC_DESC.x + 3, ty + 4, { width: TC_DESC.w,              lineBreak: false });
      doc.text('CANT.',         TC_CANT.x,    ty + 4, { width: TC_CANT.w, align: 'right', lineBreak: false });
      doc.text('P. UNIT.',      TC_PUN.x,     ty + 4, { width: TC_PUN.w,  align: 'right', lineBreak: false });
      doc.text('SUBTOTAL',      TC_SUB.x,     ty + 4, { width: TC_SUB.w - 4, align: 'right', lineBreak: false });
      doc.y = ty + 17;
    };

    drawTableHeader();

    let rowIdx = 0;
    for (const linea of lineas) {
      if (doc.y > 740) {
        doc.addPage();
        doc.y = PDF_MARGIN;
        drawTableHeader();
        rowIdx = 0;
      }
      const rowY = doc.y;
      const rowH = 18;

      if (rowIdx % 2 === 1) {
        doc.rect(PDF_MARGIN, rowY, PDF_CONTENT_W, rowH).fill(ROW_ALT);
      }

      doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK);
      doc.text(String(rowIdx + 1),              TC_NUM.x  + 3, rowY + 4, { width: TC_NUM.w,               lineBreak: false });
      doc.text(linea.descripcion,               TC_DESC.x + 3, rowY + 4, { width: TC_DESC.w,              lineBreak: false });
      doc.text(String(linea.cantidad),          TC_CANT.x,     rowY + 4, { width: TC_CANT.w, align: 'right', lineBreak: false });
      doc.text(formatCLP(linea.precioUnitario), TC_PUN.x,      rowY + 4, { width: TC_PUN.w,  align: 'right', lineBreak: false });
      doc.text(formatCLP(linea.subtotal),       TC_SUB.x,      rowY + 4, { width: TC_SUB.w - 4, align: 'right', lineBreak: false });

      doc.y = rowY + rowH;
      rowIdx++;
    }

    doc.lineWidth(0.5)
      .moveTo(PDF_MARGIN, doc.y).lineTo(PDF_W - PDF_MARGIN, doc.y).stroke(BORDER_COLOR);
    doc.y += 12;

    // ══════════════════════ E) TOTALES ══════════════════════

    const TT_X  = 358;
    const TT_LW = 112;
    const TT_VX = TT_X + TT_LW;
    const TT_VW = PDF_W - PDF_MARGIN - TT_VX;
    let   totY  = doc.y;

    const drawTotRow = (
      label: string,
      value: string,
      opts: { bold?: boolean; highlight?: boolean } = {},
    ): void => {
      const { bold = false, highlight = false } = opts;
      if (highlight) {
        doc.rect(TT_X - 6, totY - 2, PDF_W - PDF_MARGIN - TT_X + 6, 18).fill(BECK_YELLOW);
      }
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
        .fillColor(highlight ? BECK_DARK : TEXT_DARK);
      doc.text(label, TT_X,  totY, { width: TT_LW,               lineBreak: false });
      doc.text(value, TT_VX, totY, { width: TT_VW, align: 'right', lineBreak: false });
      totY += 16;
    };

    drawTotRow('Subtotal:', formatCLP(subtotal));
    if (descuentoPct > 0) {
      drawTotRow(`Descuento (${formatPct(descuentoPct)}):`, `− ${formatCLP(descuentoMonto)}`);
    }
    if (impuesto > 0) {
      drawTotRow('IVA (19%):', formatCLP(impuesto));
    }

    doc.lineWidth(0.5)
      .moveTo(TT_X - 6, totY - 3).lineTo(PDF_W - PDF_MARGIN, totY - 3).stroke(BORDER_COLOR);
    totY += 4;

    drawTotRow('TOTAL:', formatCLP(total), { bold: true, highlight: true });
    doc.y = totY + 10;

    // ══════════════════════ F) OBSERVACIONES ══════════════════════

    if (cotizacion.observaciones) {
      if (doc.y > 720) { doc.addPage(); doc.y = PDF_MARGIN; }
      doc.y += 6;

      const obsY = doc.y;
      doc.rect(PDF_MARGIN, obsY, PDF_CONTENT_W, 16).fill(BECK_DARK);
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
        .text('OBSERVACIONES', PDF_MARGIN + 8, obsY + 4, { width: PDF_CONTENT_W - 16, lineBreak: false });

      doc.y = obsY + 16;
      doc.lineWidth(0.5)
        .moveTo(PDF_MARGIN, doc.y).lineTo(PDF_W - PDF_MARGIN, doc.y).stroke(BORDER_COLOR);

      doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK)
        .text(cotizacion.observaciones, PDF_MARGIN + 6, doc.y + 6, { width: PDF_CONTENT_W - 12 });

      doc.y += 8;
      doc.lineWidth(0.5)
        .moveTo(PDF_MARGIN, doc.y).lineTo(PDF_W - PDF_MARGIN, doc.y).stroke(BORDER_COLOR);
      doc.y += 8;
    }

    // ══════════════════════ G) FIRMA ══════════════════════

    if (doc.y > 760) { doc.addPage(); doc.y = PDF_MARGIN; }

    const sigY = doc.y < 690 ? 710 : doc.y + 24;
    doc.lineWidth(0.5)
      .moveTo(PDF_MARGIN, sigY).lineTo(PDF_MARGIN + 190, sigY).stroke('#94a3b8');
    doc.font('Helvetica').fontSize(8).fillColor(TEXT_MUTED)
      .text('Firma y Aclaración', PDF_MARGIN, sigY + 5, { lineBreak: false });

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF:', error);
  }
};
