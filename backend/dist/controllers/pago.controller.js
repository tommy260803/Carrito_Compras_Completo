"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagoController = void 0;
const pago_schema_1 = require("../schemas/pago.schema");
const pago_service_1 = require("../services/pago.service");
exports.pagoController = {
    async registrar(req, res) {
        const validated = pago_schema_1.registrarPagoSchema.parse(req.body);
        const pago = await pago_service_1.pagoService.registrarPago(req.user.id, validated);
        res.status(201).json({ success: true, data: pago });
    },
    async listarPorOrden(req, res) {
        const ordenId = Number(req.params.ordenId);
        const pagos = await pago_service_1.pagoService.listarPagosDeOrden(req.user.id, ordenId);
        res.json({ success: true, data: pagos });
    },
    // Admin
    async listarAdmin(req, res) {
        const { estado, desde, hasta, orden_codigo, cliente_email } = req.query;
        const pagos = await pago_service_1.pagoService.listarPagosAdmin({
            estado: estado ? String(estado) : undefined,
            desde: desde ? new Date(String(desde)) : undefined,
            hasta: hasta ? new Date(String(hasta)) : undefined,
            orden_codigo: orden_codigo ? String(orden_codigo) : undefined,
            cliente_email: cliente_email ? String(cliente_email) : undefined,
        });
        res.json({ success: true, data: pagos });
    },
};
//# sourceMappingURL=pago.controller.js.map