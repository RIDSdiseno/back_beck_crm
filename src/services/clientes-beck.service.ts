import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import type { RawFilaCliente } from "../utils/importClientes";

function normalizeString(value: unknown): string {
  return String(value ?? "").trim();
}

function optStr(value: unknown): string | null {
  const s = normalizeString(value);
  return s || null;
}

export function procesarRut(value: unknown): string {
  const raw = normalizeString(value);

  if (!raw) {
    throw new Error("El RUT es obligatorio.");
  }

  if (!/^[\dKk.\-]+$/.test(raw)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }
  if (/--/.test(raw)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }
  if (raw.includes(".") && !raw.includes("-")) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

  const limpio = raw.replace(/[.\-]/g, "").toUpperCase();

  if (limpio.length < 8) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);

  if (!/^\d+$/.test(digits) || !/^[\dK]$/.test(dv)) {
    throw new Error("RUT inválido. Ingresa un RUT con formato válido.");
  }

  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

function procesarTelefono(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;

  const soloDigitos = raw.replace(/\D/g, "");

  if (soloDigitos.length < 8 || soloDigitos.length > 12) {
    throw new Error("Teléfono inválido.");
  }

  return soloDigitos;
}

function procesarCorreo(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    throw new Error("Correo inválido.");
  }

  return raw.toLowerCase();
}

function getClienteInclude() {
  return {
    contactos: {
      orderBy: [{ principal: "desc" as const }, { createdAt: "desc" as const }],
    },
    oportunidades: {
      orderBy: { createdAt: "desc" as const },
      take: 20,
      select: {
        id: true,
        nombreProyecto: true,
        empresa: true,
        etapa: true,
        estadoCierre: true,
        valorOriginal: true,
        monedaOriginal: true,
        valorClp: true,
        valorUf: true,
        fechaProbableCierre: true,
        vendedor: true,
        createdAt: true,
      },
    },
  } satisfies Prisma.ClienteBeckInclude;
}

type ClienteInput = {
  rut?: unknown;
  razonSocial?: unknown;
  razon_social?: unknown;
  nombreEmpresa?: unknown;
  direccion?: unknown;
  telefono?: unknown;
  correo?: unknown;
  region?: unknown;
  comuna?: unknown;
  tipoCliente?: unknown;
  tipo_cliente?: unknown;
  origen?: unknown;
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

function buildClienteData(raw: ClienteInput, isUpdate = false) {
  const razonSocialRaw = raw.razonSocial ?? raw.razon_social;
  const nombreEmpresaRaw = raw.nombreEmpresa;
  const tipoClienteRaw = raw.tipoCliente ?? raw.tipo_cliente;

  if (!isUpdate) {
    if (!normalizeString(raw.rut)) throw new Error("El RUT es obligatorio.");
    if (!normalizeString(razonSocialRaw)) {
      throw new Error("La razón social es obligatoria.");
    }
  }

  return {
    ...(raw.rut !== undefined && { rut: procesarRut(raw.rut) }),
    ...(razonSocialRaw !== undefined && {
      razonSocial: normalizeString(razonSocialRaw),
    }),
    ...(nombreEmpresaRaw !== undefined && {
      nombreEmpresa: optStr(nombreEmpresaRaw),
    }),
    ...(raw.direccion !== undefined && { direccion: optStr(raw.direccion) }),
    ...(raw.telefono !== undefined && {
      telefono: procesarTelefono(raw.telefono),
    }),
    ...(raw.correo !== undefined && { correo: procesarCorreo(raw.correo) }),
    ...(raw.region !== undefined && { region: optStr(raw.region) }),
    ...(raw.comuna !== undefined && { comuna: optStr(raw.comuna) }),
    ...(tipoClienteRaw !== undefined && { tipoCliente: optStr(tipoClienteRaw) }),
    ...(raw.origen !== undefined && { origen: optStr(raw.origen) }),
    ...(raw.observaciones !== undefined && {
      observaciones: optStr(raw.observaciones),
    }),
    ...(raw.activo !== undefined && { activo: Boolean(raw.activo) }),
  };
}

function buildContactoData(raw: ContactoInput, isUpdate = false) {
  if (!isUpdate && !normalizeString(raw.nombre)) {
    throw new Error("El nombre del contacto es obligatorio.");
  }

  return {
    ...(raw.nombre !== undefined && { nombre: normalizeString(raw.nombre) }),
    ...(raw.cargo !== undefined && { cargo: optStr(raw.cargo) }),
    ...(raw.telefono !== undefined && {
      telefono: procesarTelefono(raw.telefono),
    }),
    ...(raw.correo !== undefined && { correo: procesarCorreo(raw.correo) }),
    ...(raw.principal !== undefined && { principal: Boolean(raw.principal) }),
    ...(raw.activo !== undefined && { activo: Boolean(raw.activo) }),
    ...(raw.observaciones !== undefined && {
      observaciones: optStr(raw.observaciones),
    }),
  };
}

export async function listarClientesBeck(params?: {
  q?: string;
  activo?: boolean;
}) {
  const q = normalizeString(params?.q);

  return prisma.clienteBeck.findMany({
    where: {
      ...(params?.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { rut: { contains: q, mode: "insensitive" } },
          { razonSocial: { contains: q, mode: "insensitive" } },
          { nombreEmpresa: { contains: q, mode: "insensitive" } },
          { correo: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    include: getClienteInclude(),
    orderBy: { createdAt: "desc" },
  });
}

export async function buscarClientesBeck(q: string) {
  const query = normalizeString(q);

  if (!query) return [];

  return listarClientesBeck({ q: query, activo: true });
}

export async function obtenerClienteBeck(id: string) {
  const cliente = await prisma.clienteBeck.findUnique({
    where: { id },
    include: getClienteInclude(),
  });

  if (!cliente) throw new Error("Cliente no encontrado.");

  return cliente;
}

export async function crearClienteBeck(rawData: ClienteInput) {
  const data = buildClienteData(rawData, false);

  if (!data.rut) throw new Error("El RUT es obligatorio.");
  if (!data.razonSocial) throw new Error("La razón social es obligatoria.");

  return prisma.clienteBeck.create({
    data: {
      ...data,
      rut: data.rut,
      razonSocial: data.razonSocial,
    },
    include: getClienteInclude(),
  });
}

export async function actualizarClienteBeck(id: string, rawData: ClienteInput) {
  const existente = await prisma.clienteBeck.findUnique({ where: { id } });

  if (!existente) throw new Error("Cliente no encontrado.");

  const data = buildClienteData(rawData, true);

  return prisma.clienteBeck.update({
    where: { id },
    data,
    include: getClienteInclude(),
  });
}

export async function cambiarEstadoClienteBeck(id: string, activo: boolean) {
  const existente = await prisma.clienteBeck.findUnique({ where: { id } });

  if (!existente) throw new Error("Cliente no encontrado.");

  return prisma.clienteBeck.update({
    where: { id },
    data: { activo },
    include: getClienteInclude(),
  });
}

export async function agregarContactoClienteBeck(
  clienteId: string,
  rawData: ContactoInput
) {
  const cliente = await prisma.clienteBeck.findUnique({
    where: { id: clienteId },
  });

  if (!cliente) throw new Error("Cliente no encontrado.");

  const data = buildContactoData(rawData, false);

  if (!data.nombre) throw new Error("El nombre del contacto es obligatorio.");

  if (data.principal === true) {
    await prisma.contactoClienteBeck.updateMany({
      where: { clienteId },
      data: { principal: false },
    });
  }

  return prisma.contactoClienteBeck.create({
    data: {
      ...data,
      nombre: data.nombre,
      clienteId,
    },
  });
}

export async function actualizarContactoClienteBeck(
  contactoId: string,
  rawData: ContactoInput
) {
  const existente = await prisma.contactoClienteBeck.findUnique({
    where: { id: contactoId },
  });

  if (!existente) throw new Error("Contacto no encontrado.");

  const data = buildContactoData(rawData, true);

  if (data.principal === true) {
    await prisma.contactoClienteBeck.updateMany({
      where: { clienteId: existente.clienteId },
      data: { principal: false },
    });
  }

  return prisma.contactoClienteBeck.update({
    where: { id: contactoId },
    data,
  });
}

export async function cambiarEstadoContactoClienteBeck(
  contactoId: string,
  activo: boolean
) {
  const existente = await prisma.contactoClienteBeck.findUnique({
    where: { id: contactoId },
  });

  if (!existente) throw new Error("Contacto no encontrado.");

  return prisma.contactoClienteBeck.update({
    where: { id: contactoId },
    data: { activo },
  });
}


type MappedCliente = {
  rut: string | null;
  razonSocial: string | null;
  nombreEmpresa: string | null;
  telefono: string | null;
  correo: string | null;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  tipoCliente: string | null;
};

type ErrorFila = { fila: number; rut?: string; error: string };
type DuplicadoFila = { fila: number; rut: string; razonSocial: string; motivo: string };
type CreadoFila = { id: string; rut: string; razonSocial: string };

export type ImportResult = {
  totalProcesados: number;
  totalCreados: number;
  totalDuplicados: number;
  totalErrores: number;
  creados: CreadoFila[];
  duplicadosOmitidos: DuplicadoFila[];
  errores: ErrorFila[];
  advertencias: string[];
};

function normalizarClave(k: string): string {
  return k
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[\s_]+/g, " ")
    .trim();
}

const COLUMNAS: Record<string, keyof MappedCliente> = {
  rut: "rut",
  "razon social": "razonSocial",
  "nombre empresa": "nombreEmpresa",
  telefono: "telefono",
  fono: "telefono",
  correo: "correo",
  email: "correo",
  region: "region",
  comuna: "comuna",
  direccion: "direccion",
  "tipo cliente": "tipoCliente",
};

function mapearFila(raw: RawFilaCliente): MappedCliente {
  const result: MappedCliente = {
    rut: null, razonSocial: null, nombreEmpresa: null,
    telefono: null, correo: null, region: null,
    comuna: null, direccion: null, tipoCliente: null,
  };
  for (const [k, v] of Object.entries(raw)) {
    const campo = COLUMNAS[normalizarClave(k)];
    if (campo && v) result[campo] = v;
  }
  return result;
}

export async function importarClientesBeck(filas: RawFilaCliente[]): Promise<ImportResult> {
  const creados: CreadoFila[] = [];
  const duplicadosOmitidos: DuplicadoFila[] = [];
  const errores: ErrorFila[] = [];
  const advertencias: string[] = [];
  let procesados = 0;

  for (let i = 0; i < filas.length; i++) {
    const numFila = i + 2;
    const mapped = mapearFila(filas[i]);

    if (!mapped.rut && !mapped.razonSocial) continue;

    procesados++;

    try {
      if (!mapped.rut) throw new Error("El RUT es obligatorio.");
      if (!mapped.razonSocial) throw new Error("La Razon Social es obligatoria.");

      const rut = procesarRut(mapped.rut);

      const existente = await prisma.clienteBeck.findUnique({
        where: { rut },
        select: { id: true },
      });

      if (existente) {
        duplicadosOmitidos.push({
          fila: numFila,
          rut,
          razonSocial: mapped.razonSocial,
          motivo: "RUT ya existe",
        });
        continue;
      }

      const cliente = await prisma.clienteBeck.create({
        data: {
          rut,
          razonSocial: mapped.razonSocial.trim(),
          nombreEmpresa: mapped.nombreEmpresa?.trim() || null,
          telefono: procesarTelefono(mapped.telefono),
          correo: procesarCorreo(mapped.correo),
          region: mapped.region || null,
          comuna: mapped.comuna || null,
          direccion: mapped.direccion || null,
          tipoCliente: mapped.tipoCliente || null,
          activo: true,
        },
        select: { id: true, rut: true, razonSocial: true },
      });

      creados.push(cliente);
    } catch (err) {
      errores.push({
        fila: numFila,
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

export async function obtenerOportunidadesClienteBeck(clienteId: string) {
  const cliente = await prisma.clienteBeck.findUnique({
    where: { id: clienteId },
    select: { id: true },
  });

  if (!cliente) throw new Error("Cliente no encontrado.");

  return prisma.operadorBeck.findMany({
    where: { clienteBeckId: clienteId },
    orderBy: { createdAt: "desc" },
    include: {
      cotizaciones: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}