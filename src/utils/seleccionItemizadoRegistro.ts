import type { Prisma } from '@prisma/client';

type OpcionItemizado = {
  codigoBeck: string | null;
  elementoPasante: string | null;
  visible: boolean;
  configuracionesPorObra: { visible: boolean; nombrePersonalizado: string | null }[];
};

export class ErrorSeleccionItemizado extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
  }
}

export function validarSeleccionItemizado(id: unknown, estado: string): asserts id is string {
  if (estado !== 'en_revision' && estado !== 'validado') {
    throw new ErrorSeleccionItemizado('Solo se puede cambiar el itemizado de registros en revisión o validados.', 409);
  }
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ErrorSeleccionItemizado('Selecciona un Itemizado BECK válido.');
  }
}

// Las configuraciones recibidas deben estar filtradas por la obra del registro.
export function prepararCambioItemizado(
  opcion: OpcionItemizado | null,
  estado: string,
): Prisma.RegistroTerrenoUpdateInput {
  if (estado !== 'en_revision' && estado !== 'validado') {
    throw new ErrorSeleccionItemizado('El registro todavía no está disponible para edición de Ingeniería.', 409);
  }
  if (!opcion) throw new ErrorSeleccionItemizado('El Itemizado BECK seleccionado ya no existe.');
  const configuracion = opcion.configuracionesPorObra[0];
  if (!(configuracion?.visible ?? opcion.visible)) {
    throw new ErrorSeleccionItemizado('El Itemizado BECK seleccionado no está habilitado para esta obra.');
  }
  const descripcion = opcion.elementoPasante?.trim() || '';
  const mandante = configuracion?.nombrePersonalizado?.trim() || descripcion;
  if (!descripcion || descripcion.length > 500 || mandante.length > 255) {
    throw new ErrorSeleccionItemizado('Revisa la descripción y el nombre mandante del itemizado: están vacíos o exceden el largo permitido.');
  }
  return {
    descripcionMaterial: descripcion,
    itemizadoBeck: descripcion,
    codigoBeck: opcion.codigoBeck,
    itemizadoMandanteTexto: mandante,
    // El catálogo de opciones BECK no es la tabla histórica itemizados_mandante.
    itemizadoMandante: { disconnect: true },
    estado: 'en_revision',
  };
}

export function correccionDebePasarPorSupervisor(
  estadoActual: string, estadoSolicitado: unknown, esCorreccion: boolean,
): boolean {
  return esCorreccion && estadoSolicitado === 'en_revision' &&
    estadoActual !== 'en_revision' && estadoActual !== 'validado';
}
