export declare const reporteService: {
    kpis(): Promise<{
        ventasTotales: number;
        ticketPromedio: number;
        ordenesPendientes: number;
        productosSinStock: number;
    }>;
    ventasDiarias(desde: Date, hasta: Date): Promise<{
        fecha: string;
        total: number;
    }[]>;
    ventasPorCategoria(): Promise<{
        categoria: string;
        total: number;
    }[]>;
    productosMasVendidos(limit: number): Promise<{
        producto_id: number;
        nombre: string;
        cantidad: number;
    }[]>;
};
//# sourceMappingURL=reporte.service.d.ts.map