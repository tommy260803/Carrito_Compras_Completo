"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carritoController = void 0;
const carrito_service_1 = require("../services/carrito.service");
const carrito_schema_1 = require("../schemas/carrito.schema");
exports.carritoController = {
    async obtenerCarrito(req, res) {
        const carrito = await carrito_service_1.carritoService.obtenerCarrito(req.user.id);
        res.json({ success: true, data: carrito });
    },
    async agregarItem(req, res) {
        const validated = carrito_schema_1.agregarItemSchema.parse(req.body);
        const item = await carrito_service_1.carritoService.agregarItem(req.user.id, validated);
        res.status(201).json({ success: true, data: item });
    },
    async actualizarItem(req, res) {
        const { itemId } = req.params;
        const validated = carrito_schema_1.actualizarItemSchema.parse(req.body);
        const item = await carrito_service_1.carritoService.actualizarItem(Number(itemId), validated);
        res.json({ success: true, data: item });
    },
    async eliminarItem(req, res) {
        const { itemId } = req.params;
        await carrito_service_1.carritoService.eliminarItem(Number(itemId));
        res.json({ success: true, message: 'Item eliminado del carrito' });
    },
    async vaciarCarrito(req, res) {
        await carrito_service_1.carritoService.vaciarCarrito(req.user.id);
        res.json({ success: true, message: 'Carrito vaciado' });
    },
};
//# sourceMappingURL=carrito.controller.js.map