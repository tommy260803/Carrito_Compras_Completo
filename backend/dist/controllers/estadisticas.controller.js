"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estadisticasController = void 0;
const estadisticas_service_1 = require("../services/estadisticas.service");
exports.estadisticasController = {
    async tendenciaVentas(req, res) {
        const data = await estadisticas_service_1.estadisticasService.tendenciaMensual();
        res.json({ success: true, data });
    },
    async analisisABC(req, res) {
        const abc = await estadisticas_service_1.estadisticasService.analisisABC();
        res.json({ success: true, data: abc });
    },
    async rfmSegmentacion(req, res) {
        const rfm = await estadisticas_service_1.estadisticasService.calcularRFM();
        res.json({ success: true, data: rfm });
    },
    // ... resto de endpoints
};
//# sourceMappingURL=estadisticas.controller.js.map