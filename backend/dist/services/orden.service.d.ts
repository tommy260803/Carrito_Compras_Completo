export declare const ordenService: {
    crearOrden(clienteId: number, carritoId: number, direccionId: number, metodoPago: string): Promise<{
        items: ({
            producto: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                updated_at: Date;
                id: number;
                sku: string;
                descripcion_corta: string | null;
                descripcion_larga: string | null;
                categoria_id: number;
                marca_id: number | null;
                unidad_medida_id: number | null;
                precio_costo: import("@prisma/client/runtime/library").Decimal;
                precio_venta: import("@prisma/client/runtime/library").Decimal;
                precio_oferta: import("@prisma/client/runtime/library").Decimal | null;
                oferta_inicio: Date | null;
                oferta_fin: Date | null;
                peso: import("@prisma/client/runtime/library").Decimal | null;
                dimensiones: string | null;
                stock_minimo: number;
                created_by: number | null;
                updated_by: number | null;
            };
        } & {
            id: number;
            producto_id: number;
            cantidad: number;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            orden_id: number;
            precio_unitario: import("@prisma/client/runtime/library").Decimal;
        })[];
        estado: {
            nombre: string;
            created_at: Date;
            id: number;
            descripcion: string | null;
            color: string | null;
        };
        direccion_envio: {
            nombre: string;
            telefono: string | null;
            created_at: Date;
            updated_at: Date;
            id: number;
            cliente_id: number;
            direccion: string;
            ciudad: string;
            provincia: string;
            codigo_postal: string;
            es_principal: boolean;
        };
    } & {
        created_at: Date;
        updated_at: Date;
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        cliente_id: number;
        codigo: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        impuestos: import("@prisma/client/runtime/library").Decimal;
        metodo_pago: string | null;
        pago_referencia: string | null;
        fecha_orden: Date;
        fecha_pago: Date | null;
        fecha_envio: Date | null;
        fecha_entrega: Date | null;
        notas: string | null;
        estado_id: number;
        direccion_envio_id: number;
        metodo_envio_id: number | null;
    }>;
    cambiarEstado(ordenId: number, nuevoEstadoId: number, usuarioId: number, comentario?: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        total: import("@prisma/client/runtime/library").Decimal;
        cliente_id: number;
        codigo: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        impuestos: import("@prisma/client/runtime/library").Decimal;
        metodo_pago: string | null;
        pago_referencia: string | null;
        fecha_orden: Date;
        fecha_pago: Date | null;
        fecha_envio: Date | null;
        fecha_entrega: Date | null;
        notas: string | null;
        estado_id: number;
        direccion_envio_id: number;
        metodo_envio_id: number | null;
    }>;
};
//# sourceMappingURL=orden.service.d.ts.map