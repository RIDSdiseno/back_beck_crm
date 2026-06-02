// src/routes/registros.routes.ts
import { Router } from 'express';
import {
  crearRegistro,
  listarRegistros,
  obtenerRegistro,
  listarPendientes,
  actualizarEstadoRegistro,
  actualizarRegistro,
  descargarRegistroPdf,
  reenviarRevision,
  iniciarRevision,
} from '../controllers/registros.controller';
import {
  importarRegistrosExcel,
  descargarEjemploExcel,
} from '../controllers/importar-registros.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload, uploadExcelFile } from '../middlewares/upload';

const router = Router();

const canReadRegistros = authorize('administrador', 'ingenieria', 'visualizador', 'terreno', 'jefeobra');

/**
 * POST /api/registros
 * Crear registro con fotos (1-5 imágenes)
 * Solo terreno y administrador
 */
router.post(
  '/',
  authenticate,
  authorize('terreno', 'administrador', 'jefeobra'),
  upload.array('fotos', 5), // Max 5 fotos
  crearRegistro
);

/**
 * POST /api/registros/importar
 * Importar registros desde Excel (hojas: SELLOS CORTAFUEGOS, Junta Lineal ESPUMA)
 * Solo administrador e ingenieria
 */
router.post(
  '/importar',
  authenticate,
  authorize('administrador', 'ingenieria', 'jefeobra'),
  uploadExcelFile,
  importarRegistrosExcel
);

/**
 * GET /api/registros/ejemplo-excel
 * Descarga el archivo Excel de ejemplo con obra "Obra Demo"
 * Solo administrador, ingenieria y jefeobra
 */
router.get(
  '/ejemplo-excel',
  authenticate,
  authorize('administrador', 'ingenieria', 'jefeobra'),
  descargarEjemploExcel,
);

/**
 * GET /api/registros
 * Listar registros con filtros opcionales
 */
router.get('/', authenticate, canReadRegistros, listarRegistros);

/**
 * GET /api/registros/pendientes
 * Listar registros pendientes (para Ingeniería)
 * Solo ingenieria, administrador, visualizador
 */
router.get(
  '/pendientes',
  authenticate,
  authorize('ingenieria', 'administrador', 'visualizador'),
  listarPendientes
);

/**
 * PATCH /api/registros/:id/estado
 * Actualizar estado del registro (pendiente, validado, rechazado)
 * Solo administrador e ingenieria
 */
router.patch(
  '/:id/estado',
  authenticate,
  authorize('administrador', 'ingenieria'),
  actualizarEstadoRegistro,
);

/**
 * PATCH /api/registros/:id/iniciar-revision
 * Ingeniería inicia revisión de un registro en estado pendiente
 * Solo ingenieria y administrador
 */
router.patch(
  '/:id/iniciar-revision',
  authenticate,
  authorize('ingenieria', 'administrador'),
  iniciarRevision,
);

/**
 * PATCH /api/registros/:id/reenviar-revision
 * Reenviar corrección (o registro pendiente) a revisión de Ingeniería
 * Terreno y administrador
 */
router.patch(
  '/:id/reenviar-revision',
  authenticate,
  authorize('terreno', 'administrador'),
  reenviarRevision,
);

/**
 * GET /api/registros/:id/pdf
 * Descargar PDF con detalle completo del registro
 * Solo administrador, ingenieria y jefeobra
 */
router.get(
  '/:id/pdf',
  authenticate,
  authorize('administrador', 'ingenieria', 'jefeobra'),
  descargarRegistroPdf,
);

/**
 * PUT /api/registros/:id
 * Actualizar campos editables de un registro
 * Solo administrador e ingenieria
 */
router.put(
  '/:id',
  authenticate,
  authorize('administrador', 'ingenieria'),
  actualizarRegistro,
);

/**
 * GET /api/registros/:id
 * Obtener un registro especifico
 */
router.get('/:id', authenticate, canReadRegistros, obtenerRegistro);

export default router;
