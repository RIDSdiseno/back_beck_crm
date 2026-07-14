import { EstadoPreparacionItemizado } from '@prisma/client';
import { prisma } from '../config/prisma';

export class ItemizadoObraError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ItemizadoObraError';
  }
}

/**
 * Bloquea escrituras de configuración de itemizado (visible, nombrePersonalizado, orden,
 * rendimientos) por parte de Beck. Solo se puede escribir mientras la obra está en
 * PREPARACION: una vez enviada a revisión del cliente (EN_REVISION_CLIENTE) o
 * confirmada (FINALIZADO), Beck ya no puede modificar nada. Centraliza la validación
 * para no repetirla en cada controller que escribe ConfiguracionItemizadoOpcionObra.
 */
export async function assertItemizadoObraEditable(obraId: string): Promise<void> {
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { estadoPreparacionItemizado: true },
  });

  if (!obra) {
    throw new ItemizadoObraError('Obra no encontrada', 404);
  }

  if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.FINALIZADO) {
    throw new ItemizadoObraError(
      'La preparación del itemizado de esta obra ya fue finalizada.',
      409,
    );
  }

  if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.EN_REVISION_CLIENTE) {
    throw new ItemizadoObraError(
      'La propuesta de itemizado está en revisión del cliente y no puede modificarse.',
      409,
    );
  }
}

/**
 * Excepción administrativa: permite a Beck seguir corrigiendo `visible` (Opciones de
 * itemizado) y nombre/orden/rendimientos (Configurar itemizados) aunque la obra ya
 * esté FINALIZADO — para poder agregar un itemizado que faltó, o ajustar el detalle
 * del contrato ya confirmado, sin reabrir todo el flujo de propuesta. Sigue bloqueando
 * EN_REVISION_CLIENTE: mientras el cliente está revisando/seleccionando, Beck no debe
 * tocar nada (la propuesta y la selección son responsabilidad exclusiva del cliente
 * en esa etapa). No usar para propuestoAlCliente/seleccionadoPorCliente — esos campos
 * siguen bloqueados en FINALIZADO vía assertItemizadoObraEditable.
 */
export async function assertItemizadoObraEditableAdmin(obraId: string): Promise<void> {
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { estadoPreparacionItemizado: true },
  });

  if (!obra) {
    throw new ItemizadoObraError('Obra no encontrada', 404);
  }

  if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.EN_REVISION_CLIENTE) {
    throw new ItemizadoObraError(
      'La propuesta de itemizado está en revisión del cliente y no puede modificarse.',
      409,
    );
  }
}

/**
 * Bloquea la edición del cliente sobre la propuesta de itemizado. El cliente solo puede
 * editar mientras la obra está en EN_REVISION_CLIENTE: antes de eso Beck aún no envió la
 * propuesta, y después de FINALIZADO el itemizado quedó confirmado y es inmutable.
 */
export async function assertItemizadoObraEditablePorCliente(obraId: string): Promise<void> {
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { estadoPreparacionItemizado: true },
  });

  if (!obra) {
    throw new ItemizadoObraError('Obra no encontrada', 404);
  }

  if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.PREPARACION) {
    throw new ItemizadoObraError(
      'La propuesta de itemizado aún no fue enviada para revisión.',
      409,
    );
  }

  if (obra.estadoPreparacionItemizado === EstadoPreparacionItemizado.FINALIZADO) {
    throw new ItemizadoObraError(
      'El itemizado ya fue confirmado y no puede modificarse.',
      409,
    );
  }
}

/**
 * Determina si una obra tiene al menos un itemizado incluido en la propuesta
 * (propuestoAlCliente=true). Gate usado por enviarItemizadoARevisionCliente antes
 * de permitir PREPARACION → EN_REVISION_CLIENTE. No usa `visible`: un itemizado
 * puede estar propuesto sin estar aún activo para la obra (eso solo ocurre tras
 * la confirmación del cliente).
 */
export async function existeItemizadoPropuestoParaObra(obraId: string): Promise<boolean> {
  const count = await prisma.configuracionItemizadoOpcionObra.count({
    where: { obraId, propuestoAlCliente: true },
  });
  return count > 0;
}

export type ItemizadoPropuestoCliente = {
  itemizadoOpcionId: string;
  codigoBeck: string | null;
  nombreBeck: string | null;
  nombrePersonalizado: string | null;
  propuestoAlCliente: true;
  seleccionadoPorCliente: boolean;
};

/**
 * Compatibilidad con obras preparadas ANTES de introducir propuestoAlCliente: en
 * ese entonces la pantalla "Preparar itemizado" escribía directamente `visible`
 * (ver historial de PrepararItemizadoObraDrawer). Esas obras quedaron con
 * visible=true y propuestoAlCliente=false, por lo que sin este fallback el
 * cliente vería "Sin itemizados" para una propuesta que sí le fue enviada.
 *
 * Criterio exacto para considerar la propuesta "antigua" y migrarla (los tres
 * deben cumplirse; si falta alguno, no se toca nada):
 *   - la obra está en EN_REVISION_CLIENTE (nunca en PREPARACION ni FINALIZADO);
 *   - cero configuraciones de la obra con propuestoAlCliente=true (si ya existe
 *     al menos una propuesta nueva, esta función no debe agregar nada más — evita
 *     mezclar visible=true antiguos sueltos con una propuesta ya migrada/nueva);
 *   - una o más configuraciones de la obra con visible=true (si no hay ninguna,
 *     no hay nada que migrar: la obra sigue sin itemizados, antigua o no).
 *
 * Migración persistente (no solo fallback en memoria): al detectar el caso
 * anterior, actualiza esas filas visible=true a propuestoAlCliente=true y
 * seleccionadoPorCliente=true (preselecciona todo, igual que el flujo nuevo al
 * incluir un itemizado) — nunca toca `visible`. Tras la primera consulta la obra
 * ya quedó en la lógica nueva y las siguientes llamadas no reentran a este bloque.
 */
async function migrarPropuestaAntiguaSiCorresponde(obraId: string): Promise<void> {
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: { estadoPreparacionItemizado: true },
  });
  if (obra?.estadoPreparacionItemizado !== EstadoPreparacionItemizado.EN_REVISION_CLIENTE) {
    return;
  }

  const tienePropuestaNueva = await prisma.configuracionItemizadoOpcionObra.count({
    where: { obraId, propuestoAlCliente: true },
  });
  if (tienePropuestaNueva > 0) {
    return;
  }

  const legacyVisibles = await prisma.configuracionItemizadoOpcionObra.findMany({
    where: { obraId, visible: true },
    select: { id: true },
  });
  if (legacyVisibles.length === 0) {
    return;
  }

  await prisma.$transaction([
    prisma.configuracionItemizadoOpcionObra.updateMany({
      where: { id: { in: legacyVisibles.map((c) => c.id) } },
      data: { propuestoAlCliente: true, seleccionadoPorCliente: true },
    }),
  ]);
}

/**
 * Lista, para la vista de cliente, solo los itemizados que Beck incluyó en la
 * propuesta (propuestoAlCliente=true) de una obra, con el set mínimo de campos que
 * el cliente puede ver. A diferencia de la resolución de `visible` (que también
 * mira el catálogo global), la propuesta SOLO existe a nivel de configuración por
 * obra — no hay override de catálogo global para propuestoAlCliente.
 *
 * Antes de leer, aplica la migración de compatibilidad de obras antiguas (ver
 * migrarPropuestaAntiguaSiCorresponde) para que el resultado sea siempre
 * consistente con propuestoAlCliente, sin ramas de lectura distintas para datos
 * viejos vs. nuevos.
 */
export async function listarItemizadosPropuestosParaObra(
  obraId: string,
): Promise<ItemizadoPropuestoCliente[]> {
  await migrarPropuestaAntiguaSiCorresponde(obraId);

  const configs = await prisma.configuracionItemizadoOpcionObra.findMany({
    where: { obraId, propuestoAlCliente: true },
    select: {
      itemizadoOpcionId: true,
      nombrePersonalizado: true,
      seleccionadoPorCliente: true,
      itemizadoOpcion: { select: { codigoBeck: true, elementoPasante: true } },
    },
  });

  return configs
    .map((c) => ({
      itemizadoOpcionId: c.itemizadoOpcionId,
      codigoBeck: c.itemizadoOpcion.codigoBeck,
      nombreBeck: c.itemizadoOpcion.elementoPasante,
      nombrePersonalizado: c.nombrePersonalizado,
      propuestoAlCliente: true as const,
      seleccionadoPorCliente: c.seleccionadoPorCliente,
    }))
    .sort((a, b) => (a.codigoBeck ?? "").localeCompare(b.codigoBeck ?? "", "es"));
}
