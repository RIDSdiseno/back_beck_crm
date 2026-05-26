import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';

interface ItemizadoMandanteRow {
  id: string;
  codigo_beck: string | null;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapItemizado(row: ItemizadoMandanteRow) {
  return {
    id: row.id,
    codigoBeck: row.codigo_beck,
    nombre: row.nombre,
    descripcion: row.descripcion,
    activo: row.activo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function canIncludeInactive(role: string | undefined): boolean {
  return role === 'administrador' || role === 'ingenieria';
}

export const listarItemizadosMandante = async (req: Request, res: Response): Promise<void> => {
  try {
    const incluirInactivos =
      req.query.incluirInactivos === 'true' && canIncludeInactive(req.userRole);

    const result = await dbQuery<ItemizadoMandanteRow>(
      `SELECT id, codigo_beck, nombre, descripcion, activo, created_at, updated_at
       FROM itemizados_mandante
       WHERE ($1::boolean = TRUE OR activo = TRUE)
       ORDER BY activo DESC, nombre ASC`,
      [incluirInactivos],
    );

    res.json(result.rows.map(mapItemizado));
  } catch (error) {
    console.error('Error al listar itemizados mandante:', error);
    res.status(500).json({ error: 'Error al listar itemizados mandante' });
  }
};

export const crearItemizadoMandante = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigoBeck, nombre, descripcion, activo } = req.body as {
      codigoBeck?: unknown;
      nombre?: unknown;
      descripcion?: unknown;
      activo?: unknown;
    };

    if (typeof nombre !== 'string' || !nombre.trim()) {
      res.status(400).json({ error: 'El nombre es obligatorio' });
      return;
    }

    const result = await dbQuery<ItemizadoMandanteRow>(
      `INSERT INTO itemizados_mandante (codigo_beck, nombre, descripcion, activo, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, codigo_beck, nombre, descripcion, activo, created_at, updated_at`,
      [
        codigoBeck == null ? null : String(codigoBeck).trim() || null,
        String(nombre).trim(),
        descripcion == null ? null : String(descripcion).trim() || null,
        typeof activo === 'boolean' ? activo : true,
      ],
    );

    res.status(201).json(mapItemizado(result.rows[0]));
  } catch (error) {
    console.error('Error al crear itemizado mandante:', error);
    res.status(500).json({ error: 'Error al crear itemizado mandante' });
  }
};

export const actualizarItemizadoMandante = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigoBeck, nombre, descripcion, activo } = req.body as {
      codigoBeck?: unknown;
      nombre?: unknown;
      descripcion?: unknown;
      activo?: unknown;
    };

    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim())) {
      res.status(400).json({ error: 'El nombre no puede quedar vacío' });
      return;
    }

    const result = await dbQuery<ItemizadoMandanteRow>(
      `UPDATE itemizados_mandante
       SET codigo_beck = CASE WHEN $1::boolean THEN $2 ELSE codigo_beck END,
           nombre = COALESCE($3, nombre),
           descripcion = CASE WHEN $4::boolean THEN $5 ELSE descripcion END,
           activo = COALESCE($6, activo),
           updated_at = NOW()
       WHERE id = $7
       RETURNING id, codigo_beck, nombre, descripcion, activo, created_at, updated_at`,
      [
        codigoBeck !== undefined,
        codigoBeck == null ? null : String(codigoBeck).trim() || null,
        nombre === undefined ? null : String(nombre).trim(),
        descripcion !== undefined,
        descripcion == null ? null : String(descripcion).trim() || null,
        typeof activo === 'boolean' ? activo : null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado Mandante no encontrado' });
      return;
    }

    res.json(mapItemizado(result.rows[0]));
  } catch (error) {
    console.error('Error al actualizar itemizado mandante:', error);
    res.status(500).json({ error: 'Error al actualizar itemizado mandante' });
  }
};

export const eliminarItemizadoMandante = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await dbQuery<ItemizadoMandanteRow>(
      `UPDATE itemizados_mandante
       SET activo = FALSE, updated_at = NOW()
       WHERE id = $1
       RETURNING id, codigo_beck, nombre, descripcion, activo, created_at, updated_at`,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Itemizado Mandante no encontrado' });
      return;
    }

    res.json(mapItemizado(result.rows[0]));
  } catch (error) {
    console.error('Error al desactivar itemizado mandante:', error);
    res.status(500).json({ error: 'Error al desactivar itemizado mandante' });
  }
};
