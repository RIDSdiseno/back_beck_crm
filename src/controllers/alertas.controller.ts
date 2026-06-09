import { Request, Response } from "express";
import { generarAlertasBeck, FiltroVendedor } from "../services/alertasBeck.service";
import { generarAlertasFiremat, FiltroVendedorFiremat } from "../services/alertasFiremat.service";
import { prisma } from "../config/prisma";
import { firematPrisma } from "../config/firematPrisma";

async function resolverFiltroVendedor(
  userId: string,
  rol: string,
): Promise<FiltroVendedor | undefined> {
  if (rol !== "vendedor") return undefined;

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { nombre: true, email: true },
  });

  if (!usuario) return undefined;
  return { nombre: usuario.nombre, email: usuario.email };
}

export async function getAlertasBeckController(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const rol = req.userRole!;

    const filtroVendedor = await resolverFiltroVendedor(userId, rol);

    const [alertas, vistas] = await Promise.all([
      generarAlertasBeck(filtroVendedor),
      prisma.alertaVista.findMany({
        where: { usuarioId: userId },
        select: { alertaKey: true },
      }),
    ]);

    const vistasSet = new Set(vistas.map((v) => v.alertaKey));

    const nuevas = alertas.filter((a) => !vistasSet.has(a.alertaKey));
    const vistasAlertas = alertas.filter((a) => vistasSet.has(a.alertaKey));

    res.json({
      nuevas,
      vistas: vistasAlertas,
      total: alertas.length,
    });
  } catch (error) {
    console.error("Error al obtener alertas BECK:", error);
    res.status(500).json({ error: "Error al obtener alertas" });
  }
}

export async function marcarAlertasVistasController(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const rol = req.userRole!;
    const { alertaKeys } = req.body as { alertaKeys: unknown };

    if (!Array.isArray(alertaKeys) || alertaKeys.length === 0) {
      res.status(400).json({ error: "alertaKeys debe ser un array no vacío" });
      return;
    }

    const keys = alertaKeys.filter((k): k is string => typeof k === "string");

    if (keys.length === 0) {
      res.status(400).json({ error: "alertaKeys debe contener strings válidos" });
      return;
    }

    // Validar scope: el vendedor solo puede marcar alertas que le corresponden
    const filtroVendedor = await resolverFiltroVendedor(userId, rol);
    const alertasPermitidas = await generarAlertasBeck(filtroVendedor);
    const keysPermitidas = new Set(alertasPermitidas.map((a) => a.alertaKey));

    const keysFiltradas = keys.filter((k) => keysPermitidas.has(k));

    if (keysFiltradas.length === 0) {
      res.json({ success: true, marcadas: 0 });
      return;
    }

    const result = await prisma.alertaVista.createMany({
      data: keysFiltradas.map((key) => ({ usuarioId: userId, alertaKey: key })),
      skipDuplicates: true,
    });

    res.json({
      success: true,
      marcadas: result.count,
    });
  } catch (error) {
    console.error("Error al marcar alertas como vistas:", error);
    res.status(500).json({ error: "Error al marcar alertas" });
  }
}

async function resolverFiltroVendedorFiremat(
  userId: string,
  rol: string,
): Promise<FiltroVendedorFiremat | undefined> {
  if (rol !== "vendedor_firemat") return undefined;

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { nombre: true, email: true },
  });

  if (!usuario) return undefined;
  return { nombre: usuario.nombre, email: usuario.email };
}

export async function getAlertasFirematController(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const rol = req.userRole!;

    const filtroVendedor = await resolverFiltroVendedorFiremat(userId, rol);

    const [alertas, vistas] = await Promise.all([
      generarAlertasFiremat(filtroVendedor),
      firematPrisma.alertaVistaFiremat.findMany({
        where: { usuarioId: userId },
        select: { alertaKey: true },
      }),
    ]);

    const vistasSet = new Set(vistas.map((v) => v.alertaKey));

    const nuevas = alertas.filter((a) => !vistasSet.has(a.alertaKey));
    const vistasAlertas = alertas.filter((a) => vistasSet.has(a.alertaKey));

    res.json({
      nuevas,
      vistas: vistasAlertas,
      total: alertas.length,
    });
  } catch (error) {
    console.error("Error al obtener alertas FIREMAT:", error);
    res.status(500).json({ error: "Error al obtener alertas" });
  }
}

export async function marcarAlertasFirematVistasController(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const rol = req.userRole!;
    const { alertaKeys } = req.body as { alertaKeys: unknown };

    if (!Array.isArray(alertaKeys) || alertaKeys.length === 0) {
      res.status(400).json({ error: "alertaKeys debe ser un array no vacío" });
      return;
    }

    const keys = alertaKeys.filter((k): k is string => typeof k === "string");

    if (keys.length === 0) {
      res.status(400).json({ error: "alertaKeys debe contener strings válidos" });
      return;
    }

    const filtroVendedor = await resolverFiltroVendedorFiremat(userId, rol);
    const alertasPermitidas = await generarAlertasFiremat(filtroVendedor);
    const keysPermitidas = new Set(alertasPermitidas.map((a) => a.alertaKey));

    const keysFiltradas = keys.filter((k) => keysPermitidas.has(k));

    if (keysFiltradas.length === 0) {
      res.json({ success: true, marcadas: 0 });
      return;
    }

    const result = await firematPrisma.alertaVistaFiremat.createMany({
      data: keysFiltradas.map((key) => ({ usuarioId: userId, alertaKey: key })),
      skipDuplicates: true,
    });

    res.json({
      success: true,
      marcadas: result.count,
    });
  } catch (error) {
    console.error("Error al marcar alertas FIREMAT como vistas:", error);
    res.status(500).json({ error: "Error al marcar alertas" });
  }
}
