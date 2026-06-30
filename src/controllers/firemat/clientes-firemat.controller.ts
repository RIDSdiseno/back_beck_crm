import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import {
  listarClientesFiremat,
  buscarClientesFiremat,
  obtenerClienteFiremat,
  crearClienteFiremat,
  actualizarClienteFiremat,
  cambiarEstadoClienteFiremat,
  agregarContactoClienteFiremat,
  actualizarContactoClienteFiremat,
  cambiarEstadoContactoFiremat,
  obtenerOportunidadesClienteFiremat,
  importarClientesFiremat,
} from '../../services/firemat/clientes-firemat.service';
import { parseFileToRows } from '../../utils/importClientes';

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

    const clientes = await listarClientesFiremat({ q, activo });
    res.json({ success: true, data: clientes });
  } catch (error) {
    handleError(res, error, 'listar clientes');
  }
};

export const buscarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';

    if (!q.trim()) {
      res.status(400).json({ error: 'El parámetro q es obligatorio.' });
      return;
    }

    const clientes = await buscarClientesFiremat(q);
    res.json({ success: true, data: clientes });
  } catch (error) {
    handleError(res, error, 'buscar clientes');
  }
};

export const obtenerCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const cliente = await obtenerClienteFiremat(id);
    res.json({ success: true, data: cliente });
  } catch (error) {
    handleError(res, error, 'obtener cliente');
  }
};

export const crearCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const cliente = await crearClienteFiremat(req.body);
    res.status(201).json({ success: true, data: cliente, message: 'Cliente creado' });
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

    const cliente = await actualizarClienteFiremat(id, req.body);
    res.json({ success: true, data: cliente, message: 'Cliente actualizado' });
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

    const { activo } = req.body as { activo?: unknown };

    if (typeof activo !== 'boolean' && activo !== 'true' && activo !== 'false') {
      res.status(400).json({ error: 'El campo activo es obligatorio y debe ser booleano.' });
      return;
    }

    const activoBool = typeof activo === 'boolean' ? activo : activo === 'true';

    const cliente = await cambiarEstadoClienteFiremat(id, activoBool);
    res.json({ success: true, data: cliente, message: 'Estado actualizado' });
  } catch (error) {
    handleError(res, error, 'cambiar estado de cliente');
  }
};

export const eliminarCliente = async (_req: Request, res: Response): Promise<void> => {
  res.status(405).json({
    success: false,
    error: 'La eliminacion de clientes Firemat no esta habilitada.',
  });
};

export const importarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      res.status(400).json({ error: 'Debe subir un archivo (.xlsx, .xls o .csv).' });
      return;
    }

    const filas = parseFileToRows(file.buffer, file.originalname);

    if (filas.length === 0) {
      res.status(400).json({ error: 'El archivo no contiene filas de datos.' });
      return;
    }

    const resultado = await importarClientesFiremat(filas);
    res.status(200).json(resultado);
  } catch (error) {
    handleError(res, error, 'importar clientes');
  }
};

export const agregarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const contacto = await agregarContactoClienteFiremat(id, req.body);
    res.status(201).json({ success: true, data: contacto, message: 'Contacto agregado' });
  } catch (error) {
    handleError(res, error, 'agregar contacto');
  }
};

export const actualizarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.contactoId);
    if (!id) {
      res.status(400).json({ error: 'ID de contacto inválido.' });
      return;
    }

    const contacto = await actualizarContactoClienteFiremat(id, req.body);
    res.json({ success: true, data: contacto, message: 'Contacto actualizado' });
  } catch (error) {
    handleError(res, error, 'actualizar contacto');
  }
};

export const cambiarEstadoContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.contactoId);
    if (!id) {
      res.status(400).json({ error: 'ID de contacto inválido.' });
      return;
    }

    const { activo } = req.body as { activo?: unknown };

    if (typeof activo !== 'boolean' && activo !== 'true' && activo !== 'false') {
      res.status(400).json({ error: 'El campo activo es obligatorio y debe ser booleano.' });
      return;
    }

    const activoBool = typeof activo === 'boolean' ? activo : activo === 'true';

    const contacto = await cambiarEstadoContactoFiremat(id, activoBool);
    res.json({ success: true, data: contacto, message: 'Estado de contacto actualizado' });
  } catch (error) {
    handleError(res, error, 'cambiar estado de contacto');
  }
};

export const obtenerOportunidadesCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID de cliente inválido.' });
      return;
    }

    const oportunidades = await obtenerOportunidadesClienteFiremat(id);
    res.json({ success: true, data: oportunidades });
  } catch (error) {
    handleError(res, error, 'obtener oportunidades del cliente');
  }
};
