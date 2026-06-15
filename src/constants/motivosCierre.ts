export const MOTIVOS_DESCARTE = [
  "Sin fit comercial",
  "No corresponde a Beck o Firemat",
  "Consulta irrelevante",
  "Sin proyecto real",
  "Sin respuesta inicial",
  "Contacto duplicado",
  "Información insuficiente",
  "Fuera de zona o alcance",
  "Bajo potencial",
  "Otro",
];

export const MOTIVOS_PERDIDA = [
  "Precio",
  "Competencia",
  "Timing",
  "Cliente postergó decisión",
  "Cliente canceló proyecto",
  "Proyecto adjudicado a otro proveedor",
  "Falta de stock",
  "Plazo de entrega",
  "Margen insuficiente",
  "Condiciones comerciales",
  "Falta de respuesta final",
  "Decisión interna del cliente",
  "Solución técnica no compatible",
  "Otro",
];

export const MOTIVOS_POSTERGACION = [
  "Proyecto paralizado",
  "Obra detenida",
  "Compra futura",
  "Cliente pidió retomar más adelante",
  "Sin fecha clara de decisión",
  "Espera de presupuesto",
  "Espera de licitación",
  "Recompra futura",
  "Decisión congelada",
  "Otro",
];

export type TipoMotivoCierre = "DESCARTE" | "PERDIDA" | "POSTERGACION";

export function obtenerMotivosCierre(tipo: TipoMotivoCierre): string[] {
  switch (tipo) {
    case "DESCARTE":    return MOTIVOS_DESCARTE;
    case "PERDIDA":     return MOTIVOS_PERDIDA;
    case "POSTERGACION": return MOTIVOS_POSTERGACION;
  }
}

export function validarMotivoCierre(tipo: TipoMotivoCierre, valor?: string | null): boolean {
  if (!valor || !valor.trim()) return false;
  const trimmed = valor.trim();

  // "Otro" exacto sin detalle es inválido para guardar
  if (trimmed === "Otro") return false;

  // "Otro: detalle" es válido si hay texto no vacío después de ":"
  if (trimmed.startsWith("Otro:")) {
    const detalle = trimmed.slice("Otro:".length).trim();
    return detalle.length > 0;
  }

  // Debe estar exactamente en la lista
  return obtenerMotivosCierre(tipo).includes(trimmed);
}

export class MotivoInvalidoError extends Error {
  readonly detalles: string[];
  constructor(detalles: string[]) {
    super("Motivo inválido");
    this.name = "MotivoInvalidoError";
    this.detalles = detalles;
  }
}
