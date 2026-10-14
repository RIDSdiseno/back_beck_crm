export interface RegistroResumen {
  id: string; tipoRegistro: string; piso: string; nombreSellador: string;
  usuarioId: string; cantidadSellos: number; metrosLineales: number | null;
  numeroSello: string; fecha: Date;
}
export interface TotalesInforme { registros: number; sellos: number; tabiqueria: number; juntasMl: number; otros: number }
export interface GrupoInforme extends TotalesInforme { nombre: string }
export interface ResumenInforme { total: TotalesInforme; pisos: GrupoInforme[]; responsables: GrupoInforme[] }
const vacio = (): TotalesInforme => ({ registros: 0, sellos: 0, tabiqueria: 0, juntasMl: 0, otros: 0 });
function sumar(total: TotalesInforme, r: RegistroResumen) {
  total.registros++;
  if (r.tipoRegistro === 'junta_lineal_espuma') total.juntasMl += r.metrosLineales ?? 0;
  else if (r.tipoRegistro === 'tabiqueria') total.tabiqueria += r.cantidadSellos;
  else if (r.tipoRegistro === 'sello_cortafuego') total.sellos += r.cantidadSellos;
  else total.otros++;
}
export function resumenInforme(registros: RegistroResumen[]): ResumenInforme {
  const total = vacio();
  const pisos = new Map<string, GrupoInforme>();
  const responsables = new Map<string, GrupoInforme>();
  for (const r of registros) {
    sumar(total, r);
    const piso = r.piso.trim() || 'Sin piso';
    if (!pisos.has(piso)) pisos.set(piso, { nombre: piso, ...vacio() });
    if (!responsables.has(r.usuarioId)) responsables.set(r.usuarioId, { nombre: r.nombreSellador || 'Sin responsable', ...vacio() });
    sumar(pisos.get(piso)!, r); sumar(responsables.get(r.usuarioId)!, r);
  }
  const ordenar = (map: Map<string, GrupoInforme>) => [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }));
  return { total, pisos: ordenar(pisos), responsables: ordenar(responsables) };
}
export function ordenarInforme<T extends RegistroResumen>(registros: T[], orden: string): T[] {
  return [...registros].sort((a, b) => {
    const diff = orden === 'fecha' ? a.fecha.getTime() - b.fecha.getTime() :
      (orden === 'sello' ? a.numeroSello : a.piso).localeCompare(orden === 'sello' ? b.numeroSello : b.piso, 'es', { numeric: true });
    return diff || a.numeroSello.localeCompare(b.numeroSello, 'es', { numeric: true }) || a.id.localeCompare(b.id);
  });
}
