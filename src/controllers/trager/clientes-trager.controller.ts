import { Request, Response } from 'express';
import { Prisma } from '../../generated/trager-client';
import {
  listarClientesTrager,
  obtenerClienteTrager,
  crearClienteTrager,
  actualizarClienteTrager,
  cambiarEstadoClienteTrager,
  eliminarClienteTrager,
} from '../../services/trager/clientes-trager.service';

const parseId = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

function handleError(res: Response, error: unknown, contexto: string): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Ya existe un cliente con ese RUT.' });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }
  }

  if (error instanceof Error) {
    const msg = error.message;
    if (msg.toLowerCase().includes('no encontrado')) {
      res.status(404).json({ error: msg });
      return;
    }
    res.status(400).json({ error: msg });
    return;
  }

  console.error(`Error en ${contexto}:`, error);
  res.status(500).json({ error: `Error interno al ${contexto}.` });
}

export const listarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;

    let activo: boolean | undefined;
    if (typeof req.query.activo === 'string') {
      activo = req.query.activo === 'true';
    }

    const clientes = await listarClientesTrager({ q, activo });
    res.json({ success: true, data: clientes });
  } catch (error) {
    handleError(res, error, 'listar clientes');
  }
};

export const obtenerCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }
    const cliente = await obtenerClienteTrager(id);
    res.json({ success: true, data: cliente });
  } catch (error) {
    handleError(res, error, 'obtener cliente');
  }
};

export const crearCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const cliente = await crearClienteTrager(req.body ?? {});
    res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    handleError(res, error, 'crear cliente');
  }
};

export const actualizarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }
    const cliente = await actualizarClienteTrager(id, req.body ?? {});
    res.json({ success: true, data: cliente });
  } catch (error) {
    handleError(res, error, 'actualizar cliente');
  }
};

export const cambiarEstadoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }
    const activo = Boolean((req.body as Record<string, unknown>)?.activo);
    const cliente = await cambiarEstadoClienteTrager(id, activo);
    res.json({ success: true, data: cliente });
  } catch (error) {
    handleError(res, error, 'cambiar estado del cliente');
  }
};

export const eliminarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }
    await eliminarClienteTrager(id);
    res.json({ success: true });
  } catch (error) {
    handleError(res, error, 'eliminar cliente');
  }
};
