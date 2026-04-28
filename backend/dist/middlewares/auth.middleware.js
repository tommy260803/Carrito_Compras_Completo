"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_ACCESS_SECRET);
        req.user = { id: decoded.id, email: decoded.email, rol: decoded.rol };
        next();
    }
    catch (error) {
        return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
    }
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=auth.middleware.js.map