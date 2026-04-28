"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const producto_routes_1 = __importDefault(require("./producto.routes"));
const carrito_routes_1 = __importDefault(require("./carrito.routes"));
const orden_routes_1 = __importDefault(require("./orden.routes"));
const reporte_routes_1 = __importDefault(require("./reporte.routes"));
const cliente_routes_1 = __importDefault(require("./cliente.routes"));
const wishlist_routes_1 = __importDefault(require("./wishlist.routes"));
const inventario_routes_1 = __importDefault(require("./inventario.routes"));
const pago_routes_1 = __importDefault(require("./pago.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/productos', producto_routes_1.default);
router.use('/carrito', carrito_routes_1.default);
router.use('/ordenes', orden_routes_1.default);
router.use('/reportes', reporte_routes_1.default);
router.use('/clientes', cliente_routes_1.default);
router.use('/wishlist', wishlist_routes_1.default);
router.use('/inventario', inventario_routes_1.default);
router.use('/pagos', pago_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map