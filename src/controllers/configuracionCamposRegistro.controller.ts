import { Request, Response } from 'express';
import {
  obtenerConfiguracionCampos,
  actualizarConfiguracionCampos,
  existeObra,
} from '../services/configuracionCamposRegistro.service';
import {
  ROLES_CON_RESTRICCIONES,
  RolCampo,
  normalizarRolConfiguracion,
} from '../config/camposRegistro.config';

/**
 * GET /api/configuracion-campos-registro
 * Query param opcional: ?rol=trabajador|jefeobra
 * Sin ?rol usa el rol del token del solicitante.
 * Devuelve lista de campos con visible/configurable/color efectivos para ese rol.
 */
export const obtenerConfiguracion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rol, obraId } = req.query;
    if (typeof obraId !== 'string' || !obraId.trim()) {
      res.status(400).json({ error: 'Se requiere query param obraId' });
      return;
    }

    if (!(await existeObra(obraId))) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    const rolConsulta = normalizarRolConfiguracion(typeof rol === 'string' ? rol : (req.userRole ?? 'trabajador'))
      ?? 'trabajador';

    const campos = await obtenerConfiguracionCampos(rolConsulta, obraId);
    res.json(campos);
  } catch (error) {
    console.error('Error al obtener configuración de campos:', error);
    res.status(500).json({ error: 'Error al obtener configuración de campos' });
  }
};

/**
 * PUT /api/configuracion-campos-registro
 * Solo administrador e ingenieria.
 * Body: [{ obraId: string, campo: string, rol: 'trabajador'|'jefeobra', visible: boolean }, ...]
 * Solo campos AZULES son modificables. Verdes y rojos se ignoran silenciosamente.
 */
export const actualizarConfiguracion = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body as { obraId: string; campo: string; rol: string; visible: boolean }[];

    if (!Array.isArray(updates) || updates.length === 0) {
      res.status(400).json({ error: 'Se requiere un array de actualizaciones' });
      return;
    }

    for (const u of updates) {
      if (typeof u.obraId !== 'string' || !u.obraId.trim() || typeof u.campo !== 'string' || typeof u.visible !== 'boolean') {
        res.status(400).json({
          error: 'Cada elemento debe tener "obraId" (string), "campo" (string) y "visible" (boolean)',
        });
        return;
      }
      if (!ROLES_CON_RESTRICCIONES.includes(u.rol as RolCampo)) {
        res.status(400).json({
          error: `Rol inválido: "${u.rol}". Permitidos: ${ROLES_CON_RESTRICCIONES.join(', ')}`,
        });
        return;
      }
    }

    const obraIds = [...new Set(updates.map(u => u.obraId))];
    for (const obraId of obraIds) {
      if (!(await existeObra(obraId))) {
        res.status(404).json({ error: `Obra no encontrada: ${obraId}` });
        return;
      }
    }

    await actualizarConfiguracionCampos(
      updates as { obraId: string; campo: string; rol: RolCampo; visible: boolean }[],
      req.userId ?? '',
    );

    res.json({ mensaje: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar configuración de campos:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de campos' });
  }
};
