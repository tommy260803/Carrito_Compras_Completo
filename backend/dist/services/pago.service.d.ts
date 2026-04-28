import { registrarPagoDto } from '../schemas/pago.schema';
export declare const pagoService: {
    registrarPago(clienteId: number, data: registrarPagoDto): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        estado: string;
        orden_id: number;
        referencia: string | null;
        metodo: string | null;
        monto: import("@prisma/client/runtime/library").Decimal;
        transaccion_id: string | null;
    }>;
    listarPagosDeOrden(clienteId: number, ordenId: number): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        estado: string;
        orden_id: number;
        referencia: string | null;
        metodo: string | null;
        monto: import("@prisma/client/runtime/library").Decimal;
        transaccion_id: string | null;
    }[]>;
    listarPagosAdmin(params: {
        estado?: string;
        desde?: Date;
        hasta?: Date;
        orden_codigo?: string;
        cliente_email?: string;
    }): Promise<({
        orden: {
            cliente: {
                email: string;
                password_hash: string;
                nombre: string;
                apellido: string;
                telefono: string | null;
                email_verificado: boolean;
                email_verification_token: string | null;
                reset_password_token: string | null;
                reset_password_expires: Date | null;
                activo: boolean;
                created_at: Date;
                updated_at: Date;
                id: number;
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
        };
    } & {
        created_at: Date;
        updated_at: Date;
        id: number;
        estado: string;
        orden_id: number;
        referencia: string | null;
        metodo: string | null;
        monto: import("@prisma/client/runtime/library").Decimal;
        transaccion_id: string | null;
    })[]>;
};
//# sourceMappingURL=pago.service.d.ts.map