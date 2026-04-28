"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoController = void 0;
const producto_service_1 = require("../services/producto.service");
const producto_schema_1 = require("../schemas/producto.schema");
exports.productoController = {
    async list(req, res) {
        const { page = 1, limit = 12, ...filters } = req.query;
        const result = await producto_service_1.productoService.list({
            page: Number(page),
            limit: Number(limit),
            filters,
        });
        res.json({ success: true, data: result });
    },
    async create(req, res) {
        const validated = producto_schema_1.createProductoSchema.parse(req.body);
        const newProducto = await producto_service_1.productoService.create(validated, req.user.id);
        res.status(201).json({ success: true, data: newProducto });
    },
    async getById(req, res) {
        const { id } = req.params;
        const producto = await producto_service_1.productoService.getById(Number(id));
        res.json({ success: true, data: producto });
    },
    async update(req, res) {
        const { id } = req.params;
        const validated = producto_schema_1.createProductoSchema.parse(req.body);
        const updatedProducto = await producto_service_1.productoService.update(Number(id), validated, req.user.id);
        res.json({ success: true, data: updatedProducto });
    },
    async delete(req, res) {
        const { id } = req.params;
        await producto_service_1.productoService.delete(Number(id), req.user.id);
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    },
};
//# sourceMappingURL=producto.controller.js.map