"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const inventario_controller_1 = require("../controllers/inventario.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyAccessToken);
router.use((0, rbac_middleware_1.requireRole)([1]));
router.get('/', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.list));
router.get('/stock-bajo', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.stockBajo));
router.get('/agotados', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.agotados));
router.get('/movimientos', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.movimientos));
router.put('/stock/:productoId', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.ajustarStock));
router.put('/stock-minimo/:productoId', (0, asyncHandler_1.asyncHandler)(inventario_controller_1.inventarioController.actualizarStockMinimo));
exports.default = router;
//# sourceMappingURL=inventario.routes.js.map