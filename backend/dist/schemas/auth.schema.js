"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nombre: zod_1.z.string().min(1, 'El nombre es requerido'),
    apellido: zod_1.z.string().min(1, 'El apellido es requerido'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'La contraseña es requerida'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token es requerido'),
});
//# sourceMappingURL=auth.schema.js.map