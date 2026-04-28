export declare const estadisticasService: {
    tendenciaMensual(): Promise<{
        mes: string;
        total: number;
    }[]>;
    analisisABC(): Promise<{
        producto_id: number;
        nombre: string;
        ingreso: number;
    }[]>;
    calcularRFM(): Promise<{
        cliente_id: number;
        email: string;
        ordenes: number;
        gasto: number;
    }[]>;
};
//# sourceMappingURL=estadisticas.service.d.ts.map