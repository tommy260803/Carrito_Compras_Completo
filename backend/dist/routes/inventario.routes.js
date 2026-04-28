"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const inventario_controller_1 = require("../controllers/inventario.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use(rbac_middleware_1.requireAdmin);
router.get('/stock-bajo', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.stockBajo));
router.get('/agotados', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.agotados));
router.put('/stock/:productoId', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.ajustarStock));
exports.default = router;
//# sourceMappingURL=inventario.routes.js.map