import { Router } from 'express';
import {
  cambiarEmpresa,
  changePassword,
  login,
  loginMicrosoftDeprecated,
  me,
  microsoftCallback,
  microsoftLogin,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/microsoft', loginMicrosoftDeprecated);
router.get('/microsoft/login', microsoftLogin);
router.get('/microsoft/callback', microsoftCallback);
router.get('/me', authenticate, me);
router.put('/change-password', authenticate, changePassword);
router.post('/cambiar-empresa', authenticate, cambiarEmpresa);

export default router;
