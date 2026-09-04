import { Request, Response } from 'express';
import {
  actualizarInventarioEpp,
  actualizarInventarioHerramienta,
  actualizarInventarioImplemento,
  cambiarEstadoInventarioEpp,
  cambiarEstadoInventarioHerramienta,
  cambiarEstadoInventarioImplemento,
  crearInventarioEpp,
  crearInventarioHerramienta,
  crearInventarioImplemento,
  generarSkuInventarioEpp,
  generarSkuInventarioEppMasivo,
  generarSkuInventarioImplemento,
  generarSkuInventarioImplementoMasivo,
  listarInventarioEpp,
  listarInventarioHerramientas,
  listarInventarioImplementos,
  obtenerInventarioEpp,
  obtenerInventarioHerramienta,
  obtenerInventarioImplemento,
} from '../services/inventario-beck.service';
import { importarInventarioBeckExcel } from '../services/inventario-beck-excel.service';

function getListParams(req: Request): { q?: string; activo?: boolean } {
  const params: { q?: string; activo?: boolean } = {};
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    params.q = req.query.q.trim();
  }
  if (typeof req.query.activo === 'string') {
    params.activo = req.query.activo === 'true';
  }
  return params;
}

function getActivo(body: unknown): boolean {
  const activo = (body as { activo?: unknown } | null)?.activo;
  if (typeof activo === 'boolean') return activo;
  if (activo === 'true') return true;
  if (activo === 'false') return false;
  throw new Error('El campo activo es obligatorio y debe ser booleano.');
}

function getId(req: Request): string {
  const { id } = req.params;
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('ID invalido.');
  }
  return id;
}

function handleError(res: Response, error: unknown, contexto: string): void {
  if (error instanceof Error) {
    const status = error.message.includes('no encontrado') || error.message.includes('no encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
    return;
  }

  console.error(`Error en ${contexto}:`, error);
  res.status(500).json({ error: `Error interno al ${contexto}.` });
}

export const listarEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await listarInventarioEpp(getListParams(req)));
  } catch (error) {
    handleError(res, error, 'listar EPP');
  }
};

export const obtenerEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await obtenerInventarioEpp(getId(req)));
  } catch (error) {
    handleError(res, error, 'obtener EPP');
  }
};

export const crearEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(201).json(await crearInventarioEpp(req.body));
  } catch (error) {
    handleError(res, error, 'crear EPP');
  }
};

export const actualizarEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await actualizarInventarioEpp(getId(req), req.body));
  } catch (error) {
    handleError(res, error, 'actualizar EPP');
  }
};

export const cambiarEstadoEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await cambiarEstadoInventarioEpp(getId(req), getActivo(req.body)));
  } catch (error) {
    handleError(res, error, 'cambiar estado de EPP');
  }
};

export const generarSkuEpp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await generarSkuInventarioEpp(getId(req)));
  } catch (error) {
    handleError(res, error, 'generar SKU de EPP');
  }
};

export const generarSkuEppMasivo = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await generarSkuInventarioEppMasivo());
  } catch (error) {
    handleError(res, error, 'generar SKU masivo de EPP');
  }
};

export const listarImplementos = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await listarInventarioImplementos(getListParams(req)));
  } catch (error) {
    handleError(res, error, 'listar implementos');
  }
};

export const obtenerImplemento = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await obtenerInventarioImplemento(getId(req)));
  } catch (error) {
    handleError(res, error, 'obtener implemento');
  }
};

export const crearImplemento = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(201).json(await crearInventarioImplemento(req.body));
  } catch (error) {
    handleError(res, error, 'crear implemento');
  }
};

export const actualizarImplemento = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await actualizarInventarioImplemento(getId(req), req.body));
  } catch (error) {
    handleError(res, error, 'actualizar implemento');
  }
};

export const cambiarEstadoImplemento = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await cambiarEstadoInventarioImplemento(getId(req), getActivo(req.body)));
  } catch (error) {
    handleError(res, error, 'cambiar estado de implemento');
  }
};

export const generarSkuImplemento = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await generarSkuInventarioImplemento(getId(req)));
  } catch (error) {
    handleError(res, error, 'generar SKU de implemento');
  }
};

export const generarSkuImplementoMasivo = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await generarSkuInventarioImplementoMasivo());
  } catch (error) {
    handleError(res, error, 'generar SKU masivo de implementos');
  }
};

export const listarHerramientas = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await listarInventarioHerramientas(getListParams(req)));
  } catch (error) {
    handleError(res, error, 'listar herramientas');
  }
};

export const obtenerHerramienta = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await obtenerInventarioHerramienta(getId(req)));
  } catch (error) {
    handleError(res, error, 'obtener herramienta');
  }
};

export const crearHerramienta = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(201).json(await crearInventarioHerramienta(req.body));
  } catch (error) {
    handleError(res, error, 'crear herramienta');
  }
};

export const actualizarHerramienta = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await actualizarInventarioHerramienta(getId(req), req.body));
  } catch (error) {
    handleError(res, error, 'actualizar herramienta');
  }
};

export const cambiarEstadoHerramienta = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await cambiarEstadoInventarioHerramienta(getId(req), getActivo(req.body)));
  } catch (error) {
    handleError(res, error, 'cambiar estado de herramienta');
  }
};

export const importarExcelInventarioBeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ success: false, error: 'Debe subir un archivo .xlsx.' });
      return;
    }
    if (!/\.xlsx$/i.test(file.originalname)) {
      res.status(400).json({ success: false, error: 'Solo se aceptan archivos .xlsx.' });
      return;
    }

    const resultado = await importarInventarioBeckExcel(file.buffer);
    res.json({ success: true, data: resultado });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    console.error('Error al importar inventario BECK:', error);
    res.status(500).json({ success: false, error: 'Error interno al importar inventario BECK.' });
  }
};
