import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

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
      const asignacion = await prisma.usuarios_obras.findUnique({
        where: { usuario_id_obra_id: { usuario_id: scope.targetId, obra_id: obraId } },
      });
      if (!asignacion) {
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
        fecha: true,
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
        observaciones: true,
        fotosUrls: true,
        fotoUrl: true,
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

    res.json({ success: true, data: registros });
  } catch (error) {
    console.error('Error getRegistrosObra:', error);
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

    console.log(`[getDashboardCliente] clienteBeckId recibido: ${req.query.clienteBeckId ?? '(rol cliente)'}`);
    console.log(`[getDashboardCliente] obraIds resueltos (${obrasIds.length}): ${obrasIds.join(', ') || '(vacío)'}`);

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
    };

    if (obrasIds.length === 0) {
      res.json({ success: true, data: emptyDashboard });
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
      },
    });
  } catch (error) {
    console.error('Error getDashboardCliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
