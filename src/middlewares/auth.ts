import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RolUsuario } from '../types';

// Extender el tipo Request para incluir userId y userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: RolUsuario;
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
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET no está configurado');
      res.status(500).json({ error: 'Error de configuración del servidor' });
      return;
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;

    req.userId = decoded.userId;
    req.userRole = decoded.rol;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }
    res.status(500).json({ error: 'Error al verificar token' });
  }
};

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 */
export const authorize = (...roles: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
      return;
    }

    next();
  };
};
