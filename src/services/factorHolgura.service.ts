import { prisma } from '../config/prisma';
import { getTramosHolguraPorDefecto, TramoHolgura } from '../utils/calculosRegistroTerreno';
import { TIPOS_REGISTRO_VALIDOS, TipoRegistroPermitido } from '../helpers/tiposRegistro';

export class FactorHolguraError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'FactorHolguraError';
    this.statusCode = statusCode;
  }
}

export type FactorHolguraTipoConfig = {
  tipoRegistro: string;
  personalizado: boolean;
  tramos: TramoHolgura[];
};

/** Tramos efectivos para un tipo de registro: propios de la obra, o los por defecto si no tiene. */
export async function getTramosHolguraObra(
  obraId: string,
  tipoRegistro: string,
): Promise<TramoHolgura[]> {
  const rows = await prisma.factorHolguraTramo.findMany({
    where: { obraId, tipoRegistro },
    orderBy: { orden: 'asc' },
    select: { holguraMax: true, factor: true },
  });

  if (rows.length === 0) return getTramosHolguraPorDefecto(tipoRegistro);
  return rows.map((r) => ({ holguraMax: Number(r.holguraMax), factor: Number(r.factor) }));
}

/** Vista completa para la pantalla de configuración: los 4 tipos, cada uno con sus tramos efectivos. */
export async function listarFactoresHolguraObra(obraId: string): Promise<FactorHolguraTipoConfig[]> {
  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorHolguraError('La obra indicada no existe', 404);

  const personalizados = await prisma.factorHolguraTramo.findMany({
    where: { obraId },
    orderBy: [{ tipoRegistro: 'asc' }, { orden: 'asc' }],
  });

  const porTipo = new Map<string, TramoHolgura[]>();
  for (const row of personalizados) {
    const lista = porTipo.get(row.tipoRegistro) ?? [];
    lista.push({ holguraMax: Number(row.holguraMax), factor: Number(row.factor) });
    porTipo.set(row.tipoRegistro, lista);
  }

  return TIPOS_REGISTRO_VALIDOS.map((tipoRegistro) => {
    const propios = porTipo.get(tipoRegistro);
    return {
      tipoRegistro,
      personalizado: Boolean(propios),
      tramos: propios ?? getTramosHolguraPorDefecto(tipoRegistro),
    };
  });
}

function validarTramos(tramosInput: unknown): TramoHolgura[] {
  if (!Array.isArray(tramosInput) || tramosInput.length === 0) {
    throw new FactorHolguraError('Debe indicar al menos un tramo');
  }

  const parsed = tramosInput.map((t, idx) => {
    if (!t || typeof t !== 'object') {
      throw new FactorHolguraError(`Tramo ${idx + 1}: formato inválido`);
    }
    const { holguraMax, factor } = t as Record<string, unknown>;
    const hMax = Number(holguraMax);
    const f = Number(factor);
    if (!Number.isFinite(hMax) || hMax <= 0) {
      throw new FactorHolguraError(`Tramo ${idx + 1}: holguraMax debe ser un número mayor a 0`);
    }
    if (!Number.isFinite(f) || f <= 0) {
      throw new FactorHolguraError(`Tramo ${idx + 1}: factor debe ser un número mayor a 0`);
    }
    return { holguraMax: hMax, factor: f };
  });

  const ordenados = [...parsed].sort((a, b) => a.holguraMax - b.holguraMax);
  for (let i = 1; i < ordenados.length; i++) {
    if (ordenados[i].holguraMax === ordenados[i - 1].holguraMax) {
      throw new FactorHolguraError('No puede haber dos tramos con el mismo límite de holgura');
    }
  }

  return ordenados;
}

export async function guardarTramosHolguraObra(
  obraId: string,
  tipoRegistro: string,
  tramosInput: unknown,
): Promise<TramoHolgura[]> {
  if (!TIPOS_REGISTRO_VALIDOS.includes(tipoRegistro as TipoRegistroPermitido)) {
    throw new FactorHolguraError(`tipoRegistro debe ser uno de: ${TIPOS_REGISTRO_VALIDOS.join(', ')}`);
  }

  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorHolguraError('La obra indicada no existe', 404);

  const tramos = validarTramos(tramosInput);

  await prisma.$transaction([
    prisma.factorHolguraTramo.deleteMany({ where: { obraId, tipoRegistro } }),
    prisma.factorHolguraTramo.createMany({
      data: tramos.map((t, idx) => ({
        obraId,
        tipoRegistro,
        orden: idx,
        holguraMax: t.holguraMax,
        factor: t.factor,
      })),
    }),
  ]);

  return tramos;
}

export async function restaurarTramosHolguraPorDefecto(
  obraId: string,
  tipoRegistro: string,
): Promise<void> {
  if (!TIPOS_REGISTRO_VALIDOS.includes(tipoRegistro as TipoRegistroPermitido)) {
    throw new FactorHolguraError(`tipoRegistro debe ser uno de: ${TIPOS_REGISTRO_VALIDOS.join(', ')}`);
  }
  await prisma.factorHolguraTramo.deleteMany({ where: { obraId, tipoRegistro } });
}
