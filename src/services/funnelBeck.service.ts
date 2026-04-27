import {
  EtapaFunnelBeck,
  EstadoCierreFunnel,
  MonedaFunnel,
  FuenteLeadFunnel,
  TipoMovimientoCRM,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { registrarMovimientoCRM } from "./movimientoCrm.service";


// De momento referencial. Después esto debería venir de una API o tabla propia.
const UF_REFERENCIAL = 38000;

type CreateFunnelBeckInput = {
  nombreProyecto: string;
  empresa: string;
  valorOriginal: number | string;
  monedaOriginal: MonedaFunnel;
  fechaProbableCierre: string;
  vendedor: string;
  region: string;
  comuna: string;
  fuenteLead?: FuenteLeadFunnel;
  etapa?: EtapaFunnelBeck;
  estadoCierre?: EstadoCierreFunnel;
  motivoPerdida?: string;
};

type UpdateFunnelBeckInput = Partial<CreateFunnelBeckInput>;

function normalizeString(value: unknown): string {
  return String(value ?? "").trim();
}

function toNumber(value: number | string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error("El valor ingresado no es numérico.");
  }
  return parsed;
}

function calcularValores(
  valorOriginal: number,
  monedaOriginal: MonedaFunnel
): { valorClp: number; valorUf: number } {
  if (monedaOriginal === "UF") {
    return {
      valorUf: valorOriginal,
      valorClp: Number((valorOriginal * UF_REFERENCIAL).toFixed(2)),
    };
  }

  return {
    valorClp: valorOriginal,
    valorUf: Number((valorOriginal / UF_REFERENCIAL).toFixed(4)),
  };
}

function validarEtapaYCierre(params: {
  etapa?: EtapaFunnelBeck;
  estadoCierre?: EstadoCierreFunnel;
  motivoPerdida?: string;
}) {
  const { etapa, estadoCierre, motivoPerdida } = params;

  if (etapa === "cerrada" && !estadoCierre) {
    throw new Error("Si la etapa es cerrada, debes indicar si fue ganada o perdida.");
  }

  if (estadoCierre === "perdida" && !normalizeString(motivoPerdida)) {
    throw new Error("Debes indicar el motivo de pérdida.");
  }
}

function validarCamposObligatorios(data: CreateFunnelBeckInput) {
  if (!normalizeString(data.nombreProyecto)) {
    throw new Error("El nombre del proyecto es obligatorio.");
  }
  if (!normalizeString(data.empresa)) {
    throw new Error("La empresa es obligatoria.");
  }
  if (!normalizeString(data.vendedor)) {
    throw new Error("El vendedor es obligatorio.");
  }
  if (!normalizeString(data.region)) {
    throw new Error("La región es obligatoria.");
  }
  if (!normalizeString(data.comuna)) {
    throw new Error("La comuna es obligatoria.");
  }
  if (!data.fechaProbableCierre) {
    throw new Error("La fecha probable de cierre es obligatoria.");
  }
  if (!data.monedaOriginal) {
    throw new Error("La moneda es obligatoria.");
  }

  const valor = toNumber(data.valorOriginal);
  if (valor <= 0) {
    throw new Error("El valor debe ser mayor a 0.");
  }

  validarEtapaYCierre({
    etapa: data.etapa,
    estadoCierre: data.estadoCierre,
    motivoPerdida: data.motivoPerdida,
  });
}

export async function createFunnelBeck(data: CreateFunnelBeckInput, userId: string) {
  validarCamposObligatorios(data);

  const valorOriginal = toNumber(data.valorOriginal);
  const monedaOriginal = data.monedaOriginal;
  const { valorClp, valorUf } = calcularValores(valorOriginal, monedaOriginal);

  const oportunidad = await prisma.operadorBeck.create({
    data: {
      nombreProyecto: normalizeString(data.nombreProyecto),
      empresa: normalizeString(data.empresa),
      valorOriginal,
      monedaOriginal,
      valorClp,
      valorUf,
      fechaProbableCierre: new Date(data.fechaProbableCierre),
      vendedor: normalizeString(data.vendedor),
      region: normalizeString(data.region),
      comuna: normalizeString(data.comuna),
      fuenteLead: data.fuenteLead ?? undefined,
      etapa: data.etapa ?? "prospecto_identificado",
      estadoCierre: data.estadoCierre ?? null,
      motivoPerdida: normalizeString(data.motivoPerdida) || null,
    },
  });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'FUNNEL',
    tipo: TipoMovimientoCRM.OPORTUNIDAD_CREADA,
    entidadId: oportunidad.id,
    descripcion: `Se creó oportunidad ${oportunidad.nombreProyecto} para la empresa ${oportunidad.empresa}`,
    datos: {
      nombreProyecto: oportunidad.nombreProyecto,
      empresa: oportunidad.empresa,
      etapa: oportunidad.etapa,
    },
  });

  return oportunidad;
}

export async function getAllFunnelBeck() {
  return prisma.operadorBeck.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFunnelBeckById(id: string) {
  const oportunidad = await prisma.operadorBeck.findUnique({
    where: { id },
  });

  if (!oportunidad) {
    throw new Error("Oportunidad no encontrada.");
  }

  return oportunidad;
}

export async function updateFunnelBeck(id: string, data: UpdateFunnelBeckInput, userId: string) {
  const existente = await prisma.operadorBeck.findUnique({
    where: { id },
  });

  if (!existente) {
    throw new Error("Oportunidad no encontrada.");
  }

  const nombreProyecto =
    data.nombreProyecto !== undefined
      ? normalizeString(data.nombreProyecto)
      : existente.nombreProyecto;

  const empresa =
    data.empresa !== undefined ? normalizeString(data.empresa) : existente.empresa;

  const vendedor =
    data.vendedor !== undefined ? normalizeString(data.vendedor) : existente.vendedor;

  const region =
    data.region !== undefined ? normalizeString(data.region) : existente.region;

  const comuna =
    data.comuna !== undefined ? normalizeString(data.comuna) : existente.comuna;

  const monedaOriginal = data.monedaOriginal ?? existente.monedaOriginal;
  const valorOriginal =
    data.valorOriginal !== undefined
      ? toNumber(data.valorOriginal)
      : Number(existente.valorOriginal);

  const { valorClp, valorUf } = calcularValores(valorOriginal, monedaOriginal);

  const etapa = data.etapa ?? existente.etapa;
  const estadoCierre =
    data.estadoCierre !== undefined ? data.estadoCierre : existente.estadoCierre;

  const motivoPerdida =
    data.motivoPerdida !== undefined
      ? normalizeString(data.motivoPerdida) || null
      : existente.motivoPerdida;

  if (!nombreProyecto) throw new Error("El nombre del proyecto es obligatorio.");
  if (!empresa) throw new Error("La empresa es obligatoria.");
  if (!vendedor) throw new Error("El vendedor es obligatorio.");
  if (!region) throw new Error("La región es obligatoria.");
  if (!comuna) throw new Error("La comuna es obligatoria.");
  if (valorOriginal <= 0) throw new Error("El valor debe ser mayor a 0.");

  validarEtapaYCierre({
    etapa,
    estadoCierre: estadoCierre ?? undefined,
    motivoPerdida: motivoPerdida ?? undefined,
  });

  const oportunidad = await prisma.operadorBeck.update({
    where: { id },
    data: {
      nombreProyecto,
      empresa,
      valorOriginal,
      monedaOriginal,
      valorClp,
      valorUf,
      fechaProbableCierre: data.fechaProbableCierre
        ? new Date(data.fechaProbableCierre)
        : existente.fechaProbableCierre,
      vendedor,
      region,
      comuna,
      fuenteLead: data.fuenteLead !== undefined ? data.fuenteLead : existente.fuenteLead,
      etapa,
      estadoCierre: estadoCierre ?? null,
      motivoPerdida,
    },
  });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'FUNNEL',
    tipo: 'OPORTUNIDAD_EDITADA',
    entidadId: oportunidad.id,
    descripcion: `Se editó oportunidad ${oportunidad.nombreProyecto}`,
  });

  if (data.etapa !== undefined && data.etapa !== existente.etapa) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: 'FUNNEL',
      tipo: 'ETAPA_MODIFICADA',
      entidadId: oportunidad.id,
      descripcion: `Se movió ${oportunidad.nombreProyecto} de ${existente.etapa} a ${etapa}`,
      datos: { de: existente.etapa, a: etapa },
    });
  }

  return oportunidad;
}

export async function updateEtapaFunnelBeck(
  id: string,
  payload: {
    etapa: EtapaFunnelBeck;
    estadoCierre?: EstadoCierreFunnel;
    motivoPerdida?: string;
  },
  userId: string,
) {
  const existente = await prisma.operadorBeck.findUnique({
    where: { id },
  });

  if (!existente) {
    throw new Error("Oportunidad no encontrada.");
  }

  validarEtapaYCierre(payload);

  const oportunidad = await prisma.operadorBeck.update({
    where: { id },
    data: {
      etapa: payload.etapa,
      estadoCierre: payload.estadoCierre ?? null,
      motivoPerdida: normalizeString(payload.motivoPerdida) || null,
    },
  });

  if (payload.etapa !== existente.etapa) {
    await registrarMovimientoCRM({
      usuarioId: userId,
      modulo: 'FUNNEL',
      tipo: 'ETAPA_MODIFICADA',
      entidadId: oportunidad.id,
      descripcion: `Se movió ${oportunidad.nombreProyecto} de ${existente.etapa} a ${payload.etapa}`,
      datos: { de: existente.etapa, a: payload.etapa },
    });
  }

  return oportunidad;
}

export async function deleteFunnelBeck(id: string, userId: string) {
  const existente = await prisma.operadorBeck.findUnique({
    where: { id },
  });

  if (!existente) {
    throw new Error("Oportunidad no encontrada.");
  }

  await prisma.operadorBeck.delete({
    where: { id },
  });

  await registrarMovimientoCRM({
    usuarioId: userId,
    modulo: 'FUNNEL',
    tipo: 'OPORTUNIDAD_ELIMINADA',
    entidadId: id,
    descripcion: `Se eliminó oportunidad ${existente.nombreProyecto}`,
  });

  return { message: "Oportunidad eliminada correctamente." };
}
