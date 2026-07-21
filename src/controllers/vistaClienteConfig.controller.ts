import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import {
  buildConfiguracionVistaCliente,
  resolveConfiguracionEfectiva,
  VISTA_CLIENTE_CLAVES,
} from '../helpers/configuracionVistaCliente';


type VistaClienteInputItem = {
  clave?: unknown;
  visible?: unknown;
  tituloPersonalizado?: unknown;
  orden?: unknown;
};

type VistaClienteParsedItem = {
  clave: string;
  visible: boolean;
  tituloPersonalizado: string | null;
  orden: number | null;
};

function parseItems(value: unknown): { items?: VistaClienteParsedItem[]; error?: string } {
  if (!Array.isArray(value)) return { error: 'items debe ser un array' };

  const seen = new Set<string>();
  const items: VistaClienteParsedItem[] = [];

  for (const raw of value as VistaClienteInputItem[]) {
    if (!raw || typeof raw !== 'object') return { error: 'Cada item debe ser un objeto' };

    if (typeof raw.clave !== 'string' || !VISTA_CLIENTE_CLAVES.has(raw.clave)) {
      return { error: `Clave de vista cliente invalida: ${String(raw.clave ?? '')}` };
    }

    if (seen.has(raw.clave)) return { error: `Clave duplicada: ${raw.clave}` };
    seen.add(raw.clave);

    if (typeof raw.visible !== 'boolean') {
      return { error: `visible debe ser boolean para ${raw.clave}` };
    }

    if (
      raw.tituloPersonalizado !== undefined &&
      raw.tituloPersonalizado !== null &&
      typeof raw.tituloPersonalizado !== 'string'
    ) {
      return { error: `tituloPersonalizado debe ser string o null para ${raw.clave}` };
    }

    if (
      raw.orden !== undefined &&
      raw.orden !== null &&
      (!Number.isInteger(Number(raw.orden)) || Number(raw.orden) < 0)
    ) {
      return { error: `orden debe ser un entero >= 0 para ${raw.clave}` };
    }

    const titulo = typeof raw.tituloPersonalizado === 'string'
      ? raw.tituloPersonalizado.trim() || null
      : null;

    items.push({
      clave: raw.clave,
      visible: raw.visible,
      tituloPersonalizado: titulo,
      orden: raw.orden === undefined || raw.orden === null ? null : Number(raw.orden),
    });
  }

  return { items };
}

const SELECT_FIELDS = {
  clave: true,
  visible: true,
  tituloPersonalizado: true,
  orden: true,
} as const;


/**
 * GET /api/vista-cliente/configuracion/general
 * Devuelve la configuración global de vista cliente (base para todos).
 */
export const getConfiguracionGeneral = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await prisma.configuracionVistaClienteGeneral.findMany({
      select: SELECT_FIELDS,
    });

    res.json({ configuracionVista: buildConfiguracionVistaCliente(rows) });
  } catch (error) {
    console.error('Error obteniendo configuracion general de vista cliente:', error);
    res.status(500).json({ error: 'Error al obtener configuracion general' });
  }
};

/**
 * PUT /api/vista-cliente/configuracion/general
 * Guarda la configuración global de vista cliente.
 * Body: { items: [...] }
 */
export const putConfiguracionGeneral = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[vista-cliente/configuracion/general] body recibido', req.body);

    const parsed = parseItems((req.body as { items?: unknown }).items);
    if (parsed.error || !parsed.items) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    console.log(
      '[vista-cliente/configuracion/general] items recibidos',
      parsed.items.map((item) => ({
        clave: item.clave,
        visible: item.visible,
        tituloPersonalizado: item.tituloPersonalizado,
        orden: item.orden,
      })),
    );

    if (parsed.items.length > 0) {
      await prisma.$transaction(
        parsed.items.map((item) =>
          prisma.configuracionVistaClienteGeneral.upsert({
            where: { clave: item.clave },
            update: {
              visible: item.visible,
              tituloPersonalizado: item.tituloPersonalizado,
              orden: item.orden,
            },
            create: {
              clave: item.clave,
              visible: item.visible,
              tituloPersonalizado: item.tituloPersonalizado,
              orden: item.orden,
            },
          })
        )
      );
    }

    const rows = await prisma.configuracionVistaClienteGeneral.findMany({
      select: SELECT_FIELDS,
    });

    res.json({ configuracionVista: buildConfiguracionVistaCliente(rows) });
  } catch (error) {
    console.error('Error actualizando configuracion general de vista cliente:', error);
    res.status(500).json({ error: 'Error al actualizar configuracion general' });
  }
};


/**
 * GET /api/vista-cliente/configuracion/cliente/:clienteBeckId
 * Devuelve la configuración efectiva para un Cliente Beck:
 * general → clienteBeck (clienteBeck sobreescribe general).
 */
export const getConfiguracionBeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteBeckId } = req.params as { clienteBeckId: string };

    const clienteBeck = await prisma.clienteBeck.findUnique({
      where: { id: clienteBeckId },
      select: { id: true, nombreEmpresa: true, razonSocial: true },
    });

    if (!clienteBeck) {
      res.status(404).json({ error: 'Cliente Beck no encontrado' });
      return;
    }

    const [generalRows, beckRows] = await Promise.all([
      prisma.configuracionVistaClienteGeneral.findMany({ select: SELECT_FIELDS }),
      prisma.configuracionVistaClienteBeck.findMany({
        where: { clienteBeckId },
        select: SELECT_FIELDS,
      }),
    ]);

    res.json({
      clienteBeck,
      configuracionVista: resolveConfiguracionEfectiva([], beckRows, generalRows),
    });
  } catch (error) {
    console.error('Error obteniendo configuracion de cliente Beck:', error);
    res.status(500).json({ error: 'Error al obtener configuracion de cliente Beck' });
  }
};

/**
 * PUT /api/vista-cliente/configuracion/cliente/:clienteBeckId
 * Guarda la configuración específica de un Cliente Beck.
 * Devuelve la config efectiva (general + clienteBeck).
 * Body: { items: [...] }
 */
export const putConfiguracionBeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteBeckId } = req.params as { clienteBeckId: string };

    const clienteBeck = await prisma.clienteBeck.findUnique({
      where: { id: clienteBeckId },
      select: { id: true, nombreEmpresa: true, razonSocial: true },
    });

    if (!clienteBeck) {
      res.status(404).json({ error: 'Cliente Beck no encontrado' });
      return;
    }

    const parsed = parseItems((req.body as { items?: unknown }).items);
    if (parsed.error || !parsed.items) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    if (parsed.items.length > 0) {
      await prisma.$transaction(
        parsed.items.map((item) =>
          prisma.configuracionVistaClienteBeck.upsert({
            where: {
              clienteBeckId_clave: {
                clienteBeckId,
                clave: item.clave,
              },
            },
            update: {
              visible: item.visible,
              tituloPersonalizado: item.tituloPersonalizado,
              orden: item.orden,
            },
            create: {
              clienteBeckId,
              clave: item.clave,
              visible: item.visible,
              tituloPersonalizado: item.tituloPersonalizado,
              orden: item.orden,
            },
          })
        )
      );
    }

    const [generalRows, beckRows] = await Promise.all([
      prisma.configuracionVistaClienteGeneral.findMany({ select: SELECT_FIELDS }),
      prisma.configuracionVistaClienteBeck.findMany({
        where: { clienteBeckId },
        select: SELECT_FIELDS,
      }),
    ]);

    res.json({
      clienteBeck,
      configuracionVista: resolveConfiguracionEfectiva([], beckRows, generalRows),
    });
  } catch (error) {
    console.error('Error actualizando configuracion de cliente Beck:', error);
    res.status(500).json({ error: 'Error al actualizar configuracion de cliente Beck' });
  }
};
