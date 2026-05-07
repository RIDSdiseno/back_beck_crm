import { EstadoCotizacion, TipoLineaCotizacion } from '@prisma/client';

export { TipoLineaCotizacion };

export type LineaInput = {
  tipoLinea: TipoLineaCotizacion;
  descripcion: string;
  unidad: string | null;
  cantidad: number;
  precioUnitario: number;
  gananciaPct: number;
  subtotal: number;
  orden: number;
  notasLinea: string | null;
  productoFirematId?: number | null;
};

export type CotizacionTotals = {
  lineasCalculadas: LineaInput[];
  subtotal: number;
  descuentoMonto: number;
  neto: number;
  impuesto: number;
  total: number;
};

export type CreateCotizacionInput = {
  numero: string | null;
  clienteNombre: string;
  obraId: string | null;
  funnelBeckId: string | null;
  descuento: number;
  aplicaImpuesto: boolean;
  vigencia: Date;
  observaciones: string | null;
  lineas: LineaInput[];
  total?: number;
};

export type UpdateCotizacionInput = {
  numero?: string | null;
  clienteNombre?: string;
  obraId?: string | null;
  funnelBeckId?: string | null;
  estado?: EstadoCotizacion;
  descuento?: number;
  aplicaImpuesto?: boolean;
  vigencia?: Date;
  observaciones?: string | null;
  lineas?: LineaInput[];
  total?: number;
};

export class CotizacionError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'CotizacionError';
  }
}
