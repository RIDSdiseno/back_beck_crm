import type { RawFilaCliente } from '../../utils/importClientes';
const TipoClienteComercial = { cliente_final: 'cliente_final', ferreteria: 'ferreteria', broker: 'broker', redistribuidor: 'redistribuidor', instalador: 'instalador', constructora: 'constructora', otro: 'otro' } as const;
type TipoClienteComercial = typeof TipoClienteComercial[keyof typeof TipoClienteComercial];
const CanalVentaComercial = { venta_directa: 'venta_directa', broker: 'broker', ferreteria: 'ferreteria', redistribuidor: 'redistribuidor', instalador: 'instalador', recompra: 'recompra', otro: 'otro' } as const;
type CanalVentaComercial = typeof CanalVentaComercial[keyof typeof CanalVentaComercial];
export function validarBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('El estado debe ser verdadero o falso.');
  return value;
}
function optStr(value: unknown): string | null {
  const s = String(value ?? '').trim();
  return s || null;
}

export function procesarRut(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (!/^[\dKk.\-]+$/.test(raw)) {
    throw new Error('RUT inválido. Solo se permiten números, puntos, guión y K.');
  }

  const limpio = raw.replace(/[.\-]/g, '').toUpperCase();

  if (limpio.length < 8 || limpio.length > 9) {
    throw new Error('RUT inválido. Debe tener entre 8 y 9 caracteres sin puntos ni guión.');
  }

  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);

  if (!/^\d+$/.test(digits) || !/^[\dK]$/.test(dv)) {
    throw new Error('RUT inválido. Formato incorrecto.');
  }

  let suma = 0;
  let multiplicador = 2;
  for (let i = digits.length - 1; i >= 0; i--) {
    suma += Number(digits[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  if (dv !== esperado) throw new Error('RUT inválido. El dígito verificador no coincide.');
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

function procesarTelefono(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const soloDigitos = raw.replace(/\D/g, '');

  if (soloDigitos.length < 8 || soloDigitos.length > 12) {
    throw new Error('Teléfono inválido. Debe tener entre 8 y 12 dígitos.');
  }

  return soloDigitos;
}

function normalizarCorreo(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(raw)) {
    throw new Error('Correo inválido.');
  }

  return raw.toLowerCase();
}

function procesarCorreoContacto(value: unknown): string | null {
  return normalizarCorreo(value);
}

function normalizarValorEnum(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[\s_]+/g, '_');
}

const TIPO_CLIENTE_IMPORT_MAP: Record<string, TipoClienteComercial> = {
  cliente_final: TipoClienteComercial.cliente_final,
  ferreteria: TipoClienteComercial.ferreteria,
  broker: TipoClienteComercial.broker,
  redistribuidor: TipoClienteComercial.redistribuidor,
  instalador: TipoClienteComercial.instalador,
  constructora: TipoClienteComercial.constructora,
  otro: TipoClienteComercial.otro,
};

const CANAL_VENTA_IMPORT_MAP: Record<string, CanalVentaComercial> = {
  venta_directa: CanalVentaComercial.venta_directa,
  broker: CanalVentaComercial.broker,
  ferreteria: CanalVentaComercial.ferreteria,
  redistribuidor: CanalVentaComercial.redistribuidor,
  instalador: CanalVentaComercial.instalador,
  recompra: CanalVentaComercial.recompra,
  otro: CanalVentaComercial.otro,
};

function parseTipoCliente(value: unknown): TipoClienteComercial | null {
  const key = normalizarValorEnum(value);
  if (!key) return null;

  const parsed = Object.hasOwnProperty.call(TIPO_CLIENTE_IMPORT_MAP, key) ? TIPO_CLIENTE_IMPORT_MAP[key] : undefined;
  if (!parsed) {
    throw new Error(
      'tipoCliente inválido. Valores permitidos: Cliente final, Ferretería, Broker, Redistribuidor, Instalador, Constructora, Otro'
    );
  }

  return parsed;
}

function parseCanalVenta(value: unknown): CanalVentaComercial | null {
  const key = normalizarValorEnum(value);
  if (!key) return null;

  const parsed = Object.hasOwnProperty.call(CANAL_VENTA_IMPORT_MAP, key) ? CANAL_VENTA_IMPORT_MAP[key] : undefined;
  if (!parsed) {
    throw new Error(
      'canalVenta inválido. Valores permitidos: Venta directa, Broker, Ferretería, Redistribuidor, Instalador, Recompra, Otro'
    );
  }

  return parsed;
}




export type ClienteInput = {
  nombre?: unknown;
  rut?: unknown;
  email?: unknown;
  telefono?: unknown;
  direccion?: unknown;
  razonSocial?: unknown;
  nombreEmpresa?: unknown;
  region?: unknown;
  comuna?: unknown;
  tipoCliente?: unknown;
  canalVenta?: unknown;
  activo?: unknown;
  observaciones?: unknown;
};

export type ContactoInput = {
  nombre?: unknown;
  cargo?: unknown;
  telefono?: unknown;
  correo?: unknown;
  principal?: unknown;
  activo?: unknown;
  observaciones?: unknown;
};

type MappedClienteImport = {
  rut: string | null;
  nombre: string | null;
  razonSocial: string | null;
  nombreEmpresa: string | null;
  telefono: string | null;
  email: string | null;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  tipoCliente: string | null;
  canalVenta: string | null;
};

type ErrorFilaImport = { fila: number; rut?: string; error: string };
type DuplicadoFilaImport = { fila: number; rut: string; razonSocial: string; motivo: string };
type CreadoFilaImport = {
  id: number;
  rut: string | null;
  nombre: string;
  razonSocial: string | null;
};

export type ImportClientesTragerResult = {
  totalProcesados: number;
  totalCreados: number;
  totalDuplicados: number;
  totalErrores: number;
  creados: CreadoFilaImport[];
  duplicadosOmitidos: DuplicadoFilaImport[];
  errores: ErrorFilaImport[];
  advertencias: string[];
};


export function buildClienteData(raw: ClienteInput, isUpdate = false) {
  if (!isUpdate) {
    const nombre = String(raw.nombre ?? '').trim();
    if (!nombre) throw new Error('El nombre es obligatorio.');
  }

  if (isUpdate && raw.nombre !== undefined) {
    const nombre = String(raw.nombre ?? '').trim();
    if (!nombre) throw new Error('El nombre no puede estar vacío.');
  }

  return {
    ...(raw.nombre !== undefined && { nombre: String(raw.nombre ?? '').trim() }),
    ...(raw.rut !== undefined && { rut: procesarRut(raw.rut) }),
    ...(raw.email !== undefined && { email: normalizarCorreo(raw.email) }),
    ...(raw.telefono !== undefined && { telefono: procesarTelefono(raw.telefono) }),
    ...(raw.direccion !== undefined && { direccion: optStr(raw.direccion) }),
    ...(raw.razonSocial !== undefined && { razonSocial: optStr(raw.razonSocial) }),
    ...(raw.nombreEmpresa !== undefined && { nombreEmpresa: optStr(raw.nombreEmpresa) }),
    ...(raw.region !== undefined && { region: optStr(raw.region) }),
    ...(raw.comuna !== undefined && { comuna: optStr(raw.comuna) }),
    ...(raw.tipoCliente !== undefined && { tipoCliente: parseTipoCliente(raw.tipoCliente) }),
    ...(raw.canalVenta !== undefined && { canalVenta: parseCanalVenta(raw.canalVenta) }),
    ...(raw.observaciones !== undefined && { observaciones: optStr(raw.observaciones) }),
    ...(raw.activo !== undefined && { activo: validarBoolean(raw.activo) }),
  };
}

export function buildContactoData(raw: ContactoInput, isUpdate = false) {
  if (!isUpdate) {
    const nombre = String(raw.nombre ?? '').trim();
    if (!nombre) throw new Error('El nombre del contacto es obligatorio.');
  }

  if (isUpdate && raw.nombre !== undefined) {
    const nombre = String(raw.nombre ?? '').trim();
    if (!nombre) throw new Error('El nombre del contacto no puede estar vacío.');
  }

  return {
    ...(raw.nombre !== undefined && { nombre: String(raw.nombre ?? '').trim() }),
    ...(raw.cargo !== undefined && { cargo: optStr(raw.cargo) }),
    ...(raw.telefono !== undefined && { telefono: procesarTelefono(raw.telefono) }),
    ...(raw.correo !== undefined && { correo: procesarCorreoContacto(raw.correo) }),
    ...(raw.principal !== undefined && { principal: validarBoolean(raw.principal) }),
    ...(raw.activo !== undefined && { activo: validarBoolean(raw.activo) }),
    ...(raw.observaciones !== undefined && { observaciones: optStr(raw.observaciones) }),
  };
}

function normalizarClaveImport(k: string): string {
  return k
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[\s_]+/g, ' ')
    .trim();
}

const COLUMNAS_IMPORT: Record<string, keyof MappedClienteImport> = {
  rut: 'rut',
  nombre: 'nombre',
  'razon social': 'razonSocial',
  'nombre empresa': 'nombreEmpresa',
  telefono: 'telefono',
  fono: 'telefono',
  email: 'email',
  correo: 'email',
  region: 'region',
  comuna: 'comuna',
  direccion: 'direccion',
  'tipo cliente': 'tipoCliente',
  'canal venta': 'canalVenta',
};

export function mapearFilaImport(raw: RawFilaCliente): MappedClienteImport {
  const result: MappedClienteImport = {
    rut: null,
    nombre: null,
    razonSocial: null,
    nombreEmpresa: null,
    telefono: null,
    email: null,
    region: null,
    comuna: null,
    direccion: null,
    tipoCliente: null,
    canalVenta: null,
  };

  for (const [k, v] of Object.entries(raw)) {
    const clave = normalizarClaveImport(k);
    const campo = Object.hasOwnProperty.call(COLUMNAS_IMPORT, clave) ? COLUMNAS_IMPORT[clave] : undefined;
    if (campo && v) result[campo] = v;
  }

  return result;
}

export function filaImportVacia(mapped: MappedClienteImport): boolean {
  return Object.values(mapped).every(value => !value);
}
