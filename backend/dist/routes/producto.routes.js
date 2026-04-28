"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controller_1 = require("../controllers/producto.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(producto_controller_1.productoController.list));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(producto_controller_1.productoController.getById));
router.post('/', auth_middleware_1.verifyAccessToken, (0, rbac_middleware_1.requireRole)([1]), (0, asyncHandler_1.asyncHandler)(producto_controller_1.productoController.create));
router.put('/:id', auth_middleware_1.verifyAccessToken, (0, rbac_middleware_1.requireRole)([1]), (0, asyncHandler_1.asyncHandler)(producto_controller_1.productoController.update));
router.delete('/:id', auth_middleware_1.verifyAccessToken, (0, rbac_middleware_1.requireRole)([1]), (0, asyncHandler_1.asyncHandler)(producto_controller_1.productoController.delete));
exports.default = router;
//# sourceMappingURL=producto.routes.js.map