"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const pago_controller_1 = require("../controllers/pago.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Cliente
router.post('/', (0, rbac_middleware_1.requireRole)([2]), (0, asyncHandler_1.asyncHandler)(pago_controller_1.pagoController.registrar));
router.get('/orden/:ordenId', (0, rbac_middleware_1.requireRole)([2]), (0, asyncHandler_1.asyncHandler)(pago_controller_1.pagoController.listarPorOrden));
// Admin
router.get('/', rbac_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(pago_controller_1.pagoController.listarAdmin));
exports.default = router;
//# sourceMappingURL=pago.routes.js.map