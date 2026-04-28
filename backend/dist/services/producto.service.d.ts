export declare const productoService: {
    list({ page, limit, filters }: {
        page: number;
        limit: number;
        filters: any;
    }): Promise<{
        productos: ({
            categoria: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                updated_at: Date;
                id: number;
                slug: string;
                padre_id: number | null;
            };
            marca: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                id: number;
            } | null;
            unidad_medida: {
                nombre: string;
                activo: boolean;
                created_at: Date;
                id: number;
                simbolo: string;
            } | null;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getById(id: number): Promise<{
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
        marca: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
        } | null;
        unidad_medida: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
            simbolo: string;
        } | null;
        imagenes: {
            created_at: Date;
            updated_at: Date;
            id: number;
            producto_id: number;
            url: string;
            alt: string | null;
            orden: number;
        }[];
        atributos: {
            nombre: string;
            created_at: Date;
            id: number;
            producto_id: number;
            valor: string;
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
    }>;
    create(data: any, userId: number): Promise<{
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
        marca: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
        } | null;
        unidad_medida: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
            simbolo: string;
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
    }>;
    update(id: number, data: any, userId: number): Promise<{
        categoria: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            slug: string;
            padre_id: number | null;
        };
        marca: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
        } | null;
        unidad_medida: {
            nombre: string;
            activo: boolean;
            created_at: Date;
            id: number;
            simbolo: string;
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
    }>;
    delete(id: number, userId: number): Promise<void>;
};
//# sourceMappingURL=producto.service.d.ts.map