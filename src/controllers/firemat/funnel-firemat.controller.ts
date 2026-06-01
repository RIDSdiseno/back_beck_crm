import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

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

const isActiva = (etapa: string): boolean => !ETAPAS_CERRADAS.has(etapa);

const validateOpportunityState = (data: {
  cliente: string | null;
  etapa: string;
  montoEstimado: number | null;
  responsable: string | null;
  documentoRespaldo: string | null;
  motivoPerdida: string | null;
  motivoPostergacion: string | null;
  motivoDescarte: string | null;
  fechaReactivacion: Date | null;
  fechaProximaAccion: Date | null;
}): void => {
  if (!data.cliente) {
    throw new ValidationError('cliente es obligatorio');
  }

  if (!ETAPAS_PERMITIDAS.includes(data.etapa as EtapaFunnelFiremat)) {
    throw new ValidationError(`etapa debe ser una de: ${ETAPAS_PERMITIDAS.join(', ')}`);
  }

  if (isActiva(data.etapa) && !data.fechaProximaAccion) {
    throw new ValidationError('fechaProximaAccion es obligatoria para oportunidades activas');
  }

  if (data.etapa === 'GANADA') {
    if (data.montoEstimado === null || data.montoEstimado <= 0) {
      throw new ValidationError('montoEstimado es obligatorio para oportunidades ganadas');
    }
    if (!data.responsable) {
      throw new ValidationError('responsable es obligatorio para oportunidades ganadas');
    }
    if (!data.documentoRespaldo) {
      throw new ValidationError('documentoRespaldo es obligatorio para oportunidades ganadas');
    }
  }

  if (data.etapa === 'PERDIDA' && !data.motivoPerdida) {
    throw new ValidationError('motivoPerdida es obligatorio para oportunidades perdidas');
  }

  if (data.etapa === 'POSTERGADA') {
    if (!data.motivoPostergacion) {
      throw new ValidationError('motivoPostergacion es obligatorio para oportunidades postergadas');
    }
    if (!data.fechaReactivacion) {
      throw new ValidationError('fechaReactivacion es obligatoria para oportunidades postergadas');
    }
  }

  if (data.etapa === 'DESCARTADO' && !data.motivoDescarte) {
    throw new ValidationError('motivoDescarte es obligatorio para oportunidades descartadas');
  }
};

const handleError = (res: Response, error: unknown): void => {
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
  const fechaProximaAccion = getDate(body.fechaProximaAccion);

  validateOpportunityState({
    cliente,
    etapa,
    montoEstimado,
    responsable,
    documentoRespaldo,
    motivoPerdida,
    motivoPostergacion,
    motivoDescarte,
    fechaReactivacion,
    fechaProximaAccion,
  });

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
    proximaAccion: getNullableString(body.proximaAccion),
    fechaProximaAccion,
    observaciones: getNullableString(body.observaciones),
    origen: getNullableString(body.origen),
    estadoStock: getNullableString(body.estadoStock),
    cotizacionId: getInt(body.cotizacionId),
    motivoPerdida,
    motivoPostergacion,
    fechaReactivacion,
    documentoRespaldo,
    fechaCierre: etapa === 'GANADA' ? new Date() : getDate(body.fechaCierre),
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
  const fechaProximaAccion = hasOwn(body, 'fechaProximaAccion')
    ? getDate(body.fechaProximaAccion)
    : current.fechaProximaAccion;

  validateOpportunityState({
    cliente,
    etapa,
    montoEstimado,
    responsable,
    documentoRespaldo,
    motivoPerdida,
    motivoPostergacion,
    motivoDescarte,
    fechaReactivacion,
    fechaProximaAccion,
  });

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
  if (hasOwn(body, 'proximaAccion')) data.proximaAccion = getNullableString(body.proximaAccion);
  if (hasOwn(body, 'fechaProximaAccion')) data.fechaProximaAccion = fechaProximaAccion;
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

    res.json({ success: true, data, resumen });
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

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const createFunnelFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const dataInput = buildCreateData(body);

    await assertLinkedRecordsExist(
      typeof dataInput.productoId === 'number' ? dataInput.productoId : null,
      typeof dataInput.cotizacionId === 'number' ? dataInput.cotizacionId : null
    );

    const data = await firematPrisma.funnelFirematOpportunity.create({
      data: dataInput,
      include: funnelInclude,
    });

    res.status(201).json({ success: true, data, message: 'Oportunidad Firemat creada' });
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
    const dataInput = buildUpdateData(current, body);

    await assertLinkedRecordsExist(
      hasOwn(body, 'productoId') ? getInt(body.productoId) : null,
      hasOwn(body, 'cotizacionId') ? getInt(body.cotizacionId) : null
    );

    const data = await firematPrisma.funnelFirematOpportunity.update({
      where: { id },
      data: dataInput,
      include: funnelInclude,
    });

    res.json({ success: true, data, message: 'Oportunidad Firemat actualizada' });
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

    const body = { ...(req.body as Record<string, unknown>), etapa };
    const dataInput = buildUpdateData(current, body);

    const data = await firematPrisma.funnelFirematOpportunity.update({
      where: { id },
      data: dataInput,
      include: funnelInclude,
    });

    res.json({ success: true, data, message: 'Etapa actualizada' });
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
