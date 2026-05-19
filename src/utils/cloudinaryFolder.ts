const DEFAULT_SEGMENT = 'sin-dato';

function formatDateSegment(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export function sanitizeCloudinaryFolderSegment(value: unknown, fallback = DEFAULT_SEGMENT): string {
  const sanitized = String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\\/]+/g, '-')
    .replace(/[^a-zA-Z0-9 ._-]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return sanitized || fallback;
}

export function buildCloudinaryFolder(
  codigoObra: unknown,
  fecha: Date,
  piso: unknown,
  nombreSellador: unknown,
): string {
  const year = Number.isNaN(fecha.getTime()) ? new Date().getFullYear() : fecha.getFullYear();
  const dateSegment = formatDateSegment(fecha);

  return [
    'BeckSoluciones',
    String(year),
    sanitizeCloudinaryFolderSegment(codigoObra, 'sin-obra'),
    `Piso ${sanitizeCloudinaryFolderSegment(piso, 'sin-piso')}`,
    dateSegment,
    sanitizeCloudinaryFolderSegment(nombreSellador, 'sin-sellador'),
    'registros',
  ].join('/');
}
