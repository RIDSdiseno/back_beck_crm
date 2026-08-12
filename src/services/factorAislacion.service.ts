import { prisma } from '../config/prisma';
import {
  FactorAislacionEstado,
  getFactoresAislacionPorDefecto,
} from '../utils/calculosRegistroTerreno';

export class FactorAislacionError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'FactorAislacionError';
    this.statusCode = statusCode;
  }
}

export type FactorAislacionConfig = FactorAislacionEstado & {
  label: string;
  personalizado: boolean;
};

const ESTADOS_APLICA = [true, false] as const;

const LABELS_APLICA: Record<'true' | 'false', string> = {
  true: 'Aplica',
  false: 'No aplica',
};

function validarAplica(aplicaInput: unknown): boolean {
  if (aplicaInput === true || aplicaInput === 'true') return true;
  if (aplicaInput === false || aplicaInput === 'false') return false;
  throw new FactorAislacionError('aplica debe ser true o false');
}

function validarFactor(factorInput: unknown): number {
  const factor = Number(factorInput);
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new FactorAislacionError('factor debe ser un número mayor a 0');
  }
  return factor;
}

/** Factores efectivos (aplica / no aplica) para una obra: propios, o los por defecto si no tiene. */
export async function getFactoresAislacionObra(obraId: string): Promise<FactorAislacionEstado[]> {
  const rows = await prisma.factorAislacionObra.findMany({
    where: { obraId },
    select: { aplica: true, factor: true },
  });

  if (rows.length === 0) return getFactoresAislacionPorDefecto();

  const porEstado = new Map(rows.map((r) => [r.aplica, Number(r.factor)]));
  const defaults = getFactoresAislacionPorDefecto();
  return ESTADOS_APLICA.map((aplica) => ({
    aplica,
    factor: porEstado.get(aplica) ?? defaults.find((f) => f.aplica === aplica)!.factor,
  }));
}

/** Vista completa para la pantalla de configuración: ambos estados, cada uno con su factor efectivo. */
export async function listarFactoresAislacionObra(obraId: string): Promise<FactorAislacionConfig[]> {
  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorAislacionError('La obra indicada no existe', 404);

  const rows = await prisma.factorAislacionObra.findMany({ where: { obraId } });
  const porEstado = new Map(rows.map((r) => [r.aplica, Number(r.factor)]));
  const defaults = getFactoresAislacionPorDefecto();

  return ESTADOS_APLICA.map((aplica) => ({
    aplica,
    label: LABELS_APLICA[String(aplica) as 'true' | 'false'],
    personalizado: porEstado.has(aplica),
    factor: porEstado.get(aplica) ?? defaults.find((f) => f.aplica === aplica)!.factor,
  }));
}

export async function guardarFactorAislacionObra(
  obraId: string,
  aplicaInput: unknown,
  factorInput: unknown,
): Promise<FactorAislacionEstado> {
  const aplica = validarAplica(aplicaInput);
  const factor = validarFactor(factorInput);

  const obra = await prisma.obra.findUnique({ where: { id: obraId }, select: { id: true } });
  if (!obra) throw new FactorAislacionError('La obra indicada no existe', 404);

  await prisma.factorAislacionObra.upsert({
    where: { obraId_aplica: { obraId, aplica } },
    create: { obraId, aplica, factor },
    update: { factor },
  });

  return { aplica, factor };
}

export async function restaurarFactorAislacionPorDefecto(obraId: string, aplicaInput: unknown): Promise<void> {
  const aplica = validarAplica(aplicaInput);
  await prisma.factorAislacionObra.deleteMany({ where: { obraId, aplica } });
}
