import { Router } from 'express';
import { login, loginMicrosoft, me, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/microsoft
 * @desc    Login con Microsoft
 * @access  Public
 */
router.post('/microsoft', loginMicrosoft);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener datos del usuario autenticado
 * @access  Private
 */
router.get('/me', authenticate, me);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Cambiar contraseña del usuario autenticado
 * @access  Private
 */
router.put('/change-password', authenticate, changePassword);

export default router;