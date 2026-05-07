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

// ─── PDF helpers ─────────────────────────────────────────────────────────────

const formatCLP = (value: number): string =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatPct = (value: number): string =>
  `${new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;

const pdfHeader = (doc: any, y: number): void => {
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Descripción', 50, y, { width: 240 });
  doc.text('Cant.', 298, y, { width: 50, align: 'right' });
  doc.text('P.Unit.', 355, y, { width: 80, align: 'right' });
  doc.text('%Gan.', 442, y, { width: 50, align: 'right' });
  doc.text('Subtotal', 500, y, { width: 60, align: 'right' });
  doc.moveTo(50, y + 16).lineTo(560, y + 16).stroke();
};

const pdfRow = (doc: any, y: number, linea: LineaInput): void => {
  doc.font('Helvetica').fontSize(10);
  doc.text(linea.descripcion, 50, y, { width: 240 });
  doc.text(String(linea.cantidad), 298, y, { width: 50, align: 'right' });
  doc.text(formatCLP(linea.precioUnitario), 355, y, { width: 80, align: 'right' });
  doc.text(`${linea.gananciaPct}%`, 442, y, { width: 50, align: 'right' });
  doc.text(formatCLP(linea.subtotal), 500, y, { width: 60, align: 'right' });
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const createCotizacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const b = req.body as Record<string, unknown>;

    const clienteNombre = optStr(b.clienteNombre);
    if (!clienteNombre) {
      res.status(400).json({ success: false, error: 'clienteNombre es obligatorio' });
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

    const lineas: LineaInput[] = cotizacion.lineas.map((l) => ({
      tipoLinea: l.tipoLinea,
      descripcion: l.descripcion,
      unidad: l.unidad,
      cantidad: Number(l.cantidad),
      precioUnitario: Number(l.precioUnitario),
      gananciaPct: canViewGanancia(req) ? Number(l.gananciaPct) : 0,
      subtotal: Number(l.subtotal),
      orden: l.orden,
      notasLinea: l.notasLinea,
    }));
    const subtotal = Number(cotizacion.subtotal);
    const descuentoPct = Number(cotizacion.descuento);
    const descuentoMonto = Math.round((subtotal * (descuentoPct / 100) + Number.EPSILON) * 100) / 100;

    const fileName = `cotizacion-${cotizacion.numero ?? cotizacion.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    doc.font('Helvetica-Bold').fontSize(18).text('Cotización', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica').fontSize(11);
    doc.text(`Cliente: ${cotizacion.clienteNombre}`);
    doc.text(`Número: ${cotizacion.numero ?? 'Sin número'}`);
    doc.text(`Fecha: ${new Date(cotizacion.createdAt).toLocaleDateString('es-CL')}`);
    doc.text(`Vigencia: ${new Date(cotizacion.vigencia).toLocaleDateString('es-CL')}`);
    doc.text(`Estado: ${cotizacion.estado}`);
    if (cotizacion.obra) doc.text(`Obra: ${cotizacion.obra.nombre}`);
    if (cotizacion.observaciones) {
      doc.moveDown(0.5);
      doc.text(`Observaciones: ${cotizacion.observaciones}`);
    }
    doc.moveDown();

    let y = doc.y;
    pdfHeader(doc, y);
    y += 26;

    for (const linea of lineas) {
      if (y > 720) {
        doc.addPage();
        y = 50;
        pdfHeader(doc, y);
        y += 26;
      }
      pdfRow(doc, y, linea);
      y += 22;
    }

    y += 10;
    doc.moveTo(360, y).lineTo(560, y).stroke();
    y += 10;

    doc.font('Helvetica').fontSize(11);
    doc.text(`Subtotal: ${formatCLP(subtotal)}`, 360, y, { width: 200, align: 'right' });
    y += 18;
    doc.text(`Descuento (${formatPct(descuentoPct)}): ${formatCLP(descuentoMonto)}`, 360, y, { width: 200, align: 'right' });
    y += 18;
    doc.text(`Impuesto (IVA): ${formatCLP(Number(cotizacion.impuesto))}`, 360, y, { width: 200, align: 'right' });
    y += 20;
    doc.font('Helvetica-Bold');
    doc.text(`Total: ${formatCLP(Number(cotizacion.total))}`, 360, y, { width: 200, align: 'right' });

    doc.end();
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else console.error('Error generando PDF:', error);
  }
};
