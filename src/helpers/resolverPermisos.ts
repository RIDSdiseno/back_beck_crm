type Permiso = { modulo: string; puedeVer: boolean; puedeEditar: boolean };

/** Conserva accesos anteriores hasta que se configure explícitamente el nuevo permiso. */
export function resolverPermisos(defaults: Permiso[], rol: Permiso[], usuario: Permiso[] = []): Permiso[] {
  const roles = new Map(rol.map(p => [p.modulo, p]));
  const usuarios = new Map(usuario.map(p => [p.modulo, p]));
  const efectivos = defaults.map(p => usuarios.get(p.modulo) ?? roles.get(p.modulo) ?? p);
  return efectivos.map(p => {
    if (!p.modulo.endsWith('_acceder_plataforma') || usuarios.has(p.modulo) || roles.has(p.modulo)) return p;
    const empresa = p.modulo.split('_')[0];
    const anterior = efectivos.find(v => v.modulo === empresa + '_cambiar_empresa');
    const permitido = p.puedeVer || !!(anterior?.puedeVer || anterior?.puedeEditar);
    return { ...p, puedeVer: permitido, puedeEditar: permitido };
  });
}
