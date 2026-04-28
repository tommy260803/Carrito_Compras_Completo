"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const config_1 = require("../config");
const AppError_1 = require("../utils/AppError");
exports.authService = {
    // Registro de cliente (tabla `cli_clientes`). Para administradores se asume seed/manual.
    async register(data) {
        const existingCliente = await prisma_1.prisma.cli_clientes.findUnique({ where: { email: data.email } });
        if (existingCliente)
            throw new AppError_1.AppError('Email ya registrado', 409);
        const hashed = await bcrypt_1.default.hash(data.password, 12);
        const cliente = await prisma_1.prisma.cli_clientes.create({
            data: {
                email: data.email,
                password_hash: hashed,
                nombre: data.nombre,
                apellido: data.apellido,
            },
        });
        const accessToken = this.generateAccessToken({ id: cliente.id, email: cliente.email, rol: 2 });
        const refreshToken = await this.generateRefreshToken(cliente.id, 2);
        return { user: { id: cliente.id, email: cliente.email, nombre: cliente.nombre, rol: 2 }, accessToken, refreshToken };
    },
    async login(email, password) {
        // 1) Intentar admin (`seg_usuarios`)
        const admin = await prisma_1.prisma.seg_usuarios.findUnique({ where: { email } });
        if (admin && admin.rol_id === 1) {
            if (!(await bcrypt_1.default.compare(password, admin.password_hash)))
                throw new AppError_1.AppError('Credenciales inválidas', 401);
            if (!admin.activo)
                throw new AppError_1.AppError('Cuenta desactivada', 401);
            const accessToken = this.generateAccessToken({ id: admin.id, email: admin.email, rol: 1 });
            const refreshToken = await this.generateRefreshToken(admin.id, 1);
            return { accessToken, refreshToken, user: { id: admin.id, email: admin.email, rol: 1 } };
        }
        // 2) Intentar cliente (`cli_clientes`)
        const cliente = await prisma_1.prisma.cli_clientes.findUnique({ where: { email } });
        if (!cliente || !(await bcrypt_1.default.compare(password, cliente.password_hash))) {
            throw new AppError_1.AppError('Credenciales inválidas', 401);
        }
        if (!cliente.activo)
            throw new AppError_1.AppError('Cuenta desactivada', 401);
        const accessToken = this.generateAccessToken({ id: cliente.id, email: cliente.email, rol: 2 });
        const refreshToken = await this.generateRefreshToken(cliente.id, 2);
        return { accessToken, refreshToken, user: { id: cliente.id, email: cliente.email, rol: 2 } };
    },
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, rol: user.rol }, config_1.config.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    },
    async generateRefreshToken(userId, rol) {
        const token = jsonwebtoken_1.default.sign({ id: userId, rol }, config_1.config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        // Almacenar en DB para revocación (tabla ligada a `seg_usuarios`; guardamos `usuario_id` = id del token)
        await prisma_1.prisma.seg_refresh_tokens.create({
            data: { token, usuario_id: userId, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });
        return token;
    },
    async refreshToken(oldToken) {
        const payload = jsonwebtoken_1.default.verify(oldToken, config_1.config.JWT_REFRESH_SECRET);
        const stored = await prisma_1.prisma.seg_refresh_tokens.findFirst({ where: { token: oldToken, revoked: false } });
        if (!stored || stored.expires_at < new Date())
            throw new AppError_1.AppError('Refresh token inválido', 401);
        const rol = Number(payload.rol);
        if (rol === 1) {
            const admin = await prisma_1.prisma.seg_usuarios.findUnique({ where: { id: payload.id } });
            if (!admin)
                throw new AppError_1.AppError('Usuario no existe', 401);
            await prisma_1.prisma.seg_refresh_tokens.update({ where: { id: stored.id }, data: { revoked: true } });
            const newAccessToken = this.generateAccessToken({ id: admin.id, email: admin.email, rol: 1 });
            const newRefreshToken = await this.generateRefreshToken(admin.id, 1);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        const cliente = await prisma_1.prisma.cli_clientes.findUnique({ where: { id: payload.id } });
        if (!cliente)
            throw new AppError_1.AppError('Usuario no existe', 401);
        await prisma_1.prisma.seg_refresh_tokens.update({ where: { id: stored.id }, data: { revoked: true } });
        const newAccessToken = this.generateAccessToken({ id: cliente.id, email: cliente.email, rol: 2 });
        const newRefreshToken = await this.generateRefreshToken(cliente.id, 2);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },
    async logout(refreshToken) {
        await prisma_1.prisma.seg_refresh_tokens.updateMany({ where: { token: refreshToken }, data: { revoked: true } });
    },
    async getUserById(userId) {
        // Para `/auth/me` se prioriza admin; si no existe, devolver cliente
        const admin = await prisma_1.prisma.seg_usuarios.findUnique({
            where: { id: userId },
            select: { id: true, email: true, nombre: true, apellido: true, rol_id: true, rol: { select: { nombre: true } } },
        });
        if (admin) {
            return { id: admin.id, email: admin.email, nombre: admin.nombre, apellido: admin.apellido, rol: admin.rol.nombre };
        }
        const cliente = await prisma_1.prisma.cli_clientes.findUnique({
            where: { id: userId },
            select: { id: true, email: true, nombre: true, apellido: true, telefono: true },
        });
        if (!cliente)
            throw new AppError_1.AppError('Usuario no encontrado', 404);
        return { id: cliente.id, email: cliente.email, nombre: cliente.nombre, apellido: cliente.apellido, telefono: cliente.telefono, rol: 'cliente' };
    },
};
//# sourceMappingURL=auth.service.js.map