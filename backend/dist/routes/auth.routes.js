"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_cotroller_1 = require("../controllers/auth.cotroller");
const auth_1 = require("../middlewares/auth");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post('/register', (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.register));
router.post('/login', (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.login));
router.post('/refresh', (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.refreshToken));
router.post('/logout', (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.logout));
router.get('/me', auth_1.authenticate, (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.me));
// compat frontend
router.get('/profile', auth_1.authenticate, (0, asyncHandler_1.asyncHandler)(auth_cotroller_1.authController.me));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map