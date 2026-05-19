import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import {
  listarClientesBeck,
  buscarClientesBeck,
  obtenerClienteBeck,
  crearClienteBeck,
  actualizarClienteBeck,
  cambiarEstadoClienteBeck,
  agregarContactoClienteBeck,
  actualizarContactoClienteBeck,
  cambiarEstadoContactoClienteBeck,
  obtenerOportunidadesClienteBeck,
} from '../services/clientes-beck.service';

function handleError(res: Response, error: unknown, contexto: string): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(400).json({ error: 'Ya existe un registro con ese valor único (RUT o correo duplicado).' });
    return;
  }

  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('no encontrado') || msg.includes('No encontrado')) {
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

    const clientes = await listarClientesBeck({ q, activo });
    res.json(clientes);
  } catch (error) {
    console.error('Error al listar clientes:', error);
    res.status(500).json({ error: 'Error al listar clientes.' });
  }
};

export const buscarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';

    if (!q.trim()) {
      res.status(400).json({ error: 'El parámetro q es obligatorio.' });
      return;
    }

    const clientes = await buscarClientesBeck(q);
    res.json(clientes);
  } catch (error) {
    handleError(res, error, 'buscar clientes');
  }
};

export const obtenerCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const cliente = await obtenerClienteBeck(id);
    res.json(cliente);
  } catch (error) {
    handleError(res, error, 'obtener cliente');
  }
};

export const crearCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const cliente = await crearClienteBeck(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    handleError(res, error, 'crear cliente');
  }
};

export const actualizarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const cliente = await actualizarClienteBeck(id, req.body);
    res.json(cliente);
  } catch (error) {
    handleError(res, error, 'actualizar cliente');
  }
};

export const cambiarEstadoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const { activo } = req.body as { activo?: unknown };

    if (typeof activo !== 'boolean' && activo !== 'true' && activo !== 'false') {
      res.status(400).json({ error: 'El campo activo es obligatorio y debe ser booleano.' });
      return;
    }

    const activoBool = typeof activo === 'boolean' ? activo : activo === 'true';

    const cliente = await cambiarEstadoClienteBeck(id, activoBool);
    res.json(cliente);
  } catch (error) {
    handleError(res, error, 'cambiar estado de cliente');
  }
};

export const agregarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const contacto = await agregarContactoClienteBeck(id, req.body);
    res.status(201).json(contacto);
  } catch (error) {
    handleError(res, error, 'agregar contacto');
  }
};

export const actualizarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contactoId } = req.params;

    if (typeof contactoId !== 'string' || !contactoId.trim()) {
      res.status(400).json({ error: 'ID de contacto inválido.' });
      return;
    }

    const contacto = await actualizarContactoClienteBeck(contactoId, req.body);
    res.json(contacto);
  } catch (error) {
    handleError(res, error, 'actualizar contacto');
  }
};

export const cambiarEstadoContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contactoId } = req.params;

    if (typeof contactoId !== 'string' || !contactoId.trim()) {
      res.status(400).json({ error: 'ID de contacto inválido.' });
      return;
    }

    const { activo } = req.body as { activo?: unknown };

    if (typeof activo !== 'boolean' && activo !== 'true' && activo !== 'false') {
      res.status(400).json({ error: 'El campo activo es obligatorio y debe ser booleano.' });
      return;
    }

    const activoBool = typeof activo === 'boolean' ? activo : activo === 'true';

    const contacto = await cambiarEstadoContactoClienteBeck(contactoId, activoBool);
    res.json(contacto);
  } catch (error) {
    handleError(res, error, 'cambiar estado de contacto');
  }
};

export const obtenerOportunidadesCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const oportunidades = await obtenerOportunidadesClienteBeck(id);
    res.json(oportunidades);
  } catch (error) {
    handleError(res, error, 'obtener oportunidades del cliente');
  }
};
