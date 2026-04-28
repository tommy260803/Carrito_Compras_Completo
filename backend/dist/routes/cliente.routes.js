"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const cliente_controller_1 = require("../controllers/cliente.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Admin
router.get('/admin', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.listarAdmin));
// Cliente
router.use((0, rbac_middleware_1.requireRole)([2]));
router.get('/me', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.me));
router.get('/historial-compras', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.historialCompras));
router.get('/direcciones', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.listarDirecciones));
router.post('/direcciones', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.crearDireccion));
router.put('/direcciones/:id', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.actualizarDireccion));
router.delete('/direcciones/:id', (0, asyncHandler_1.asyncHandler)(cliente_controller_1.clienteController.eliminarDireccion));
exports.default = router;
//# sourceMappingURL=cliente.routes.js.map