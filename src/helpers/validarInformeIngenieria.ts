export function seleccionInformeValida(
  ids: string[],
  registros: Array<{ id: string; obraId: string; estado: string; cargaCompleta: boolean }>,
): boolean {
  return ids.length > 0 && ids.length <= 50 && new Set(ids).size === ids.length &&
    registros.length === ids.length && registros.every(r => ids.includes(r.id) && r.estado === 'validado' && r.cargaCompleta) &&
    new Set(registros.map(r => r.id)).size === ids.length &&
    new Set(registros.map(r => r.obraId)).size === 1;
}
