import { TipoArchivoFunnel } from "@prisma/client";
import { deleteFile, uploadFileDetailed } from "../config/cloudinary";
import { prisma } from "../config/prisma";

const TIPOS_ARCHIVO_FUNNEL = new Set<string>(Object.values(TipoArchivoFunnel));

function parseTipoArchivo(value: unknown): TipoArchivoFunnel {
  const tipo = String(value ?? "").trim();
  if (!TIPOS_ARCHIVO_FUNNEL.has(tipo)) {
    throw new Error("Tipo de archivo inválido.");
  }
  return tipo as TipoArchivoFunnel;
}

function buildFunnelArchivoFolder(oportunidadId: string, tipo: TipoArchivoFunnel): string {
  return `BeckSoluciones/funnel/${oportunidadId}/${tipo}`;
}

export async function createFunnelBeckArchivos(
  oportunidadId: string,
  tipoRaw: unknown,
  files: Express.Multer.File[] | undefined,
) {
  const tipo = parseTipoArchivo(tipoRaw);

  if (!files || files.length === 0) {
    throw new Error("Debes subir al menos 1 archivo.");
  }

  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id: oportunidadId },
    select: { id: true },
  });
  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  const folder = buildFunnelArchivoFolder(oportunidadId, tipo);
  const uploaded = await Promise.all(
    files.map(async (file) => {
      const result = await uploadFileDetailed(file.buffer, folder);
      return {
        oportunidadId,
        tipo,
        url: result.secure_url,
        publicId: result.public_id,
        nombreArchivo: file.originalname || result.original_filename,
        mimeType: file.mimetype || null,
        bytes: typeof file.size === "number" ? file.size : result.bytes,
      };
    }),
  );

  await prisma.funnelBeckArchivo.createMany({ data: uploaded });

  return prisma.funnelBeckArchivo.findMany({
    where: {
      oportunidadId,
      publicId: { in: uploaded.map((file) => file.publicId) },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listFunnelBeckArchivos(oportunidadId: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id: oportunidadId },
    select: { id: true },
  });
  if (!oportunidad) throw new Error("Oportunidad no encontrada.");

  return prisma.funnelBeckArchivo.findMany({
    where: { oportunidadId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteFunnelBeckArchivo(archivoId: string) {
  const archivo = await prisma.funnelBeckArchivo.findUnique({
    where: { id: archivoId },
  });
  if (!archivo) throw new Error("Archivo no encontrado.");

  await deleteFile(archivo.publicId);
  await prisma.funnelBeckArchivo.delete({ where: { id: archivoId } });

  return { message: "Archivo eliminado correctamente." };
}
