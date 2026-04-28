"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../schemas/auth.schema");
exports.authController = {
    async register(req, res) {
        const validated = auth_schema_1.registerSchema.parse(req.body);
        const { user, accessToken, refreshToken } = await auth_service_1.authService.register(validated);
        res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
    },
    async login(req, res) {
        const { email, password } = auth_schema_1.loginSchema.parse(req.body);
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim(); // evita fallos por espacios al copiar/pegar
        const result = await auth_service_1.authService.login(normalizedEmail, normalizedPassword);
        res.json({ success: true, data: result });
    },
    async refreshToken(req, res) {
        // soporta `refreshToken` (schema) y `refresh_token` (frontend actual)
        const body = req.body?.refresh_token ? { refreshToken: req.body.refresh_token } : req.body;
        const { refreshToken } = auth_schema_1.refreshTokenSchema.parse(body);
        const tokens = await auth_service_1.authService.refreshToken(refreshToken);
        res.json({ success: true, data: tokens });
    },
    async logout(req, res) {
        const refreshToken = req.body?.refreshToken ?? req.body?.refresh_token;
        await auth_service_1.authService.logout(refreshToken);
        res.json({ success: true, message: 'Logout exitoso' });
    },
    async me(req, res) {
        const user = await auth_service_1.authService.getUserById(req.user.id);
        res.json({ success: true, data: user });
    },
};
//# sourceMappingURL=auth.cotroller.js.map