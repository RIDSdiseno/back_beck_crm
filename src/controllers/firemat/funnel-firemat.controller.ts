import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';
import { prisma } from '../../config/prisma';
import { puedeCambiarEmpresa } from '../../helpers/puedeCambiarEmpresa';
import {
  obtenerMapaReglasValidacion,
  clasificarResultadoValidacion,
  construirResultadoValidacion,
} from '../../services/configuracionValidacion.service';
import { validarMotivoCierre, MotivoInvalidoError } from '../../constants/motivosCierre';

const ETAPAS_PERMITIDAS = [
  'PROSPECTO',
  'PRIMER_CONTACTO',
  'DESARROLLO_COTIZACION',
  'COTIZACION_ENVIADA',
  'ORDEN_CONFIRMADA',
  'GANADA',
  'PERDIDA',
  'POSTERGADA',
  'DESCARTADO',
] as const;

type EtapaFunnelFiremat = (typeof ETAPAS_PERMITIDAS)[number];

const ETAPAS_CERRADAS = new Set<string>([
  'GANADA',
  'PERDIDA',
  'POSTERGADA',
  'DESCARTADO',
]);

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const funnelInclude = {
  producto: true,
  cotizacion: true,
};

const parseIdParam = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  return getString(value);
};

const isBlank = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

const getNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const getInt = (value: unknown): number | null => {
  const n = getNumber(value);
  return n !== null && Number.isInteger(n) ? n : null;
};

const getDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
};

const parseEtapa = (value: unknown): EtapaFunnelFiremat | null => {
  if (typeof value !== 'string') return null;
  return ETAPAS_PERMITIDAS.includes(value as EtapaFunnelFiremat)
    ? (value as EtapaFunnelFiremat)
    : null;
};

const hasOwn = (body: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(body, key);


const isSameCalendarDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ---------- Validación estructural (no dinámica) ----------

const validateStructuralConstraints = (etapa: string, montoEstimado: number | null): void => {
  if (etapa === 'GANADA' && (montoEstimado === null || montoEstimado <= 0)) {
    throw new ValidationError('montoEstimado es obligatorio para oportunidades ganadas');
  }
};

// ---------- Validación dinámica FIREMAT ----------

interface CamposSnapshotFiremat {
  cliente: string | null;
  rutEmpresa: string | null;
  nombreOportunidad: string | null;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
  responsable: string | null;
  unidadNegocio: string | null;
  urgencia: string | null;
  tipoUso: string | null;
  necesidadSoporteTecnico: boolean | null;
  lineaProducto: string | null;
  productoId: number | null;
  cantidadEstimada: number | null;
  montoEstimado: number | null;
  alternativaProducto: string | null;
  comision: number | null;
  margenEstimado: number | null;
  fechaComprometidaEnvio: Date | null;
  versionCotizacion: string | null;
  comentariosCliente: string | null;
  objeciones: string | null;
  cotizacionId: number | null;
  ordenCompra: string | null;
  correoAceptacion: string | null;
  condicionesComerciales: string | null;
  coordinacionAdministrativa: string | null;
  estadoDocumentacion: string | null;
  traspasoAdministracion: boolean | null;
  traspasoERP: boolean | null;
  coordinacionDespacho: string | null;
  estadoComercialOrden: string | null;
  estadoDocumentacionVenta: string | null;
  tipoBroker: string | null;
  fechaEstimadaDespacho: Date | null;
  fechaSeguimientoPostventa: Date | null;
  proximaAccion: string | null;
  fechaProximaAccion: Date | null;
  documentoRespaldo: string | null;
  flujoPosterior: string | null;
  motivoPerdida: string | null;
  motivoPostergacion: string | null;
  fechaReactivacion: Date | null;
  motivoDescarte: string | null;
}

const isMissingBoolean = (value: unknown): boolean => typeof value !== 'boolean';
const isMissingNumber = (value: unknown): boolean => value === null || value === undefined || !Number.isFinite(Number(value));
const isMissingPositiveNumber = (value: unknown): boolean => isMissingNumber(value) || Number(value) <= 0;

async function ejecutarValidacionDinamicaFiremat(
  _etapaParaReglas: string,
  etapaDestino: string,
  c: CamposSnapshotFiremat
): Promise<{ bloqueos: string[]; advertencias: string[]; puedeAvanzar: boolean; reglasCargadas: string[] }> {
  // Firemat valida requisitos de entrada de la etapa destino.
  const mapa = await obtenerMapaReglasValidacion('FIREMAT', etapaDestino);
  const mapaDestino = mapa;
  const resultado = { bloqueos: [] as string[], advertencias: [] as string[] };

  clasificarResultadoValidacion('CLIENTE_REQUERIDO',              isBlank(c.cliente),                       mapa, resultado);
  clasificarResultadoValidacion('RUT_EMPRESA_REQUERIDO',          isBlank(c.rutEmpresa),                    mapa, resultado);
  clasificarResultadoValidacion('NOMBRE_OPORTUNIDAD_REQUERIDO',   isBlank(c.nombreOportunidad),             mapa, resultado);
  clasificarResultadoValidacion('CONTACTO_REQUERIDO',             isBlank(c.contacto),                      mapa, resultado);
  clasificarResultadoValidacion('TELEFONO_CORREO_REQUERIDO',      isBlank(c.telefono) && isBlank(c.correo), mapa, resultado);
  clasificarResultadoValidacion('RESPONSABLE_REQUERIDO',          isBlank(c.responsable),                   mapa, resultado);
  clasificarResultadoValidacion('UNIDAD_NEGOCIO_REQUERIDA',       isBlank(c.unidadNegocio),                 mapa, resultado);
  clasificarResultadoValidacion('URGENCIA_REQUERIDA',             isBlank(c.urgencia),                      mapa, resultado);
  clasificarResultadoValidacion('TIPO_USO_REQUERIDO',             isBlank(c.tipoUso),                       mapa, resultado);
  clasificarResultadoValidacion('SOPORTE_TECNICO_REQUERIDO',      isMissingBoolean(c.necesidadSoporteTecnico), mapa, resultado);
  clasificarResultadoValidacion('LINEA_PRODUCTO_REQUERIDA',       isBlank(c.lineaProducto),                 mapa, resultado);
  clasificarResultadoValidacion('PRODUCTO_REQUERIDO',             isMissingNumber(c.productoId),            mapa, resultado);
  clasificarResultadoValidacion('CANTIDAD_ESTIMADA_REQUERIDA',    isMissingPositiveNumber(c.cantidadEstimada), mapa, resultado);
  clasificarResultadoValidacion('MONTO_ESTIMADO_REQUERIDO',       isMissingPositiveNumber(c.montoEstimado), mapa, resultado);
  clasificarResultadoValidacion('ALTERNATIVA_PRODUCTO_REQUERIDA', isBlank(c.alternativaProducto),           mapa, resultado);
  clasificarResultadoValidacion('COMISION_REQUERIDA',             isMissingNumber(c.comision),              mapa, resultado);
  clasificarResultadoValidacion('MARGEN_ESTIMADO_REQUERIDO',      isMissingNumber(c.margenEstimado),        mapa, resultado);
  clasificarResultadoValidacion('FECHA_COMPROMETIDA_ENVIO_REQUERIDA', isBlank(c.fechaComprometidaEnvio),    mapa, resultado);
  clasificarResultadoValidacion('VERSION_COTIZACION_REQUERIDA',   isBlank(c.versionCotizacion),             mapa, resultado);
  clasificarResultadoValidacion('COMENTARIOS_CLIENTE_REQUERIDO',  isBlank(c.comentariosCliente),            mapa, resultado);
  clasificarResultadoValidacion('OBJECIONES_REQUERIDAS',          isBlank(c.objeciones),                    mapa, resultado);
  clasificarResultadoValidacion('COTIZACION_VINCULADA_REQUERIDA', isMissingNumber(c.cotizacionId),          mapa, resultado);
  clasificarResultadoValidacion('ORDEN_COMPRA_REQUERIDA',         isBlank(c.ordenCompra),                   mapa, resultado);
  clasificarResultadoValidacion('CORREO_ACEPTACION_REQUERIDO',    isBlank(c.correoAceptacion),              mapa, resultado);
  clasificarResultadoValidacion('CONDICIONES_COMERCIALES_REQUERIDAS', isBlank(c.condicionesComerciales),    mapa, resultado);
  clasificarResultadoValidacion('COORDINACION_ADMINISTRATIVA_REQUERIDA', isBlank(c.coordinacionAdministrativa), mapa, resultado);
  clasificarResultadoValidacion('ESTADO_DOCUMENTACION_REQUERIDO', isBlank(c.estadoDocumentacion),           mapa, resultado);
  clasificarResultadoValidacion('TRASPASO_ADMINISTRACION_REQUERIDO', isMissingBoolean(c.traspasoAdministracion), mapa, resultado);
  clasificarResultadoValidacion('TRASPASO_ERP_REQUERIDO',         isMissingBoolean(c.traspasoERP),          mapa, resultado);
  clasificarResultadoValidacion('COORDINACION_DESPACHO_REQUERIDA', isBlank(c.coordinacionDespacho),         mapa, resultado);
  clasificarResultadoValidacion('ESTADO_COMERCIAL_ORDEN_REQUERIDO', isBlank(c.estadoComercialOrden),        mapa, resultado);
  clasificarResultadoValidacion('ESTADO_DOCUMENTACION_VENTA_REQUERIDO', isBlank(c.estadoDocumentacionVenta), mapa, resultado);
  clasificarResultadoValidacion('TIPO_BROKER_REQUERIDO',          isBlank(c.tipoBroker),                    mapa, resultado);
  clasificarResultadoValidacion('FECHA_ESTIMADA_DESPACHO_REQUERIDA', isBlank(c.fechaEstimadaDespacho),      mapa, resultado);
  clasificarResultadoValidacion('FECHA_SEGUIMIENTO_POSTVENTA_REQUERIDA', isBlank(c.fechaSeguimientoPostventa), mapa, resultado);
  clasificarResultadoValidacion('PROXIMA_ACCION_REQUERIDA',       isBlank(c.proximaAccion),                 mapa, resultado);
  clasificarResultadoValidacion('FECHA_PROXIMA_ACCION_REQUERIDA', isBlank(c.fechaProximaAccion),            mapa, resultado);

  // Checks de cierre: se evalúan contra el mapa de la etapa destino
  if (etapaDestino === 'GANADA') {
    clasificarResultadoValidacion('GANADA_DOCUMENTO_RESPALDO',          isBlank(c.documentoRespaldo), mapaDestino, resultado);
    clasificarResultadoValidacion('GANADA_FLUJO_POSTERIOR_REQUERIDO',   isBlank(c.flujoPosterior),    mapaDestino, resultado);
  }
  if (etapaDestino === 'PERDIDA') {
    clasificarResultadoValidacion('PERDIDA_MOTIVO_REQUERIDO', isBlank(c.motivoPerdida), mapaDestino, resultado);
    // PERDIDA_ETAPA_REQUERIDA: etapaPerdida no existe aún en el modelo Firemat
  }
  if (etapaDestino === 'POSTERGADA') {
    clasificarResultadoValidacion('POSTERGADA_MOTIVO_REQUERIDO',             isBlank(c.motivoPostergacion), mapaDestino, resultado);
    clasificarResultadoValidacion('POSTERGADA_FECHA_REACTIVACION_REQUERIDA', isBlank(c.fechaReactivacion),  mapaDestino, resultado);
  }
  if (etapaDestino === 'DESCARTADO') {
    clasificarResultadoValidacion('DESCARTADA_MOTIVO_REQUERIDO', isBlank(c.motivoDescarte), mapaDestino, resultado);
  }

  return {
    ...construirResultadoValidacion(resultado.bloqueos, resultado.advertencias),
    reglasCargadas: [
      ...new Set([
        ...Array.from(mapa.keys()),
        ...(mapaDestino === mapa ? [] : Array.from(mapaDestino.keys())),
      ]),
    ].sort(),
  };
}

const snapshotDesdeBody = (body: Record<string, unknown>): CamposSnapshotFiremat => ({
  cliente:             getString(body.cliente),
  rutEmpresa:          getNullableString(body.rutEmpresa),
  nombreOportunidad:   getNullableString(body.nombreOportunidad),
  contacto:            getNullableString(body.contacto),
  telefono:            getNullableString(body.telefono),
  correo:              getNullableString(body.correo),
  responsable:         getNullableString(body.responsable),
  unidadNegocio:       getNullableString(body.unidadNegocio),
  urgencia:            getNullableString(body.urgencia),
  tipoUso:             getNullableString(body.tipoUso),
  necesidadSoporteTecnico:
    typeof body.necesidadSoporteTecnico === 'boolean' ? body.necesidadSoporteTecnico : null,
  lineaProducto:       getNullableString(body.lineaProducto),
  productoId:          getInt(body.productoId),
  cantidadEstimada:    getInt(body.cantidadEstimada),
  montoEstimado:       getNumber(body.montoEstimado),
  alternativaProducto: getNullableString(body.alternativaProducto),
  comision:            getNumber(body.comision),
  margenEstimado:      getNumber(body.margenEstimado),
  fechaComprometidaEnvio: getDate(body.fechaComprometidaEnvio),
  versionCotizacion:   getNullableString(body.versionCotizacion),
  comentariosCliente:  getNullableString(body.comentariosCliente),
  objeciones:          getNullableString(body.objeciones),
  cotizacionId:        getInt(body.cotizacionId),
  ordenCompra:         getNullableString(body.ordenCompra),
  correoAceptacion:    getNullableString(body.correoAceptacion),
  condicionesComerciales: getNullableString(body.condicionesComerciales),
  coordinacionAdministrativa: getNullableString(body.coordinacionAdministrativa),
  estadoDocumentacion: getNullableString(body.estadoDocumentacion),
  traspasoAdministracion:
    typeof body.traspasoAdministracion === 'boolean' ? body.traspasoAdministracion : null,
  traspasoERP:         typeof body.traspasoERP === 'boolean' ? body.traspasoERP : null,
  coordinacionDespacho: getNullableString(body.coordinacionDespacho),
  estadoComercialOrden: getNullableString(body.estadoComercialOrden),
  estadoDocumentacionVenta: getNullableString(body.estadoDocumentacionVenta),
  tipoBroker:          getNullableString(body.tipoBroker),
  fechaEstimadaDespacho: getDate(body.fechaEstimadaDespacho),
  fechaSeguimientoPostventa: getDate(body.fechaSeguimientoPostventa),
  proximaAccion:       getNullableString(body.proximaAccion),
  fechaProximaAccion:  getDate(body.fechaProximaAccion),
  documentoRespaldo:   getNullableString(body.documentoRespaldo),
  flujoPosterior:      getNullableString(body.flujoPosterior),
  motivoPerdida:       getNullableString(body.motivoPerdida),
  motivoPostergacion:  getNullableString(body.motivoPostergacion),
  fechaReactivacion:   getDate(body.fechaReactivacion),
  motivoDescarte:      getNullableString(body.motivoDescarte),
});

const snapshotDesdeCurrent = (
  current: Prisma.FunnelFirematOpportunityGetPayload<Record<string, never>>,
  body: Record<string, unknown>
): CamposSnapshotFiremat => ({
  cliente:            hasOwn(body, 'cliente')            ? getString(body.cliente)            : current.cliente,
  rutEmpresa:         hasOwn(body, 'rutEmpresa')         ? getNullableString(body.rutEmpresa)         : current.rutEmpresa,
  nombreOportunidad:  hasOwn(body, 'nombreOportunidad')  ? getNullableString(body.nombreOportunidad)  : current.nombreOportunidad,
  contacto:           hasOwn(body, 'contacto')           ? getNullableString(body.contacto)           : current.contacto,
  telefono:           hasOwn(body, 'telefono')           ? getNullableString(body.telefono)           : current.telefono,
  correo:             hasOwn(body, 'correo')             ? getNullableString(body.correo)             : current.correo,
  responsable:        hasOwn(body, 'responsable')        ? getNullableString(body.responsable)        : current.responsable,
  unidadNegocio:      hasOwn(body, 'unidadNegocio')      ? getNullableString(body.unidadNegocio)      : current.unidadNegocio,
  urgencia:           hasOwn(body, 'urgencia')           ? getNullableString(body.urgencia)           : current.urgencia,
  tipoUso:            hasOwn(body, 'tipoUso')            ? getNullableString(body.tipoUso)            : current.tipoUso,
  necesidadSoporteTecnico: hasOwn(body, 'necesidadSoporteTecnico')
    ? (typeof body.necesidadSoporteTecnico === 'boolean' ? body.necesidadSoporteTecnico : null)
    : current.necesidadSoporteTecnico,
  lineaProducto:      hasOwn(body, 'lineaProducto')      ? getNullableString(body.lineaProducto)      : current.lineaProducto,
  productoId:         hasOwn(body, 'productoId')         ? getInt(body.productoId)                    : current.productoId,
  cantidadEstimada:   hasOwn(body, 'cantidadEstimada')   ? getInt(body.cantidadEstimada)              : current.cantidadEstimada,
  montoEstimado:      hasOwn(body, 'montoEstimado')      ? getNumber(body.montoEstimado)              : current.montoEstimado,
  alternativaProducto: hasOwn(body, 'alternativaProducto') ? getNullableString(body.alternativaProducto) : current.alternativaProducto,
  comision:           hasOwn(body, 'comision')           ? getNumber(body.comision)                   : current.comision,
  margenEstimado:     hasOwn(body, 'margenEstimado')     ? getNumber(body.margenEstimado)             : current.margenEstimado,
  fechaComprometidaEnvio: hasOwn(body, 'fechaComprometidaEnvio') ? getDate(body.fechaComprometidaEnvio) : current.fechaComprometidaEnvio,
  versionCotizacion:  hasOwn(body, 'versionCotizacion')  ? getNullableString(body.versionCotizacion)  : current.versionCotizacion,
  comentariosCliente: hasOwn(body, 'comentariosCliente') ? getNullableString(body.comentariosCliente) : current.comentariosCliente,
  objeciones:         hasOwn(body, 'objeciones')         ? getNullableString(body.objeciones)         : current.objeciones,
  cotizacionId:       hasOwn(body, 'cotizacionId')       ? getInt(body.cotizacionId)                  : current.cotizacionId,
  ordenCompra:        hasOwn(body, 'ordenCompra')        ? getNullableString(body.ordenCompra)        : current.ordenCompra,
  correoAceptacion:   hasOwn(body, 'correoAceptacion')   ? getNullableString(body.correoAceptacion)   : current.correoAceptacion,
  condicionesComerciales: hasOwn(body, 'condicionesComerciales') ? getNullableString(body.condicionesComerciales) : current.condicionesComerciales,
  coordinacionAdministrativa: hasOwn(body, 'coordinacionAdministrativa') ? getNullableString(body.coordinacionAdministrativa) : current.coordinacionAdministrativa,
  estadoDocumentacion: hasOwn(body, 'estadoDocumentacion') ? getNullableString(body.estadoDocumentacion) : current.estadoDocumentacion,
  traspasoAdministracion: hasOwn(body, 'traspasoAdministracion')
    ? (typeof body.traspasoAdministracion === 'boolean' ? body.traspasoAdministracion : null)
    : current.traspasoAdministracion,
  traspasoERP:        hasOwn(body, 'traspasoERP')
    ? (typeof body.traspasoERP === 'boolean' ? body.traspasoERP : null)
    : current.traspasoERP,
  coordinacionDespacho: hasOwn(body, 'coordinacionDespacho') ? getNullableString(body.coordinacionDespacho) : current.coordinacionDespacho,
  estadoComercialOrden: hasOwn(body, 'estadoComercialOrden') ? getNullableString(body.estadoComercialOrden) : current.estadoComercialOrden,
  estadoDocumentacionVenta: hasOwn(body, 'estadoDocumentacionVenta') ? getNullableString(body.estadoDocumentacionVenta) : current.estadoDocumentacionVenta,
  tipoBroker:         hasOwn(body, 'tipoBroker')         ? getNullableString(body.tipoBroker)         : current.tipoBroker,
  fechaEstimadaDespacho: hasOwn(body, 'fechaEstimadaDespacho') ? getDate(body.fechaEstimadaDespacho) : current.fechaEstimadaDespacho,
  fechaSeguimientoPostventa: hasOwn(body, 'fechaSeguimientoPostventa') ? getDate(body.fechaSeguimientoPostventa) : current.fechaSeguimientoPostventa,
  proximaAccion:      hasOwn(body, 'proximaAccion')      ? getNullableString(body.proximaAccion)      : current.proximaAccion,
  fechaProximaAccion: hasOwn(body, 'fechaProximaAccion') ? getDate(body.fechaProximaAccion)           : current.fechaProximaAccion,
  documentoRespaldo:  hasOwn(body, 'documentoRespaldo')  ? getNullableString(body.documentoRespaldo)  : current.documentoRespaldo,
  flujoPosterior:     hasOwn(body, 'flujoPosterior')     ? getNullableString(body.flujoPosterior)     : current.flujoPosterior,
  motivoPerdida:      hasOwn(body, 'motivoPerdida')      ? getNullableString(body.motivoPerdida)      : current.motivoPerdida,
  motivoPostergacion: hasOwn(body, 'motivoPostergacion') ? getNullableString(body.motivoPostergacion) : current.motivoPostergacion,
  fechaReactivacion:  hasOwn(body, 'fechaReactivacion')  ? getDate(body.fechaReactivacion)            : current.fechaReactivacion,
  motivoDescarte:     hasOwn(body, 'motivoDescarte')     ? getNullableString(body.motivoDescarte)     : current.motivoDescarte,
});

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof MotivoInvalidoError) {
    res.status(400).json({ success: false, error: 'Motivo inválido', detalles: error.detalles });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
    return;
  }

  console.error('Error en Funnel Firemat:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

function validarMotivosEnBody(body: Record<string, unknown>): void {
  const motivoPerdida = typeof body.motivoPerdida === 'string' ? body.motivoPerdida : null;
  if (motivoPerdida && !validarMotivoCierre('PERDIDA', motivoPerdida)) {
    throw new MotivoInvalidoError([
      'El motivo de pérdida debe ser uno de los motivos predefinidos o usar formato Otro: detalle.',
    ]);
  }

  const motivoPostergacion = typeof body.motivoPostergacion === 'string' ? body.motivoPostergacion : null;
  if (motivoPostergacion && !validarMotivoCierre('POSTERGACION', motivoPostergacion)) {
    throw new MotivoInvalidoError([
      'El motivo de postergación debe ser uno de los motivos predefinidos o usar formato Otro: detalle.',
    ]);
  }

  const motivoDescarte = typeof body.motivoDescarte === 'string' ? body.motivoDescarte : null;
  if (motivoDescarte && !validarMotivoCierre('DESCARTE', motivoDescarte)) {
    throw new MotivoInvalidoError([
      'El motivo de descarte debe ser uno de los motivos predefinidos o usar formato Otro: detalle.',
    ]);
  }
}

interface RegistrarCambioEtapaParams {
  tx: Prisma.TransactionClient;
  oportunidadId: number;
  etapaAnterior: string | null;
  etapaNueva: string;
  usuarioId: string | null;
}

const registrarCambioEtapaFiremat = async ({
  tx,
  oportunidadId,
  etapaAnterior,
  etapaNueva,
  usuarioId,
}: RegistrarCambioEtapaParams): Promise<void> => {
  await tx.historialEtapaFiremat.create({
    data: { oportunidadId, etapaAnterior, etapaNueva, usuarioId },
  });
};

const assertLinkedRecordsExist = async (
  productoId: number | null,
  cotizacionId: number | null
): Promise<void> => {
  if (productoId !== null) {
    const producto = await firematPrisma.producto.findUnique({
      where: { id: productoId },
      select: { id: true },
    });
    if (!producto) throw new ValidationError('productoId no existe');
  }

  if (cotizacionId !== null) {
    const cotizacion = await firematPrisma.cotizacionFiremat.findUnique({
      where: { id: cotizacionId },
      select: { id: true },
    });
    if (!cotizacion) throw new ValidationError('cotizacionId no existe');
  }
};

interface ClienteRegistradoSets {
  ruts: Set<string>;
  emails: Set<string>;
  telefonos: Set<string>;
}

const cargarClientesParaMatch = async (): Promise<ClienteRegistradoSets> => {
  const clientes = await firematPrisma.cliente.findMany({
    where: { activo: true },
    select: { rut: true, email: true, telefono: true },
  });
  return {
    ruts: new Set(clientes.map(c => c.rut).filter((r): r is string => r !== null)),
    emails: new Set(clientes.map(c => c.email?.toLowerCase()).filter((e): e is string => e !== null)),
    telefonos: new Set(clientes.map(c => c.telefono).filter((t): t is string => t !== null)),
  };
};

const esClienteRegistrado = (
  o: { rutEmpresa: string | null; correo: string | null; telefono: string | null },
  sets: ClienteRegistradoSets
): boolean => {
  if (o.rutEmpresa && sets.ruts.has(o.rutEmpresa)) return true;
  if (o.correo && sets.emails.has(o.correo.toLowerCase())) return true;
  if (o.telefono && sets.telefonos.has(o.telefono)) return true;
  return false;
};

const buildCreateData = (body: Record<string, unknown>): Prisma.FunnelFirematOpportunityUncheckedCreateInput => {
  const etapa = parseEtapa(body.etapa) ?? 'PROSPECTO';
  const cliente = getString(body.cliente);
  const montoEstimado = getNumber(body.montoEstimado) ?? 0;
  const responsable = getNullableString(body.responsable);
  const documentoRespaldo = getNullableString(body.documentoRespaldo);
  const motivoPerdida = getNullableString(body.motivoPerdida);
  const motivoPostergacion = getNullableString(body.motivoPostergacion);
  const motivoDescarte = getNullableString(body.motivoDescarte);
  const fechaReactivacion = getDate(body.fechaReactivacion);
  const proximaAccion = getNullableString(body.proximaAccion);
  const fechaProximaAccion = getDate(body.fechaProximaAccion);

  return {
    cliente: cliente ?? '',
    contacto: getNullableString(body.contacto),
    telefono: getNullableString(body.telefono),
    correo: getNullableString(body.correo),
    tipoCliente: getNullableString(body.tipoCliente),
    rutEmpresa: getNullableString(body.rutEmpresa),
    region: getNullableString(body.region),
    comuna: getNullableString(body.comuna),
    unidadNegocio: getNullableString(body.unidadNegocio),
    productoId: getInt(body.productoId),
    cantidadEstimada: getInt(body.cantidadEstimada),
    urgencia: getNullableString(body.urgencia),
    tipoUso: getNullableString(body.tipoUso),
    necesidadSoporteTecnico:
      typeof body.necesidadSoporteTecnico === 'boolean'
        ? body.necesidadSoporteTecnico
        : null,
    alternativaProducto: getNullableString(body.alternativaProducto),
    comision: getNumber(body.comision),
    margenEstimado: getNumber(body.margenEstimado),
    fechaComprometidaEnvio: getDate(body.fechaComprometidaEnvio),
    versionCotizacion: getNullableString(body.versionCotizacion),
    comentariosCliente: getNullableString(body.comentariosCliente),
    objeciones: getNullableString(body.objeciones),
    ordenCompra: getNullableString(body.ordenCompra),
    correoAceptacion: getNullableString(body.correoAceptacion),
    condicionesComerciales: getNullableString(body.condicionesComerciales),
    coordinacionAdministrativa: getNullableString(body.coordinacionAdministrativa),
    estadoDocumentacion: getNullableString(body.estadoDocumentacion),
    traspasoAdministracion:
      typeof body.traspasoAdministracion === 'boolean'
        ? body.traspasoAdministracion
        : null,
    traspasoERP:
      typeof body.traspasoERP === 'boolean'
        ? body.traspasoERP
        : null,
    coordinacionDespacho: getNullableString(body.coordinacionDespacho),
    estadoComercialOrden: getNullableString(body.estadoComercialOrden),
    estadoDocumentacionVenta: getNullableString(body.estadoDocumentacionVenta),
    flujoPosterior: getNullableString(body.flujoPosterior),
    motivoDescarte,
    tipoBroker: getNullableString(body.tipoBroker),
    fechaEstimadaDespacho: getDate(body.fechaEstimadaDespacho),
    fechaSeguimientoPostventa: getDate(body.fechaSeguimientoPostventa),
    responsable,
    etapa,
    montoEstimado,
    probabilidadCierre: getInt(body.probabilidadCierre),
    proximaAccion,
    fechaProximaAccion,
    observaciones: getNullableString(body.observaciones),
    origen: getNullableString(body.origen),
    estadoStock: getNullableString(body.estadoStock),
    lineaProducto: getNullableString(body.lineaProducto),
    descuento: getNumber(body.descuento),
    stockOportunidad: getNullableString(body.stockOportunidad),
    cotizacionId: getInt(body.cotizacionId),
    motivoPerdida,
    motivoPostergacion,
    fechaReactivacion,
    documentoRespaldo,
    fechaCierre: etapa === 'GANADA' ? new Date() : getDate(body.fechaCierre),
    nombreOportunidad: getNullableString(body.nombreOportunidad),
    cargoContacto: getNullableString(body.cargoContacto),
    direccionProyecto: getNullableString(body.direccionProyecto),
    tipoOportunidad: getNullableString(body.tipoOportunidad),
    fechaProbableCierre: getDate(body.fechaProbableCierre),
    riesgoTecnico: getNullableString(body.riesgoTecnico),
    comentariosInternos: getNullableString(body.comentariosInternos),
    observacionesTecnicas: getNullableString(body.observacionesTecnicas),
    observacionCamposFaltantes: getNullableString(body.observacionCamposFaltantes),
    esReactivacion: typeof body.esReactivacion === 'boolean' ? body.esReactivacion : false,
  };
};

const buildUpdateData = (
  current: Prisma.FunnelFirematOpportunityGetPayload<Record<string, never>>,
  body: Record<string, unknown>
): Prisma.FunnelFirematOpportunityUncheckedUpdateInput => {
  const etapa = hasOwn(body, 'etapa') ? parseEtapa(body.etapa) : (current.etapa as EtapaFunnelFiremat);
  if (!etapa) {
    throw new ValidationError(`etapa debe ser una de: ${ETAPAS_PERMITIDAS.join(', ')}`);
  }

  const cliente = hasOwn(body, 'cliente') ? getString(body.cliente) : current.cliente;
  const montoEstimado = hasOwn(body, 'montoEstimado')
    ? getNumber(body.montoEstimado)
    : current.montoEstimado;
  const responsable = hasOwn(body, 'responsable')
    ? getNullableString(body.responsable)
    : current.responsable;
  const documentoRespaldo = hasOwn(body, 'documentoRespaldo')
    ? getNullableString(body.documentoRespaldo)
    : current.documentoRespaldo;
  const motivoPerdida = hasOwn(body, 'motivoPerdida')
    ? getNullableString(body.motivoPerdida)
    : current.motivoPerdida;
  const motivoPostergacion = hasOwn(body, 'motivoPostergacion')
    ? getNullableString(body.motivoPostergacion)
    : current.motivoPostergacion;
  const motivoDescarte = hasOwn(body, 'motivoDescarte')
    ? getNullableString(body.motivoDescarte)
    : current.motivoDescarte;
  const fechaReactivacion = hasOwn(body, 'fechaReactivacion')
    ? getDate(body.fechaReactivacion)
    : current.fechaReactivacion;
  const proximaAccion = hasOwn(body, 'proximaAccion')
    ? getNullableString(body.proximaAccion)
    : current.proximaAccion;
  const fechaProximaAccion = hasOwn(body, 'fechaProximaAccion')
    ? getDate(body.fechaProximaAccion)
    : current.fechaProximaAccion;

  const data: Prisma.FunnelFirematOpportunityUncheckedUpdateInput = {};

  if (hasOwn(body, 'cliente')) data.cliente = cliente ?? '';
  if (hasOwn(body, 'contacto')) data.contacto = getNullableString(body.contacto);
  if (hasOwn(body, 'telefono')) data.telefono = getNullableString(body.telefono);
  if (hasOwn(body, 'correo')) data.correo = getNullableString(body.correo);
  if (hasOwn(body, 'tipoCliente')) data.tipoCliente = getNullableString(body.tipoCliente);
  if (hasOwn(body, 'rutEmpresa')) data.rutEmpresa = getNullableString(body.rutEmpresa);
  if (hasOwn(body, 'region')) data.region = getNullableString(body.region);
  if (hasOwn(body, 'comuna')) data.comuna = getNullableString(body.comuna);
  if (hasOwn(body, 'unidadNegocio')) data.unidadNegocio = getNullableString(body.unidadNegocio);
  if (hasOwn(body, 'productoId')) data.productoId = getInt(body.productoId);
  if (hasOwn(body, 'cantidadEstimada')) data.cantidadEstimada = getInt(body.cantidadEstimada);
  if (hasOwn(body, 'urgencia')) data.urgencia = getNullableString(body.urgencia);
  if (hasOwn(body, 'tipoUso')) data.tipoUso = getNullableString(body.tipoUso);
  if (hasOwn(body, 'necesidadSoporteTecnico')) {
    data.necesidadSoporteTecnico =
      typeof body.necesidadSoporteTecnico === 'boolean'
        ? body.necesidadSoporteTecnico
        : null;
  }
  if (hasOwn(body, 'alternativaProducto')) {
    data.alternativaProducto = getNullableString(body.alternativaProducto);
  }
  if (hasOwn(body, 'comision')) {
    data.comision = getNumber(body.comision);
  }
  if (hasOwn(body, 'margenEstimado')) {
    data.margenEstimado = getNumber(body.margenEstimado);
  }
  if (hasOwn(body, 'fechaComprometidaEnvio')) {
    data.fechaComprometidaEnvio = getDate(body.fechaComprometidaEnvio);
  }
  if (hasOwn(body, 'versionCotizacion')) {
    data.versionCotizacion = getNullableString(body.versionCotizacion);
  }
  if (hasOwn(body, 'comentariosCliente')) {
    data.comentariosCliente = getNullableString(body.comentariosCliente);
  }
  if (hasOwn(body, 'objeciones')) {
    data.objeciones = getNullableString(body.objeciones);
  }
  if (hasOwn(body, 'ordenCompra')) {
    data.ordenCompra = getNullableString(body.ordenCompra);
  }
  if (hasOwn(body, 'correoAceptacion')) {
    data.correoAceptacion = getNullableString(body.correoAceptacion);
  }
  if (hasOwn(body, 'condicionesComerciales')) {
    data.condicionesComerciales = getNullableString(body.condicionesComerciales);
  }
  if (hasOwn(body, 'coordinacionAdministrativa')) {
    data.coordinacionAdministrativa = getNullableString(body.coordinacionAdministrativa);
  }
  if (hasOwn(body, 'estadoDocumentacion')) {
    data.estadoDocumentacion = getNullableString(body.estadoDocumentacion);
  }
  if (hasOwn(body, 'traspasoAdministracion')) {
    data.traspasoAdministracion =
      typeof body.traspasoAdministracion === 'boolean'
        ? body.traspasoAdministracion
        : null;
  }
  if (hasOwn(body, 'traspasoERP')) {
    data.traspasoERP =
      typeof body.traspasoERP === 'boolean'
        ? body.traspasoERP
        : null;
  }
  if (hasOwn(body, 'coordinacionDespacho')) {
    data.coordinacionDespacho = getNullableString(body.coordinacionDespacho);
  }
  if (hasOwn(body, 'estadoComercialOrden')) {
    data.estadoComercialOrden = getNullableString(body.estadoComercialOrden);
  }
  if (hasOwn(body, 'estadoDocumentacionVenta')) {
    data.estadoDocumentacionVenta = getNullableString(body.estadoDocumentacionVenta);
  }
  if (hasOwn(body, 'flujoPosterior')) {
    data.flujoPosterior = getNullableString(body.flujoPosterior);
  }
  if (hasOwn(body, 'motivoDescarte')) {
    data.motivoDescarte = motivoDescarte;
  }
  if (hasOwn(body, 'tipoBroker')) {
    data.tipoBroker = getNullableString(body.tipoBroker);
  }
  if (hasOwn(body, 'fechaEstimadaDespacho')) {
    data.fechaEstimadaDespacho = getDate(body.fechaEstimadaDespacho);
  }
  if (hasOwn(body, 'fechaSeguimientoPostventa')) {
    data.fechaSeguimientoPostventa = getDate(body.fechaSeguimientoPostventa);
  }
  if (hasOwn(body, 'responsable')) data.responsable = responsable;
  if (hasOwn(body, 'etapa')) data.etapa = etapa;
  if (hasOwn(body, 'montoEstimado')) data.montoEstimado = montoEstimado ?? 0;
  if (hasOwn(body, 'probabilidadCierre')) data.probabilidadCierre = getInt(body.probabilidadCierre);
  if (hasOwn(body, 'proximaAccion')) data.proximaAccion = proximaAccion;
  if (hasOwn(body, 'fechaProximaAccion')) {
    data.fechaProximaAccion = fechaProximaAccion;
    // Incrementar cuando se reprograma: anterior fecha → nueva fecha distinta (no null→fecha ni fecha→null)
    if (
      current.fechaProximaAccion !== null &&
      fechaProximaAccion !== null &&
      !isSameCalendarDay(current.fechaProximaAccion, fechaProximaAccion)
    ) {
      data.reprogramacionesCount = { increment: 1 };
    }
  }
  if (hasOwn(body, 'observaciones')) data.observaciones = getNullableString(body.observaciones);
  if (hasOwn(body, 'origen')) data.origen = getNullableString(body.origen);
  if (hasOwn(body, 'estadoStock')) data.estadoStock = getNullableString(body.estadoStock);
  if (hasOwn(body, 'cotizacionId')) data.cotizacionId = getInt(body.cotizacionId);
  if (hasOwn(body, 'motivoPerdida')) data.motivoPerdida = motivoPerdida;
  if (hasOwn(body, 'motivoPostergacion')) data.motivoPostergacion = motivoPostergacion;
  if (hasOwn(body, 'fechaReactivacion')) data.fechaReactivacion = fechaReactivacion;
  if (hasOwn(body, 'documentoRespaldo')) data.documentoRespaldo = documentoRespaldo;
  if (etapa === 'GANADA' && current.etapa !== 'GANADA') data.fechaCierre = new Date();
  if (hasOwn(body, 'fechaCierre')) data.fechaCierre = getDate(body.fechaCierre);
  if (hasOwn(body, 'nombreOportunidad')) data.nombreOportunidad = getNullableString(body.nombreOportunidad);
  if (hasOwn(body, 'cargoContacto')) data.cargoContacto = getNullableString(body.cargoContacto);
  if (hasOwn(body, 'direccionProyecto')) data.direccionProyecto = getNullableString(body.direccionProyecto);
  if (hasOwn(body, 'tipoOportunidad')) data.tipoOportunidad = getNullableString(body.tipoOportunidad);
  if (hasOwn(body, 'fechaProbableCierre')) data.fechaProbableCierre = getDate(body.fechaProbableCierre);
  if (hasOwn(body, 'riesgoTecnico')) data.riesgoTecnico = getNullableString(body.riesgoTecnico);
  if (hasOwn(body, 'comentariosInternos')) data.comentariosInternos = getNullableString(body.comentariosInternos);
  if (hasOwn(body, 'observacionesTecnicas')) data.observacionesTecnicas = getNullableString(body.observacionesTecnicas);
  if (hasOwn(body, 'observacionCamposFaltantes')) data.observacionCamposFaltantes = getNullableString(body.observacionCamposFaltantes);
  if (hasOwn(body, 'lineaProducto')) data.lineaProducto = getNullableString(body.lineaProducto);
  if (hasOwn(body, 'descuento')) data.descuento = getNumber(body.descuento);
  if (hasOwn(body, 'stockOportunidad')) data.stockOportunidad = getNullableString(body.stockOportunidad);
  if (hasOwn(body, 'esReactivacion')) {
    data.esReactivacion = typeof body.esReactivacion === 'boolean' ? body.esReactivacion : false;
  }

  return data;
};

export const getFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, etapa, responsable, cliente, cotizacionId } = req.query;
    const where: Prisma.FunnelFirematOpportunityWhereInput = {};

    if (typeof etapa === 'string' && etapa.trim()) {
      where.etapa = etapa.trim();
    }
    if (typeof responsable === 'string' && responsable.trim()) {
      where.responsable = { contains: responsable.trim(), mode: 'insensitive' };
    }
    if (typeof cliente === 'string' && cliente.trim()) {
      where.cliente = { contains: cliente.trim(), mode: 'insensitive' };
    }
    if (typeof cotizacionId === 'string' && cotizacionId.trim()) {
      const id = getInt(cotizacionId);
      if (id !== null) where.cotizacionId = id;
    }
    if (typeof q === 'string' && q.trim()) {
      const term = q.trim();
      where.OR = [
        { cliente: { contains: term, mode: 'insensitive' } },
        { contacto: { contains: term, mode: 'insensitive' } },
        { responsable: { contains: term, mode: 'insensitive' } },
        { producto: { nombre: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const data = await firematPrisma.funnelFirematOpportunity.findMany({
      where,
      include: funnelInclude,
      orderBy: { updatedAt: 'desc' },
    });

    const resumen = {
      totalOportunidades: data.length,
      pipelineTotal: data
        .filter((o) => !ETAPAS_CERRADAS.has(o.etapa))
        .reduce((sum, o) => sum + o.montoEstimado, 0),
      ganadas: data.filter((o) => o.etapa === 'GANADA').length,
      perdidas: data.filter((o) => o.etapa === 'PERDIDA').length,
      postergadas: data.filter((o) => o.etapa === 'POSTERGADA').length,
      cotizacionesVinculadas: data.filter((o) => o.cotizacionId !== null).length,
    };

    const clienteSets = await cargarClientesParaMatch();
    const dataConFlag = data.map(o => ({ ...o, clienteRegistrado: esClienteRegistrado(o, clienteSets) }));
    res.json({ success: true, data: dataConFlag, resumen });
  } catch (error) {
    handleError(res, error);
  }
};

export const getFunnelFirematById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const data = await firematPrisma.funnelFirematOpportunity.findUnique({
      where: { id },
      include: funnelInclude,
    });

    if (!data) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const clienteSets = await cargarClientesParaMatch();
    res.json({ success: true, data: { ...data, clienteRegistrado: esClienteRegistrado(data, clienteSets) } });
  } catch (error) {
    handleError(res, error);
  }
};

export const createFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    validarMotivosEnBody(body);
    const etapa = parseEtapa(body.etapa) ?? 'PROSPECTO';
    const montoEstimado = getNumber(body.montoEstimado) ?? 0;

    validateStructuralConstraints(etapa, montoEstimado);

    const snapshot = snapshotDesdeBody(body);
    // Al crear, no hay etapa previa; etapaParaReglas = etapaDestino = etapa inicial
    const observacionCrear = getNullableString(body.observacionCamposFaltantes);
    let advertenciasCrear: string[] = [];
    if (!observacionCrear) {
      const validacion = await ejecutarValidacionDinamicaFiremat(etapa, etapa, snapshot);

      if (!validacion.puedeAvanzar) {
        res.status(409).json({
          message: 'Existen reglas bloqueantes pendientes.',
          bloqueos: validacion.bloqueos,
          advertencias: validacion.advertencias,
          puedeAvanzar: false,
          advertenciasCamposCriticos: validacion.bloqueos,
          requiereObservacionCamposFaltantes: true,
        });
        return;
      }
      advertenciasCrear = validacion.advertencias;
    }

    const dataInput = buildCreateData(body);

    await assertLinkedRecordsExist(
      typeof dataInput.productoId === 'number' ? dataInput.productoId : null,
      typeof dataInput.cotizacionId === 'number' ? dataInput.cotizacionId : null
    );

    const data = await firematPrisma.$transaction(async (tx) => {
      const created = await tx.funnelFirematOpportunity.create({
        data: { ...dataInput, fechaUltimoCambioEtapa: new Date() },
        include: funnelInclude,
      });
      await registrarCambioEtapaFiremat({
        tx,
        oportunidadId: created.id,
        etapaAnterior: null,
        etapaNueva: created.etapa,
        usuarioId: req.userId ?? null,
      });
      return created;
    });

    const clienteSets = await cargarClientesParaMatch();
    res.status(201).json({
      success: true,
      data: { ...data, clienteRegistrado: esClienteRegistrado(data, clienteSets) },
      message: 'Oportunidad Firemat creada',
      advertencias: advertenciasCrear,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const current = await firematPrisma.funnelFirematOpportunity.findUnique({ where: { id } });
    if (!current) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    validarMotivosEnBody(body);

    // Check permission if cliente is changing
    if (req.userId && req.userRole && req.userRole !== 'administrador' && hasOwn(body, 'cliente')) {
      const nuevoCliente = getString(body.cliente);
      if (nuevoCliente !== current.cliente) {
        const puede = await puedeCambiarEmpresa(req.userId, req.userRole, 'firemat');
        if (!puede) {
          res.status(403).json({ success: false, error: 'No tienes permiso para cambiar la empresa o cliente asociado.' });
          return;
        }
      }
    }

    const dataInput = buildUpdateData(current, body);

    await assertLinkedRecordsExist(
      hasOwn(body, 'productoId') ? getInt(body.productoId) : null,
      hasOwn(body, 'cotizacionId') ? getInt(body.cotizacionId) : null
    );

    const nuevaEtapa = hasOwn(body, 'etapa') ? parseEtapa(body.etapa) : null;
    let advertenciasUpdate: string[] = [];
    if (nuevaEtapa !== null && nuevaEtapa !== current.etapa) {
      const idxActualUpd  = ETAPAS_PERMITIDAS.indexOf(current.etapa as typeof ETAPAS_PERMITIDAS[number]);
      const idxDestinoUpd = ETAPAS_PERMITIDAS.indexOf(nuevaEtapa as typeof ETAPAS_PERMITIDAS[number]);
      const esRetrocesoUpd = idxActualUpd !== -1 && idxDestinoUpd !== -1 && idxDestinoUpd < idxActualUpd;

      if (!esRetrocesoUpd) {
        const observacionFinalUpd = hasOwn(body, 'observacionCamposFaltantes')
          ? getNullableString(body.observacionCamposFaltantes)
          : current.observacionCamposFaltantes;

        if (!observacionFinalUpd) {
          const snapshot = snapshotDesdeCurrent(current, body);
          const validacion = await ejecutarValidacionDinamicaFiremat(current.etapa, nuevaEtapa, snapshot);

          if (validacion.bloqueos.length > 0 || validacion.advertencias.length > 0) {
            res.status(409).json({
              success: false,
              message: 'Existen reglas de validacion pendientes.',
              bloqueos: validacion.bloqueos,
              advertencias: validacion.advertencias,
              puedeAvanzar: false,
              advertenciasCamposCriticos: validacion.bloqueos,
              requiereObservacionCamposFaltantes: true,
            });
            return;
          }

          advertenciasUpdate = validacion.advertencias;
        }
      }
    }

    const etapaCambio = nuevaEtapa !== null && nuevaEtapa !== current.etapa;
    if (etapaCambio) {
      dataInput.fechaUltimoCambioEtapa = new Date();
    }

    const data = await firematPrisma.$transaction(async (tx) => {
      const updated = await tx.funnelFirematOpportunity.update({
        where: { id },
        data: dataInput,
        include: funnelInclude,
      });
      if (etapaCambio && nuevaEtapa !== null) {
        await registrarCambioEtapaFiremat({
          tx,
          oportunidadId: id,
          etapaAnterior: current.etapa,
          etapaNueva: nuevaEtapa,
          usuarioId: req.userId ?? null,
        });
      }
      return updated;
    });

    const clienteSets = await cargarClientesParaMatch();
    res.json({
      success: true,
      data: { ...data, clienteRegistrado: esClienteRegistrado(data, clienteSets) },
      message: 'Oportunidad Firemat actualizada',
      advertencias: advertenciasUpdate,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchEtapaFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const etapa = parseEtapa((req.body as Record<string, unknown>).etapa);
    if (!etapa) {
      res.status(400).json({ success: false, error: `etapa debe ser una de: ${ETAPAS_PERMITIDAS.join(', ')}` });
      return;
    }

    const current = await firematPrisma.funnelFirematOpportunity.findUnique({ where: { id } });
    if (!current) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const body: Record<string, unknown> = { ...(req.body as Record<string, unknown>), etapa };
    validarMotivosEnBody(body);
    const dataInput = buildUpdateData(current, body);

    let advertenciasPatch: string[] = [];
    if (etapa !== current.etapa) {
      const idxActual  = ETAPAS_PERMITIDAS.indexOf(current.etapa as typeof ETAPAS_PERMITIDAS[number]);
      const idxDestino = ETAPAS_PERMITIDAS.indexOf(etapa as typeof ETAPAS_PERMITIDAS[number]);
      const esRetroceso = idxActual !== -1 && idxDestino !== -1 && idxDestino < idxActual;

      console.log("[VALIDACION ETAPA]", {
        modulo: "FIREMAT",
        etapaActual: current.etapa,
        etapaDestino: etapa,
        idxActual,
        idxDestino,
        esRetroceso,
        etapaUsadaParaValidar: esRetroceso ? "(omitido - retroceso)" : etapa,
      });

      if (!esRetroceso) {
        // Solo la observación enviada en este PATCH habilita el bypass.
        // No leer current.observacionCamposFaltantes: si ese campo tiene valor
        // guardado de antes, no debe evitar la validación en futuros avances.
        const observacionFinalPatch = hasOwn(body, 'observacionCamposFaltantes')
          ? getNullableString(body.observacionCamposFaltantes)
          : null;

        if (!observacionFinalPatch) {
          const currentRecord = current as unknown as Record<string, unknown>;
          console.log('[FIREMAT CAMPOS VALIDACION]', {
            id: current.id,
            etapa: current.etapa,
            nombreOportunidad: current.nombreOportunidad,
            empresa: currentRecord.empresa,
            clienteId: currentRecord.clienteId,
            clienteFirematId: currentRecord.clienteFirematId,
            cliente: current.cliente,
            rutEmpresa: current.rutEmpresa,
            contacto: current.contacto,
            nombreContacto: currentRecord.nombreContacto,
            telefono: current.telefono,
            correo: current.correo,
            email: currentRecord.email,
            responsable: current.responsable,
            vendedor: currentRecord.vendedor,
            unidadNegocio: current.unidadNegocio,
            proximaAccion: current.proximaAccion,
            fechaProximaAccion: current.fechaProximaAccion,
          });

          const snapshot = snapshotDesdeCurrent(current, body);
          const validacion = await ejecutarValidacionDinamicaFiremat(current.etapa, etapa, snapshot);

          console.log("[VALIDACION ETAPA RESULTADO]", {
            modulo: "FIREMAT",
            etapaActual: current.etapa,
            etapaDestino: etapa,
            etapaUsadaParaValidar: etapa,
            reglasCargadas: validacion.reglasCargadas,
            bloqueos: validacion.bloqueos,
            advertencias: validacion.advertencias,
            puedeAvanzar: validacion.puedeAvanzar,
            observacionCamposFaltantesBody: observacionFinalPatch,
          });

          if (validacion.bloqueos.length > 0 || validacion.advertencias.length > 0) {
            res.status(409).json({
              success: false,
              message: 'Existen reglas de validacion pendientes.',
              bloqueos: validacion.bloqueos,
              advertencias: validacion.advertencias,
              reglasCargadas: validacion.reglasCargadas,
              puedeAvanzar: false,
              advertenciasCamposCriticos: validacion.bloqueos,
              requiereObservacionCamposFaltantes: true,
            });
            return;
          }

          advertenciasPatch = validacion.advertencias;
        } else {
          console.log("[VALIDACION ETAPA OMITIDA]", {
            modulo: "FIREMAT",
            etapaActual: current.etapa,
            etapaDestino: etapa,
            razon: "observacionCamposFaltantes enviada en body — bypass autorizado",
          });
        }
      }
    }

    const etapaCambio = etapa !== current.etapa;
    if (etapaCambio) {
      dataInput.fechaUltimoCambioEtapa = new Date();
    }

    const data = await firematPrisma.$transaction(async (tx) => {
      const updated = await tx.funnelFirematOpportunity.update({
        where: { id },
        data: dataInput,
        include: funnelInclude,
      });
      if (etapaCambio) {
        await registrarCambioEtapaFiremat({
          tx,
          oportunidadId: id,
          etapaAnterior: current.etapa,
          etapaNueva: etapa,
          usuarioId: req.userId ?? null,
        });
      }
      return updated;
    });

    const clienteSets = await cargarClientesParaMatch();
    res.json({
      success: true,
      data: { ...data, clienteRegistrado: esClienteRegistrado(data, clienteSets) },
      message: 'Etapa actualizada',
      advertencias: advertenciasPatch,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    await firematPrisma.funnelFirematOpportunity.delete({ where: { id } });

    res.json({ success: true, message: 'Oportunidad Firemat eliminada' });
  } catch (error) {
    handleError(res, error);
  }
};

export const getHistorialEtapasFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID invalido' });
      return;
    }

    const oportunidad = await firematPrisma.funnelFirematOpportunity.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!oportunidad) {
      res.status(404).json({ success: false, error: 'Oportunidad no encontrada' });
      return;
    }

    const historial = await firematPrisma.historialEtapaFiremat.findMany({
      where: { oportunidadId: id },
      orderBy: { createdAt: 'asc' },
    });

    const usuarioIds = [
      ...new Set(historial.map(h => h.usuarioId).filter((uid): uid is string => uid !== null)),
    ];

    const usuariosMap = new Map<string, { nombre: string; email: string }>();
    if (usuarioIds.length > 0) {
      const usuarios = await prisma.usuario.findMany({
        where: { id: { in: usuarioIds } },
        select: { id: true, nombre: true, email: true },
      });
      for (const u of usuarios) {
        usuariosMap.set(u.id, { nombre: u.nombre, email: u.email });
      }
    }

    const data = historial.map(h => ({
      id: h.id,
      oportunidadId: h.oportunidadId,
      etapaAnterior: h.etapaAnterior,
      etapaNueva: h.etapaNueva,
      usuarioId: h.usuarioId,
      usuarioNombre: h.usuarioId ? (usuariosMap.get(h.usuarioId)?.nombre ?? null) : null,
      usuarioEmail: h.usuarioId ? (usuariosMap.get(h.usuarioId)?.email ?? null) : null,
      createdAt: h.createdAt.toISOString(),
    }));

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};
