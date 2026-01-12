import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Sube una imagen a Cloudinary
 * @param fileBuffer Buffer del archivo
 * @param folder Carpeta en Cloudinary (ej: 'beck/registros')
 * @returns URL de la imagen subida
 */
export const uploadImage = async (fileBuffer: Buffer, folder: string = 'beck/registros'): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1920, crop: 'limit' }, // Máximo 1920x1920
          { quality: 'auto' }, // Optimización automática
          { fetch_format: 'auto' }, // Formato automático (WebP si el navegador lo soporta)
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('No se pudo subir la imagen'));
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
