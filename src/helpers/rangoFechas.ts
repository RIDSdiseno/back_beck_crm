export type RangoRapido = 'hoy' | 'semana' | 'mes' | 'completa';

export const rangosRapidosValidos: RangoRapido[] = ['hoy', 'semana', 'mes', 'completa'];

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * hoy: día actual completo.
 * semana: últimos 7 días corridos (hoy - 6 días hasta hoy), no semana calendario ISO.
 * mes: mes calendario actual completo (día 1 al último día del mes).
 * completa: sin límite de fecha.
 */
export const getDateRange = (rango: RangoRapido): { fechaDesde: Date | null; fechaHasta: Date | null } => {
  const now = new Date();

  if (rango === 'completa') {
    return { fechaDesde: null, fechaHasta: null };
  }

  if (rango === 'hoy') {
    return {
      fechaDesde: startOfDay(now),
      fechaHasta: endOfDay(now),
    };
  }

  if (rango === 'semana') {
    const fechaDesde = startOfDay(now);
    fechaDesde.setDate(fechaDesde.getDate() - 6);

    return {
      fechaDesde,
      fechaHasta: endOfDay(now),
    };
  }

  return {
    fechaDesde: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    fechaHasta: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
};
