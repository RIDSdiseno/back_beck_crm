import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

type BaseParams = {
  q?: string;
  activo?: boolean;
};

type EppInput = {
  sku?: unknown;
  item?: unknown;
  modeloMarca?: unknown;
  unidadMedida?: unknown;
  talla?: unknown;
  color?: unknown;
  stockInicial?: unknown;
  entrada?: unknown;
  salida?: unknown;
  saldo?: unknown;
  activo?: unknown;
};

type ImplementoInput = EppInput & {
  cantidad?: unknown;
  tallaMedida?: unknown;
  ubicacion?: unknown;
  fecha?: unknown;
};

type HerramientaInput = {
  nombre?: unknown;
  marca?: unknown;
  modelo?: unknown;
  categoria?: unknown;
  sku?: unknown;
  ubicacion?: unknown;
  fechaCompra?: unknown;
  fechaMantencion?: unknown;
  encargado?: unknown;
  activo?: unknown;
};

function normalizeString(value: unknown): string {
  return String(value ?? '').trim();
}

function capitalizar(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase('es-CL') + value.slice(1);
}

function optStr(value: unknown): string | null {
  const valueString = normalizeString(value);
  return valueString || null;
}

function parseNonNegativeInt(value: unknown, field: string): number {
  if (value === undefined || value === null || value === '') return 0;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(`${field} debe ser un numero entero mayor o igual a 0.`);
  }
  return numberValue;
}

function parseOptionalDate(value: unknown): Date | null {
  const valueString = normalizeString(value);
  if (!valueString) return null;

  const date = new Date(`${valueString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Fecha invalida.');
  }
  return date;
}

function parseActivo(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('El campo activo debe ser booleano.');
}

function buildEppData(raw: EppInput, isUpdate = false) {
  if (!isUpdate && !normalizeString(raw.item)) {
    throw new Error('El item es obligatorio.');
  }

  return {
    ...(raw.sku !== undefined && { sku: optStr(raw.sku) }),
    ...(raw.item !== undefined && { item: capitalizar(normalizeString(raw.item)) }),
    ...(raw.modeloMarca !== undefined && { modeloMarca: optStr(raw.modeloMarca) }),
    ...(raw.unidadMedida !== undefined && { unidadMedida: optStr(raw.unidadMedida) }),
    ...(raw.talla !== undefined && { talla: optStr(raw.talla) }),
    ...(raw.color !== undefined && { color: optStr(raw.color) }),
    ...(raw.stockInicial !== undefined && { stockInicial: parseNonNegativeInt(raw.stockInicial, 'stockInicial') }),
    ...(raw.entrada !== undefined && { entrada: parseNonNegativeInt(raw.entrada, 'entrada') }),
    ...(raw.salida !== undefined && { salida: parseNonNegativeInt(raw.salida, 'salida') }),
    ...(raw.saldo !== undefined && { saldo: parseNonNegativeInt(raw.saldo, 'saldo') }),
    ...(raw.activo !== undefined && { activo: parseActivo(raw.activo) }),
  };
}

function buildImplementoData(raw: ImplementoInput, isUpdate = false) {
  if (!isUpdate && !normalizeString(raw.item)) {
    throw new Error('El item es obligatorio.');
  }

  return {
    ...(raw.sku !== undefined && { sku: optStr(raw.sku) }),
    ...(raw.item !== undefined && { item: capitalizar(normalizeString(raw.item)) }),
    ...(raw.modeloMarca !== undefined && { modeloMarca: optStr(raw.modeloMarca) }),
    ...(raw.cantidad !== undefined && { cantidad: parseNonNegativeInt(raw.cantidad, 'cantidad') }),
    ...(raw.unidadMedida !== undefined && { unidadMedida: optStr(raw.unidadMedida) }),
    ...(raw.tallaMedida !== undefined && { tallaMedida: optStr(raw.tallaMedida) }),
    ...(raw.color !== undefined && { color: optStr(raw.color) }),
    ...(raw.ubicacion !== undefined && { ubicacion: optStr(raw.ubicacion) }),
    ...(raw.fecha !== undefined && { fecha: parseOptionalDate(raw.fecha) }),
    ...(raw.salida !== undefined && { salida: parseNonNegativeInt(raw.salida, 'salida') }),
    ...(raw.saldo !== undefined && { saldo: parseNonNegativeInt(raw.saldo, 'saldo') }),
    ...(raw.activo !== undefined && { activo: parseActivo(raw.activo) }),
  };
}

function buildHerramientaData(raw: HerramientaInput, isUpdate = false) {
  if (!isUpdate && !normalizeString(raw.nombre)) {
    throw new Error('El nombre es obligatorio.');
  }

  return {
    ...(raw.nombre !== undefined && { nombre: capitalizar(normalizeString(raw.nombre)) }),
    ...(raw.marca !== undefined && { marca: optStr(raw.marca) }),
    ...(raw.modelo !== undefined && { modelo: optStr(raw.modelo) }),
    ...(raw.categoria !== undefined && { categoria: optStr(raw.categoria) }),
    ...(raw.sku !== undefined && { sku: optStr(raw.sku) }),
    ...(raw.ubicacion !== undefined && { ubicacion: optStr(raw.ubicacion) }),
    ...(raw.fechaCompra !== undefined && { fechaCompra: parseOptionalDate(raw.fechaCompra) }),
    ...(raw.fechaMantencion !== undefined && { fechaMantencion: parseOptionalDate(raw.fechaMantencion) }),
    ...(raw.encargado !== undefined && { encargado: optStr(raw.encargado) }),
    ...(raw.activo !== undefined && { activo: parseActivo(raw.activo) }),
  };
}

export async function listarInventarioEpp(params: BaseParams = {}) {
  const q = normalizeString(params.q);
  return prisma.inventarioBeckEpp.findMany({
    where: {
      ...(params.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { sku: { contains: q, mode: 'insensitive' } },
          { item: { contains: q, mode: 'insensitive' } },
          { modeloMarca: { contains: q, mode: 'insensitive' } },
          { talla: { contains: q, mode: 'insensitive' } },
          { color: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: [{ activo: 'desc' }, { item: 'asc' }],
  });
}

export async function obtenerInventarioEpp(id: string) {
  const item = await prisma.inventarioBeckEpp.findUnique({ where: { id } });
  if (!item) throw new Error('EPP no encontrado.');
  return item;
}

export async function crearInventarioEpp(raw: EppInput) {
  const data = buildEppData(raw, false);
  if (!data.item) throw new Error('El item es obligatorio.');
  return prisma.inventarioBeckEpp.create({ data: data as Prisma.InventarioBeckEppCreateInput });
}

export async function actualizarInventarioEpp(id: string, raw: EppInput) {
  await obtenerInventarioEpp(id);
  const data = buildEppData(raw, true);
  return prisma.inventarioBeckEpp.update({ where: { id }, data });
}

export async function cambiarEstadoInventarioEpp(id: string, activo: boolean) {
  await obtenerInventarioEpp(id);
  return prisma.inventarioBeckEpp.update({ where: { id }, data: { activo } });
}

const SKU_GENERADO_INICIO = 900000;
export const SKU_GENERADO_REGEX = /^9\d{5}$/;

async function siguienteSkuEppDisponible(reservados: Set<string>): Promise<number> {
  const rows = await prisma.inventarioBeckEpp.findMany({
    where: { sku: { startsWith: '9' } },
    select: { sku: true },
  });

  let max = SKU_GENERADO_INICIO;
  for (const row of rows) {
    if (row.sku && SKU_GENERADO_REGEX.test(row.sku)) {
      const n = Number(row.sku);
      if (n > max) max = n;
    }
  }

  let next = max + 1;
  while (reservados.has(String(next))) next += 1;
  return next;
}

export async function generarSkuInventarioEpp(id: string) {
  const item = await obtenerInventarioEpp(id);
  if (item.sku && item.sku.trim()) {
    throw new Error('Este EPP ya tiene un SKU asignado.');
  }

  const existentes = await prisma.inventarioBeckEpp.findMany({ select: { sku: true } });
  const reservados = new Set(existentes.map((row) => row.sku).filter((sku): sku is string => !!sku));

  const next = await siguienteSkuEppDisponible(reservados);
  return prisma.inventarioBeckEpp.update({ where: { id }, data: { sku: String(next) } });
}

export async function generarSkuInventarioEppMasivo(): Promise<{ actualizados: number }> {
  const sinSku = await prisma.inventarioBeckEpp.findMany({
    where: { OR: [{ sku: null }, { sku: '' }] },
    select: { id: true },
  });

  if (sinSku.length === 0) return { actualizados: 0 };

  const existentes = await prisma.inventarioBeckEpp.findMany({ select: { sku: true } });
  const reservados = new Set(existentes.map((row) => row.sku).filter((sku): sku is string => !!sku));

  let actualizados = 0;
  for (const item of sinSku) {
    const next = await siguienteSkuEppDisponible(reservados);
    const nextStr = String(next);
    reservados.add(nextStr);
    await prisma.inventarioBeckEpp.update({ where: { id: item.id }, data: { sku: nextStr } });
    actualizados += 1;
  }

  return { actualizados };
}

export async function listarInventarioImplementos(params: BaseParams = {}) {
  const q = normalizeString(params.q);
  return prisma.inventarioBeckImplemento.findMany({
    where: {
      ...(params.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { sku: { contains: q, mode: 'insensitive' } },
          { item: { contains: q, mode: 'insensitive' } },
          { modeloMarca: { contains: q, mode: 'insensitive' } },
          { tallaMedida: { contains: q, mode: 'insensitive' } },
          { color: { contains: q, mode: 'insensitive' } },
          { ubicacion: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: [{ activo: 'desc' }, { item: 'asc' }],
  });
}

export async function obtenerInventarioImplemento(id: string) {
  const item = await prisma.inventarioBeckImplemento.findUnique({ where: { id } });
  if (!item) throw new Error('Implemento no encontrado.');
  return item;
}

export async function crearInventarioImplemento(raw: ImplementoInput) {
  const data = buildImplementoData(raw, false);
  if (!data.item) throw new Error('El item es obligatorio.');
  return prisma.inventarioBeckImplemento.create({ data: data as Prisma.InventarioBeckImplementoCreateInput });
}

export async function actualizarInventarioImplemento(id: string, raw: ImplementoInput) {
  await obtenerInventarioImplemento(id);
  const data = buildImplementoData(raw, true);
  return prisma.inventarioBeckImplemento.update({ where: { id }, data });
}

export async function cambiarEstadoInventarioImplemento(id: string, activo: boolean) {
  await obtenerInventarioImplemento(id);
  return prisma.inventarioBeckImplemento.update({ where: { id }, data: { activo } });
}

const SKU_GENERADO_INICIO_IMPLEMENTO = 800000;
export const SKU_GENERADO_REGEX_IMPLEMENTO = /^8\d{5}$/;

async function siguienteSkuImplementoDisponible(reservados: Set<string>): Promise<number> {
  const rows = await prisma.inventarioBeckImplemento.findMany({
    where: { sku: { startsWith: '8' } },
    select: { sku: true },
  });

  let max = SKU_GENERADO_INICIO_IMPLEMENTO;
  for (const row of rows) {
    if (row.sku && SKU_GENERADO_REGEX_IMPLEMENTO.test(row.sku)) {
      const n = Number(row.sku);
      if (n > max) max = n;
    }
  }

  let next = max + 1;
  while (reservados.has(String(next))) next += 1;
  return next;
}

export async function generarSkuInventarioImplemento(id: string) {
  const item = await obtenerInventarioImplemento(id);
  if (item.sku && item.sku.trim()) {
    throw new Error('Este implemento ya tiene un SKU asignado.');
  }

  const existentes = await prisma.inventarioBeckImplemento.findMany({ select: { sku: true } });
  const reservados = new Set(existentes.map((row) => row.sku).filter((sku): sku is string => !!sku));

  const next = await siguienteSkuImplementoDisponible(reservados);
  return prisma.inventarioBeckImplemento.update({ where: { id }, data: { sku: String(next) } });
}

export async function generarSkuInventarioImplementoMasivo(): Promise<{ actualizados: number }> {
  const sinSku = await prisma.inventarioBeckImplemento.findMany({
    where: { OR: [{ sku: null }, { sku: '' }] },
    select: { id: true },
  });

  if (sinSku.length === 0) return { actualizados: 0 };

  const existentes = await prisma.inventarioBeckImplemento.findMany({ select: { sku: true } });
  const reservados = new Set(existentes.map((row) => row.sku).filter((sku): sku is string => !!sku));

  let actualizados = 0;
  for (const item of sinSku) {
    const next = await siguienteSkuImplementoDisponible(reservados);
    const nextStr = String(next);
    reservados.add(nextStr);
    await prisma.inventarioBeckImplemento.update({ where: { id: item.id }, data: { sku: nextStr } });
    actualizados += 1;
  }

  return { actualizados };
}

export async function listarInventarioHerramientas(params: BaseParams = {}) {
  const q = normalizeString(params.q);
  return prisma.inventarioBeckHerramienta.findMany({
    where: {
      ...(params.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { sku: { contains: q, mode: 'insensitive' } },
          { nombre: { contains: q, mode: 'insensitive' } },
          { marca: { contains: q, mode: 'insensitive' } },
          { modelo: { contains: q, mode: 'insensitive' } },
          { categoria: { contains: q, mode: 'insensitive' } },
          { ubicacion: { contains: q, mode: 'insensitive' } },
          { encargado: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: [{ activo: 'desc' }, { nombre: 'asc' }],
  });
}

export async function obtenerInventarioHerramienta(id: string) {
  const item = await prisma.inventarioBeckHerramienta.findUnique({ where: { id } });
  if (!item) throw new Error('Herramienta no encontrada.');
  return item;
}

export async function crearInventarioHerramienta(raw: HerramientaInput) {
  const data = buildHerramientaData(raw, false);
  if (!data.nombre) throw new Error('El nombre es obligatorio.');
  return prisma.inventarioBeckHerramienta.create({ data: data as Prisma.InventarioBeckHerramientaCreateInput });
}

export async function actualizarInventarioHerramienta(id: string, raw: HerramientaInput) {
  await obtenerInventarioHerramienta(id);
  const data = buildHerramientaData(raw, true);
  return prisma.inventarioBeckHerramienta.update({ where: { id }, data });
}

export async function cambiarEstadoInventarioHerramienta(id: string, activo: boolean) {
  await obtenerInventarioHerramienta(id);
  return prisma.inventarioBeckHerramienta.update({ where: { id }, data: { activo } });
}
