import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export type UploadedImageDetails = {
  secure_url: string;
  public_id: string;
  format: string | null;
  bytes: number | null;
  original_filename: string | null;
};

export type UploadedFileDetails = {
  secure_url: string;
  public_id: string;
  bytes: number | null;
  original_filename: string | null;
};

/**
 * Sube una imagen a Cloudinary y devuelve los metadatos completos
 * (incluyendo public_id, requerido para persistir en `fotos_registro`).
 */
export const uploadImageDetailed = async (
  fileBuffer: Uint8Array,
  folder: string = 'beck/registros'
): Promise<UploadedImageDetails> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1920, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format ?? null,
            bytes: typeof result.bytes === 'number' ? result.bytes : null,
            original_filename: result.original_filename ?? null,
          });
        } else {
          reject(new Error('No se pudo subir la imagen'));
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Sube una imagen a Cloudinary
 * @param fileBuffer Buffer del archivo
 * @param folder Carpeta en Cloudinary (ej: 'beck/registros')
 * @returns URL de la imagen subida
 */
export const uploadImage = async (fileBuffer: Uint8Array, folder: string = 'beck/registros'): Promise<string> => {
  const details = await uploadImageDetailed(fileBuffer, folder);
  return details.secure_url;
};

/**
 * Sube un archivo genérico a Cloudinary usando detección automática del tipo.
 */
export const uploadFileDetailed = async (
  fileBuffer: Uint8Array,
  folder: string
): Promise<UploadedFileDetails> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            bytes: typeof result.bytes === 'number' ? result.bytes : null,
            original_filename: result.original_filename ?? null,
          });
        } else {
          reject(new Error('No se pudo subir el archivo'));
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Elimina una imagen de Cloudinary
 * @param publicId Public ID de la imagen en Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

/**
 * Elimina un archivo genérico de Cloudinary.
 */
export const deleteFile = async (publicId: string): Promise<void> => {
  let lastError: unknown = null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    if (result?.result === 'ok') return;
  } catch (error) {
    lastError = error;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    if (result?.result === 'ok' || result?.result === 'not found') return;
  } catch (error) {
    lastError = error;
  }

  if (lastError) throw lastError;
};
