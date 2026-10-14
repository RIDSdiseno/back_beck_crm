interface ClienteCompatible {
  email: string | null;
  telefono: string | null;
  contactoNombre: string | null;
  contactoTelefono: string | null;
  contactoCorreo: string | null;
  contactos: Array<{ nombre: string; telefono: string | null; correo: string | null; activo: boolean; principal: boolean }>;
}

/** Conserva el contrato de Funnel y Cotizaciones sin tratar los datos de empresa como una persona. */
export function conContactoPrincipal<T extends ClienteCompatible>(cliente: T) {
  const contacto = cliente.contactos.find(c => c.activo && c.principal) ?? cliente.contactos.find(c => c.activo);
  // Durante un despliegue gradual puede seguir llegando un alta desde el formulario anterior.
  const sinContactosMigrados = cliente.contactos.length === 0;
  return { ...cliente,
    contactoNombre: contacto?.nombre ?? (sinContactosMigrados ? cliente.contactoNombre : null),
    contactoTelefono: contacto?.telefono ?? (sinContactosMigrados ? cliente.contactoTelefono : null) ?? cliente.telefono,
    contactoCorreo: contacto?.correo ?? (sinContactosMigrados ? cliente.contactoCorreo : null) ?? cliente.email,
  };
}
