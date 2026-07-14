// src/routes/registros.routes.ts
import { Router } from 'express';
import {
  crearRegistro,
  listarRegistros,
  obtenerRegistro,
  listarPendientes,
  getResumenRegistros,
  actualizarEstadoRegistro,
  actualizarRegistro,
  descargarRegistroPdf,
  reenviarRevision,
  iniciarRevision,
  rendimientoAcumulado,
  marcarInspeccion,
  getControlInspeccion,
  crearControlInspeccion,
  verDetalleInspeccion,
  revisarInspeccion,
} from '../controllers/registros.controller';
import {
  importarRegistrosExcel,
  descargarEjemploExcel,
} from '../controllers/importar-registros.controller';
import { descargarPdfConsolidadoCliente } from '../controllers/cliente.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/requirePermission';
import { upload, uploadExcelFile } from '../middlewares/upload';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * POST /api/registros
 * Crear registro con fotos (1-5 imágenes)
 */
router.post(
  '/',
  authenticate,
  requirePermission('beck_registro', 'editar'),
  upload.array('fotos', 5), // Max 5 fotos
  crearRegistro
);

/**
 * POST /api/registros/importar
 * Importar registros desde Excel (hojas: SELLOS CORTAFUEGOS, Junta Lineal ESPUMA)
 */
router.post(
  '/importar',
  authenticate,
  requirePermission('beck_registro', 'editar'),
  uploadExcelFile,
  importarRegistrosExcel
);

/**
 * GET /api/registros/ejemplo-excel
 * Descarga el archivo Excel de ejemplo con obra "Obra Demo"
 */
router.get(
  '/ejemplo-excel',
  authenticate,
  requirePermission('beck_registro', 'ver'),
  descargarEjemploExcel,
);

/**
 * GET /api/registros
 * Listar registros con filtros opcionales.
 * Acepta beck_registro.ver (módulo Registros) o beck_reportes.ver (página Reportes).
 */
router.get('/', authenticate, requirePermission(['beck_registro', 'beck_reportes'], 'ver'), listarRegistros);

/**
 * POST /api/registros/pdf-consolidado
 * Descarga consolidada para el módulo Registro (staff interno) — reutiliza
 * exactamente el mismo controller que /api/cliente/registros/pdf-consolidado
 * (misma validación, misma generación/unión de PDFs). Solo cambia la
 * autorización: aquí basta el permiso de ver Registro (visibilidad org-wide,
 * no acotada a un cliente/obra), en vez del scope de Vista Cliente.
 */
router.post(
  '/pdf-consolidado',
  authenticate,
  requirePermission(['beck_registro', 'beck_reportes'], 'ver'),
  (req: Request, _res: Response, next: NextFunction) => {
    (req as Request & { accesoInternoRegistros?: boolean }).accesoInternoRegistros = true;
    next();
  },
  descargarPdfConsolidadoCliente,
);

/**
 * GET /api/registros/pendientes
 * Listar registros para Procesamiento Ingeniería (todos los estados).
 * El cliente filtra la tabla a pendiente/en_revision y usa todos los estados para KPIs.
 */
router.get(
  '/pendientes',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'ver'),
  listarPendientes
);

/**
 * GET /api/registros/resumen
 * Conteos por estado para KPIs de Procesamiento Ingeniería.
 */
router.get(
  '/resumen',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'ver'),
  getResumenRegistros
);

/**
 * PATCH /api/registros/:id/estado
 * Actualizar estado del registro (pendiente, validado, rechazado)
 */
router.patch(
  '/:id/estado',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  actualizarEstadoRegistro,
);

/**
 * PATCH /api/registros/:id/iniciar-revision
 * Ingeniería inicia revisión de un registro en estado pendiente
 */
router.patch(
  '/:id/iniciar-revision',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  iniciarRevision,
);

/**
 * PATCH /api/registros/:id/reenviar-revision
 * Reenviar corrección (o registro pendiente) a revisión de Ingeniería
 */
router.patch(
  '/:id/reenviar-revision',
  authenticate,
  requirePermission('beck_registro', 'editar'),
  reenviarRevision,
);

/**
 * GET /api/registros/rendimiento-acumulado
 * Rendimiento acumulado por sellador en un rango de fechas (equivale a SUMAR.SI.CONJUNTO de Excel).
 * Query params: fechaInicio, fechaFin (obligatorios), obraId, nombreSellador (opcionales).
 */
router.get(
  '/rendimiento-acumulado',
  authenticate,
  requirePermission(['beck_registro', 'beck_reportes'], 'ver'),
  rendimientoAcumulado,
);

/**
 * GET /api/registros/:id/pdf
 * Descargar PDF con detalle completo del registro.
 * Acepta beck_procesamiento_ingenieria.ver o beck_reportes.ver (descarga desde página Reportes).
 */
router.get(
  '/:id/pdf',
  authenticate,
  requirePermission(['beck_procesamiento_ingenieria', 'beck_reportes'], 'ver'),
  descargarRegistroPdf,
);

/**
 * PATCH /api/registros/:id/inspeccion
 * Acción de la web: enviar un registro a inspección, o quitarlo mientras no haya
 * sido inspeccionado todavía. La web nunca controla la inspección en sí.
 * Body: { seleccionadoParaInspeccion: boolean }
 */
router.patch(
  '/:id/inspeccion',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  marcarInspeccion,
);

/**
 * GET /api/registros/:id/inspeccion
 * Detalle de inspección de solo lectura para la web: estado, quién/cuándo se envió
 * y, si ya fue inspeccionado por el Supervisor desde la app, el resultado completo.
 */
router.get(
  '/:id/inspeccion',
  authenticate,
  requirePermission(['beck_procesamiento_ingenieria', 'beck_registro'], 'ver'),
  verDetalleInspeccion,
);

/**
 * PATCH /api/registros/:id/inspeccion/revision
 * Ingeniería (web) valida o rechaza el resultado de la inspección ya registrada
 * por el Supervisor. Rechazar devuelve el registro a la cola del supervisor.
 * Body: { accion: 'validar' | 'rechazar', motivo? }
 */
router.patch(
  '/:id/inspeccion/revision',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  revisarInspeccion,
);

/**
 * GET /api/registros/:id/control-inspeccion
 * Devuelve el control de inspección asociado al registro (registro crudo).
 */
router.get(
  '/:id/control-inspeccion',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'ver'),
  getControlInspeccion,
);

/**
 * POST /api/registros/:id/control-inspeccion
 * Registra el resultado del control de inspección. Pensado para la app del
 * Supervisor: el controller exige rol jefeobra o administrador, aunque el gate
 * de módulo usa 'beck_registro' (permiso que el Supervisor sí tiene).
 */
router.post(
  '/:id/control-inspeccion',
  authenticate,
  requirePermission('beck_registro', 'editar'),
  crearControlInspeccion,
);

/**
 * PUT /api/registros/:id
 * Actualizar campos editables de un registro
 */
router.put(
  '/:id',
  authenticate,
  requirePermission('beck_procesamiento_ingenieria', 'editar'),
  actualizarRegistro,
);

/**
 * GET /api/registros/:id
 * Obtener un registro especifico
 */
router.get('/:id', authenticate, requirePermission('beck_registro', 'ver'), obtenerRegistro);

export default router;
