import { tragerPrisma } from '../../config/tragerPrisma';
import { Prisma } from '../../generated/trager-client';
import type { RawFilaCliente } from '../../utils/importClientes';
import { buildClienteData, buildContactoData, type ClienteInput, type ContactoInput } from './clientes-trager.validation';
import { conContactoPrincipal } from './clientes-trager.compatibilidad';
import { importarFilasClientesTrager } from './importar-clientes-trager';

const clienteInclude = { contactos: { orderBy: [{ principal: 'desc' as const }, { createdAt: 'asc' as const }, { id: 'asc' as const }] } };
type ClienteInputCompatible = ClienteInput & { contactoNombre?: unknown; contactoTelefono?: unknown; contactoCorreo?: unknown };

async function bloquearCliente(tx: Prisma.TransactionClient, clienteId: number) {
  const filas = await tx.$queryRaw<Array<{ id: number }>>`SELECT id FROM "Cliente" WHERE id = ${clienteId} FOR UPDATE`;
  if (!filas.length) throw new Error('Cliente no encontrado.');
}
async function sincronizarContactoAnterior(tx: Prisma.TransactionClient, clienteId: number) {
  const contacto = await tx.contactoClienteTrager.findFirst({
    where: { clienteId, activo: true }, orderBy: [{ principal: 'desc' }, { createdAt: 'asc' }, { id: 'asc' }],
  });
  await tx.cliente.update({ where: { id: clienteId }, data: {
    contactoNombre: contacto?.nombre ?? null,
    contactoTelefono: contacto?.telefono ?? null,
    contactoCorreo: contacto?.correo ?? null,
  } });
}
async function guardarContactoAnterior(tx: Prisma.TransactionClient, clienteId: number, raw: ClienteInputCompatible) {
  if (![raw.contactoNombre, raw.contactoTelefono, raw.contactoCorreo].some(v => v !== undefined)) return;
  const existente = await tx.contactoClienteTrager.findFirst({
    where: { clienteId, activo: true }, orderBy: [{ principal: 'desc' }, { id: 'asc' }],
  });
  const data = buildContactoData({
    nombre: raw.contactoNombre ?? existente?.nombre ?? 'Contacto principal',
    telefono: raw.contactoTelefono ?? existente?.telefono,
    correo: raw.contactoCorreo ?? existente?.correo,
    principal: true, activo: true,
  });
  await tx.contactoClienteTrager.updateMany({ where: { clienteId }, data: { principal: false } });
  if (existente) await tx.contactoClienteTrager.update({ where: { id: existente.id }, data });
  else await tx.contactoClienteTrager.create({ data: { ...data, clienteId, nombre: data.nombre! } });
  await sincronizarContactoAnterior(tx, clienteId);
}

export async function listarClientesTrager(params?: { q?: string; activo?: boolean }) {
  const q = String(params?.q ?? '').trim();
  const clientes = await tragerPrisma.cliente.findMany({
    where: {
      ...(params?.activo !== undefined && { activo: params.activo }),
      ...(q && { OR: [
        { rut: { contains: q, mode: 'insensitive' as const } },
        { nombre: { contains: q, mode: 'insensitive' as const } },
        { razonSocial: { contains: q, mode: 'insensitive' as const } },
        { nombreEmpresa: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { contactos: { some: { nombre: { contains: q, mode: 'insensitive' as const } } } },
      ] }),
    }, include: clienteInclude, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
  return clientes.map(conContactoPrincipal);
}
export async function obtenerClienteTrager(id: number) {
  const cliente = await tragerPrisma.cliente.findUnique({ where: { id }, include: clienteInclude });
  if (!cliente) throw new Error('Cliente no encontrado.');
  return conContactoPrincipal(cliente);
}
export async function crearClienteTrager(raw: ClienteInputCompatible) {
  const data = buildClienteData(raw);
  return tragerPrisma.$transaction(async tx => {
    const cliente = await tx.cliente.create({ data: { ...data, nombre: data.nombre! } });
    await guardarContactoAnterior(tx, cliente.id, raw);
    return conContactoPrincipal(await tx.cliente.findUniqueOrThrow({ where: { id: cliente.id }, include: clienteInclude }));
  });
}
export async function actualizarClienteTrager(id: number, raw: ClienteInputCompatible) {
  const data = buildClienteData(raw, true);
  return tragerPrisma.$transaction(async tx => {
    await bloquearCliente(tx, id);
    await tx.cliente.update({ where: { id }, data });
    await guardarContactoAnterior(tx, id, raw);
    return conContactoPrincipal(await tx.cliente.findUniqueOrThrow({ where: { id }, include: clienteInclude }));
  });
}
export async function cambiarEstadoClienteTrager(id: number, activo: boolean) {
  return actualizarClienteTrager(id, { activo });
}
export async function eliminarClienteTrager(id: number) {
  const existente = await tragerPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');
  await tragerPrisma.cliente.delete({ where: { id } });
}
export async function importarClientesTrager(filas: RawFilaCliente[]) {
  return importarFilasClientesTrager(filas, {
    existeRut: async rut => Boolean(await tragerPrisma.cliente.findUnique({ where: { rut }, select: { id: true } })),
    crear: async data => tragerPrisma.cliente.create({ data, select: { id: true, rut: true, nombre: true, razonSocial: true } }),
  });
}
export async function agregarContactoClienteTrager(clienteId: number, raw: ContactoInput) {
  const data = buildContactoData(raw);
  if (data.principal && data.activo === false) throw new Error('El contacto principal debe estar activo.');
  return tragerPrisma.$transaction(async tx => {
    await bloquearCliente(tx, clienteId);
    if (data.principal) await tx.contactoClienteTrager.updateMany({ where: { clienteId }, data: { principal: false } });
    const contacto = await tx.contactoClienteTrager.create({ data: { ...data, nombre: data.nombre!, clienteId } });
    await sincronizarContactoAnterior(tx, clienteId);
    return contacto;
  });
}
export async function actualizarContactoClienteTrager(contactoId: number, raw: ContactoInput) {
  const data = buildContactoData(raw, true);
  return tragerPrisma.$transaction(async tx => {
    const inicial = await tx.contactoClienteTrager.findUnique({ where: { id: contactoId } });
    if (!inicial) throw new Error('Contacto no encontrado.');
    await bloquearCliente(tx, inicial.clienteId);
    const existente = await tx.contactoClienteTrager.findUniqueOrThrow({ where: { id: contactoId } });
    if (data.principal && !(data.activo ?? existente.activo)) throw new Error('El contacto principal debe estar activo.');
    if (data.activo === false) data.principal = false;
    if (data.principal) await tx.contactoClienteTrager.updateMany({ where: { clienteId: existente.clienteId }, data: { principal: false } });
    const contacto = await tx.contactoClienteTrager.update({ where: { id: contactoId }, data });
    await sincronizarContactoAnterior(tx, existente.clienteId);
    return contacto;
  });
}
export async function cambiarEstadoContactoTrager(contactoId: number, activo: boolean) {
  return actualizarContactoClienteTrager(contactoId, { activo });
}
