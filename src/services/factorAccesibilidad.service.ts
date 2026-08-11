import { prisma } from '../config/prisma';
import {
  FactorAccesibilidadNivel,
  LABELS_ACCESIBILIDAD,
  NIVELES_ACCESIBILIDAD,
  getFactoresAccesibilidadPorDefecto,
} from '../utils/calculosRegistroTerreno';

export class FactorAccesibilidadError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'FactorAccesibilidadError';
    this.statusCode = statusCode;
  }
}

export type FactorAccesibilidadConfig = FactorAccesibilidadNivel & {
  label: string;
  personalizado: boolean;
};

function validarNivel(nivelInput: unknown): number {
  const nivel = Number(nivelInput);
  if (!NIVELES_ACCESIBILIDAD.includes(nivel as 1 | 2 | 3)) {
    throw new FactorAccesibilidadError(`nivel debe ser uno de: ${NIVELES_ACCESIBILIDAD.join(', ')}`);
  }
  return nivel;
}

function validarFactor(factorInput: unknown): number {
  const factor = Number(factorInput);
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new FactorAccesibilidadError('factor debe ser un número mayor a 0');
  }
  return factor;
}

/** Factores efectivos por nivel para una obra: propios, o los por defecto si no tiene. */
export async function getFactoresAccesibilidadObra(obraId: string): Promise<FactorAccesibilidadNivel[]> {
  const rows = await prisma.factorAccesibilidadObra.findMany({
    where: { obraId },
    select: { nivel: true, factor: true },
  });

  if (rows.length === 0) return getFactoresAccesibilidadPorDefecto();

  const porNivel = new Map(rows.map((r) => [r.nivel, Number(r.factor)]));
  return NIVELES_ACCESIBILIDAD.map((nivel) => ({
    nivel,
    factor: porNivel.get(nivel) ?? getFactoresAccesibilidadPorDefecto().find((f) => f.nivel === nivel)!.factor,
  }));
}

/** Vista completa para la pantalla de configuración: los 3 niveles, cada uno con su factor efectivo. */
export async function listarFactoresAccesibilidadObra(obraId: string): Promise<FactorAccesibilidadConfig[]> {
  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorAccesibilidadError('La obra indicada no existe', 404);

  const rows = await prisma.factorAccesibilidadObra.findMany({ where: { obraId } });
  const porNivel = new Map(rows.map((r) => [r.nivel, Number(r.factor)]));
  const defaults = getFactoresAccesibilidadPorDefecto();

  return NIVELES_ACCESIBILIDAD.map((nivel) => ({
    nivel,
    label: LABELS_ACCESIBILIDAD[nivel],
    personalizado: porNivel.has(nivel),
    factor: porNivel.get(nivel) ?? defaults.find((f) => f.nivel === nivel)!.factor,
  }));
}

export async function guardarFactorAccesibilidadObra(
  obraId: string,
  nivelInput: unknown,
  factorInput: unknown,
): Promise<FactorAccesibilidadNivel> {
  const nivel = validarNivel(nivelInput);
  const factor = validarFactor(factorInput);

  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorAccesibilidadError('La obra indicada no existe', 404);

  await prisma.factorAccesibilidadObra.upsert({
    where: { obraId_nivel: { obraId, nivel } },
    create: { obraId, nivel, factor },
    update: { factor },
  });

  return { nivel, factor };
}

export async function restaurarFactorAccesibilidadPorDefecto(obraId: string, nivelInput: unknown): Promise<void> {
  const nivel = validarNivel(nivelInput);
  await prisma.factorAccesibilidadObra.deleteMany({ where: { obraId, nivel } });
}
