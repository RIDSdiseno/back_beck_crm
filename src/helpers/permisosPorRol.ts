import { RolUsuario } from '../types';

export interface PermisoBase {
  modulo: string;
  puedeVer: boolean;
  puedeEditar: boolean;
}

export const TODOS_LOS_MODULOS: string[] = [
  'beck_dashboard',
  'beck_procesamiento_ingenieria',
  'beck_oficina_tecnica',
  'beck_registro',
  'beck_reportes',
  'beck_cotizaciones',
  'beck_movimientos',
  'beck_obras',
  'beck_funnel',
  'beck_clientes',
  'beck_vista_cliente',
  'beck_usuarios_parametros',
  'beck_reglas_validacion',
  'beck_cambiar_empresa',
  'firemat_dashboard',
  'firemat_funnel',
  'firemat_cotizaciones',
  'firemat_clientes',
  'firemat_productos',
  'firemat_categorias',
  'firemat_inventario',
  'firemat_ventas',
  'firemat_movimientos',
  'firemat_reportes',
  'firemat_usuarios_parametros',
  'firemat_cambiar_empresa',
];

function buildPermisos(
  acceso: Partial<Record<string, { ver: boolean; editar: boolean }>>,
): PermisoBase[] {
  return TODOS_LOS_MODULOS.map((modulo) => {
    const cfg = acceso[modulo];
    return { modulo, puedeVer: cfg?.ver ?? false, puedeEditar: cfg?.editar ?? false };
  });
}

function grant(
  modulos: string[],
  ver: boolean,
  editar: boolean,
): Partial<Record<string, { ver: boolean; editar: boolean }>> {
  return Object.fromEntries(modulos.map((m) => [m, { ver, editar }]));
}

export const PERMISOS_POR_ROL: Record<RolUsuario, PermisoBase[]> = {
  administrador: buildPermisos(grant(TODOS_LOS_MODULOS, true, true)),

  vendedor: buildPermisos(
    grant(
      ['beck_dashboard', 'beck_funnel', 'beck_cotizaciones', 'beck_clientes', 'beck_movimientos', 'beck_reportes', 'beck_vista_cliente'],
      true,
      true,
    ),
  ),

  ingenieria: buildPermisos(
    grant(
      ['beck_dashboard', 'beck_procesamiento_ingenieria', 'beck_oficina_tecnica', 'beck_registro', 'beck_reportes', 'beck_obras', 'beck_usuarios_parametros'],
      true,
      true,
    ),
  ),

  terreno: buildPermisos(grant(['beck_registro'], true, true)),

  jefeobra: buildPermisos(
    grant(['beck_dashboard', 'beck_registro', 'beck_obras', 'beck_usuarios_parametros'], true, true),
  ),

  visualizador: buildPermisos(
    grant(
      ['beck_dashboard', 'beck_funnel', 'beck_cotizaciones', 'beck_reportes', 'beck_clientes', 'beck_vista_cliente'],
      true,
      false,
    ),
  ),

  vendedor_firemat: buildPermisos({
    ...grant(['firemat_funnel', 'firemat_cotizaciones', 'firemat_clientes'], true, true),
    ...grant(
      [
        'firemat_dashboard',
        'firemat_productos',
        'firemat_categorias',
        'firemat_inventario',
        'firemat_ventas',
        'firemat_movimientos',
        'firemat_reportes',
      ],
      true,
      false,
    ),
  }),

  bodeguero: buildPermisos({
    ...grant(
      ['firemat_productos', 'firemat_categorias', 'firemat_inventario', 'firemat_ventas'],
      true,
      true,
    ),
    ...grant(['firemat_dashboard', 'firemat_movimientos', 'firemat_reportes'], true, false),
  }),

  visualizador_firemat: buildPermisos(
    grant(
      [
        'firemat_dashboard',
        'firemat_funnel',
        'firemat_cotizaciones',
        'firemat_clientes',
        'firemat_productos',
        'firemat_categorias',
        'firemat_inventario',
        'firemat_movimientos',
        'firemat_reportes',
      ],
      true,
      false,
    ),
  ),

  cliente: buildPermisos(grant(['beck_vista_cliente'], true, false)),
};
