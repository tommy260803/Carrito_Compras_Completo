import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { loginSchema, registerSchema, refreshTokenSchema } from '../schemas/auth.schema';

export const authController = {
  async register(req: Request, res: Response) {
    const validated = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.register(validated);
    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  },

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim(); // evita fallos por espacios al copiar/pegar
    const result = await authService.login(normalizedEmail, normalizedPassword);
    res.json({ success: true, data: result });
  },

  async refreshToken(req: Request, res: Response) {
    // soporta `refreshToken` (schema) y `refresh_token` (frontend actual)
    const body = req.body?.refresh_token ? { refreshToken: req.body.refresh_token } : req.body;
    const { refreshToken } = refreshTokenSchema.parse(body);
    const tokens = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: tokens });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.body?.refreshToken ?? req.body?.refresh_token;
    await authService.logout(refreshToken);
    res.json({ success: true, message: 'Logout exitoso' });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getUserById(req.user!.id);
    res.json({ success: true, data: user });
  },
};
