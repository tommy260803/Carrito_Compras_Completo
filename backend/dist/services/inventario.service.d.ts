export declare const inventarioService: {
    list(): Promise<({
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
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
    })[]>;
    stockBajo(): Promise<({
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
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
    })[]>;
    agotados(): Promise<({
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
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
    })[]>;
    movimientos(productoId?: number): Promise<({
        usuario: {
            email: string;
            nombre: string | null;
            id: number;
        } | null;
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
        id: number;
        usuario_id: number | null;
        producto_id: number;
        cantidad: number;
        tipo: string;
        referencia: string | null;
    })[]>;
    ajustarStock(productoId: number, cantidad: number, userId?: number): Promise<{
        updated_at: Date;
        id: number;
        producto_id: number;
        cantidad: number;
        reservado: number;
        disponible: number;
    }>;
    actualizarStockMinimo(productoId: number, stockMinimo: number): Promise<{
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
    }>;
};
//# sourceMappingURL=inventario.service.d.ts.map