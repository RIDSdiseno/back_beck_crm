import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';
import {
  CAMPOS_POR_COLOR_POR_ROL,
  CAMPOS_REGISTRO_POR_ROL,
  ROLES_CON_RESTRICCIONES,
  RolCampo,
  normalizarRolConfiguracion,
} from '../config/camposRegistro.config';

export interface CampoVisibilidad {
  campo: string;
  label: string;
  rol: RolCampo;
  obraId: string;
  color: 'verde' | 'azul' | 'rojo';
  visible: boolean;
  bloqueado: boolean;
  configurable: boolean;
}

export interface ItemizadoMandanteResumen {
  id: string;
  codigoBeck: string | null;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

interface ConfiguracionRow {
  campo: string;
  visible: boolean;
}

function obtenerCatalogoRol(rol: RolCampo) {
  return CAMPOS_REGISTRO_POR_ROL[rol];
}

function obtenerRolEfectivo(rol: string): RolCampo {
  return normalizarRolConfiguracion(rol) ?? 'trabajador';
}

export async function existeObra(obraId: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM obras
    WHERE id = ${obraId}::uuid
    LIMIT 1
  `;
  return rows.length > 0;
}

/**
 * Devuelve la lista oficial de campos Excel con visibilidad efectiva para una obra.
 * Configuraciones antiguas/globales o campos desconocidos se ignoran.
 */
export async function obtenerConfiguracionCampos(
  rol: string,
  obraId: string,
): Promise<CampoVisibilidad[]> {
  const rolEfectivo = obtenerRolEfectivo(rol);
  const catalogo = obtenerCatalogoRol(rolEfectivo);
  const camposCatalogo = new Set(catalogo.map(c => c.campo));

  const dbConfigs = await prisma.$queryRaw<ConfiguracionRow[]>`
    SELECT campo, visible
    FROM configuracion_campos_registro
    WHERE obra_id = ${obraId}::uuid
      AND rol = ${rolEfectivo}
  `;

  const dbMap = new Map(
    dbConfigs
      .filter(c => camposCatalogo.has(c.campo))
      .map(c => [c.campo, c.visible]),
  );

  return catalogo.map(def => {
    if (def.color === 'verde') {
      return {
        ...def,
        rol: rolEfectivo,
        obraId,
        visible: true,
        bloqueado: true,
        configurable: false,
      };
    }
    if (def.color === 'rojo') {
      return {
        ...def,
        rol: rolEfectivo,
        obraId,
        visible: false,
        bloqueado: true,
        configurable: false,
      };
    }

    const visibleDB = dbMap.has(def.campo) ? (dbMap.get(def.campo) as boolean) : true;
    return {
      ...def,
      rol: rolEfectivo,
      obraId,
      visible: visibleDB,
      bloqueado: false,
      configurable: true,
    };
  });
}

function obtenerConfiguracionDefault(rol: string, obraId = ''): CampoVisibilidad[] {
  const rolEfectivo = obtenerRolEfectivo(rol);
  return obtenerCatalogoRol(rolEfectivo).map(def => ({
    ...def,
    rol: rolEfectivo,
    obraId,
    visible: def.color === 'rojo' ? false : true,
    bloqueado: def.color !== 'azul',
    configurable: def.color === 'azul',
  }));
}

/**
 * Persiste solo campos azules para jefeobra/trabajador por obra.
 * Campos verdes, rojos o desconocidos se ignoran por seguridad.
 */
export async function actualizarConfiguracionCampos(
  updates: { obraId: string; campo: string; rol: RolCampo; visible: boolean }[],
  updatedByUserId: string,
): Promise<void> {
  const rolesValidos = new Set(ROLES_CON_RESTRICCIONES);

  const validUpdates = updates.filter((u) => {
    if (!rolesValidos.has(u.rol)) return false;
    return CAMPOS_POR_COLOR_POR_ROL[u.rol].azul.includes(u.campo);
  });

  for (const u of validUpdates) {
    await prisma.configuracionCamposRegistro.upsert({
      where: {
        obraId_rol_campo: {
          obraId: u.obraId,
          rol: u.rol,
          campo: u.campo,
        },
      },
      update: {
        visible: u.visible,
        updatedByUserId: updatedByUserId || null,
      },
      create: {
        obraId: u.obraId,
        rol: u.rol,
        campo: u.campo,
        visible: u.visible,
        updatedByUserId: updatedByUserId || null,
      },
    });
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function getValue(registro: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (registro[key] !== undefined) return registro[key];
  }
  return null;
}

function getObraId(registro: Record<string, unknown>): string | null {
  const direct = getValue(registro, 'obraId', 'obra_id');
  if (typeof direct === 'string' && direct.trim()) return direct;

  const obra = asRecord(registro.obra);
  const nested = obra?.id;
  return typeof nested === 'string' && nested.trim() ? nested : null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'object' && 'toString' in value) {
    const n = Number(String(value));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatDateOnly(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ?? null;
}

function getFoto(registro: Record<string, unknown>): unknown {
  const fotoUrl = getValue(registro, 'foto', 'fotoUrl');
  if (fotoUrl) return fotoUrl;

  const fotosUrls = getValue(registro, 'fotosUrls', 'fotos_urls');
  if (Array.isArray(fotosUrls)) return fotosUrls[0] ?? null;
  return null;
}

function mapearRegistroAExcel(registro: Record<string, unknown>): Record<string, unknown> {
  const itemizadoMandante = asRecord(registro.itemizadoMandante);
  const cantidadSellos = toNumber(getValue(registro, 'cantidadSellos', 'cantidad_sellos'));
  const holgura = toNumber(getValue(registro, 'holgura'));
  const factorHolguras = toNumber(
    getValue(registro, 'factorHolguras', 'factor_holguras', 'factor_por_holguras')
  );
  const cantidadSellosConFactores = cantidadSellos !== null && factorHolguras !== null
    ? cantidadSellos * factorHolguras
    : getValue(registro, 'cantidadSellosConFactores', 'cantidad_sellos_con_factores');
  const cantidadFinal = getValue(
    registro,
    'cantidad_final',
    'cantidadFinal',
  );
  const itemizadoBeck = getValue(
    registro,
    'itemizadoBeck',
    'itemizado_beck',
    'descripcionMaterial',
    'descripcion_material',
  );

  return {
    codigoBeck: getValue(registro, 'codigoBeck', 'codigo_beck'),
    itemizadoBeck,
    itemizadoMandante: itemizadoMandante
      ? {
        id: itemizadoMandante.id ?? null,
        codigoBeck: itemizadoMandante.codigoBeck ?? null,
        nombre: itemizadoMandante.nombre ?? null,
        descripcion: itemizadoMandante.descripcion ?? null,
        activo: itemizadoMandante.activo ?? null,
      }
      : getValue(registro, 'itemizadoMandante', 'itemizado_mandante'),
    fechaEjecucionSello: formatDateOnly(getValue(registro, 'fechaEjecucionSello', 'fecha_ejecucion_sello', 'fecha')),
    diaSemana: getValue(registro, 'diaSemana', 'dia_semana'),
    piso: getValue(registro, 'piso'),
    eje_alfabetico: getValue(registro, 'eje_alfabetico', 'ejeAlfabetico'),
    eje_numerico: getValue(registro, 'eje_numerico', 'ejeNumerico'),
    nombreSellador: getValue(registro, 'nombreSellador', 'nombre_sellador'),
    foto: getFoto(registro),
    recinto: getValue(registro, 'recinto', 'modulo'),
    modulo: getValue(registro, 'modulo', 'moduloEdificio', 'modulo_edificio'),
    numeroSello: getValue(registro, 'numeroSello', 'numero_sello'),
    cantidadSellos,
    holgura,
    factor_por_holguras: factorHolguras,
    cielo_modular: getValue(registro, 'cielo_modular', 'cieloModular'),
    cantidad_sellos_con_factores: cantidadSellosConFactores,
    aislacion: getValue(registro, 'aislacion'),
    cantidad_sellos_aislacion: getValue(registro, 'cantidad_sellos_aislacion', 'cantidadSellosAislacion'),
    reparacion_tabique: getValue(registro, 'reparacion_tabique', 'reparacionTabique'),
    cantidad_final: cantidadFinal,
    observaciones: getValue(registro, 'observaciones'),
    folio: getValue(registro, 'folio'),
  };
}

function filtrarRegistroConConfig<T extends Record<string, unknown>>(
  registro: T,
  config: CampoVisibilidad[],
): Partial<T> {
  const camposVisibles = new Set(config.filter(c => c.visible).map(c => c.campo));
  const registroExcel = mapearRegistroAExcel(registro);

  return Object.fromEntries(
    Object.entries(registroExcel).filter(([key]) => camposVisibles.has(key)),
  ) as Partial<T>;
}

export async function sanitizarRegistroPorRol<T extends Record<string, unknown>>(
  registro: T,
  rol: string,
  obraId?: string | null,
): Promise<Partial<T>> {
  const obraIdEfectiva = obraId ?? getObraId(registro);
  if (!obraIdEfectiva) return filtrarRegistroConConfig(registro, obtenerConfiguracionDefault(rol));

  const config = await obtenerConfiguracionCampos(rol, obraIdEfectiva);
  return filtrarRegistroConConfig(registro, config);
}

export async function sanitizarRegistrosPorRol<T extends Record<string, unknown>>(
  registros: T[],
  rol: string,
  obraId?: string | null,
): Promise<Partial<T>[]> {
  if (registros.length === 0) return [];

  const configsPorObra = new Map<string, CampoVisibilidad[]>();

  return Promise.all(registros.map(async (reg) => {
    const obraIdRegistro = obraId ?? getObraId(reg);
    if (!obraIdRegistro) return filtrarRegistroConConfig(reg, obtenerConfiguracionDefault(rol));

    let config = configsPorObra.get(obraIdRegistro);
    if (!config) {
      config = await obtenerConfiguracionCampos(rol, obraIdRegistro);
      configsPorObra.set(obraIdRegistro, config);
    }

    return filtrarRegistroConConfig(reg, config);
  }));
}

export async function adjuntarCodigosBeck<T extends Record<string, unknown>>(registros: T[]): Promise<T[]> {
  const ids = registros
    .map(reg => reg.id)
    .filter((id): id is string => typeof id === 'string');

  if (ids.length === 0) return registros;

  try {
    const rows = await prisma.$queryRaw<{ id: string; codigo_beck: string | null }[]>`
      SELECT id, codigo_beck
      FROM registros_terreno
      WHERE id IN (${Prisma.join(ids)})
    `;
    const codigos = new Map(rows.map(row => [row.id, row.codigo_beck]));

    return registros.map(reg => ({
      ...reg,
      codigoBeck: typeof reg.id === 'string' ? codigos.get(reg.id) ?? null : null,
    }));
  } catch {
    return registros;
  }
}

export async function obtenerItemizadoMandanteActivo(
  itemizadoMandanteId: string,
): Promise<ItemizadoMandanteResumen | null> {
  const rows = await prisma.$queryRaw<{
    id: string;
    codigo_beck: string | null;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
  }[]>`
    SELECT id, codigo_beck, nombre, descripcion, activo
    FROM itemizados_mandante
    WHERE id = ${itemizadoMandanteId}::uuid AND activo = TRUE
    LIMIT 1
  `;

  const item = rows[0];
  if (!item) return null;

  return {
    id: item.id,
    codigoBeck: item.codigo_beck,
    nombre: item.nombre,
    descripcion: item.descripcion,
    activo: item.activo,
  };
}

export async function adjuntarItemizadosMandante<T extends Record<string, unknown>>(registros: T[]): Promise<T[]> {
  const ids = registros
    .map(reg => reg.id)
    .filter((id): id is string => typeof id === 'string');

  if (ids.length === 0) return registros;

  try {
    const rows = await prisma.$queryRaw<{
      registro_id: string;
      itemizado_mandante_id: string | null;
      codigo_beck: string | null;
      nombre: string | null;
      descripcion: string | null;
      activo: boolean | null;
    }[]>`
      SELECT
        rt.id AS registro_id,
        rt.itemizado_mandante_id,
        im.codigo_beck,
        im.nombre,
        im.descripcion,
        im.activo
      FROM registros_terreno rt
      LEFT JOIN itemizados_mandante im ON im.id = rt.itemizado_mandante_id
      WHERE rt.id IN (${Prisma.join(ids)})
    `;

    const itemizados = new Map(rows.map(row => [
      row.registro_id,
      row.itemizado_mandante_id
        ? {
          id: row.itemizado_mandante_id,
          codigoBeck: row.codigo_beck,
          nombre: row.nombre,
          descripcion: row.descripcion,
          activo: row.activo,
        }
        : null,
    ]));

    return registros.map(reg => {
      const itemizadoMandante = typeof reg.id === 'string' ? itemizados.get(reg.id) ?? null : null;
      return {
        ...reg,
        itemizadoMandanteId: itemizadoMandante?.id ?? null,
        itemizadoMandante,
        itemizadoMandanteNombre: itemizadoMandante?.nombre ?? null,
      };
    });
  } catch {
    return registros;
  }
}
