"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const carrito_controller_1 = require("../controllers/carrito.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, rbac_middleware_1.requireRole)([2])); // solo clientes pueden tener carrito
router.get('/', (0, asyncHandler_1.asyncHandler)(carrito_controller_1.carritoController.obtenerCarrito));
router.post('/items', (0, asyncHandler_1.asyncHandler)(carrito_controller_1.carritoController.agregarItem));
router.put('/items/:itemId', (0, asyncHandler_1.asyncHandler)(carrito_controller_1.carritoController.actualizarItem));
router.delete('/items/:itemId', (0, asyncHandler_1.asyncHandler)(carrito_controller_1.carritoController.eliminarItem));
router.delete('/vaciar', (0, asyncHandler_1.asyncHandler)(carrito_controller_1.carritoController.vaciarCarrito));
exports.default = router;
//# sourceMappingURL=carrito.routes.js.map