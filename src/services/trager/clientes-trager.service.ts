import { tragerPrisma } from '../../config/tragerPrisma';

function optStr(value: unknown): string | null {
  const s = String(value ?? '').trim();
  return s || null;
}

function calcularDigitoVerificador(digits: string): string {
  let suma = 0;
  let multiplicador = 2;

  for (let i = digits.length - 1; i >= 0; i--) {
    suma += parseInt(digits[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

function procesarRut(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (!/^[\dKk.\-]+$/.test(raw)) {
    throw new Error('RUT inválido. Solo se permiten números, puntos, guión y K.');
  }

  const limpio = raw.replace(/[.\-]/g, '').toUpperCase();
  if (limpio.length < 8 || limpio.length > 9) {
    throw new Error('RUT inválido. Debe tener entre 8 y 9 caracteres (sin puntos ni guión).');
  }

  const dv = limpio.slice(-1);
  const digits = limpio.slice(0, -1);

  if (!/^\d+$/.test(digits) || !/^[\dK]$/.test(dv)) {
    throw new Error('RUT inválido. Formato incorrecto.');
  }

  if (calcularDigitoVerificador(digits) !== dv) {
    throw new Error('RUT inválido. El dígito verificador no coincide.');
  }

  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

function procesarTelefono(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const limpio = raw.replace(/\s/g, '');
  if (!/^(\+?56)?9\d{8}$/.test(limpio)) {
    throw new Error(
      'Teléfono de contacto inválido. Formato esperado: 912345678, 56912345678 o +56912345678.'
    );
  }

  return limpio.replace(/\D/g, '');
}

function normalizarCorreo(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(raw)) {
    throw new Error('Correo de contacto inválido.');
  }

  return raw.toLowerCase();
}

type ClienteInput = {
  nombre?: unknown;
  rut?: unknown;
  contactoNombre?: unknown;
  contactoTelefono?: unknown;
  contactoCorreo?: unknown;
  activo?: unknown;
};

function buildClienteData(raw: ClienteInput, isUpdate = false) {
  if (!isUpdate) {
    const nombre = String(raw.nombre ?? '').trim();
    if (!nombre) throw new Error('El nombre es obligatorio.');
    if (!String(raw.contactoNombre ?? '').trim()) throw new Error('El nombre de contacto es obligatorio.');
    if (!String(raw.contactoCorreo ?? '').trim()) throw new Error('El correo de contacto es obligatorio.');
  }

  if (isUpdate) {
    if (raw.nombre !== undefined && !String(raw.nombre ?? '').trim()) {
      throw new Error('El nombre no puede estar vacío.');
    }
    if (raw.contactoNombre !== undefined && !String(raw.contactoNombre ?? '').trim()) {
      throw new Error('El nombre de contacto no puede estar vacío.');
    }
    if (raw.contactoCorreo !== undefined && !String(raw.contactoCorreo ?? '').trim()) {
      throw new Error('El correo de contacto no puede estar vacío.');
    }
  }

  return {
    ...(raw.nombre !== undefined && { nombre: String(raw.nombre ?? '').trim() }),
    ...(raw.rut !== undefined && { rut: procesarRut(raw.rut) }),
    ...(raw.contactoNombre !== undefined && { contactoNombre: optStr(raw.contactoNombre) }),
    ...(raw.contactoTelefono !== undefined && { contactoTelefono: procesarTelefono(raw.contactoTelefono) }),
    ...(raw.contactoCorreo !== undefined && { contactoCorreo: normalizarCorreo(raw.contactoCorreo) }),
    ...(raw.activo !== undefined && { activo: Boolean(raw.activo) }),
  };
}

export async function listarClientesTrager(params?: { q?: string; activo?: boolean }) {
  const q = String(params?.q ?? '').trim();

  return tragerPrisma.cliente.findMany({
    where: {
      ...(params?.activo !== undefined && { activo: params.activo }),
      ...(q && {
        OR: [
          { rut: { contains: q, mode: 'insensitive' } },
          { nombre: { contains: q, mode: 'insensitive' } },
          { contactoNombre: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function obtenerClienteTrager(id: number) {
  const cliente = await tragerPrisma.cliente.findUnique({ where: { id } });
  if (!cliente) throw new Error('Cliente no encontrado.');
  return cliente;
}

export async function crearClienteTrager(raw: ClienteInput) {
  const data = buildClienteData(raw, false);
  if (!data.nombre) throw new Error('El nombre es obligatorio.');

  return tragerPrisma.cliente.create({
    data: {
      ...data,
      nombre: data.nombre,
    },
  });
}

export async function actualizarClienteTrager(id: number, raw: ClienteInput) {
  const existente = await tragerPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');

  const data = buildClienteData(raw, true);

  return tragerPrisma.cliente.update({
    where: { id },
    data,
  });
}

export async function cambiarEstadoClienteTrager(id: number, activo: boolean) {
  const existente = await tragerPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');

  return tragerPrisma.cliente.update({
    where: { id },
    data: { activo },
  });
}

export async function eliminarClienteTrager(id: number) {
  const existente = await tragerPrisma.cliente.findUnique({ where: { id } });
  if (!existente) throw new Error('Cliente no encontrado.');

  await tragerPrisma.cliente.delete({ where: { id } });
}
