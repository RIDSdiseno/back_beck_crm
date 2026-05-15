import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RolUsuario } from "../types";
import { prisma } from "../config/prisma";

// Extender el tipo Request para incluir userId y userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: RolUsuario;
      empresaContexto?: 'beck' | 'firemat';
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  rol: RolUsuario;
}

/**
 * Middleware para verificar token JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Token no proporcionado",
      });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET no está configurado");
      res.status(500).json({
        success: false,
        error: "Error de configuración del servidor",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        rol: true,
        activo: true,
      },
    });

    if (!usuario) {
      res.status(401).json({
        success: false,
        error: "Usuario no encontrado",
      });
      return;
    }

    if (!usuario.activo) {
      res.status(403).json({
        success: false,
        error: "Usuario desactivado",
      });
      return;
    }

    req.userId = usuario.id;
    req.userRole = usuario.rol as RolUsuario;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token expirado",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Token inválido",
      });
      return;
    }

    console.error("Error al verificar token:", error);
    res.status(500).json({
      success: false,
      error: "Error al verificar token",
    });
  }
};

/**
 * Middleware para verificar roles
 */
export const authorize = (...roles: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({
        success: false,
        error: "No autenticado",
      });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        error: "No tienes permisos para acceder a este recurso",
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para bloquear roles sin acceso al CRM web/API privada.
 */
export const denyRoles = (...roles: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.userRole && roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        error: "Acceso denegado",
      });
      return;
    }

    next();
  };
};
