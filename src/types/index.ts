
export type RolUsuario =
  | 'administrador'
  | 'vendedor'
  | 'terreno'
  | 'ingenieria'
  | 'visualizador'
  | 'jefeobra'
  | 'vendedor_firemat'
  | 'bodeguero'
  | 'visualizador_firemat'
  | 'cliente';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  azure_id: string | null;
  password_hash: string | null;
  rol: RolUsuario;
  activo: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface Obra {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  creado_por_id: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Itemizado {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio_unitario: number;
  creado_por_id: string;
  created_at: Date;
  updated_at?: Date;
}

export type FactorHolgura = 1 | 1.2 | 1.4 | 1.8;
export type FactorAccesibilidad = 1 | 2 | 3;
export type EstadoRegistroTerreno = 'pendiente' | 'en_revision' | 'validado' | 'rechazado';
export type TipoRegistroTerreno = 'sello_cortafuego' | 'junta_lineal_espuma' | 'tabiqueria' | 'otros';

export interface RegistroTerreno {
  id: string;
  codigo_beck?: string | null;
  itemizado_mandante_id?: string | null;
  obra_id: string;
  usuario_id: string;
  fecha: Date;
  dia_semana: string;
  descripcion_material: string;
  modulo: string;
  piso: string;
  eje_numerico: string;
  eje_alfabetico: string;
  numero_sello: string;
  cantidad_sellos: number;
  nombre_sellador: string;
  holgura: FactorHolgura;
  observaciones?: string;
  fotos_urls: string[];
  tipo_registro: TipoRegistroTerreno;
  metros_lineales?: number | null;
  itemizado_mandante?: string | null;
  factor_por_holguras?: number | null;
  cielo_modular?: number | null;
  cantidad_sellos_con_factores?: number | null;
  aislacion?: number | null;
  cantidad_sellos_aislacion?: number | null;
  reparacion_tabique?: number | null;
  cantidad_final?: number | null;
  estado: EstadoRegistroTerreno;
  created_at: Date;
  updated_at?: Date;
}

export interface ProcesamientoIngenieria {
  id: string;
  registro_terreno_id: string;
  usuario_id: string;
  codigo: string | null;
  itemizado_id: string | null;
  total_sellos_calculado: number | null;
  notas?: string | null;
  procesado_at: Date;
}

export type TipoNotificacion = 'nuevo_registro' | 'registro_procesado' | 'alerta_inventario' | 'sistema';

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: TipoNotificacion;
  referencia_id?: string; // ID del registro/recurso relacionado
  mensaje: string;
  leido: boolean;
  created_at: Date;
}

export interface Producto {
  id: string;
  codigo_producto: string;
  nombre: string;
  descripcion?: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion?: string;
  created_at: Date;
  updated_at?: Date;
}

export type TipoMovimiento = 'ingreso' | 'egreso';

export interface MovimientoInventario {
  id: string;
  producto_id: string;
  tipo: TipoMovimiento;
  cantidad: number;
  usuario_id: string;
  codigo_escaneado?: string;
  observaciones?: string;
  created_at: Date;
}

export type EstadoCotizacion = 'borrador' | 'enviada' | 'aprobada' | 'rechazada';

export interface ItemCotizacion {
  itemizado_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Cotizacion {
  id: string;
  numero: string; // Auto-generado COT-YYYY-0001
  cliente: string;
  obra_id?: string;
  items: ItemCotizacion[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: EstadoCotizacion;
  creado_por_id: string;
  created_at: Date;
  updated_at?: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    empresaDefault: 'beck' | 'firemat';
  };
}

export interface CreateRegistroTerrenoDTO {
  obra_id: string;
  codigo_beck?: string | null;
  itemizadoMandanteId?: string | null;
  fecha?: string;
  descripcion_material: string;
  modulo: string;
  piso: string;
  eje_numerico: string;
  eje_alfabetico: string;
  numero_sello: string;
  cantidad_sellos: number;
  nombre_sellador: string;
  holgura: FactorHolgura;
  accesibilidad: FactorAccesibilidad;
  observaciones?: string;
  tipo_registro?: TipoRegistroTerreno;
  metros_lineales?: number | null;
  factor_por_holguras?: number | null;
  factorPorHolguras?: number | string | null;
  cielo_modular?: number | null;
  cieloModular?: number | string | null;
  cantidad_sellos_con_factores?: number | null;
  cantidadSellosConFactores?: number | string | null;
  aislacion?: number | string | null;
  cantidad_sellos_aislacion?: number | null;
  cantidadSellosAislacion?: number | string | null;
  reparacion_tabique?: number | null;
  reparacionTabique?: number | string | null;
  cantidad_final?: number | null;
  cantidadFinal?: number | string | null;
  // fotos se suben como multipart/form-data
}

export interface CreateProcesamientoDTO {
  registro_terreno_id: string;
  codigo: string;
  itemizado_id: string;
  notas?: string;
}
