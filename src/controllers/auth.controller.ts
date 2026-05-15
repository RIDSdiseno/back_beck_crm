import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import {
  buildFrontendErrorRedirect,
  buildFrontendSuccessRedirect,
  buildMicrosoftAuthorizationUrl,
  exchangeCodeForMicrosoftUser,
  validateMicrosoftState,
} from '../services/microsoftAuth.service';
import { AuthResponse, LoginDTO, RolUsuario } from '../types';

const ALLOWED_EMAIL_DOMAINS = ['@becksoluciones.cl', '@firemat.cl'] as const;

const isDominioValido = (email: string): boolean =>
  ALLOWED_EMAIL_DOMAINS.some(domain => email.endsWith(domain));

const getEmpresaDefault = (email: string): 'beck' | 'firemat' =>
  email.endsWith('@firemat.cl') ? 'firemat' : 'beck';

type AuthUser = {
  id: string;
  nombre: string;
  email: string;
  rol: AuthResponse['user']['rol'];
};

const getQueryParam = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const firstString = value.find((item): item is string => typeof item === 'string' && item.trim().length > 0);
    return firstString?.trim();
  }

  return undefined;
};

const createAppToken = (usuario: AuthUser): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign(
    {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    },
    secret,
    { expiresIn: '7d' } as SignOptions,
  );
};

const buildAuthResponse = (usuario: AuthUser): AuthResponse => ({
  token: createAppToken(usuario),
  user: {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    empresaDefault: getEmpresaDefault(usuario.email.toLowerCase()),
  },
});

const redirectToFrontendError = (res: Response, message: string): void => {
  try {
    res.redirect(buildFrontendErrorRedirect(message));
  } catch (error) {
    console.error('Error redirecting Microsoft auth failure to frontend:', error);
    res.status(500).json({ error: message });
  }
};

const findOrCreateMicrosoftUser = async (azureId: string, email: string, nombre: string) => {
  let usuario = await prisma.usuario.findUnique({
    where: { azureId },
  });

  if (usuario) {
    return usuario;
  }

  const usuarioPorEmail = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioPorEmail) {
    usuario = await prisma.usuario.update({
      where: { id: usuarioPorEmail.id },
      data: {
        azureId,
      },
    });

    return usuario;
  }

  const defaultRol: RolUsuario = email.endsWith('@firemat.cl') ? 'visualizador_firemat' : 'visualizador';

  return prisma.usuario.create({
    data: {
      nombre,
      email,
      azureId,
      rol: defaultRol,
      activo: true,
      passwordHash: null,
    },
  });
};

/**
 * Login de usuario tradicional
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginDTO = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contrasena son requeridos' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isDominioValido(normalizedEmail)) {
      res.status(403).json({ error: 'Dominio de correo no permitido' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: normalizedEmail },
    });

    if (!usuario) {
      res.status(401).json({ error: 'Credenciales invalidas' });
      return;
    }

    if (!usuario.activo) {
      res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador' });
      return;
    }

    if (!usuario.passwordHash) {
      res.status(400).json({ error: 'El usuario no tiene una contrasena configurada' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales invalidas' });
      return;
    }

    console.log('Login exitoso:', {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.json(
      buildAuthResponse({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      }),
    );
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error al iniciar sesion' });
  }
};

/**
 * Flujo Microsoft SPA/token obsoleto
 * POST /api/auth/microsoft
 */
export const loginMicrosoftDeprecated = (_req: Request, res: Response): void => {
  res.status(410).json({
    error: 'El flujo Microsoft con token desde frontend esta obsoleto. Usa GET /api/auth/microsoft/login.',
  });
};

/**
 * Inicia el login Microsoft via authorization code flow
 * GET /api/auth/microsoft/login
 */
export const microsoftLogin = (_req: Request, res: Response): void => {
  try {
    res.redirect(buildMicrosoftAuthorizationUrl());
  } catch (error) {
    console.error('Error starting Microsoft login:', error);
    res.status(500).json({ error: 'Error al iniciar sesion con Microsoft' });
  }
};

/**
 * Callback Microsoft para authorization code flow
 * GET /api/auth/microsoft/callback
 */
export const microsoftCallback = async (req: Request, res: Response): Promise<void> => {
  const microsoftError = getQueryParam(req.query.error);
  const microsoftErrorDescription =
    getQueryParam(req.query.error_description) ?? 'La autenticacion con Microsoft fallo.';

  if (microsoftError) {
    redirectToFrontendError(res, microsoftErrorDescription);
    return;
  }

  const code = getQueryParam(req.query.code);
  const state = getQueryParam(req.query.state);

  if (!code || !state) {
    redirectToFrontendError(res, 'El callback de Microsoft no incluyo code y state.');
    return;
  }

  try {
    validateMicrosoftState(state);

    const microsoftUser = await exchangeCodeForMicrosoftUser(code);

    if (!isDominioValido(microsoftUser.email)) {
      redirectToFrontendError(res, 'Dominio de correo no permitido.');
      return;
    }

    const usuario = await findOrCreateMicrosoftUser(
      microsoftUser.azureId,
      microsoftUser.email,
      microsoftUser.nombre,
    );

    if (!usuario.activo) {
      redirectToFrontendError(res, 'Usuario inactivo. Contacta al administrador.');
      return;
    }

    const appToken = createAppToken({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

    const empresaDefault = getEmpresaDefault(usuario.email);

    console.log('Login Microsoft exitoso:', {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaDefault,
    });

    res.redirect(buildFrontendSuccessRedirect(appToken, empresaDefault));
  } catch (error) {
    console.error('Error handling Microsoft callback:', error);
    redirectToFrontendError(res, 'Error al iniciar sesion con Microsoft.');
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

    res.json({
      ...usuario,
      empresaDefault: getEmpresaDefault(usuario.email.toLowerCase()),
    });
  } catch (error) {
    console.error('Error in me:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

/**
 * Cambiar empresa activa
 * POST /api/auth/cambiar-empresa
 * Solo administradores pueden cambiar de empresa.
 */
export const cambiarEmpresa = (req: Request, res: Response): void => {
  if (req.userRole !== 'administrador') {
    res.status(403).json({
      success: false,
      error: 'Solo administradores pueden cambiar de empresa',
    });
    return;
  }

  const { empresa } = req.body as { empresa?: unknown };

  if (empresa !== 'beck' && empresa !== 'firemat') {
    res.status(400).json({
      success: false,
      error: "El campo 'empresa' debe ser 'beck' o 'firemat'",
    });
    return;
  }

  res.json({ success: true, empresa });
};

/**
 * Cambiar contrasena
 * PUT /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body as {
      newPassword?: string;
      oldPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Contrasena actual y nueva contrasena son requeridas' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'La nueva contrasena debe tener al menos 8 caracteres' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    if (!usuario.passwordHash) {
      res.status(400).json({ error: 'El usuario no tiene una contrasena configurada' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, usuario.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Contrasena actual incorrecta' });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error al cambiar contrasena' });
  }
};
