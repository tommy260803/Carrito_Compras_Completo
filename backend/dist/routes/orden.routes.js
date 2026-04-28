"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const orden_controller_1 = require("../controllers/orden.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Cliente (shop)
router.post('/', (0, rbac_middleware_1.requireRole)([2]), (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.crear));
router.get('/mis-ordenes', (0, rbac_middleware_1.requireRole)([2]), (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.listarMisOrdenes));
router.get('/mis-ordenes/:id', (0, rbac_middleware_1.requireRole)([2]), (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.obtenerDetalle));
// Admin
router.get('/', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.listar));
router.get('/estados', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.listarEstados));
router.get('/:id', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.obtener));
router.put('/:id/estado', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(orden_controller_1.ordenController.cambiarEstado));
exports.default = router;
//# sourceMappingURL=orden.routes.js.map