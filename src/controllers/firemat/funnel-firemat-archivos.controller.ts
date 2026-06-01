import { Request, Response } from 'express';
import { deleteFile, uploadFileDetailed } from '../../config/cloudinary';
import { firematPrisma } from '../../config/firematPrisma';

const parseIdParam = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getNullableString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const ensureOportunidadExists = async (oportunidadId: number): Promise<boolean> => {
  const oportunidad = await firematPrisma.funnelFirematOpportunity.findUnique({
    where: { id: oportunidadId },
    select: { id: true },
  });

  return Boolean(oportunidad);
};

export const listarArchivosFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const oportunidadId = parseIdParam(req.params.id);
    if (!oportunidadId) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const exists = await ensureOportunidadExists(oportunidadId);
    if (!exists) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const data = await firematPrisma.funnelFirematArchivo.findMany({
      where: { oportunidadId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al listar archivos Funnel Firemat:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const subirArchivosFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const oportunidadId = parseIdParam(req.params.id);
    if (!oportunidadId) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, error: 'Debes subir al menos 1 archivo' });
      return;
    }

    const exists = await ensureOportunidadExists(oportunidadId);
    if (!exists) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const tipo = getNullableString(req.body?.tipo) ?? 'OTRO';
    const etapa = getNullableString(req.body?.etapa);
    const observaciones = getNullableString(req.body?.observaciones);
    const folder = `firemat/oportunidades/${oportunidadId}`;

    const data = await Promise.all(
      files.map(async (file) => {
        const result = await uploadFileDetailed(file.buffer, folder);
        return firematPrisma.funnelFirematArchivo.create({
          data: {
            oportunidadId,
            tipo,
            url: result.secure_url,
            publicId: result.public_id,
            nombreArchivo: file.originalname || result.original_filename,
            mimeType: file.mimetype || null,
            bytes: typeof file.size === 'number' ? file.size : result.bytes,
            etapa,
            observaciones,
          },
        });
      })
    );

    res.status(201).json({
      success: true,
      data,
      message: 'Archivos subidos correctamente',
    });
  } catch (error) {
    console.error('Error al subir archivos Funnel Firemat:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const eliminarArchivoFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const archivoId = parseIdParam(req.params.archivoId);
    if (!archivoId) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const archivo = await firematPrisma.funnelFirematArchivo.findUnique({
      where: { id: archivoId },
    });

    if (!archivo) {
      res.status(404).json({ success: false, error: 'Archivo no encontrado' });
      return;
    }

    await deleteFile(archivo.publicId);
    await firematPrisma.funnelFirematArchivo.delete({
      where: { id: archivoId },
    });

    res.json({ success: true, message: 'Archivo eliminado' });
  } catch (error) {
    console.error('Error al eliminar archivo Funnel Firemat:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
