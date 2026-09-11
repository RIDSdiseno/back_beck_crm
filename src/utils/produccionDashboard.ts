type VersionRegistro = {
  id: string;
  registroOrigenId: string | null;
  createdAt: Date;
  cargaCompleta: boolean;
  estado: string;
};

// Resolver la cadena antes del filtro de fecha evita contar versiones reemplazadas.
export function idsProduccionVigente(registros: VersionRegistro[]): Set<string> {
  const grupos = new Map<string, string>();
  const raiz = (id: string): string => {
    let actual = id;
    while (grupos.has(actual) && grupos.get(actual) !== actual) {
      actual = grupos.get(actual)!;
    }
    let paso = id;
    while (grupos.has(paso) && grupos.get(paso) !== actual) {
      const siguiente = grupos.get(paso)!;
      grupos.set(paso, actual);
      paso = siguiente;
    }
    return actual;
  };

  for (const registro of registros) {
    if (registro.registroOrigenId) {
      grupos.set(raiz(registro.id), raiz(registro.registroOrigenId));
    }
  }

  const vigentes = new Map<string, VersionRegistro>();
  for (const registro of registros) {
    if (!registro.cargaCompleta) continue;
    const grupo = raiz(registro.id);
    const anterior = vigentes.get(grupo);
    if (!anterior || registro.createdAt.getTime() > anterior.createdAt.getTime()
      || (registro.createdAt.getTime() === anterior.createdAt.getTime() && registro.id > anterior.id)) {
      vigentes.set(grupo, registro);
    }
  }
  return new Set([...vigentes.values()]
    .filter((registro) => registro.estado !== 'rechazado')
    .map((registro) => registro.id));
}
