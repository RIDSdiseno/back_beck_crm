import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import XLSX from 'xlsx';
import {
  ItemizadoObraError,
  assertItemizadoObraEditable,
  assertItemizadoObraEditableAdmin,
  listarItemizadosPropuestosParaObra,
} from '../services/itemizadoPreparacionObra.service';

const getString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
};

const hasOwn = (body: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(body, key);

const handleError = (res: Response, error: unknown): void => {
  if (error instanceof ItemizadoObraError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    res.status(404).json({ success: false, error: 'Opción no encontrada' });
    return;
  }
  console.error('Error en ItemizadoOpciones:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const getNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const listarItemizadoOpciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigoBeck, tipo, elementoPasante, elementoPenetra, materialidad, visible, obraId } = req.query;

    const where: Prisma.ItemizadoOpcionWhereInput = {};

    if (typeof codigoBeck === 'string' && codigoBeck.trim()) {
      where.codigoBeck = { contains: codigoBeck.trim(), mode: 'insensitive' };
    }
    if (typeof tipo === 'string' && tipo.trim()) {
      where.tipo = { contains: tipo.trim(), mode: 'insensitive' };
    }
    if (typeof elementoPasante === 'string' && elementoPasante.trim()) {
      where.elementoPasante = { contains: elementoPasante.trim(), mode: 'insensitive' };
    }
    if (typeof elementoPenetra === 'string' && elementoPenetra.trim()) {
      where.elementoPenetra = { contains: elementoPenetra.trim(), mode: 'insensitive' };
    }
    if (typeof materialidad === 'string' && materialidad.trim()) {
      where.materialidad = { contains: materialidad.trim(), mode: 'insensitive' };
    }

    // Cuando se filtra por visible sin obraId se usa el campo global
    const obraIdStr = typeof obraId === 'string' && obraId.trim() ? obraId.trim() : null;
    if (!obraIdStr) {
      if (visible === 'true') where.visible = true;
      if (visible === 'false') where.visible = false;
    }

    const opciones = await prisma.itemizadoOpcion.findMany({
      where,
      orderBy: [{ codigoBeck: 'asc' }, { createdAt: 'asc' }],
    });

    if (!obraIdStr) {
      res.json({ success: true, data: opciones });
      return;
    }

    // Cargar configuraciones específicas de esta obra en un solo query
    const configs = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId: obraIdStr },
      select: {
        itemizadoOpcionId: true,
        visible: true,
        propuestoAlCliente: true,
        seleccionadoPorCliente: true,
        nombrePersonalizado: true,
        orden: true,
        rendimientoSellosEsperadoDiario: true,
        rendimientoReparacionEsperadoDiario: true,
      },
    });
    const configMap = new Map(configs.map((c) => [c.itemizadoOpcionId, c]));

    // Catálogo global completo (sin filtrar por visible) mezclado con el
    // valor efectivo por obra — usado por "Preparar itemizado", que necesita
    // ver también los itemizados inactivos/sin configuración para poder
    // activarlos. "nombrePersonalizado"/"orden" solo existen a nivel de
    // ConfiguracionItemizadoOpcionObra (no hay override global), por eso
    // vienen null cuando no hay config explícita para esta obra.
    // propuestoAlCliente/seleccionadoPorCliente tampoco tienen override global
    // (solo existen por obra): sin config explícita, ambos son false.
    const data = opciones.map((op) => {
      const config = configMap.get(op.id);
      return {
        ...op,
        visible: config ? config.visible : op.visible,
        propuestoAlCliente: config?.propuestoAlCliente ?? false,
        seleccionadoPorCliente: config?.seleccionadoPorCliente ?? false,
        nombrePersonalizado: config?.nombrePersonalizado ?? null,
        orden: config?.orden ?? null,
        rendimientoSellosEsperadoDiario:
          config?.rendimientoSellosEsperadoDiario ?? op.rendimientoSellosEsperadoDiario,
        rendimientoReparacionEsperadoDiario:
          config?.rendimientoReparacionEsperadoDiario ?? op.rendimientoReparacionEsperadoDiario,
      };
    });

    // Aplicar filtro de visible después de resolver el efectivo
    const filtrado =
      visible === 'true' ? data.filter((d) => d.visible) :
      visible === 'false' ? data.filter((d) => !d.visible) :
      data;

    res.json({ success: true, data: filtrado });
  } catch (error) {
    handleError(res, error);
  }
};

export const getItemizadoOpcionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = await prisma.itemizadoOpcion.findUnique({ where: { id } });

    if (!data) {
      res.status(404).json({ success: false, error: 'Opción no encontrada' });
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const crearItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;

    const data = await prisma.itemizadoOpcion.create({
      data: {
        codigoBeck: getString(body.codigoBeck),
        tipo: getString(body.tipo),
        elementoPasante: getString(body.elementoPasante),
        elementoPenetra: getString(body.elementoPenetra),
        materialidad: getString(body.materialidad),
        visible: typeof body.visible === 'boolean' ? body.visible : false,
        rendimientoSellosEsperadoDiario: getNumber(body.rendimientoSellosEsperadoDiario),
        rendimientoReparacionEsperadoDiario: getNumber(body.rendimientoReparacionEsperadoDiario),
      },
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const actualizarItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body as Record<string, unknown>;

    // Campos de catálogo: siempre son globales (identidad compartida de la opción,
    // ej. código BECK, materialidad), sin importar si viene obraId.
    const updateData: Prisma.ItemizadoOpcionUpdateInput = {};
    if (hasOwn(body, 'codigoBeck')) updateData.codigoBeck = getString(body.codigoBeck);
    if (hasOwn(body, 'tipo')) updateData.tipo = getString(body.tipo);
    if (hasOwn(body, 'elementoPasante')) updateData.elementoPasante = getString(body.elementoPasante);
    if (hasOwn(body, 'elementoPenetra')) updateData.elementoPenetra = getString(body.elementoPenetra);
    if (hasOwn(body, 'materialidad')) updateData.materialidad = getString(body.materialidad);

    const obraId = typeof body.obraId === 'string' && body.obraId.trim() ? body.obraId.trim() : null;

    if (obraId) {
      // Excepción administrativa: Beck puede seguir corrigiendo `visible` por obra
      // incluso en FINALIZADO (agregar un itemizado que faltó), no solo en PREPARACION.
      await assertItemizadoObraEditableAdmin(obraId);

      // visible es específico de la obra: va a la configuración por obra, nunca al
      // catálogo global (evita que una obra pise a otra). Los rendimientos por obra
      // ya NO se editan desde esta pantalla (Opciones de itemizado) — se mueven a
      // Configurar itemizados (ver guardarConfiguracionItemizadosPorObra); por eso
      // este endpoint ya no lee rendimientoSellosEsperadoDiario/rendimientoReparacionEsperadoDiario
      // cuando viene obraId.
      const obraData: Prisma.ConfiguracionItemizadoOpcionObraUpdateInput = {};
      if (hasOwn(body, 'visible') && typeof body.visible === 'boolean') {
        obraData.visible = body.visible;
      }

      const [, config] = await prisma.$transaction([
        prisma.itemizadoOpcion.update({ where: { id }, data: updateData }),
        prisma.configuracionItemizadoOpcionObra.upsert({
          where: { obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: id } },
          create: {
            obraId,
            itemizadoOpcionId: id,
            visible: typeof obraData.visible === 'boolean' ? obraData.visible : true,
          },
          update: obraData,
        }),
      ]);

      const opcionGlobal = await prisma.itemizadoOpcion.findUniqueOrThrow({ where: { id } });

      // Respuesta refleja el valor EFECTIVO para esta obra (override > global),
      // preservando el id de la opción (no el de la fila de configuración).
      res.json({
        success: true,
        data: {
          ...opcionGlobal,
          visible: config.visible,
          rendimientoSellosEsperadoDiario:
            config.rendimientoSellosEsperadoDiario ?? opcionGlobal.rendimientoSellosEsperadoDiario,
          rendimientoReparacionEsperadoDiario:
            config.rendimientoReparacionEsperadoDiario ?? opcionGlobal.rendimientoReparacionEsperadoDiario,
        },
      });
      return;
    }

    // Sin obraId → edición del catálogo maestro (comportamiento global existente)
    if (hasOwn(body, 'visible') && typeof body.visible === 'boolean') {
      updateData.visible = body.visible;
    }
    if (hasOwn(body, 'rendimientoSellosEsperadoDiario')) {
      updateData.rendimientoSellosEsperadoDiario = getNumber(body.rendimientoSellosEsperadoDiario);
    }
    if (hasOwn(body, 'rendimientoReparacionEsperadoDiario')) {
      updateData.rendimientoReparacionEsperadoDiario = getNumber(body.rendimientoReparacionEsperadoDiario);
    }

    const data = await prisma.itemizadoOpcion.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchVisibleItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body as Record<string, unknown>;

    if (typeof body.visible !== 'boolean') {
      res.status(400).json({ success: false, error: 'visible debe ser boolean' });
      return;
    }

    const obraId = typeof body.obraId === 'string' && body.obraId.trim() ? body.obraId.trim() : null;

    if (obraId) {
      // Excepción administrativa: permite corregir `visible` aunque la obra ya
      // esté FINALIZADO (agregar un itemizado que faltó en el contrato confirmado).
      await assertItemizadoObraEditableAdmin(obraId);

      // Actualizar visibilidad solo para esta obra (no toca el maestro global)
      const config = await prisma.configuracionItemizadoOpcionObra.upsert({
        where: { obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: id } },
        create: { obraId, itemizadoOpcionId: id, visible: body.visible },
        update: { visible: body.visible },
      });

      res.json({ success: true, data: config, scope: 'obra' });
      return;
    }

    // Sin obraId → actualizar visible global (administración del maestro)
    const data = await prisma.itemizadoOpcion.update({
      where: { id },
      data: { visible: body.visible },
    });

    res.json({ success: true, data, scope: 'global' });
  } catch (error) {
    handleError(res, error);
  }
};

export const eliminarItemizadoOpcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.itemizadoOpcion.delete({ where: { id } });
    res.json({ success: true, message: 'Opción eliminada' });
  } catch (error) {
    handleError(res, error);
  }
};

// ─── Configuración de itemizados por obra ─────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getConfiguracionItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
      select: {
        id: true,
        estadoPreparacionItemizado: true,
        itemizadoFinalizadoAt: true,
        itemizadoFinalizadoPor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    // Configs explícitas de esta obra (visibles e invisibles)
    const configsRaw = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId },
      include: {
        itemizadoOpcion: {
          select: {
            id: true,
            codigoBeck: true,
            tipo: true,
            elementoPasante: true,
            elementoPenetra: true,
            materialidad: true,
            rendimientoSellosEsperadoDiario: true,
            rendimientoReparacionEsperadoDiario: true,
          },
        },
      },
    });

    // Rendimiento efectivo: override de la obra si existe, si no el del catálogo global
    const configs = configsRaw.map((c) => ({
      ...c,
      itemizadoOpcion: {
        ...c.itemizadoOpcion,
        rendimientoSellosEsperadoDiario:
          c.rendimientoSellosEsperadoDiario ?? c.itemizadoOpcion.rendimientoSellosEsperadoDiario,
        rendimientoReparacionEsperadoDiario:
          c.rendimientoReparacionEsperadoDiario ?? c.itemizadoOpcion.rendimientoReparacionEsperadoDiario,
      },
    }));

    const configuredIds = configs.map((c) => c.itemizadoOpcionId);

    // Items globalmente visibles que no tienen config explícita para esta obra
    const globalVisibles = await prisma.itemizadoOpcion.findMany({
      where: {
        visible: true,
        ...(configuredIds.length > 0 ? { id: { notIn: configuredIds } } : {}),
      },
      select: {
        id: true,
        codigoBeck: true,
        tipo: true,
        elementoPasante: true,
        elementoPenetra: true,
        materialidad: true,
        rendimientoSellosEsperadoDiario: true,
        rendimientoReparacionEsperadoDiario: true,
      },
    });

    type ItemResult = {
      id: string | null;
      obraId: string;
      itemizadoOpcionId: string;
      visible: boolean;
      orden: number | null;
      nombrePersonalizado: string | null;
      itemizadoOpcion: {
        id: string;
        codigoBeck: string | null;
        tipo: string | null;
        elementoPasante: string | null;
        elementoPenetra: string | null;
        materialidad: string | null;
        rendimientoSellosEsperadoDiario: number | null;
        rendimientoReparacionEsperadoDiario: number | null;
      };
      nombreMostrar: string;
    };

    const fromConfigs: ItemResult[] = configs
      .filter((c) => c.visible)
      .map((c) => ({
        id: c.id,
        obraId: c.obraId,
        itemizadoOpcionId: c.itemizadoOpcionId,
        visible: c.visible,
        orden: c.orden,
        nombrePersonalizado: c.nombrePersonalizado,
        itemizadoOpcion: c.itemizadoOpcion,
        nombreMostrar:
          c.nombrePersonalizado && c.nombrePersonalizado.trim()
            ? c.nombrePersonalizado.trim()
            : (c.itemizadoOpcion.elementoPasante ?? ''),
      }));

    const fromGlobal: ItemResult[] = globalVisibles.map((op) => ({
      id: null,
      obraId,
      itemizadoOpcionId: op.id,
      visible: true,
      orden: null,
      nombrePersonalizado: null,
      itemizadoOpcion: op,
      nombreMostrar: op.elementoPasante ?? '',
    }));

    const data = [...fromConfigs, ...fromGlobal].sort((a, b) => {
      if (a.orden !== null && b.orden !== null) return a.orden - b.orden;
      if (a.orden !== null) return -1;
      if (b.orden !== null) return 1;
      return (a.itemizadoOpcion.codigoBeck ?? '').localeCompare(
        b.itemizadoOpcion.codigoBeck ?? '',
        'es',
      );
    });

    res.json({
      success: true,
      obra: {
        id: obra.id,
        estadoPreparacionItemizado: obra.estadoPreparacionItemizado,
        itemizadoFinalizadoAt: obra.itemizadoFinalizadoAt,
        itemizadoFinalizadoPor: obra.itemizadoFinalizadoPor,
      },
      data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const guardarConfiguracionItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const body = req.body as { items?: unknown };

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    // Excepción administrativa: bajo la arquitectura de propuesta/selección, `visible`
    // solo se activa tras la confirmación del cliente, por lo que esta pantalla
    // (Configurar itemizados: nombre mandante, orden, rendimientos por obra) recién
    // tiene itemizados para trabajar una vez FINALIZADO — debe permitirse editar ahí.
    await assertItemizadoObraEditableAdmin(obraId);

    if (!Array.isArray(body.items)) {
      res.status(400).json({ success: false, error: 'items debe ser un arreglo' });
      return;
    }

    const itemsRaw = body.items as unknown[];

    for (const item of itemsRaw) {
      if (typeof item !== 'object' || item === null) {
        res.status(400).json({ success: false, error: 'Cada item debe ser un objeto' });
        return;
      }
      const {
        itemizadoOpcionId,
        visible,
        rendimientoSellosEsperadoDiario,
        rendimientoReparacionEsperadoDiario,
      } = item as Record<string, unknown>;

      if (typeof itemizadoOpcionId !== 'string' || !UUID_REGEX.test(itemizadoOpcionId)) {
        res.status(400).json({
          success: false,
          error: `itemizadoOpcionId inválido: ${String(itemizadoOpcionId)}`,
        });
        return;
      }
      if (hasOwn(item as Record<string, unknown>, 'visible') && typeof visible !== 'boolean') {
        res.status(400).json({
          success: false,
          error: `visible debe ser boolean en el item ${itemizadoOpcionId}`,
        });
        return;
      }
      if (
        hasOwn(item as Record<string, unknown>, 'rendimientoSellosEsperadoDiario') &&
        rendimientoSellosEsperadoDiario !== null &&
        !(typeof rendimientoSellosEsperadoDiario === 'number' && Number.isInteger(rendimientoSellosEsperadoDiario) && rendimientoSellosEsperadoDiario >= 0)
      ) {
        res.status(400).json({
          success: false,
          error: `rendimientoSellosEsperadoDiario debe ser un entero no negativo o null en el item ${itemizadoOpcionId}`,
        });
        return;
      }
      if (
        hasOwn(item as Record<string, unknown>, 'rendimientoReparacionEsperadoDiario') &&
        rendimientoReparacionEsperadoDiario !== null &&
        !(typeof rendimientoReparacionEsperadoDiario === 'number' && Number.isInteger(rendimientoReparacionEsperadoDiario) && rendimientoReparacionEsperadoDiario >= 0)
      ) {
        res.status(400).json({
          success: false,
          error: `rendimientoReparacionEsperadoDiario debe ser un entero no negativo o null en el item ${itemizadoOpcionId}`,
        });
        return;
      }
    }

    type ItemInput = {
      itemizadoOpcionId: string;
      orden?: number | null;
      nombrePersonalizado?: string | null;
      visible?: boolean;
      rendimientoSellosEsperadoDiario?: number | null;
      rendimientoReparacionEsperadoDiario?: number | null;
    };

    const items = itemsRaw as ItemInput[];
    const allIds = items.map((i) => i.itemizadoOpcionId);

    // Evitar duplicados dentro del mismo payload
    const idsVistos = new Set<string>();
    const idsDuplicados = new Set<string>();
    for (const id of allIds) {
      if (idsVistos.has(id)) idsDuplicados.add(id);
      idsVistos.add(id);
    }
    if (idsDuplicados.size > 0) {
      res.status(400).json({
        success: false,
        error: 'itemizadoOpcionId duplicado en el payload',
        ids: [...idsDuplicados],
      });
      return;
    }

    // Verificar que todos los itemizadoOpcionIds existen
    const found = await prisma.itemizadoOpcion.findMany({
      where: { id: { in: allIds } },
      select: { id: true, visible: true },
    });
    const foundMap = new Map(found.map((f) => [f.id, f.visible]));
    const notFound = allIds.filter((id) => !foundMap.has(id));
    if (notFound.length > 0) {
      res.status(404).json({ success: false, error: 'Algunos itemizados no existen', ids: notFound });
      return;
    }

    // Resolver visibilidad efectiva: config explícita > global
    const explicitConfigs = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId, itemizadoOpcionId: { in: allIds } },
      select: { itemizadoOpcionId: true, visible: true },
    });
    const configMap = new Map(explicitConfigs.map((c) => [c.itemizadoOpcionId, c.visible]));

    // El gate de "debe estar visible" solo aplica a items que NO traen `visible` explícito:
    // si el payload trae `visible`, esa es la nueva intención (mostrar u ocultar) y no requiere estado previo.
    const idsSinVisibleExplicito = items
      .filter((item) => typeof item.visible !== 'boolean')
      .map((item) => item.itemizadoOpcionId);
    const notVisible = idsSinVisibleExplicito.filter((id) =>
      configMap.has(id) ? !configMap.get(id) : !foundMap.get(id),
    );
    if (notVisible.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Algunos itemizados no están visibles para esta obra',
        ids: notVisible,
      });
      return;
    }

    // Upsert: orden y nombrePersonalizado siempre se aplican (compat con payload anterior);
    // visible y rendimientos son parciales — solo se tocan si vienen explícitos en el item.
    const results = await Promise.all(
      items.map((item) => {
        const ordenVal =
          typeof item.orden === 'number' && Number.isInteger(item.orden) && item.orden > 0
            ? item.orden
            : null;
        const nombreVal =
          typeof item.nombrePersonalizado === 'string' && item.nombrePersonalizado.trim()
            ? item.nombrePersonalizado.trim()
            : null;

        const visibleProvisto = typeof item.visible === 'boolean';
        const sellosProvisto = hasOwn(item as unknown as Record<string, unknown>, 'rendimientoSellosEsperadoDiario');
        const reparacionProvisto = hasOwn(item as unknown as Record<string, unknown>, 'rendimientoReparacionEsperadoDiario');

        const updateData: Prisma.ConfiguracionItemizadoOpcionObraUpdateInput = {
          orden: ordenVal,
          nombrePersonalizado: nombreVal,
        };
        if (visibleProvisto) updateData.visible = item.visible;
        if (sellosProvisto) updateData.rendimientoSellosEsperadoDiario = item.rendimientoSellosEsperadoDiario ?? null;
        if (reparacionProvisto) updateData.rendimientoReparacionEsperadoDiario = item.rendimientoReparacionEsperadoDiario ?? null;

        return prisma.configuracionItemizadoOpcionObra.upsert({
          where: {
            obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: item.itemizadoOpcionId },
          },
          create: {
            obraId,
            itemizadoOpcionId: item.itemizadoOpcionId,
            visible: visibleProvisto ? (item.visible as boolean) : true,
            orden: ordenVal,
            nombrePersonalizado: nombreVal,
            rendimientoSellosEsperadoDiario: sellosProvisto ? (item.rendimientoSellosEsperadoDiario ?? null) : null,
            rendimientoReparacionEsperadoDiario: reparacionProvisto ? (item.rendimientoReparacionEsperadoDiario ?? null) : null,
          },
          update: updateData,
        });
      }),
    );

    res.json({ success: true, data: results });
  } catch (error) {
    handleError(res, error);
  }
};

// ─── Propuesta de itemizado por obra (PrepararItemizadoObraDrawer) ────────────
//
// Endpoint dedicado para la pantalla "Preparar itemizado": escribe únicamente
// propuestoAlCliente (+ seleccionadoPorCliente derivado, ver más abajo). A
// diferencia de guardarConfiguracionItemizadosPorObra (usado por "Configurar
// itemizados"), este endpoint NUNCA toca visible, orden, nombrePersonalizado ni
// los rendimientos — así Beck puede incluir/quitar itemizados de la propuesta
// sin arriesgar pisar esos campos ni activar prematuramente el itemizado para
// la obra (eso solo ocurre en confirmarItemizadoCliente, tras la confirmación).
export const guardarPropuestaItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const body = req.body as { items?: unknown };

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    await assertItemizadoObraEditable(obraId);

    if (!Array.isArray(body.items)) {
      res.status(400).json({ success: false, error: 'items debe ser un arreglo' });
      return;
    }

    const itemsRaw = body.items as unknown[];
    for (const item of itemsRaw) {
      if (typeof item !== 'object' || item === null) {
        res.status(400).json({ success: false, error: 'Cada item debe ser un objeto' });
        return;
      }
      const { itemizadoOpcionId, propuestoAlCliente } = item as Record<string, unknown>;
      if (typeof itemizadoOpcionId !== 'string' || !UUID_REGEX.test(itemizadoOpcionId)) {
        res.status(400).json({
          success: false,
          error: `itemizadoOpcionId inválido: ${String(itemizadoOpcionId)}`,
        });
        return;
      }
      if (typeof propuestoAlCliente !== 'boolean') {
        res.status(400).json({
          success: false,
          error: `propuestoAlCliente debe ser boolean en el item ${itemizadoOpcionId}`,
        });
        return;
      }
    }

    type PropuestaItemInput = { itemizadoOpcionId: string; propuestoAlCliente: boolean };
    const items = itemsRaw as PropuestaItemInput[];
    const allIds = items.map((i) => i.itemizadoOpcionId);

    const idsVistos = new Set<string>();
    const idsDuplicados = new Set<string>();
    for (const id of allIds) {
      if (idsVistos.has(id)) idsDuplicados.add(id);
      idsVistos.add(id);
    }
    if (idsDuplicados.size > 0) {
      res.status(400).json({
        success: false,
        error: 'itemizadoOpcionId duplicado en el payload',
        ids: [...idsDuplicados],
      });
      return;
    }

    const found = await prisma.itemizadoOpcion.findMany({
      where: { id: { in: allIds } },
      select: { id: true },
    });
    const foundIds = new Set(found.map((f) => f.id));
    const notFound = allIds.filter((id) => !foundIds.has(id));
    if (notFound.length > 0) {
      res.status(404).json({ success: false, error: 'Algunos itemizados no existen', ids: notFound });
      return;
    }

    // Al incluir (propuestoAlCliente=true) se inicia seleccionadoPorCliente=true por
    // defecto: preferencia de UX para que el cliente reciba todo preseleccionado y
    // pueda desmarcar lo que no quiere, en vez de partir de una lista vacía. Al
    // quitar de la propuesta (propuestoAlCliente=false) se limpia seleccionadoPorCliente
    // a false, y visible nunca se toca aquí (permanece en lo que ya tuviera, que
    // solo puede ser false antes de la confirmación del cliente).
    const results = await Promise.all(
      items.map((item) =>
        prisma.configuracionItemizadoOpcionObra.upsert({
          where: {
            obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId: item.itemizadoOpcionId },
          },
          create: {
            obraId,
            itemizadoOpcionId: item.itemizadoOpcionId,
            visible: false,
            propuestoAlCliente: item.propuestoAlCliente,
            seleccionadoPorCliente: item.propuestoAlCliente,
          },
          update: {
            propuestoAlCliente: item.propuestoAlCliente,
            seleccionadoPorCliente: item.propuestoAlCliente ? true : false,
          },
        }),
      ),
    );

    res.json({ success: true, data: results });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /itemizado-opciones/obra/:obraId/propuesta — equivalente interno (roles Beck)
// de GET /cliente/obras/:obraId/itemizados, para que ItemizadoPreviewPanel muestre
// exactamente la misma tabla que verá el cliente (mismos itemizados propuestos,
// mismo estado de selección), en solo lectura. Reutiliza listarItemizadosPropuestosParaObra
// en vez de duplicar la resolución de propuestoAlCliente.
export const getPropuestaItemizadosPorObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
      select: {
        id: true,
        estadoPreparacionItemizado: true,
        itemizadoFinalizadoAt: true,
        itemizadoFinalizadoPor: { select: { id: true, nombre: true, email: true } },
      },
    });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    const data = await listarItemizadosPropuestosParaObra(obraId);

    res.json({ success: true, obra, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchVisibleMasivoObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const obraId = req.params.obraId as string;
    const body = req.body as Record<string, unknown>;

    if (typeof body.visible !== 'boolean') {
      res.status(400).json({ success: false, error: 'visible debe ser boolean' });
      return;
    }
    const visible = body.visible;

    if (!UUID_REGEX.test(obraId)) {
      res.status(400).json({ success: false, error: 'obraId debe ser un UUID válido' });
      return;
    }

    await assertItemizadoObraEditable(obraId);

    const todasLasOpciones = await prisma.itemizadoOpcion.findMany({ select: { id: true } });
    const todosLosIds = todasLasOpciones.map((op) => op.id);

    if (todosLosIds.length === 0) {
      res.json({ success: true, actualizados: 0, visible });
      return;
    }

    const configsExistentes = await prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId, itemizadoOpcionId: { in: todosLosIds } },
      select: { itemizadoOpcionId: true },
    });
    const idsConConfig = new Set(configsExistentes.map((c) => c.itemizadoOpcionId));
    const idsSinConfig = todosLosIds.filter((id) => !idsConConfig.has(id));

    await prisma.$transaction(async (tx) => {
      if (idsConConfig.size > 0) {
        await tx.configuracionItemizadoOpcionObra.updateMany({
          where: { obraId, itemizadoOpcionId: { in: [...idsConConfig] } },
          data: { visible },
        });
      }
      if (idsSinConfig.length > 0) {
        await tx.configuracionItemizadoOpcionObra.createMany({
          data: idsSinConfig.map((itemizadoOpcionId) => ({ obraId, itemizadoOpcionId, visible })),
          skipDuplicates: true,
        });
      }
    });

    res.json({ success: true, actualizados: todosLosIds.length, visible });
  } catch (error) {
    handleError(res, error);
  }
};

// ─── Importación masiva desde Excel ───────────────────────────────────────────

const NOMBRE_HOJA = 'Cálculo Material por Pasada';
const FILA_ENCABEZADOS = 12; // 0-indexed → Excel row 13
const FILA_INICIO_DATOS = 13; // 0-indexed → Excel row 14

function leerCeldaXlsx(sheet: XLSX.WorkSheet, r: number, c: number): string | null {
  const addr = XLSX.utils.encode_cell({ r, c });
  const cell = sheet[addr] as XLSX.CellObject | undefined;
  if (!cell || cell.v == null) return null;
  const s = (cell.w !== undefined ? cell.w : String(cell.v)).trim();
  return s || null;
}

function normalizarEncabezado(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function claveUnicidad(row: {
  codigoBeck: string | null;
  tipo: string | null;
  elementoPasante: string | null;
  elementoPenetra: string | null;
  materialidad: string | null;
}): string {
  return [
    row.codigoBeck ?? '',
    row.tipo ?? '',
    row.elementoPasante ?? '',
    row.elementoPenetra ?? '',
    row.materialidad ?? '',
  ].join('\x00');
}

interface FilaItemizadoImport {
  codigoBeck: string | null;
  tipo: string | null;
  elementoPasante: string | null;
  elementoPenetra: string | null;
  materialidad: string | null;
}

export const importarItemizadoOpciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const reemplazar =
      req.query.reemplazar === 'true' ||
      (req.body as Record<string, unknown>).reemplazar === true ||
      (req.body as Record<string, unknown>).reemplazar === 'true';

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: 'Se requiere un archivo Excel en el campo "file"' });
      return;
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(file.buffer, { type: 'buffer', raw: false, cellNF: false });
    } catch {
      res.status(422).json({ success: false, error: 'No se pudo leer el archivo. Verifique que sea un Excel válido.' });
      return;
    }

    const sheet = workbook.Sheets[NOMBRE_HOJA];
    if (!sheet) {
      res.status(422).json({
        success: false,
        error: `No se encontró la hoja "${NOMBRE_HOJA}" en el archivo`,
      });
      return;
    }

    const sheetRef = sheet['!ref'];
    if (!sheetRef) {
      res.json({ success: true, totalFilas: 0, importadas: 0, omitidas: 0, duplicadas: 0, errores: [] });
      return;
    }

    const range = XLSX.utils.decode_range(sheetRef);
    const lastRow = range.e.r;
    const lastCol = range.e.c;

    // Leer encabezados desde Excel row 13 (0-indexed: 12)
    const colNums: Record<string, number> = {};
    for (let c = 0; c <= lastCol; c++) {
      const val = leerCeldaXlsx(sheet, FILA_ENCABEZADOS, c);
      if (val) colNums[normalizarEncabezado(val)] = c;
    }

    const COL = {
      codigoBeck: colNums['codigo'] ?? -1,
      tipo: colNums['tipo'] ?? -1,
      elementoPasante: colNums['elemento pasante'] ?? -1,
      elementoPenetra: colNums['elemento penetrado'] ?? -1,
      materialidad: colNums['materialidad'] ?? -1,
    };

    // Leer filas de datos desde Excel row 14 (0-indexed: 13)
    const filas: FilaItemizadoImport[] = [];
    let totalFilas = 0;

    for (let r = FILA_INICIO_DATOS; r <= lastRow; r++) {
      const fila: FilaItemizadoImport = {
        codigoBeck: COL.codigoBeck >= 0 ? leerCeldaXlsx(sheet, r, COL.codigoBeck) : null,
        tipo: COL.tipo >= 0 ? leerCeldaXlsx(sheet, r, COL.tipo) : null,
        elementoPasante: COL.elementoPasante >= 0 ? leerCeldaXlsx(sheet, r, COL.elementoPasante) : null,
        elementoPenetra: COL.elementoPenetra >= 0 ? leerCeldaXlsx(sheet, r, COL.elementoPenetra) : null,
        materialidad: COL.materialidad >= 0 ? leerCeldaXlsx(sheet, r, COL.materialidad) : null,
      };

      if (!fila.codigoBeck && !fila.tipo && !fila.elementoPasante && !fila.elementoPenetra && !fila.materialidad) {
        continue;
      }

      totalFilas++;
      filas.push(fila);
    }

    // Eliminar catálogo global completo si reemplazar=true
    if (reemplazar) {
      await prisma.itemizadoOpcion.deleteMany({});
    }

    // Cargar claves existentes para deduplicación (solo en modo append)
    let existingKeys = new Set<string>();
    if (!reemplazar) {
      const existing = await prisma.itemizadoOpcion.findMany({
        select: { codigoBeck: true, tipo: true, elementoPasante: true, elementoPenetra: true, materialidad: true },
      });
      existingKeys = new Set(existing.map(claveUnicidad));
    }

    // Construir registros a crear, deduplicando intra-archivo y contra BD
    const registrosACrear: {
      codigoBeck: string | null;
      tipo: string | null;
      elementoPasante: string | null;
      elementoPenetra: string | null;
      materialidad: string | null;
      visible: boolean;
    }[] = [];

    let duplicadas = 0;
    const seenInFile = new Set<string>();

    for (const fila of filas) {
      const key = claveUnicidad(fila);

      if (seenInFile.has(key)) {
        duplicadas++;
        continue;
      }
      seenInFile.add(key);

      if (!reemplazar && existingKeys.has(key)) {
        duplicadas++;
        continue;
      }

      registrosACrear.push({
        codigoBeck: fila.codigoBeck,
        tipo: fila.tipo,
        elementoPasante: fila.elementoPasante,
        elementoPenetra: fila.elementoPenetra,
        materialidad: fila.materialidad,
        visible: false,
      });
    }

    if (registrosACrear.length > 0) {
      await prisma.itemizadoOpcion.createMany({ data: registrosACrear });
    }

    const importadas = registrosACrear.length;
    const omitidas = totalFilas - importadas - duplicadas;

    res.json({
      success: true,
      totalFilas,
      importadas,
      omitidas,
      duplicadas,
      errores: [] as string[],
    });
  } catch (error) {
    console.error('Error en importarItemizadoOpciones:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
