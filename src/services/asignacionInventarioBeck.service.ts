import { Prisma, RolUsuario, TipoInventarioBeck } from '@prisma/client';
import { prisma } from '../config/prisma';
import { registrarMovimientoCRM } from './movimientoCrm.service';

type LineaAsignacionInput = {
  tipoItem?: unknown;
  itemId?: unknown;
  cantidad?: unknown;
};

type CrearAsignacionesInput = {
  obraId?: unknown;
  jefeObraId?: unknown;
  observacion?: unknown;
  lineas?: unknown;
  asignadoPorId: string;
};

type LineaParseada = {
  tipoItem: TipoInventarioBeck;
  itemId: string;
  cantidad: number;
};

const TIPOS_VALIDOS = Object.values(TipoInventarioBeck);

function parseLineas(raw: unknown): LineaParseada[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Debes seleccionar al menos un item para asignar.');
  }

  const lineas = (raw as LineaAsignacionInput[]).map((linea, index) => {
    const tipoItem = linea?.tipoItem;
    if (typeof tipoItem !== 'string' || !TIPOS_VALIDOS.includes(tipoItem as TipoInventarioBeck)) {
      throw new Error(`Linea ${index + 1}: tipoItem invalido.`);
    }

    const itemId = linea?.itemId;
    if (typeof itemId !== 'string' || !itemId.trim()) {
      throw new Error(`Linea ${index + 1}: itemId es obligatorio.`);
    }

    const cantidadRaw = linea?.cantidad;
    const cantidad = Number(cantidadRaw ?? 1);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(`Linea ${index + 1}: cantidad debe ser un entero mayor a 0.`);
    }

    return { tipoItem: tipoItem as TipoInventarioBeck, itemId: itemId.trim(), cantidad };
  });

  const claves = new Set<string>();
  for (const linea of lineas) {
    const clave = `${linea.tipoItem}:${linea.itemId}`;
    if (claves.has(clave)) {
      throw new Error('No repitas el mismo item dentro de la misma asignacion.');
    }
    claves.add(clave);
  }

  return lineas;
}

function campoItem(tipoItem: TipoInventarioBeck): 'eppId' | 'implementoId' | 'herramientaId' {
  if (tipoItem === TipoInventarioBeck.epp) return 'eppId';
  if (tipoItem === TipoInventarioBeck.implemento) return 'implementoId';
  return 'herramientaId';
}

const ASIGNACION_INCLUDE = {
  obra: { select: { id: true, nombre: true, codigo: true } },
  jefeObra: { select: { id: true, nombre: true, email: true, rol: true } },
  asignadoPor: { select: { id: true, nombre: true, email: true } },
  devueltoPor: { select: { id: true, nombre: true, email: true } },
  trabajador: { select: { id: true, nombre: true, email: true } },
  epp: { select: { id: true, item: true, sku: true } },
  implemento: { select: { id: true, item: true, sku: true } },
  herramienta: { select: { id: true, nombre: true, sku: true } },
} satisfies Prisma.AsignacionInventarioBeckInclude;

/**
 * Cuanto tiene disponible un supervisor (jefe de obra) de cada item, en una obra, para
 * reasignar a un trabajador: la suma de sus lotes recibidos de bodega (estado 'asignado')
 * que todavia no estan en manos de un trabajador (trabajadorId nulo). No toca el
 * inventario central: ese stock ya se descuenta una sola vez, cuando bodega se lo entrega
 * al supervisor.
 */
async function obtenerLotesDisponiblesSupervisor(
  db: Pick<typeof prisma, 'asignacionInventarioBeck'>,
  supervisorId: string,
  obraId: string,
) {
  return db.asignacionInventarioBeck.findMany({
    where: { jefeObraId: supervisorId, obraId, estado: 'asignado', trabajadorId: null },
    include: {
      epp: { select: { item: true } },
      implemento: { select: { item: true } },
      herramienta: { select: { nombre: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function listarInventarioDisponibleSupervisor(supervisorId: string, obraId: string) {
  if (!obraId?.trim()) throw new Error('obraId es obligatorio.');

  const lotes = await obtenerLotesDisponiblesSupervisor(prisma, supervisorId, obraId);
  const porClave = new Map<string, { tipoItem: TipoInventarioBeck; itemId: string; nombre: string; disponible: number }>();

  for (const lote of lotes) {
    const itemId = lote.eppId ?? lote.implementoId ?? lote.herramientaId!;
    const clave = `${lote.tipoItem}:${itemId}`;
    const nombre = lote.epp?.item ?? lote.implemento?.item ?? lote.herramienta?.nombre ?? '';
    const existente = porClave.get(clave);
    porClave.set(clave, { tipoItem: lote.tipoItem, itemId, nombre, disponible: (existente?.disponible ?? 0) + lote.cantidad });
  }

  return Array.from(porClave.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function crearAsignacionesInventario(input: CrearAsignacionesInput) {
  const obraId = typeof input.obraId === 'string' ? input.obraId.trim() : '';
  const destinatarioId = typeof input.jefeObraId === 'string' ? input.jefeObraId.trim() : '';
  const observacion = typeof input.observacion === 'string' && input.observacion.trim() ? input.observacion.trim() : null;

  if (!obraId) throw new Error('obraId es obligatorio.');
  if (!destinatarioId) throw new Error('Debes seleccionar un destinatario.');

  const lineas = parseLineas(input.lineas);

  const [obra, asignadoPor, destinatario] = await Promise.all([
    prisma.obra.findUnique({ where: { id: obraId }, select: { id: true, nombre: true } }),
    prisma.usuario.findUnique({ where: { id: input.asignadoPorId }, select: { id: true, nombre: true, rol: true } }),
    prisma.usuario.findUnique({ where: { id: destinatarioId }, select: { id: true, nombre: true, rol: true, activo: true } }),
  ]);

  if (!obra) throw new Error('Obra no encontrada.');
  if (!asignadoPor) throw new Error('Usuario que asigna no encontrado.');
  if (!destinatario) throw new Error('Destinatario no encontrado.');
  if (!destinatario.activo) throw new Error('El destinatario seleccionado esta inactivo.');

  // Un supervisor (jefe de obra) solo puede reasignar a un trabajador (terreno) lo que el
  // mismo tiene disponible; cualquier otro rol (bodega, administrador, ingenieria) asigna
  // desde el inventario central de bodega a un supervisor.
  const esReenvioDeSupervisor = asignadoPor.rol === RolUsuario.jefeobra;

  if (esReenvioDeSupervisor) {
    if (destinatario.rol !== RolUsuario.terreno) throw new Error('El destinatario debe tener rol Operario.');
  } else {
    if (destinatario.rol !== RolUsuario.jefeobra) throw new Error('El destinatario debe tener rol Supervisor.');
  }

  const resultado = await prisma.$transaction(async (tx) => {
    const creadas = [];

    if (esReenvioDeSupervisor) {
      for (const linea of lineas) {
        const lotes = await tx.asignacionInventarioBeck.findMany({
          where: {
            jefeObraId: input.asignadoPorId,
            obraId,
            estado: 'asignado',
            trabajadorId: null,
            [campoItem(linea.tipoItem)]: linea.itemId,
          },
          orderBy: { createdAt: 'asc' },
        });

        let restante = linea.cantidad;
        for (const lote of lotes) {
          if (restante <= 0) break;

          if (lote.cantidad <= restante) {
            creadas.push(
              await tx.asignacionInventarioBeck.update({
                where: { id: lote.id },
                data: { trabajadorId: destinatarioId, reasignadoAt: new Date() },
              }),
            );
            restante -= lote.cantidad;
          } else {
            await tx.asignacionInventarioBeck.update({
              where: { id: lote.id },
              data: { cantidad: { decrement: restante } },
            });
            creadas.push(
              await tx.asignacionInventarioBeck.create({
                data: {
                  obraId,
                  jefeObraId: lote.jefeObraId,
                  asignadoPorId: lote.asignadoPorId,
                  tipoItem: lote.tipoItem,
                  eppId: lote.eppId,
                  implementoId: lote.implementoId,
                  herramientaId: lote.herramientaId,
                  cantidad: restante,
                  observacion,
                  trabajadorId: destinatarioId,
                  reasignadoAt: new Date(),
                },
              }),
            );
            restante = 0;
          }
        }

        if (restante > 0) {
          throw new Error(`No tienes disponible suficiente para completar la asignacion (faltan ${restante}).`);
        }

        if (linea.tipoItem === TipoInventarioBeck.herramienta) {
          await tx.inventarioBeckHerramienta.update({
            where: { id: linea.itemId },
            data: { encargado: destinatario.nombre },
          });
        }
      }
    } else {
      for (const linea of lineas) {
        if (linea.tipoItem === TipoInventarioBeck.epp) {
          const epp = await tx.inventarioBeckEpp.findUnique({ where: { id: linea.itemId } });
          if (!epp) throw new Error(`EPP no encontrado: ${linea.itemId}`);
          if (!epp.activo) throw new Error(`El EPP "${epp.item}" esta inactivo.`);
          if (epp.saldo < linea.cantidad) {
            throw new Error(`Stock insuficiente de "${epp.item}" (disponible: ${epp.saldo}).`);
          }
          await tx.inventarioBeckEpp.update({
            where: { id: epp.id },
            data: { saldo: { decrement: linea.cantidad }, salida: { increment: linea.cantidad } },
          });
          creadas.push(
            await tx.asignacionInventarioBeck.create({
              data: { obraId, jefeObraId: destinatarioId, asignadoPorId: input.asignadoPorId, tipoItem: linea.tipoItem, eppId: epp.id, cantidad: linea.cantidad, observacion },
            }),
          );
          continue;
        }

        if (linea.tipoItem === TipoInventarioBeck.implemento) {
          const implemento = await tx.inventarioBeckImplemento.findUnique({ where: { id: linea.itemId } });
          if (!implemento) throw new Error(`Implemento no encontrado: ${linea.itemId}`);
          if (!implemento.activo) throw new Error(`El implemento "${implemento.item}" esta inactivo.`);
          if (implemento.saldo < linea.cantidad) {
            throw new Error(`Stock insuficiente de "${implemento.item}" (disponible: ${implemento.saldo}).`);
          }
          await tx.inventarioBeckImplemento.update({
            where: { id: implemento.id },
            data: { saldo: { decrement: linea.cantidad }, salida: { increment: linea.cantidad } },
          });
          creadas.push(
            await tx.asignacionInventarioBeck.create({
              data: { obraId, jefeObraId: destinatarioId, asignadoPorId: input.asignadoPorId, tipoItem: linea.tipoItem, implementoId: implemento.id, cantidad: linea.cantidad, observacion },
            }),
          );
          continue;
        }

        const herramienta = await tx.inventarioBeckHerramienta.findUnique({ where: { id: linea.itemId } });
        if (!herramienta) throw new Error(`Herramienta no encontrada: ${linea.itemId}`);
        if (!herramienta.activo) throw new Error(`La herramienta "${herramienta.nombre}" esta inactiva.`);
        if (linea.cantidad !== 1) throw new Error(`La herramienta "${herramienta.nombre}" solo admite cantidad 1 (es un activo unico).`);

        await tx.inventarioBeckHerramienta.update({ where: { id: herramienta.id }, data: { encargado: destinatario.nombre } });
        creadas.push(
          await tx.asignacionInventarioBeck.create({
            data: { obraId, jefeObraId: destinatarioId, asignadoPorId: input.asignadoPorId, tipoItem: linea.tipoItem, herramientaId: herramienta.id, cantidad: 1, observacion },
          }),
        );
      }

      await tx.usuarios_obras.upsert({
        where: { usuario_id_obra_id: { usuario_id: destinatarioId, obra_id: obraId } },
        update: {},
        create: { usuario_id: destinatarioId, obra_id: obraId },
      });
    }

    return creadas;
  });

  await registrarMovimientoCRM({
    usuarioId: input.asignadoPorId,
    modulo: 'INVENTARIO',
    tipo: 'ASIGNACION_INVENTARIO_CREADA',
    entidadId: obra.id,
    descripcion: `Se asignaron ${resultado.length} item(s) de inventario a ${destinatario.nombre} en la obra ${obra.nombre}`,
    datos: { obraId, destinatarioId, lineas } as Prisma.InputJsonValue,
  });

  return resultado;
}

export async function listarObrasParaAsignacion() {
  return prisma.obra.findMany({
    where: { estado: 'activa' },
    select: { id: true, nombre: true, codigo: true },
    orderBy: { nombre: 'asc' },
  });
}

async function listarUsuariosParaAsignacionPorRol(obraId: string, rol: RolUsuario) {
  if (!obraId?.trim()) throw new Error('obraId es obligatorio.');

  const [todos, vinculaciones] = await Promise.all([
    prisma.usuario.findMany({
      where: { rol, activo: true },
      select: { id: true, nombre: true, email: true },
      orderBy: { nombre: 'asc' },
    }),
    prisma.usuarios_obras.findMany({
      where: { obra_id: obraId },
      select: { usuario_id: true },
    }),
  ]);

  const vinculadosIds = new Set(vinculaciones.map((v) => v.usuario_id));

  const usuarios = todos
    .map((usuario) => ({ ...usuario, vinculadoAObra: vinculadosIds.has(usuario.id) }))
    .sort((a, b) => Number(b.vinculadoAObra) - Number(a.vinculadoAObra) || a.nombre.localeCompare(b.nombre));

  return { usuarios, esFallback: vinculadosIds.size === 0 };
}

export async function listarSupervisoresParaAsignacion(obraId: string) {
  const { usuarios, esFallback } = await listarUsuariosParaAsignacionPorRol(obraId, RolUsuario.jefeobra);
  return { supervisores: usuarios, esFallback };
}

export async function listarTrabajadoresParaAsignacion(obraId: string) {
  const { usuarios, esFallback } = await listarUsuariosParaAsignacionPorRol(obraId, RolUsuario.terreno);
  return { trabajadores: usuarios, esFallback };
}

export async function listarAsignacionesInventario(params: { obraId?: string; jefeObraId?: string } = {}) {
  return prisma.asignacionInventarioBeck.findMany({
    where: {
      ...(params.obraId && { obraId: params.obraId }),
      ...(params.jefeObraId && { jefeObraId: params.jefeObraId }),
    },
    include: ASIGNACION_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
}

export async function devolverAsignacionInventario(asignacionId: string, devueltoPorId: string) {
  if (!asignacionId?.trim()) throw new Error('El id de la asignacion es obligatorio.');

  const asignacion = await prisma.asignacionInventarioBeck.findUnique({
    where: { id: asignacionId },
    include: { epp: true, implemento: true, herramienta: true, jefeObra: { select: { id: true, nombre: true } } },
  });
  if (!asignacion) throw new Error('Asignacion no encontrada.');
  if (asignacion.estado === 'devuelto') throw new Error('Esta asignacion ya fue devuelta.');

  // Si el lote esta actualmente con un trabajador, "devolver" significa que el trabajador
  // se lo devuelve al supervisor (un paso atras en la cadena): no toca el inventario
  // central, solo libera el lote para que el supervisor lo vuelva a tener disponible.
  const seReclamaDeTrabajador = asignacion.trabajadorId !== null;

  await prisma.$transaction(async (tx) => {
    if (seReclamaDeTrabajador) {
      if (asignacion.tipoItem === TipoInventarioBeck.herramienta && asignacion.herramientaId) {
        await tx.inventarioBeckHerramienta.update({
          where: { id: asignacion.herramientaId },
          data: { encargado: asignacion.jefeObra.nombre },
        });
      }
      await tx.asignacionInventarioBeck.update({
        where: { id: asignacionId },
        data: { trabajadorId: null, reasignadoAt: null },
      });
      return;
    }

    if (asignacion.tipoItem === TipoInventarioBeck.epp && asignacion.eppId) {
      await tx.inventarioBeckEpp.update({
        where: { id: asignacion.eppId },
        data: { saldo: { increment: asignacion.cantidad }, salida: { decrement: asignacion.cantidad } },
      });
    } else if (asignacion.tipoItem === TipoInventarioBeck.implemento && asignacion.implementoId) {
      await tx.inventarioBeckImplemento.update({
        where: { id: asignacion.implementoId },
        data: { saldo: { increment: asignacion.cantidad }, salida: { decrement: asignacion.cantidad } },
      });
    } else if (asignacion.tipoItem === TipoInventarioBeck.herramienta && asignacion.herramientaId) {
      await tx.inventarioBeckHerramienta.update({
        where: { id: asignacion.herramientaId },
        data: { encargado: null },
      });
    }

    await tx.asignacionInventarioBeck.update({
      where: { id: asignacionId },
      data: { estado: 'devuelto', devueltoAt: new Date(), devueltoPorId },
    });
  });

  const nombreItem = asignacion.epp?.item ?? asignacion.implemento?.item ?? asignacion.herramienta?.nombre ?? 'item';

  await registrarMovimientoCRM({
    usuarioId: devueltoPorId,
    modulo: 'INVENTARIO',
    tipo: 'ASIGNACION_INVENTARIO_DEVUELTA',
    entidadId: asignacion.obraId,
    descripcion: seReclamaDeTrabajador
      ? `Se reclamo de vuelta "${nombreItem}" (cantidad ${asignacion.cantidad}) desde un trabajador`
      : `Se devolvio a bodega "${nombreItem}" (cantidad ${asignacion.cantidad})`,
    datos: { asignacionId } as Prisma.InputJsonValue,
  });

  return prisma.asignacionInventarioBeck.findUnique({
    where: { id: asignacionId },
    include: ASIGNACION_INCLUDE,
  });
}
