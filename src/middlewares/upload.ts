import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido. Solo se aceptan imágenes JPEG, PNG y WebP'));
  }
};

// Límites
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB por defecto
const MAX_FILES = parseInt(process.env.MAX_FILES_PER_UPLOAD || '5', 10); // 5 archivos por defecto

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

// Filtro para aceptar solo archivos Excel
const excelFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ];
  if (allowedMimes.includes(file.mimetype) || /\.(xlsx|xls)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se aceptan archivos Excel (.xlsx, .xls)'));
  }
};

export const uploadExcel = multer({
  storage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
    files: 1,
  },
});

/**
 * Middleware específico para subir un único archivo Excel en el campo "file".
 * Devuelve 400 con mensaje claro si el campo no coincide.
 */
export const uploadExcelFile = (req: Request, res: Response, next: NextFunction): void => {
  uploadExcel.single('file')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({
          success: false,
          error: "Campo de archivo inválido. Use 'file'.",
        });
        return;
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          success: false,
          error: 'El archivo Excel excede el tamaño máximo de 20MB',
        });
        return;
      }
      res.status(400).json({ success: false, error: err.message });
      return;
    }
    if (err) {
      res.status(400).json({ success: false, error: (err as Error).message });
      return;
    }
    next();
  });
};

/**
 * Middleware para manejar errores de multer
 */
export const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / 1024 / 1024}MB` });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: `Solo se permiten hasta ${MAX_FILES} archivos` });
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({ error: 'Campo de archivo inesperado' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }

  next();
};
