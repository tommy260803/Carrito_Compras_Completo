"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = void 0;
// Roles numéricos (alineado con JWT `rol`)
// 1 = admin, 2 = cliente (shop)
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'No autenticado' });
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ success: false, message: 'Permisos insuficientes' });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)([1]);
//# sourceMappingURL=rbac.middleware.js.map