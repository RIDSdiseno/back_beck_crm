import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { verifyMicrosoftToken } from '../services/microsoftAuth.service';
import { LoginDTO, AuthResponse } from '../types';

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginDTO = req.body;

    // Validaciones básicas
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    // Buscar usuario por email usando Prisma
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!usuario) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador' });
      return;
    }

    // Verificar contraseña
    if (!usuario.passwordHash) {
      res.status(400).json({ error: 'El usuario no tiene una contrasena configurada' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no está configurado');
      res.status(500).json({ error: 'Error de configuración del servidor' });
      return;
    }

    const rol: AuthResponse['user']['rol'] = usuario.rol;

    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        rol,
      },
      secret,
      { expiresIn: '7d' } as SignOptions
    );

    // Respuesta con token y datos del usuario (sin password)
    const response: AuthResponse = {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

/**
 * Login con Microsoft
 * POST /api/auth/microsoft
 */
export const loginMicrosoft = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      res.status(400).json({ error: 'Token de Microsoft requerido' });
      return;
    }

    const microsoftUser = await verifyMicrosoftToken(token);

    const azureId = microsoftUser.oid;
    const email = microsoftUser.preferred_username ?? microsoftUser.email;
    const nombre = microsoftUser.name ?? email;

    if (!azureId || !email || !nombre) {
      res.status(400).json({ error: 'Token de Microsoft invÃ¡lido' });
      return;
    }

    let usuario = await prisma.usuario.findUnique({
      where: { azureId },
    });

    if (!usuario) {
      const normalizedEmail = email.toLowerCase().trim();
      const usuarioPorEmail = await prisma.usuario.findUnique({
        where: { email: normalizedEmail },
      });

      if (usuarioPorEmail) {
        usuario = await prisma.usuario.update({
          where: { id: usuarioPorEmail.id },
          data: {
            azureId,
          },
        });
      } else {
        usuario = await prisma.usuario.create({
          data: {
            nombre,
            email: normalizedEmail,
            azureId,
            rol: 'vendedor',
            activo: true,
            passwordHash: null,
          },
        });
      }
    }

    if (!usuario.activo) {
      res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no estÃ¡ configurado');
      res.status(500).json({ error: 'Error de configuraciÃ³n del servidor' });
      return;
    }

    const rol: AuthResponse['user']['rol'] = usuario.rol;

    const jwtToken = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        rol,
      },
      secret,
      { expiresIn: '7d' } as SignOptions
    );

    const response: AuthResponse = {
      token: jwtToken,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error en loginMicrosoft:', error);
    res.status(500).json({ error: 'Error al iniciar sesiÃ³n con Microsoft' });
  }
};

/**
 * Obtener datos del usuario autenticado
 * GET /api/auth/me
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

/**
 * Cambiar contraseña
 * PUT /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
      return;
    }

    // Obtener usuario con Prisma
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña actual
    if (!usuario.passwordHash) {
      res.status(400).json({ error: 'El usuario no tiene una contrasena configurada' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, usuario.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Contraseña actual incorrecta' });
      return;
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña con Prisma
    await prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};
