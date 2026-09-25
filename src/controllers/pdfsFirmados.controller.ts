import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { getPrivateDownloadUrl } from '../config/cloudinary';
import { PDF_FIRMADO_WHERE, parametrosPdfs, PdfFirmadoError, urlPublicaPdfPermitida, leerPdfOriginal } from '../utils/pdfsFirmados';

function fail(res: Response, error: unknown) {
  const known = error instanceof PdfFirmadoError;
  res.status(known ? error.status : 502).json({ success: false, error: known ? error.message : 'No se pudo consultar el archivo o el listado de PDF firmados' });
}

export async function listarPdfsFirmados(req: Request, res: Response) {
  try {
    const { page, limit, where } = parametrosPdfs(req.query);
    const [items, total] = await prisma.$transaction([
      prisma.registroTerreno.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: [{ validadoClienteAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
        select: {
          id: true, codigoBeck: true, numeroSello: true, validadoClienteAt: true, nombreFirmanteCliente: true,
          obra: { select: { id: true, nombre: true, codigo: true } },
          validadoClientePor: { select: { id: true, nombre: true, email: true } },
        },
      }),
      prisma.registroTerreno.count({ where }),
    ]);
    res.json({ success: true, data: { items: items.map(item => ({
      ...item, codigoRegistro: `REG-${item.id.slice(0, 6).toUpperCase()}`,
      firmante: item.nombreFirmanteCliente || item.validadoClientePor?.nombre || 'No registrado',
      nombreHistorico: Boolean(item.nombreFirmanteCliente),
    })), total, page, limit } });
  } catch (error) { fail(res, error); }
}

export async function filtrosPdfsFirmados(_req: Request, res: Response) {
  try {
    const [obras, firmantes] = await prisma.$transaction([
      prisma.obra.findMany({ where: { registrosTerreno: { some: PDF_FIRMADO_WHERE } }, select: { id: true, nombre: true, codigo: true }, orderBy: { nombre: 'asc' } }),
      prisma.usuario.findMany({ where: { registrosValidadosCliente: { some: PDF_FIRMADO_WHERE } }, select: { id: true, nombre: true, email: true }, orderBy: { nombre: 'asc' } }),
    ]);
    res.json({ success: true, data: { obras, firmantes } });
  } catch (error) { fail(res, error); }
}

export async function archivoPdfFirmado(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) throw new PdfFirmadoError(400, 'Identificador inválido');
    const registro = await prisma.registroTerreno.findFirst({
      where: { ...PDF_FIRMADO_WHERE, id }, select: { pdfFirmadoUrl: true },
    });
    if (!registro?.pdfFirmadoUrl) throw new PdfFirmadoError(404, 'PDF firmado no disponible');
    const reference = registro.pdfFirmadoUrl;
    const url = /^https?:\/\//i.test(reference)
      ? urlPublicaPdfPermitida(reference, process.env.CLOUDINARY_CLOUD_NAME || '')
      : getPrivateDownloadUrl(reference, 'pdf', 'raw');
    const buffer = await leerPdfOriginal(url);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${req.query.download === 'true' ? 'attachment' : 'inline'}; filename="REG-${id.slice(0, 6).toUpperCase()}-firmado.pdf"`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(buffer);
  } catch (error) { fail(res, error); }
}
