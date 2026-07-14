import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { EstadoPreparacionItemizado } from '@prisma/client';
import { prisma } from '../config/prisma';
import { resolveConfiguracionEfectiva } from '../helpers/configuracionVistaCliente';
import {
  obtenerConfiguracionCampos,
  sanitizarRegistrosPorRol,
} from '../services/configuracionCamposRegistro.service';
import { generateRegistroPdfBuffer } from '../services/registroPdf.service';
import { uploadFileDetailed } from '../config/cloudinary';
import {
  assertItemizadoObraEditablePorCliente,
  ItemizadoObraError,
  listarItemizadosPropuestosParaObra,
} from '../services/itemizadoPreparacionObra.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ScopeOk =
  | { mode: 'usuario'; targetId: string }
  | { mode: 'clienteBeck'; clienteBeckId: string; obraIds: string[] };

type ScopeResult =
  | ({ ok: true } & ScopeOk)
  | { ok: false; status: number; error: string };

// ─── Helpers de resolución de scope ──────────────────────────────────────────

async function getObrasPermitidas(userId: string): Promise<string[]> {
  const asignaciones = await prisma.usuarios_obras.findMany({
    where: { usuario_id: userId },
    select: { obra_id: true },
  });
  return asignaciones.map(a => a.obra_id);
}

async function getObrasPorClienteBeck(clienteBeckId: string): Promise<string[]> {
  const [obrasDirectas, oportunidades] = await Promise.all([
    prisma.obra.findMany({
      where: { clienteBeckId },
      select: { id: true },
    }),
    prisma.operadorBeck.findMany({
      where: { clienteBeckId, obraId: { not: null } },
      select: { obraId: true },
    }),
  ]);

  console.log(`[getObrasPorClienteBeck] clienteBeckId=${clienteBeckId}`);
  console.log(`[getObrasPorClienteBeck] obrasDirectas (Obra.clienteBeckId): ${obrasDirectas.map(o => o.id).join(', ') || '(ninguna)'}`);
  console.log(`[getObrasPorClienteBeck] obraIds vía OperadorBeck: ${oportunidades.map(op => op.obraId).join(', ') || '(ninguna)'}`);

  const ids = new Set<string>(obrasDirectas.map(o => o.id));
  for (const op of oportunidades) {
    if (op.obraId) ids.add(op.obraId);
  }
  const result = [...ids];
  console.log(`[getObrasPorClienteBeck] obraIds combinados (${result.length}): ${result.join(', ') || '(vacío)'}`);
  return result;
}

async function getObrasFromScope(scope: ScopeOk): Promise<string[]> {
  if (scope.mode === 'clienteBeck') return scope.obraIds;
  return getObrasPermitidas(scope.targetId);
}

async function clienteTieneObraAsignada(userId: string, obraId: string): Promise<boolean> {
  const asignacion = await prisma.usuarios_obras.findUnique({
    where: { usuario_id_obra_id: { usuario_id: userId, obra_id: obraId } },
    select: { usuario_id: true },
  });
  return Boolean(asignacion);
}

const SELECT_VISTA = {
  clave: true,
  visible: true,
  tituloPersonalizado: true,
  orden: true,
} as const;

async function getConfiguracionVistaFromScope(scope: ScopeOk) {
  const generalRows = await prisma.configuracionVistaClienteGeneral.findMany({
    select: SELECT_VISTA,
  });

  if (scope.mode === 'clienteBeck') {
    const beckRows = await prisma.configuracionVistaClienteBeck.findMany({
      where: { clienteBeckId: scope.clienteBeckId },
      select: SELECT_VISTA,
    });
    return resolveConfiguracionEfectiva([], beckRows, generalRows);
  }

  // mode === 'usuario': resolve clienteBeckId from their obras, then merge all layers
  const usuarioRows = await prisma.configuracionVistaClienteUsuario.findMany({
    where: { usuarioId: scope.targetId },
    select: SELECT_VISTA,
  });

  const obraIds = await getObrasPermitidas(scope.targetId);
  let beckRows: { clave: string; visible: boolean; tituloPersonalizado: string | null; orden: number | null }[] = [];

  if (obraIds.length > 0) {
    const obras = await prisma.obra.findMany({
      where: { id: { in: obraIds } },
      select: { clienteBeckId: true },
    });
    const beckIds = [...new Set(
      obras.map(o => o.clienteBeckId).filter((id): id is string => id !== null),
    )];
    if (beckIds.length === 1) {
      beckRows = await prisma.configuracionVistaClienteBeck.findMany({
        where: { clienteBeckId: beckIds[0] },
        select: SELECT_VISTA,
      });
    }
  }

  return resolveConfiguracionEfectiva(usuarioRows, beckRows, generalRows);
}

/**
 * Determina el scope de acceso según el rol del usuario autenticado:
 * - cliente        → siempre sus propias obras (usuarios_obras). Ignora query params.
 * - administrador  → requiere clienteBeckId o clienteUsuarioId.
 *     clienteBeckId tiene prioridad sobre clienteUsuarioId.
 */
async function resolverScope(req: Request): Promise<ScopeResult> {
  const rol = req.userRole;
  const selfId = req.userId!;

  // ── Rol cliente: siempre se filtra por su propio userId ──────────────────
  if (rol === 'cliente') {
    return { ok: true, mode: 'usuario', targetId: selfId };
  }

  // ── Administrador: puede seleccionar un cliente Beck o un usuario cliente ─
  if (rol === 'administrador') {
    const clienteBeckId = req.query.clienteBeckId as string | undefined;
    const clienteUsuarioId = req.query.clienteUsuarioId as string | undefined;

    // Prioridad 1: clienteBeckId
    if (clienteBeckId) {
      const beck = await prisma.clienteBeck.findUnique({
        where: { id: clienteBeckId },
        select: { id: true, activo: true },
      });
      if (!beck) {
        return { ok: false, status: 404, error: 'Cliente Beck no encontrado' };
      }
      if (!beck.activo) {
        return { ok: false, status: 403, error: 'El cliente Beck está inactivo' };
      }
      const obraIds = await getObrasPorClienteBeck(clienteBeckId);
      return { ok: true, mode: 'clienteBeck', clienteBeckId, obraIds };
    }

    // Prioridad 2: clienteUsuarioId (compatibilidad anterior)
    if (clienteUsuarioId) {
      const usuarioObjetivo = await prisma.usuario.findUnique({
        where: { id: clienteUsuarioId },
        select: { id: true, rol: true, activo: true },
      });
      if (!usuarioObjetivo || usuarioObjetivo.rol !== 'cliente') {
        return { ok: false, status: 404, error: 'Usuario cliente no encontrado' };
      }
      if (!usuarioObjetivo.activo) {
        return { ok: false, status: 403, error: 'El usuario cliente está inactivo' };
      }
      return { ok: true, mode: 'usuario', targetId: clienteUsuarioId };
    }

    return {
      ok: false,
      status: 400,
      error: 'Debe seleccionar un cliente mediante clienteBeckId o clienteUsuarioId',
    };
  }

  // ── Usuario interno (ingenieria, vendedor, jefeobra, etc.) con permiso beck_vista_cliente ─
  // El guard requirePermission ya verificó el permiso; aquí solo resolvemos el scope.
  // Se requiere clienteBeckId para delimitar el acceso — no se permite vista global.
  const clienteBeckId = req.query.clienteBeckId as string | undefined;

  if (!clienteBeckId) {
    return {
      ok: false,
      status: 400,
      error: 'Debe seleccionar un cliente para ver la información.',
    };
  }

  const beck = await prisma.clienteBeck.findUnique({
    where: { id: clienteBeckId },
    select: { id: true, activo: true },
  });
  if (!beck) {
    return { ok: false, status: 404, error: 'Cliente Beck no encontrado' };
  }
  if (!beck.activo) {
    return { ok: false, status: 403, error: 'El cliente Beck está inactivo' };
  }
  const obraIds = await getObrasPorClienteBeck(clienteBeckId);
  return { ok: true, mode: 'clienteBeck', clienteBeckId, obraIds };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

// GET /api/cliente/clientes-beck  (solo administrador)
export const getClientesBeck = async (_req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await prisma.clienteBeck.findMany({
      where: { activo: true },
      select: {
        id: true,
        rut: true,
        razonSocial: true,
        nombreEmpresa: true,
        correo: true,
        telefono: true,
        region: true,
        comuna: true,
        activo: true,
      },
      orderBy: { razonSocial: 'asc' },
    });

    if (clientes.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // Obras asociadas: directas (Obra.clienteBeckId) + legado (OperadorBeck → obraId)
    const clienteIds = clientes.map(c => c.id);
    const [obrasDirectas, oportunidades] = await Promise.all([
      prisma.obra.findMany({
        where: { clienteBeckId: { in: clienteIds } },
        select: { id: true, clienteBeckId: true },
      }),
      prisma.operadorBeck.findMany({
        where: { clienteBeckId: { in: clienteIds }, obraId: { not: null } },
        select: { clienteBeckId: true, obraId: true },
      }),
    ]);

    const obrasPorCliente = new Map<string, Set<string>>();

    for (const obra of obrasDirectas) {
      if (!obra.clienteBeckId) continue;
      if (!obrasPorCliente.has(obra.clienteBeckId)) {
        obrasPorCliente.set(obra.clienteBeckId, new Set());
      }
      obrasPorCliente.get(obra.clienteBeckId)!.add(obra.id);
    }

    for (const op of oportunidades) {
      if (!op.clienteBeckId || !op.obraId) continue;
      if (!obrasPorCliente.has(op.clienteBeckId)) {
        obrasPorCliente.set(op.clienteBeckId, new Set());
      }
      obrasPorCliente.get(op.clienteBeckId)!.add(op.obraId);
    }

    // Conteo de registros validados por obra (una sola query)
    const allObraIds = [...new Set([...obrasPorCliente.values()].flatMap(s => [...s]))];
    const registrosMap = new Map<string, number>();

    if (allObraIds.length > 0) {
      const conteos = await prisma.registroTerreno.groupBy({
        by: ['obraId'],
        where: { obraId: { in: allObraIds }, estado: 'validado' },
        _count: { id: true },
      });
      for (const c of conteos) {
        registrosMap.set(c.obraId, c._count.id);
      }
    }

    const data = clientes.map(c => {
      const obrasSet = obrasPorCliente.get(c.id) ?? new Set<string>();
      const totalRegistrosValidados = [...obrasSet].reduce(
        (sum, obraId) => sum + (registrosMap.get(obraId) ?? 0),
        0
      );
      return {
        id: c.id,
        rut: c.rut,
        razonSocial: c.razonSocial,
        nombreEmpresa: c.nombreEmpresa,
        correo: c.correo,
        telefono: c.telefono,
        region: c.region,
        comuna: c.comuna,
        activo: c.activo,
        cantidadObrasAsociadas: obrasSet.size,
        totalRegistrosValidados,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getClientesBeck:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/cliente/usuarios-clientes  (solo administrador)
export const getUsuariosClientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { rol: 'cliente' },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
        _count: { select: { usuarios_obras: true } },
      },
      orderBy: { nombre: 'asc' },
    });

    const data = usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      activo: u.activo,
      cantidadObrasAsignadas: u._count.usuarios_obras,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getUsuariosClientes:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/cliente/obras
export const getObrasCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolverScope(req);
    if (!scope.ok) {
      res.status(scope.status).json({ success: false, error: scope.error });
      return;
    }

    const obrasIds = await getObrasFromScope(scope);

    if (obrasIds.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const obras = await prisma.obra.findMany({
      where: { id: { in: obrasIds } },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        cliente: true,
        direccion: true,
        estado: true,
        _count: {
          select: {
            registrosTerreno: { where: { estado: 'validado' } },
          },
        },
        registrosTerreno: {
          where: { estado: 'validado' },
          select: { cantidadFinal: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const data = obras.map(obra => ({
      id: obra.id,
      nombre: obra.nombre,
      codigo: obra.codigo,
      cliente: obra.cliente,
      direccion: obra.direccion,
      estado: obra.estado,
      totalRegistrosValidados: obra._count.registrosTerreno,
      cantidadFinalTotal: obra.registrosTerreno.reduce(
        (sum, r) => sum + (Number(r.cantidadFinal) || 0),
        0
      ),
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getObrasCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/cliente/obras/:obraId/registros
export const getRegistrosObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolverScope(req);
    if (!scope.ok) {
      res.status(scope.status).json({ success: false, error: scope.error });
      return;
    }

    const obraId = req.params.obraId as string;

    // Verificar acceso a la obra según el modo del scope
    if (scope.mode === 'usuario') {
      if (!(await clienteTieneObraAsignada(scope.targetId, obraId))) {
        res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
        return;
      }
    } else {
      // clienteBeck: la obra debe estar en la lista ya resuelta desde OperadorBeck
      if (!scope.obraIds.includes(obraId)) {
        res.status(403).json({ success: false, error: 'Esta obra no pertenece al cliente seleccionado' });
        return;
      }
    }

    const registros = await prisma.registroTerreno.findMany({
      where: { obraId, estado: 'validado' },
      select: {
        id: true,
        obraId: true,
        fecha: true,
        diaSemana: true,
        tipoRegistro: true,
        piso: true,
        modulo: true,
        recinto: true,
        ejeNumerico: true,
        ejeAlfabetico: true,
        numeroSello: true,
        cantidadSellos: true,
        cantidadFinal: true,
        descripcionMaterial: true,
        nombreSellador: true,
        itemizadoBeck: true,
        itemizadoMandanteTexto: true,
        codigoBeck: true,
        holgura: true,
        factorPorHolguras: true,
        accesibilidad: true,
        cantidadSellosConFactores: true,
        aislacion: true,
        cantidadSellosAislacion: true,
        reparacionTabique: true,
        folio: true,
        observaciones: true,
        fotosUrls: true,
        fotoUrl: true,
        validadoCliente: true,
        validadoClienteAt: true,
        pdfFirmadoUrl: true,
        validadoClientePor: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        itemizadoMandante: {
          select: {
            id: true,
            codigoBeck: true,
            nombre: true,
            descripcion: true,
            activo: true,
          },
        },
        fotos_registro: {
          select: {
            id: true,
            url: true,
            public_id: true,
            nombre_archivo: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    const registrosSanitizados = await sanitizarRegistrosPorRol(
      registros as unknown as Record<string, unknown>[],
      'cliente',
      obraId,
    );

    const data = registrosSanitizados.map((registro, index) => {
      const original = registros[index];
      const validadoCliente = original.validadoCliente === true;

      return {
        ...registro,
        validadoCliente,
        validadoClienteAt: original.validadoClienteAt,
        validadoClientePor: original.validadoClientePor,
        pdfFirmadoUrl: original.pdfFirmadoUrl,
        estado: validadoCliente ? 'Validado' : 'No validado',
        acciones: {
          puedeValidar: !validadoCliente,
        },
      };
    });

    const configuracionCampos = await obtenerConfiguracionCampos('cliente', obraId);
    const columnasConfigurables = configuracionCampos
      .filter(campo => campo.visible)
      .map(({ campo, label, configurable }) => ({ campo, label, configurable }));
    const columnasFijas = [
      { campo: 'estado', label: 'Estado', configurable: false },
      { campo: 'acciones', label: 'Acciones', configurable: false },
    ];

    res.json({
      success: true,
      data,
      configuracionCampos,
      columnasConfigurables,
      columnasFijas,
      columnas: [...columnasConfigurables, ...columnasFijas],
    });
  } catch (error) {
    console.error('Error getRegistrosObra:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Límites de firma — idénticos a los de beck-mobile-backend (cliente.controller.ts)
function validarFirmaBody(body: unknown): { ok: true; pathData: string; canvasWidth: number; canvasHeight: number } | { ok: false; error: string } {
  const { pathData, canvasWidth, canvasHeight } = (body ?? {}) as Record<string, unknown>;

  if (!pathData || typeof pathData !== 'string' || pathData.trim().length === 0) {
    return { ok: false, error: 'Falta la firma del cliente' };
  }
  if (pathData.length > 100_000) {
    return { ok: false, error: 'La firma es demasiado compleja' };
  }
  if (
    !Number.isFinite(Number(canvasWidth)) || Number(canvasWidth) <= 0 || Number(canvasWidth) > 5000 ||
    !Number.isFinite(Number(canvasHeight)) || Number(canvasHeight) <= 0 || Number(canvasHeight) > 5000
  ) {
    return { ok: false, error: 'Dimensiones de canvas inválidas' };
  }

  return { ok: true, pathData, canvasWidth: Number(canvasWidth), canvasHeight: Number(canvasHeight) };
}

const VALIDADO_CLIENTE_SELECT = {
  id: true,
  validadoCliente: true,
  validadoClienteAt: true,
  pdfFirmadoUrl: true,
  validadoClientePor: {
    select: {
      id: true,
      nombre: true,
      email: true,
    },
  },
} as const;

// PATCH /api/cliente/registros/:registroId/validar
export const validarRegistroCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.userRole !== 'cliente' || !req.userId) {
      res.status(403).json({ success: false, error: 'Solo usuarios cliente pueden validar registros' });
      return;
    }

    const registroId = req.params.registroId as string;

    const firma = validarFirmaBody(req.body);
    if (!firma.ok) {
      res.status(400).json({ success: false, error: firma.error });
      return;
    }

    const registro = await prisma.registroTerreno.findUnique({
      where: { id: registroId },
      select: {
        id: true,
        obraId: true,
        codigoBeck: true,
        estado: true,
        validadoCliente: true,
        validadoClienteAt: true,
        pdfFirmadoUrl: true,
        validadoClientePor: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    if (!registro) {
      res.status(404).json({ success: false, error: 'Registro no encontrado' });
      return;
    }

    if (!(await clienteTieneObraAsignada(req.userId, registro.obraId))) {
      res.status(403).json({ success: false, error: 'No tienes acceso a este registro' });
      return;
    }

    if (registro.estado !== 'validado') {
      res.status(400).json({ success: false, error: 'Solo se pueden validar registros previamente validados por el flujo interno' });
      return;
    }

    if (registro.validadoCliente) {
      res.status(409).json({
        success: false,
        error: 'El registro ya fue validado por el cliente',
        data: {
          id: registro.id,
          validadoCliente: true,
          validadoClienteAt: registro.validadoClienteAt,
          validadoClientePor: registro.validadoClientePor,
          pdfFirmadoUrl: registro.pdfFirmadoUrl,
          estado: 'Validado',
          acciones: { puedeValidar: false },
        },
      });
      return;
    }

    // Cargar detalle completo (obra, usuario ejecutor, fotos) para generar el PDF
    const registroFull = await prisma.registroTerreno.findUnique({
      where: { id: registroId },
      include: {
        obra:           { select: { id: true, nombre: true, codigo: true, cliente: true } },
        usuario:        { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });

    if (!registroFull) {
      res.status(404).json({ success: false, error: 'Registro no encontrado' });
      return;
    }

    const firmante = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { nombre: true },
    });

    const firmadoAt = new Date();
    const firmadoPor = firmante?.nombre || 'Cliente';

    // Generar PDF con firma incrustada (mismo núcleo que descargarRegistroPdf)
    const pdfBuffer = await generateRegistroPdfBuffer(registroFull, {
      pathData: firma.pathData,
      canvasWidth: firma.canvasWidth,
      canvasHeight: firma.canvasHeight,
      firmadoPor,
      firmadoAt,
    });

    const codigoBeck = registro.codigoBeck ?? `REG-${registroId.slice(0, 6).toUpperCase()}`;

    // Subir PDF firmado a Cloudinary como raw — mismo folder/convención de publicId que beck-mobile-backend
    const pdfResult = await uploadFileDetailed(pdfBuffer, 'beck/pdfs-firmados', {
      resourceType: 'raw',
      publicId: `${codigoBeck}-firmado-${registroId.slice(0, 8)}`,
    });

    // Nota sobre condición de carrera: el PDF ya se generó y subió a Cloudinary en
    // este punto. Si dos requests concurrentes llegan aquí (ambos pasaron el chequeo
    // de `validadoCliente` de arriba), ambos subirán un PDF a Cloudinary, pero el
    // `updateMany` de abajo con `where: { validadoCliente: false }` solo puede
    // aplicar a UNO de los dos — el que pierde la carrera cae en `count === 0` y
    // responde 409 con el estado real ya persistido por el ganador, sin sobrescribir
    // nada. El registro nunca queda validado sin PDF ni con doble firma persistida;
    // el único costo posible es un PDF huérfano en Cloudinary del request perdedor
    // (no afecta la integridad de datos, solo almacenamiento).
    const updatedCount = await prisma.registroTerreno.updateMany({
      where: {
        id: registroId,
        validadoCliente: false,
      },
      data: {
        validadoCliente: true,
        validadoClientePorId: req.userId,
        validadoClienteAt: firmadoAt,
        pdfFirmadoUrl: pdfResult.secure_url,
      },
    });

    if (updatedCount.count === 0) {
      const actual = await prisma.registroTerreno.findUnique({
        where: { id: registroId },
        select: VALIDADO_CLIENTE_SELECT,
      });

      res.status(409).json({
        success: false,
        error: 'El registro ya fue validado por el cliente',
        data: actual
          ? {
            id: actual.id,
            validadoCliente: actual.validadoCliente,
            validadoClienteAt: actual.validadoClienteAt,
            validadoClientePor: actual.validadoClientePor,
            pdfFirmadoUrl: actual.pdfFirmadoUrl,
            estado: actual.validadoCliente ? 'Validado' : 'No validado',
            acciones: { puedeValidar: !actual.validadoCliente },
          }
          : null,
      });
      return;
    }

    const actualizado = await prisma.registroTerreno.findUnique({
      where: { id: registroId },
      select: VALIDADO_CLIENTE_SELECT,
    });

    res.json({
      success: true,
      data: {
        id: actualizado?.id ?? registroId,
        validadoCliente: actualizado?.validadoCliente ?? true,
        validadoClienteAt: actualizado?.validadoClienteAt ?? null,
        validadoClientePor: actualizado?.validadoClientePor ?? null,
        pdfFirmadoUrl: actualizado?.pdfFirmadoUrl ?? pdfResult.secure_url,
        estado: 'Validado',
        acciones: { puedeValidar: false },
      },
    });
  } catch (error) {
    console.error('Error validarRegistroCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/cliente/registros/:id/pdf
// Si el registro ya tiene PDF firmado, redirige a esa URL (conserva firma y
// sello). Si no lo tiene pero ya está validado, genera su PDF normal al
// vuelo (mismo núcleo que descargarRegistroPdf), sin persistir ni subir
// nada — un registro validado sin firma es un caso válido, nunca un error.
export const obtenerPdfFirmadoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolverScope(req);
    if (!scope.ok) {
      res.status(scope.status).json({ success: false, error: scope.error });
      return;
    }

    const id = req.params.id as string;

    const registro = await prisma.registroTerreno.findUnique({
      where: { id },
      include: {
        obra: { select: { id: true, nombre: true, codigo: true, cliente: true } },
        usuario: { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });

    if (!registro) {
      res.status(404).json({ success: false, error: 'Registro no encontrado' });
      return;
    }

    if (scope.mode === 'usuario') {
      if (!(await clienteTieneObraAsignada(scope.targetId, registro.obraId))) {
        res.status(403).json({ success: false, error: 'No tienes acceso a este registro' });
        return;
      }
    } else if (!scope.obraIds.includes(registro.obraId)) {
      res.status(403).json({ success: false, error: 'Esta obra no pertenece al cliente seleccionado' });
      return;
    }

    if (registro.estado !== 'validado') {
      res.status(404).json({
        success: false,
        error: 'Este registro todavía no está validado',
      });
      return;
    }

    if (registro.pdfFirmadoUrl) {
      res.redirect(registro.pdfFirmadoUrl);
      return;
    }

    const pdfBuffer = await generateRegistroPdfBuffer(registro);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="registro.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error obtenerPdfFirmadoCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// ─── Firma masiva ─────────────────────────────────────────────────────────────

const MAX_REGISTROS_FIRMA_MASIVA = 20;

function validarRegistroIdsBody(
  body: unknown,
  max: number,
): { ok: true; registroIds: string[] } | { ok: false; error: string } {
  const { registroIds } = (body ?? {}) as Record<string, unknown>;

  if (!Array.isArray(registroIds) || registroIds.length === 0) {
    return { ok: false, error: 'Debes seleccionar al menos un registro' };
  }
  if (registroIds.length > max) {
    return { ok: false, error: `No puedes seleccionar más de ${max} registros a la vez` };
  }
  if (!registroIds.every((id) => typeof id === 'string' && id.trim().length > 0)) {
    return { ok: false, error: 'IDs de registro inválidos' };
  }
  const unicos = new Set(registroIds as string[]);
  if (unicos.size !== registroIds.length) {
    return { ok: false, error: 'Hay registros duplicados en la selección' };
  }

  return { ok: true, registroIds: registroIds as string[] };
}

// PATCH /api/cliente/registros/validar-multiple
// Firma varios registros con una sola firma. La selección puede ser mixta
// (pendientes + ya firmados): los ya firmados se reportan como "omitidos" y
// jamás se tocan — no se regenera su PDF, no se re-sube nada a Cloudinary y
// no se sobrescribe validadoCliente/validadoClienteAt/validadoClientePorId/
// pdfFirmadoUrl. Solo los pendientes se procesan, cada uno genera y sube su
// propio PDF de forma independiente y secuencial (mismo núcleo que
// validarRegistroCliente) — un fallo puntual no afecta a los demás ni deja
// ningún registro en un estado ambiguo (mismo guard updateMany +
// validadoCliente:false que el endpoint individual, aplicado uno por uno,
// como defensa adicional ante condiciones de carrera).
export const validarRegistrosClienteMultiple = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.userRole !== 'cliente' || !req.userId) {
      res.status(403).json({ success: false, error: 'Solo usuarios cliente pueden validar registros' });
      return;
    }

    const idsResult = validarRegistroIdsBody(req.body, MAX_REGISTROS_FIRMA_MASIVA);
    if (!idsResult.ok) {
      res.status(400).json({ success: false, error: idsResult.error });
      return;
    }
    const { registroIds } = idsResult;

    const firma = validarFirmaBody(req.body);
    if (!firma.ok) {
      res.status(400).json({ success: false, error: firma.error });
      return;
    }

    const registrosBase = await prisma.registroTerreno.findMany({
      where: { id: { in: registroIds } },
      select: {
        id: true,
        obraId: true,
        codigoBeck: true,
        estado: true,
        validadoCliente: true,
      },
    });

    if (registrosBase.length !== registroIds.length) {
      const encontrados = new Set(registrosBase.map((r) => r.id));
      const faltantes = registroIds.filter((id) => !encontrados.has(id));
      res.status(404).json({ success: false, error: 'Uno o más registros no existen', data: { faltantes } });
      return;
    }

    const obraIdsUnicos = new Set(registrosBase.map((r) => r.obraId));
    if (obraIdsUnicos.size > 1) {
      res.status(400).json({ success: false, error: 'Todos los registros deben pertenecer a la misma obra' });
      return;
    }
    const [obraId] = obraIdsUnicos;

    if (!(await clienteTieneObraAsignada(req.userId, obraId))) {
      res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
      return;
    }

    const noValidados = registrosBase.filter((r) => r.estado !== 'validado').map((r) => r.id);
    if (noValidados.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Todos los registros deben estar validados por el flujo interno',
        data: { noValidados },
      });
      return;
    }

    // Selección mixta permitida: los registros ya firmados por el cliente se
    // omiten (nunca se regenera su PDF ni se tocan sus campos) y solo se
    // procesan los pendientes. Si NINGUNO está pendiente no hay nada que
    // firmar y se rechaza explícitamente.
    const yaFirmados = registrosBase.filter((r) => r.validadoCliente);
    const pendientes = registrosBase.filter((r) => !r.validadoCliente);

    if (pendientes.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Todos los registros seleccionados ya fueron validados por el cliente',
        data: { yaFirmados: yaFirmados.map((r) => r.id) },
      });
      return;
    }

    const omitidos: Array<{ id: string; motivo: string }> = yaFirmados.map((r) => ({
      id: r.id,
      motivo: 'El registro ya estaba firmado.',
    }));

    const firmante = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { nombre: true },
    });
    const firmadoAt = new Date();
    const firmadoPor = firmante?.nombre || 'Cliente';

    const exitosos: Array<{ id: string; pdfFirmadoUrl: string }> = [];
    const fallidos: Array<{ id: string; motivo: string }> = [];

    // Solo se procesan los pendientes — los ya firmados quedaron en
    // `omitidos` arriba y nunca entran a este loop, así que jamás se genera
    // ni se sube un PDF nuevo para ellos, ni se toca validadoCliente /
    // validadoClienteAt / validadoClientePorId / pdfFirmadoUrl existentes.
    for (const registroBase of pendientes) {
      try {
        const registroFull = await prisma.registroTerreno.findUnique({
          where: { id: registroBase.id },
          include: {
            obra: { select: { id: true, nombre: true, codigo: true, cliente: true } },
            usuario: { select: { id: true, nombre: true, email: true, rol: true } },
            fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
          },
        });
        if (!registroFull) {
          fallidos.push({ id: registroBase.id, motivo: 'Registro no encontrado' });
          continue;
        }

        const pdfBuffer = await generateRegistroPdfBuffer(registroFull, {
          pathData: firma.pathData,
          canvasWidth: firma.canvasWidth,
          canvasHeight: firma.canvasHeight,
          firmadoPor,
          firmadoAt,
        });

        const codigoBeck = registroBase.codigoBeck ?? `REG-${registroBase.id.slice(0, 6).toUpperCase()}`;
        const pdfResult = await uploadFileDetailed(pdfBuffer, 'beck/pdfs-firmados', {
          resourceType: 'raw',
          publicId: `${codigoBeck}-firmado-${registroBase.id.slice(0, 8)}`,
        });

        // Mismo guard de condición de carrera que validarRegistroCliente: si
        // el registro ya fue firmado entre la validación previa y este punto,
        // el update no aplica y se reporta como fallido sin sobrescribir nada.
        const updatedCount = await prisma.registroTerreno.updateMany({
          where: { id: registroBase.id, validadoCliente: false },
          data: {
            validadoCliente: true,
            validadoClientePorId: req.userId,
            validadoClienteAt: firmadoAt,
            pdfFirmadoUrl: pdfResult.secure_url,
          },
        });

        if (updatedCount.count === 0) {
          fallidos.push({ id: registroBase.id, motivo: 'El registro ya fue validado por el cliente' });
          continue;
        }

        exitosos.push({ id: registroBase.id, pdfFirmadoUrl: pdfResult.secure_url });
      } catch (err) {
        console.error(`Error procesando firma masiva para registro ${registroBase.id}:`, err);
        fallidos.push({ id: registroBase.id, motivo: 'Error generando o subiendo el PDF firmado' });
      }
    }

    res.json({
      success: true,
      data: {
        exitosos,
        omitidos,
        fallidos,
        totalSolicitados: registroIds.length,
        totalExitosos: exitosos.length,
        totalOmitidos: omitidos.length,
        totalFallidos: fallidos.length,
      },
    });
  } catch (error) {
    console.error('Error validarRegistrosClienteMultiple:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// ─── Descarga consolidada ───────────────────────────────────────────────────────

const MAX_REGISTROS_PDF_CONSOLIDADO = 20;

async function fetchPdfBuffer(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// POST /api/cliente/registros/pdf-consolidado
// Genera un único PDF con las páginas de todos los registros seleccionados,
// respetando el orden de selección. Cada registro se resuelve de forma
// independiente: si tiene pdfFirmadoUrl se reutiliza (conserva firma y
// sello); si no lo tiene, se genera su PDF normal al vuelo (mismo núcleo que
// descargarRegistroPdf), sin persistir ni subir nada. La selección puede
// mezclar libremente registros firmados y no firmados — un registro
// validado sin firma NUNCA es un error, es un caso válido. Único requisito:
// todos deben tener estado==='validado'. No es tolerante a fallos de red al
// obtener un PDF firmado ya existente: si eso falla, se aborta toda la
// operación en vez de entregar un documento consolidado incompleto sin
// avisar.
export const descargarPdfConsolidadoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    // Acceso de staff interno (montado en /api/registros/pdf-consolidado, ver
    // registros.routes.ts): ya quedó autorizado por requirePermission antes de
    // llegar aquí, con la misma visibilidad de registros que ya tiene en
    // /beck/registro (org-wide, no acotada a un cliente/obra específico) — no
    // aplica el scope de Vista Cliente (clienteBeckId), que exige seleccionar
    // un cliente y no tiene sentido para esta vista.
    const accesoInterno = (req as Request & { accesoInternoRegistros?: boolean }).accesoInternoRegistros === true;

    let scope: Awaited<ReturnType<typeof resolverScope>> | null = null;
    if (!accesoInterno) {
      scope = await resolverScope(req);
      if (!scope.ok) {
        res.status(scope.status).json({ success: false, error: scope.error });
        return;
      }
    }

    const idsResult = validarRegistroIdsBody(req.body, MAX_REGISTROS_PDF_CONSOLIDADO);
    if (!idsResult.ok) {
      res.status(400).json({ success: false, error: idsResult.error });
      return;
    }
    const idsOrdenados = idsResult.registroIds;

    const registros = await prisma.registroTerreno.findMany({
      where: { id: { in: idsOrdenados } },
      include: {
        obra: { select: { id: true, nombre: true, codigo: true, cliente: true } },
        usuario: { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });

    if (registros.length !== idsOrdenados.length) {
      res.status(404).json({ success: false, error: 'Uno o más registros no existen' });
      return;
    }

    const obraIdsUnicos = new Set(registros.map((r) => r.obraId));
    if (obraIdsUnicos.size > 1) {
      res.status(400).json({ success: false, error: 'Todos los registros deben pertenecer a la misma obra' });
      return;
    }
    const [obraId] = obraIdsUnicos;

    if (!accesoInterno && scope) {
      if (scope.mode === 'usuario') {
        if (!(await clienteTieneObraAsignada(scope.targetId, obraId))) {
          res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
          return;
        }
      } else if (!scope.obraIds.includes(obraId)) {
        res.status(403).json({ success: false, error: 'Esta obra no pertenece al cliente seleccionado' });
        return;
      }
    }

    const noValidados = registros.filter((r) => r.estado !== 'validado');
    if (noValidados.length > 0) {
      res.status(400).json({ success: false, error: 'Todos los registros deben estar validados' });
      return;
    }

    // Cada registro se resuelve de forma independiente, sin importar si el
    // resto de la selección está firmado o no: un registro validado siempre
    // puede incluirse. Si tiene pdfFirmadoUrl se reutiliza (conserva firma y
    // sello); si no lo tiene, se genera su PDF normal al vuelo (sin firma),
    // sin persistir ni subir nada a Cloudinary. Nunca se mezcla lo firmado y
    // lo no firmado en documentos separados ni se bloquea la operación por
    // ausencia de firma — eso es un caso válido, no un error.
    const registrosPorId = new Map(registros.map((r) => [r.id, r]));
    const registrosEnOrden = idsOrdenados.map((id) => registrosPorId.get(id)!);

    const mergedPdf = await PDFDocument.create();

    for (const registro of registrosEnOrden) {
      let pdfBytes: Buffer | null;

      if (registro.pdfFirmadoUrl) {
        pdfBytes = await fetchPdfBuffer(registro.pdfFirmadoUrl);
        if (!pdfBytes) {
          res.status(502).json({
            success: false,
            error: `No se pudo obtener el PDF firmado del registro ${registro.codigoBeck ?? registro.id}`,
          });
          return;
        }
      } else {
        // Sin pdfFirmadoUrl (validado pero aún no firmado por el cliente):
        // se genera su PDF normal al vuelo, sin signatureOptions (sin firma
        // ni sello), sin persistir ni subir nada.
        pdfBytes = await generateRegistroPdfBuffer(registro);
      }

      const sourcePdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    res.setHeader('Content-Type', 'application/pdf');
    // inline (no attachment): el frontend abre este PDF en una pestaña nueva
    // vía blob + window.open, no dispara una descarga automática del navegador.
    res.setHeader('Content-Disposition', 'inline; filename="registros-validados.pdf"');
    res.send(Buffer.from(mergedBytes));
  } catch (error) {
    console.error('Error descargarPdfConsolidadoCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/cliente/dashboard
export const getDashboardCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolverScope(req);
    if (!scope.ok) {
      res.status(scope.status).json({ success: false, error: scope.error });
      return;
    }

    const obrasIds = await getObrasFromScope(scope);
    const configuracionVista = await getConfiguracionVistaFromScope(scope);

    console.log(`[getDashboardCliente] clienteBeckId recibido: ${req.query.clienteBeckId ?? '(rol cliente)'}`);
    console.log(`[getDashboardCliente] obraIds resueltos (${obrasIds.length}): ${obrasIds.join(', ') || '(vacío)'}`);

    console.log('[getDashboardCliente] configuracionVista resuelta', configuracionVista.map(item => ({
      clave: item.clave,
      visible: item.visible,
      tituloPersonalizado: item.tituloPersonalizado,
      orden: item.orden,
    })));

    const emptyDashboard = {
      kpis: {
        totalObras: 0,
        totalRegistrosValidados: 0,
        cantidadFinalTotal: 0,
        registrosEsteMes: 0,
      },
      registrosPorTipo: [],
      registrosPorObra: [],
      registrosPorPiso: [],
      registrosPorFecha: [],
      ultimosRegistrosValidados: [],
      configuracionVista,
    };

    if (obrasIds.length === 0) {
      res.json({ success: true, configuracionVista, data: emptyDashboard });
      return;
    }

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
    const treintaDiasAtras = new Date(ahora);
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

    const registros = await prisma.registroTerreno.findMany({
      where: { obraId: { in: obrasIds }, estado: 'validado' },
      select: {
        id: true,
        obraId: true,
        fecha: true,
        tipoRegistro: true,
        piso: true,
        modulo: true,
        cantidadFinal: true,
        obra: { select: { nombre: true } },
      },
      orderBy: { fecha: 'desc' },
    });

    console.log(`[getDashboardCliente] registros validados encontrados: ${registros.length}`);

    const totalRegistrosValidados = registros.length;
    const cantidadFinalTotal = registros.reduce(
      (sum, r) => sum + (Number(r.cantidadFinal) || 0),
      0
    );
    const registrosEsteMes = registros.filter(
      r => r.fecha >= inicioMes && r.fecha <= finMes
    ).length;

    const porTipoMap = new Map<string, number>();
    const porObraMap = new Map<string, { nombre: string; cantidad: number }>();
    const porPisoMap = new Map<string, number>();
    const porFechaMap = new Map<string, number>();

    for (const r of registros) {
      const tipo = r.tipoRegistro || 'sin_tipo';
      porTipoMap.set(tipo, (porTipoMap.get(tipo) || 0) + 1);

      const obraEntry = porObraMap.get(r.obraId);
      if (obraEntry) {
        obraEntry.cantidad++;
      } else {
        porObraMap.set(r.obraId, { nombre: r.obra.nombre, cantidad: 1 });
      }

      const piso = r.piso || 'sin_piso';
      porPisoMap.set(piso, (porPisoMap.get(piso) || 0) + 1);

      if (r.fecha >= treintaDiasAtras) {
        const fechaStr = r.fecha.toISOString().slice(0, 10);
        porFechaMap.set(fechaStr, (porFechaMap.get(fechaStr) || 0) + 1);
      }
    }

    res.json({
      success: true,
      configuracionVista,
      data: {
        kpis: {
          totalObras: obrasIds.length,
          totalRegistrosValidados,
          cantidadFinalTotal,
          registrosEsteMes,
        },
        registrosPorTipo: Array.from(porTipoMap.entries()).map(([tipo, cantidad]) => ({
          tipo,
          cantidad,
        })),
        registrosPorObra: Array.from(porObraMap.entries()).map(([obraId, { nombre, cantidad }]) => ({
          obraId,
          nombre,
          cantidad,
        })),
        registrosPorPiso: Array.from(porPisoMap.entries()).map(([piso, cantidad]) => ({
          piso,
          cantidad,
        })),
        registrosPorFecha: Array.from(porFechaMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([fecha, cantidad]) => ({ fecha, cantidad })),
        ultimosRegistrosValidados: registros.slice(0, 10).map(r => ({
          id: r.id,
          fecha: r.fecha,
          tipoRegistro: r.tipoRegistro,
          obraId: r.obraId,
          obraNombre: r.obra.nombre,
          modulo: r.modulo,
          cantidadFinal: r.cantidadFinal,
        })),
        configuracionVista,
      },
    });
  } catch (error) {
    console.error('Error getDashboardCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// ─── Itemizado por obra: revisión y confirmación del cliente ─────────────────

function handleItemizadoObraError(res: Response, error: unknown): void {
  if (error instanceof ItemizadoObraError) {
    res.status(error.statusCode).json({ success: false, error: error.message });
    return;
  }
  console.error('Error en itemizado de cliente:', error);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
}

// GET /api/cliente/obras/:obraId/itemizados
// Solo itemizados incluidos en la propuesta (propuestoAlCliente=true); nada de los
// que Beck no propuso ni campos internos (orden, rendimientos, etc.). Requiere que
// Beck ya haya enviado la propuesta (EN_REVISION_CLIENTE o FINALIZADO) — en
// PREPARACION el cliente aún no debe verla.
export const getItemizadosPropuestosObraCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.userRole !== 'cliente' || !req.userId) {
      res.status(403).json({ success: false, error: 'Solo usuarios cliente pueden ver esta información' });
      return;
    }

    const obraId = req.params.obraId as string;

    if (!(await clienteTieneObraAsignada(req.userId, obraId))) {
      res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
      return;
    }

    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
      select: { id: true, estadoPreparacionItemizado: true },
    });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.PREPARACION) {
      res.status(409).json({
        success: false,
        error: 'La propuesta de itemizado aún no fue enviada para revisión.',
      });
      return;
    }

    const data = await listarItemizadosPropuestosParaObra(obraId);

    res.json({
      success: true,
      obra: { id: obra.id, estadoPreparacionItemizado: obra.estadoPreparacionItemizado },
      data,
    });
  } catch (error) {
    console.error('Error getItemizadosPropuestosObraCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// PATCH /api/cliente/obras/:obraId/itemizados/:itemizadoOpcionId
// El cliente solo puede editar nombrePersonalizado y/o seleccionadoPorCliente, sobre
// un itemizado que Beck ya incluyó en la propuesta (propuestoAlCliente=true), y solo
// mientras la obra está EN_REVISION_CLIENTE. Cualquier otro campo en el body → 400.
// No permite tocar visible, propuestoAlCliente, orden, rendimientos ni código/nombre
// Beck (ninguno de esos campos se lee del body).
export const actualizarItemizadoClienteObra = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.userRole !== 'cliente' || !req.userId) {
      res.status(403).json({ success: false, error: 'Solo usuarios cliente pueden editar este campo' });
      return;
    }

    const obraId = req.params.obraId as string;
    const itemizadoOpcionId = req.params.itemizadoOpcionId as string;
    const body = (req.body ?? {}) as Record<string, unknown>;

    const CAMPOS_PERMITIDOS = new Set(['nombrePersonalizado', 'seleccionadoPorCliente']);
    const camposRecibidos = Object.keys(body);
    const camposNoPermitidos = camposRecibidos.filter((campo) => !CAMPOS_PERMITIDOS.has(campo));
    if (camposNoPermitidos.length > 0) {
      res.status(400).json({
        success: false,
        error: `No está permitido modificar: ${camposNoPermitidos.join(', ')}`,
      });
      return;
    }
    if (camposRecibidos.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Debe enviar al menos nombrePersonalizado o seleccionadoPorCliente',
      });
      return;
    }

    const tieneNombre = Object.prototype.hasOwnProperty.call(body, 'nombrePersonalizado');
    const tieneSeleccion = Object.prototype.hasOwnProperty.call(body, 'seleccionadoPorCliente');

    const { nombrePersonalizado, seleccionadoPorCliente } = body;
    if (tieneNombre && nombrePersonalizado !== null && typeof nombrePersonalizado !== 'string') {
      res.status(400).json({ success: false, error: 'nombrePersonalizado debe ser string o null' });
      return;
    }
    if (tieneSeleccion && typeof seleccionadoPorCliente !== 'boolean') {
      res.status(400).json({ success: false, error: 'seleccionadoPorCliente debe ser boolean' });
      return;
    }

    if (!(await clienteTieneObraAsignada(req.userId, obraId))) {
      res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
      return;
    }

    await assertItemizadoObraEditablePorCliente(obraId);

    // Solo se puede editar un itemizado que Beck efectivamente incluyó en la
    // propuesta (propuestoAlCliente=true) para esta obra — sin fallback a catálogo
    // global, porque la propuesta solo existe a nivel de configuración por obra.
    const config = await prisma.configuracionItemizadoOpcionObra.findUnique({
      where: { obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId } },
      select: { propuestoAlCliente: true },
    });
    if (!config || !config.propuestoAlCliente) {
      res.status(404).json({ success: false, error: 'Itemizado no encontrado para esta obra' });
      return;
    }

    const updateData: { nombrePersonalizado?: string | null; seleccionadoPorCliente?: boolean } = {};
    if (tieneNombre) {
      updateData.nombrePersonalizado =
        typeof nombrePersonalizado === 'string' && nombrePersonalizado.trim()
          ? nombrePersonalizado.trim()
          : null;
    }
    if (tieneSeleccion) {
      updateData.seleccionadoPorCliente = seleccionadoPorCliente as boolean;
    }

    const actualizado = await prisma.configuracionItemizadoOpcionObra.update({
      where: { obraId_itemizadoOpcionId: { obraId, itemizadoOpcionId } },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        itemizadoOpcionId,
        nombrePersonalizado: actualizado.nombrePersonalizado,
        seleccionadoPorCliente: actualizado.seleccionadoPorCliente,
      },
    });
  } catch (error) {
    handleItemizadoObraError(res, error);
  }
};

// PATCH /api/cliente/obras/:obraId/itemizado/confirmar
// Confirmación final del cliente: EN_REVISION_CLIENTE → FINALIZADO. Transacción
// atómica: los itemizados propuestos quedan visible=seleccionadoPorCliente, el
// resto queda visible=false, y la obra pasa a FINALIZADO. Solo a partir de aquí
// los itemizados seleccionados quedan activos para la obra; nadie (ni Beck ni el
// cliente) puede modificar la configuración después de esto.
export const confirmarItemizadoCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.userRole !== 'cliente' || !req.userId) {
      res.status(403).json({ success: false, error: 'Solo usuarios cliente pueden confirmar el itemizado' });
      return;
    }

    const obraId = req.params.obraId as string;

    if (!(await clienteTieneObraAsignada(req.userId, obraId))) {
      res.status(403).json({ success: false, error: 'No tienes acceso a esta obra' });
      return;
    }

    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
      select: { id: true, nombre: true, estadoPreparacionItemizado: true },
    });
    if (!obra) {
      res.status(404).json({ success: false, error: 'Obra no encontrada' });
      return;
    }

    if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.PREPARACION) {
      res.status(409).json({
        success: false,
        error: 'La propuesta de itemizado aún no fue enviada para revisión.',
      });
      return;
    }

    if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.FINALIZADO) {
      res.status(409).json({ success: false, error: 'El itemizado ya fue confirmado.' });
      return;
    }

    const [, , , actualizado] = await prisma.$transaction([
      // Propuestos y aceptados por el cliente → quedan activos para la obra.
      prisma.configuracionItemizadoOpcionObra.updateMany({
        where: { obraId, propuestoAlCliente: true, seleccionadoPorCliente: true },
        data: { visible: true },
      }),
      // Propuestos pero rechazados por el cliente → quedan inactivos.
      prisma.configuracionItemizadoOpcionObra.updateMany({
        where: { obraId, propuestoAlCliente: true, seleccionadoPorCliente: false },
        data: { visible: false },
      }),
      // No propuestos → inactivos (nunca llegaron a mostrarse al cliente).
      prisma.configuracionItemizadoOpcionObra.updateMany({
        where: { obraId, propuestoAlCliente: false },
        data: { visible: false },
      }),
      prisma.obra.update({
        where: { id: obraId },
        data: {
          estadoPreparacionItemizado: EstadoPreparacionItemizado.FINALIZADO,
          itemizadoFinalizadoAt: new Date(),
          itemizadoFinalizadoPorId: req.userId,
        },
        select: {
          id: true,
          estadoPreparacionItemizado: true,
          itemizadoFinalizadoAt: true,
          itemizadoFinalizadoPorId: true,
        },
      }),
    ]);

    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error confirmarItemizadoCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
