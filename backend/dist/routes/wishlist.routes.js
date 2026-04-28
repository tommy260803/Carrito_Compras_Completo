"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, rbac_middleware_1.requireRole)([2]));
router.get('/', (0, asyncHandler_1.asyncHandler)(wishlist_controller_1.wishlistController.obtener));
router.post('/items', (0, asyncHandler_1.asyncHandler)(wishlist_controller_1.wishlistController.agregar));
router.delete('/items/:productoId', (0, asyncHandler_1.asyncHandler)(wishlist_controller_1.wishlistController.quitar));
exports.default = router;
//# sourceMappingURL=wishlist.routes.js.map