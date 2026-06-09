import { prisma } from "../config/prisma";
import { ConfiguracionValidacion } from "@prisma/client";

export async function obtenerReglasValidacion(modulo: string, etapa: string): Promise<ConfiguracionValidacion[]> {
  return prisma.configuracionValidacion.findMany({
    where: { modulo, etapa, activo: true },
    orderBy: [{ modulo: "asc" }, { etapa: "asc" }, { regla: "asc" }],
  });
}

export async function obtenerMapaReglasValidacion(modulo: string, etapa: string): Promise<Map<string, ConfiguracionValidacion>> {
  const reglas = await obtenerReglasValidacion(modulo, etapa);
  return new Map(reglas.map((r) => [r.regla, r]));
}

export interface ResultadoValidacion {
  bloqueos: string[];
  advertencias: string[];
  puedeAvanzar: boolean;
}

export function clasificarResultadoValidacion(
  reglaKey: string,
  condicionFallida: boolean,
  mapa: Map<string, ConfiguracionValidacion>,
  resultado: { bloqueos: string[]; advertencias: string[] }
): void {
  if (!condicionFallida) return;
  const regla = mapa.get(reglaKey);
  if (!regla || !regla.activo) return;
  if (regla.nivel === "IGNORAR") return;
  if (regla.nivel === "ADVERTENCIA") {
    resultado.advertencias.push(regla.etiqueta);
  } else {
    resultado.bloqueos.push(regla.etiqueta);
  }
}

export function construirResultadoValidacion(
  bloqueos: string[],
  advertencias: string[]
): ResultadoValidacion {
  return { bloqueos, advertencias, puedeAvanzar: bloqueos.length === 0 };
}
