// src/helpers/tiposRegistro.ts
import { prisma } from '../config/prisma';

export const TIPOS_REGISTRO_VALIDOS = [
  'sello_cortafuego',
  'tabiqueria',
  'junta_lineal_espuma',
  'otros',
] as const;

export type TipoRegistroPermitido = (typeof TIPOS_REGISTRO_VALIDOS)[number];

export type ValidacionTipoResult = {
  permitido: boolean;
  warning?: string;
  error?: string;
  tiposConfigurados: string[];
  tipoNormalizado: TipoRegistroPermitido | null;
};

/**
 * Devuelve el tipo normalizado si es válido según TIPOS_REGISTRO_VALIDOS, o null si no lo es.
 */
export function normalizarTipoRegistro(valor: unknown): TipoRegistroPermitido | null {
  if (typeof valor !== 'string') return null;
  const v = valor.trim() as TipoRegistroPermitido;
  return TIPOS_REGISTRO_VALIDOS.includes(v) ? v : null;
}

/**
 * Type guard: verifica que todos los elementos del array sean tipos válidos del sistema.
 */
export function validarTiposRegistroSistema(tipos: unknown[]): tipos is TipoRegistroPermitido[] {
  return tipos.every(
    (t) => typeof t === 'string' && TIPOS_REGISTRO_VALIDOS.includes(t as TipoRegistroPermitido),
  );
}

/**
 * Valida si un tipo de registro está permitido para una obra concreta.
 *
 * Reglas:
 *  1. Si el tipo no existe en TIPOS_REGISTRO_VALIDOS → error (tipo inválido del sistema).
 *  2. Si la obra no tiene configuración de tipos → permitido con advertencia
 *     (comportamiento permisivo para obras sin configurar).
 *  3. Si la obra tiene tipos configurados y el tipo está incluido → permitido.
 *  4. Si la obra tiene tipos configurados y el tipo NO está incluido → error (bloqueante).
 */
export async function validarTipoRegistroPermitidoPorObra(
  obraId: string,
  tipoRegistro: string,
): Promise<ValidacionTipoResult> {
  const tipoNormalizado = normalizarTipoRegistro(tipoRegistro);

  if (!tipoNormalizado) {
    return {
      permitido: false,
      error: 'Tipo de registro inválido.',
      tiposConfigurados: [],
      tipoNormalizado: null,
    };
  }

  const registros = await prisma.obraTipoRegistro.findMany({
    where: { obraId, activo: true },
    select: { tipoRegistro: true },
    orderBy: { tipoRegistro: 'asc' },
  });

  const tiposConfigurados = registros.map((r) => r.tipoRegistro);

  if (tiposConfigurados.length === 0) {
    return {
      permitido: true,
      warning:
        'Esta obra aún no tiene tipos de registro configurados por Ingeniería. Se permitió continuar usando el comportamiento actual del sistema.',
      tiposConfigurados,
      tipoNormalizado,
    };
  }

  if (tiposConfigurados.includes(tipoNormalizado)) {
    return {
      permitido: true,
      tiposConfigurados,
      tipoNormalizado,
    };
  }

  return {
    permitido: false,
    error: 'El tipo de registro no está habilitado para esta obra.',
    tiposConfigurados,
    tipoNormalizado,
  };
}
