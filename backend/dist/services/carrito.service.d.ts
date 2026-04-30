import { agregarItemDto, actualizarItemDto } from '../schemas/carrito.schema';
export declare const carritoService: {
    obtenerCarrito(clienteId: number): Promise<{
        items: ({
            producto: {
                categoria: {
                    nombre: string;
                    activo: boolean;
                    created_at: Date;
                    updated_at: Date;
                    id: number;
                    slug: string;
                    padre_id: number | null;
                };
                imagenes: {
                    created_at: Date;
                    updated_at: Date;
                    id: number;
                    producto_id: number;
                    url: string;
                    alt: string | null;
                    orden: number;
                }[];
                stock: {
                    updated_at: Date;
                    id: number;
                    producto_id: number;
                    cantidad: number;
                    reservado: number;
                    disponible: number;
                } | null;
            } & {
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
            created_at: Date;
            updated_at: Date;
            id: number;
            producto_id: number;
            cantidad: number;
            carrito_id: number;
        })[];
    } & {
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        id: number;
        cliente_id: number;
    }>;
    agregarItem(clienteId: number, data: agregarItemDto): Promise<{
        producto: {
            categoria: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                updated_at: Date;
                id: number;
                slug: string;
                padre_id: number | null;
            };
            imagenes: {
                created_at: Date;
                updated_at: Date;
                id: number;
                producto_id: number;
                url: string;
                alt: string | null;
                orden: number;
            }[];
        } & {
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
        created_at: Date;
        updated_at: Date;
        id: number;
        producto_id: number;
        cantidad: number;
        carrito_id: number;
    }>;
    actualizarItem(itemId: number, data: actualizarItemDto): Promise<{
        producto: {
            categoria: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                updated_at: Date;
                id: number;
                slug: string;
                padre_id: number | null;
            };
            imagenes: {
                created_at: Date;
                updated_at: Date;
                id: number;
                producto_id: number;
                url: string;
                alt: string | null;
                orden: number;
            }[];
        } & {
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
        created_at: Date;
        updated_at: Date;
        id: number;
        producto_id: number;
        cantidad: number;
        carrito_id: number;
    }>;
    eliminarItem(itemId: number): Promise<void>;
    vaciarCarrito(clienteId: number): Promise<void>;
};
//# sourceMappingURL=carrito.service.d.ts.map