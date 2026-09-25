import type { Prisma } from '@prisma/client';

export class PdfFirmadoError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const PDF_FIRMADO_WHERE: Prisma.RegistroTerrenoWhereInput = {
  validadoCliente: true,
  AND: [{ pdfFirmadoUrl: { not: null } }, { pdfFirmadoUrl: { not: '' } }],
};

export function parametrosPdfs(query: Record<string, unknown>) {
  const text = (key: string) => {
    const value = query[key];
    if (value == null) return '';
    if (typeof value !== 'string') throw new PdfFirmadoError(400, 'Filtro inválido');
    return value.trim();
  };
  const uuid = (key: string) => {
    const value = text(key);
    if (value && !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value)) {
      throw new PdfFirmadoError(400, 'Identificador inválido');
    }
    return value;
  };
  const page = Number(text('page') || 1);
  const limit = Number(text('limit') || 25);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 ||
      !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new PdfFirmadoError(400, 'Paginación inválida');
  }
  const date = (key: string) => {
    const value = text(key);
    if (!value) return undefined;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      throw new PdfFirmadoError(400, 'Fecha inválida');
    }
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) {
      throw new PdfFirmadoError(400, 'Fecha inválida');
    }
    return parsed;
  };
  const desde = date('desde');
  const hasta = date('hasta');
  if (desde && hasta && desde >= hasta) throw new PdfFirmadoError(400, 'Rango de fechas inválido');
  const search = text('search');
  if (search.length > 200) throw new PdfFirmadoError(400, 'La búsqueda es demasiado larga');
  const obraId = uuid('obraId');
  const firmanteId = uuid('firmanteId');
  const literal = search.replace(/[\\%_]/g, '\\$&');
  const registroId = search.replace(/^REG-/i, '');
  const where: Prisma.RegistroTerrenoWhereInput = {
    ...PDF_FIRMADO_WHERE,
    ...(obraId ? { obraId } : {}),
    ...(firmanteId ? { validadoClientePorId: firmanteId } : {}),
    ...(desde || hasta ? { validadoClienteAt: { gte: desde, lt: hasta } } : {}),
    ...(search ? { OR: [
      { numeroSello: { contains: literal, mode: 'insensitive' } },
      { codigoBeck: { contains: literal, mode: 'insensitive' } },
      ...(/^[0-9a-f]{6}$/i.test(registroId) ? [{ id: { gte: `${registroId.toLowerCase()}00-0000-0000-0000-000000000000`, lte: `${registroId.toLowerCase()}ff-ffff-ffff-ffff-ffffffffffff` } }] : []),
      ...(/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(registroId) ? [{ id: { equals: registroId } }] : []),
    ] } : {}),
  };
  return { page, limit, where };
}

// Solo se leen archivos de nuestra cuenta, nunca URLs arbitrarias de la BD.
export function urlPublicaPdfPermitida(reference: string, cloudName: string) {
  const url = new URL(reference);
  if (!cloudName || url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' ||
      url.username || url.password || url.port || !url.pathname.startsWith(`/${cloudName}/`)) {
    throw new PdfFirmadoError(502, 'Referencia de PDF no válida');
  }
  return url.toString();
}

export async function leerPdfOriginal(url: string, fetcher = fetch): Promise<Buffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const maxBytes = 25 * 1024 * 1024;
  try {
    const response = await fetcher(url, { signal: controller.signal, redirect: 'error' });
    if (response.status === 404) throw new PdfFirmadoError(404, 'El archivo firmado no está disponible');
    if (!response.ok || !response.body) throw new PdfFirmadoError(502, 'No se pudo obtener el PDF firmado');
    if (Number(response.headers.get('content-length')) > maxBytes) throw new PdfFirmadoError(413, 'El PDF supera el tamaño permitido');
    const reader = response.body.getReader();
    const chunks: Buffer[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new PdfFirmadoError(413, 'El PDF supera el tamaño permitido'); }
      chunks.push(Buffer.from(value));
    }
    const result = Buffer.concat(chunks);
    if (result.subarray(0, 5).toString() !== '%PDF-') throw new PdfFirmadoError(502, 'El archivo recibido no es un PDF válido');
    return result;
  } finally {
    controller.abort();
    clearTimeout(timer);
  }
}
