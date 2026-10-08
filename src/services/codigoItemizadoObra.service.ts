import { prisma } from '../config/prisma';
import {
  buscarCodigosRepetidos,
  proyectarItemsObra,
  type CambiosItemizado,
} from '../utils/codigoItemizadoObra';

/** Códigos que quedarían repetidos entre los ítems visibles de la obra al aplicar los cambios. */
export async function codigosRepetidosEnObra(obraId: string, cambios: CambiosItemizado = {}): Promise<string[]> {
  const [catalogo, configuraciones] = await Promise.all([
    prisma.itemizadoOpcion.findMany({ select: { id: true, codigoBeck: true, visible: true } }),
    prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId },
      select: { itemizadoOpcionId: true, visible: true, codigoPersonalizado: true },
    }),
  ]);
  return buscarCodigosRepetidos(proyectarItemsObra(catalogo, configuraciones, cambios));
}

/** Códigos con que se ven hoy los ítems visibles de la obra. */
export async function codigosVisiblesEnObra(obraId: string): Promise<string[]> {
  const [catalogo, configuraciones] = await Promise.all([
    prisma.itemizadoOpcion.findMany({ select: { id: true, codigoBeck: true, visible: true } }),
    prisma.configuracionItemizadoOpcionObra.findMany({
      where: { obraId },
      select: { itemizadoOpcionId: true, visible: true, codigoPersonalizado: true },
    }),
  ]);
  return proyectarItemsObra(catalogo, configuraciones)
    .filter((i) => i.visible && i.codigoEfectivo)
    .map((i) => i.codigoEfectivo as string);
}

/**
 * Para cambios del catálogo global (que afectan a todas las obras): revisa las obras que
 * usan códigos propios, que son las únicas donde puede aparecer un código repetido, porque
 * los códigos del catálogo no se repiten entre sí.
 */
export async function obrasConCodigosRepetidos(
  cambiosCatalogo: NonNullable<CambiosItemizado['catalogo']>,
): Promise<{ obraId: string; codigos: string[] }[]> {
  const obras = await prisma.configuracionItemizadoOpcionObra.findMany({
    where: { codigoPersonalizado: { not: null } },
    distinct: ['obraId'],
    select: { obraId: true },
  });
  const conflictos: { obraId: string; codigos: string[] }[] = [];
  for (const { obraId } of obras) {
    const codigos = await codigosRepetidosEnObra(obraId, { catalogo: cambiosCatalogo });
    if (codigos.length > 0) conflictos.push({ obraId, codigos });
  }
  return conflictos;
}

export const mensajeCodigosRepetidos = (codigos: string[]) =>
  `Hay códigos repetidos entre los ítems visibles de la obra: ${codigos.join(', ')}. ` +
  'Cada ítem visible debe tener un código distinto; revisa el «Código en esta obra».';
