"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const reporte_controller_1 = require("../controllers/reporte.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyAccessToken);
router.use((0, rbac_middleware_1.requireRole)([1]));
router.get('/kpis', (0, asyncHandler_1.asyncHandler)(reporte_controller_1.reporteController.kpis));
router.get('/ventas-diarias', (0, asyncHandler_1.asyncHandler)(reporte_controller_1.reporteController.ventasDiarias));
router.get('/ventas-por-categoria', (0, asyncHandler_1.asyncHandler)(reporte_controller_1.reporteController.ventasPorCategoria));
router.get('/productos-mas-vendidos', (0, asyncHandler_1.asyncHandler)(reporte_controller_1.reporteController.productosMasVendidos));
exports.default = router;
//# sourceMappingURL=reporte.routes.js.map