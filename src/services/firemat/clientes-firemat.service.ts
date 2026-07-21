import { TipoClienteFiremat, CanalVentaFiremat } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';
import { RawFilaCliente } from '../../utils/importClientes';


function optStr(value: unknown): string | null {
  const s = String(value ?? '').trim();
  return s || null;
}

function procesarRut(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (!/^[\dKk.\-]+$/.test(raw)) {
    throw new Error('RUT inválido. Solo se permiten números, puntos, guión y K.');
  }

  const limpio = raw.replace(/[.\-]/g, '').toUpperCase();

  if (limpio.length < 8) {
    throw new Error('RUT inválido. Debe tener al menos 8 caracteres.');
  }

  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);

  if (!/^\d+$/.test(digits) || !/^[\dK]$/.test(dv)) {
    throw new Error('RUT inválido. Formato incorrecto.');
  }

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

const TIPO_CLIENTE_IMPORT_MAP: Record<string, TipoClienteFiremat> = {
  cliente_final: TipoClienteFiremat.cliente_final,
  ferreteria: TipoClienteFiremat.ferreteria,
  broker: TipoClienteFiremat.broker,
  redistribuidor: TipoClienteFiremat.redistribuidor,
  instalador: TipoClienteFiremat.instalador,
  constructora: TipoClienteFiremat.constructora,
  otro: TipoClienteFiremat.otro,
};

const CANAL_VENTA_IMPORT_MAP: Record<string, CanalVentaFiremat> = {
  venta_directa: CanalVentaFiremat.venta_directa,
  broker: CanalVentaFiremat.broker,
  ferreteria: CanalVentaFiremat.ferreteria,
  redistribuidor: CanalVentaFiremat.redistribuidor,
  instalador: CanalVentaFiremat.instalador,
  recompra: CanalVentaFiremat.recompra,
  otro: CanalVentaFiremat.otro,
};

function parseTipoCliente(value: unknown): TipoClienteFiremat | null {
  const key = normalizarValorEnum(value);
  if (!key) return null;

  const parsed = TIPO_CLIENTE_IMPORT_MAP[key];
  if (!parsed) {
    throw new Error(
      'tipoCliente inválido. Valores permitidos: Cliente final, Ferretería, Broker, Redistribuidor, Instalador, Constructora, Otro'
    );
  }

  return parsed;
}

function parseCanalVenta(value: unknown): CanalVentaFiremat | null {
  const key = normalizarValorEnum(value);
  if (!key) return null;

  const parsed = CANAL_VENTA_IMPORT_MAP[key];
  if (!parsed) {
    throw new Error(
      'canalVenta inválido. Valores permitidos: Venta directa, Broker, Ferretería, Redistribuidor, Instalador, Recompra, Otro'
    );
  }

  return parsed;
}


const clienteInclude = {
  contactos: {
    orderBy: [
      { principal: 'desc' as const },
      { createdAt: 'desc' as const },
    ],
  },
  Oportunidad: {
    orderBy: [{ createdAt: 'desc' as const }],
    take: 20,
  },
};


type ClienteInput = {
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

type ContactoInput = {
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

export type ImportClientesFirematResult = {
  totalProcesados: number;
  totalCreados: number;
  totalDuplicados: number;
  totalErrores: number;
  creados: CreadoFilaImport[];
  duplicadosOmitidos: DuplicadoFilaImport[];
  errores: ErrorFilaImport[];
  advertencias: string[];
};


function buildClienteData(raw: ClienteInput, isUpdate = false) {
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
    ...(raw.activo !== undefined && { activo: Boolean(raw.activo) }),
  };
}

function buildContactoData(raw: ContactoInput, isUpdate = false) {
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
    ...(raw.principal !== undefined && { principal: Boolean(raw.principal) }),
    ...(raw.activo !== undefined && { activo: Boolean(raw.activo) }),
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

function mapearFilaImport(raw: RawFilaCliente): MappedClienteImport {
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
    const campo = COLUMNAS_IMPORT[normalizarClaveImport(k)];
    if (campo && v) result[campo] = v;
  }

  return result;
}

function filaImportVacia(mapped: MappedClienteImport): boolean {
  return Object.values(mapped).every(value => !value);
}


export async function listarClientesFiremat(params?: { q?: string; activo?: boolean }) {
  const q = String(params?.q ?? '').trim();

  return firematPrisma.cliente.findMany({
    where: {
      ...(params?.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { rut: { contains: q, mode: 'insensitive' } },
          { nombre: { contains: q, mode: 'insensitive' } },
          { razonSocial: { contains: q, mode: 'insensitive' } },
          { nombreEmpresa: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    include: clienteInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function buscarClientesFiremat(q: string) {
  const query = String(q ?? '').trim();
  if (!query) return [];

  return firematPrisma.cliente.findMany({
    where: {
      activo: true,
      OR: [
        { rut: { contains: query, mode: 'insensitive' } },
        { nombre: { contains: query, mode: 'insensitive' } },
        { razonSocial: { contains: query, mode: 'insensitive' } },
        { nombreEmpresa: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: clienteInclude,
    orderBy: { nombre: 'asc' },
  });
}

export async function obtenerClienteFiremat(id: number) {
  const cliente = await firematPrisma.cliente.findUnique({
    where: { id },
    include: clienteInclude,
  });

  if (!cliente) throw new Error('Cliente no encontrado.');

  return cliente;
}

export async function crearClienteFiremat(raw: ClienteInput) {
  const data = buildClienteData(raw, false);
  if (!data.nombre) throw new Error('El nombre es obligatorio.');

  return firematPrisma.cliente.create({
    data: {
      ...data,
      nombre: data.nombre,
    },
    include: clienteInclude,
  });
}

export async function actualizarClienteFiremat(id: number, raw: ClienteInput) {
  const existente = await firematPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');

  const data = buildClienteData(raw, true);

  return firematPrisma.cliente.update({
    where: { id },
    data,
    include: clienteInclude,
  });
}

export async function cambiarEstadoClienteFiremat(id: number, activo: boolean) {
  const existente = await firematPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');

  return firematPrisma.cliente.update({
    where: { id },
    data: { activo },
    include: clienteInclude,
  });
}

export async function importarClientesFiremat(
  filas: RawFilaCliente[]
): Promise<ImportClientesFirematResult> {
  const creados: CreadoFilaImport[] = [];
  const duplicadosOmitidos: DuplicadoFilaImport[] = [];
  const errores: ErrorFilaImport[] = [];
  const advertencias: string[] = [];
  let procesados = 0;

  for (let i = 0; i < filas.length; i++) {
    const fila = i + 2;
    const mapped = mapearFilaImport(filas[i]);

    if (filaImportVacia(mapped)) continue;

    procesados++;

    try {
      if (!mapped.rut) throw new Error('El RUT es obligatorio.');
      if (!mapped.nombre) throw new Error('El nombre es obligatorio.');

      const rut = procesarRut(mapped.rut);
      if (!rut) throw new Error('El RUT es obligatorio.');

      const existente = await firematPrisma.cliente.findUnique({
        where: { rut },
        select: { id: true },
      });

      if (existente) {
        duplicadosOmitidos.push({
          fila,
          rut,
          razonSocial: mapped.razonSocial || mapped.nombre,
          motivo: 'RUT ya existe',
        });
        continue;
      }

      const data = buildClienteData(
        {
          rut,
          nombre: mapped.nombre,
          razonSocial: mapped.razonSocial,
          nombreEmpresa: mapped.nombreEmpresa,
          telefono: mapped.telefono,
          email: mapped.email,
          region: mapped.region,
          comuna: mapped.comuna,
          direccion: mapped.direccion,
          tipoCliente: mapped.tipoCliente,
          canalVenta: mapped.canalVenta,
          activo: true,
        },
        false
      );

      const cliente = await firematPrisma.cliente.create({
        data: {
          ...data,
          nombre: data.nombre!,
          rut,
          activo: true,
        },
        select: {
          id: true,
          rut: true,
          nombre: true,
          razonSocial: true,
        },
      });

      creados.push(cliente);
    } catch (err) {
      errores.push({
        fila,
        ...(mapped.rut ? { rut: mapped.rut } : {}),
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    totalProcesados: procesados,
    totalCreados: creados.length,
    totalDuplicados: duplicadosOmitidos.length,
    totalErrores: errores.length,
    creados,
    duplicadosOmitidos,
    errores,
    advertencias,
  };
}

export async function agregarContactoClienteFiremat(clienteId: number, raw: ContactoInput) {
  const cliente = await firematPrisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) throw new Error('Cliente no encontrado.');

  const data = buildContactoData(raw, false);
  if (!data.nombre) throw new Error('El nombre del contacto es obligatorio.');

  if (data.principal === true) {
    await firematPrisma.contactoClienteFiremat.updateMany({
      where: { clienteId },
      data: { principal: false },
    });
  }

  return firematPrisma.contactoClienteFiremat.create({
    data: {
      ...data,
      nombre: data.nombre,
      clienteId,
    },
  });
}

export async function actualizarContactoClienteFiremat(contactoId: number, raw: ContactoInput) {
  const existente = await firematPrisma.contactoClienteFiremat.findUnique({
    where: { id: contactoId },
  });
  if (!existente) throw new Error('Contacto no encontrado.');

  const data = buildContactoData(raw, true);

  if (data.principal === true) {
    await firematPrisma.contactoClienteFiremat.updateMany({
      where: { clienteId: existente.clienteId },
      data: { principal: false },
    });
  }

  return firematPrisma.contactoClienteFiremat.update({
    where: { id: contactoId },
    data,
  });
}

export async function cambiarEstadoContactoFiremat(contactoId: number, activo: boolean) {
  const existente = await firematPrisma.contactoClienteFiremat.findUnique({
    where: { id: contactoId },
  });
  if (!existente) throw new Error('Contacto no encontrado.');

  return firematPrisma.contactoClienteFiremat.update({
    where: { id: contactoId },
    data: { activo },
  });
}

export async function obtenerOportunidadesClienteFiremat(clienteId: number) {
  const cliente = await firematPrisma.cliente.findUnique({
    where: { id: clienteId },
    select: { id: true },
  });
  if (!cliente) throw new Error('Cliente no encontrado.');

  const oportunidades = await firematPrisma.oportunidad.findMany({
    where: { clienteId },
    orderBy: { createdAt: 'desc' },
  });


  return oportunidades;
}
