-- CreateTable
CREATE TABLE "cat_categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "padre_id" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_productos" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion_corta" VARCHAR(300),
    "descripcion_larga" TEXT,
    "categoria_id" INTEGER NOT NULL,
    "marca_id" INTEGER,
    "unidad_medida_id" INTEGER,
    "precio_costo" DECIMAL(12,2) NOT NULL,
    "precio_venta" DECIMAL(12,2) NOT NULL,
    "precio_oferta" DECIMAL(12,2),
    "oferta_inicio" DATE,
    "oferta_fin" DATE,
    "peso" DECIMAL(10,2),
    "dimensiones" VARCHAR(100),
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_marcas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_clientes" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "apellido" VARCHAR(80) NOT NULL,
    "telefono" VARCHAR(20),
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" VARCHAR(255),
    "reset_password_token" VARCHAR(255),
    "reset_password_expires" TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cli_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_ordenes" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "impuestos" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "direccion_envio_id" INTEGER NOT NULL,
    "metodo_envio_id" INTEGER,
    "metodo_pago" VARCHAR(50),
    "pago_referencia" VARCHAR(100),
    "fecha_orden" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_pago" TIMESTAMP,
    "fecha_envio" TIMESTAMP,
    "fecha_entrega" TIMESTAMP,
    "notas" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pag_pagos" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "metodo" VARCHAR(50),
    "monto" DECIMAL(12,2) NOT NULL,
    "referencia" VARCHAR(120),
    "transaccion_id" VARCHAR(120),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "pag_pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" VARCHAR(80),
    "apellido" VARCHAR(80),
    "telefono" VARCHAR(20),
    "rol_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "reset_token" VARCHAR(255),
    "reset_expires" TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seg_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "seg_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_permisos" (
    "id" SERIAL NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "accion" VARCHAR(20) NOT NULL,

    CONSTRAINT "seg_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_rol_permiso" (
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "seg_rol_permiso_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "cat_imagenes_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(200),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "cat_imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_unidades_medida" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_producto_atributo" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "valor" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_producto_atributo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_direcciones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(20) NOT NULL,
    "telefono" VARCHAR(20),
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "cli_direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_lista_deseos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "cli_lista_deseos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_lista_deseos_productos" (
    "id" SERIAL NOT NULL,
    "lista_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cli_lista_deseos_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_carritos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ord_carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_items_carrito" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ord_items_carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_estados_orden" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "color" VARCHAR(7),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_estados_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_items_orden" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ord_items_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_metodos_envio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "costo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tiempo_entrega" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_metodos_envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_historial_estados" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "fecha" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT,

    CONSTRAINT "ord_historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_stock_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "reservado" INTEGER NOT NULL DEFAULT 0,
    "disponible" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "inv_stock_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_movimientos_inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "referencia" VARCHAR(100),
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inv_movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seg_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cat_categorias_nombre_key" ON "cat_categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_categorias_slug_key" ON "cat_categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cat_productos_sku_key" ON "cat_productos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "cat_marcas_nombre_key" ON "cat_marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cli_clientes_email_key" ON "cli_clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ord_ordenes_codigo_key" ON "ord_ordenes"("codigo");

-- CreateIndex
CREATE INDEX "pag_pagos_orden_id_idx" ON "pag_pagos"("orden_id");

-- CreateIndex
CREATE UNIQUE INDEX "seg_usuarios_email_key" ON "seg_usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seg_roles_nombre_key" ON "seg_roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_unidades_medida_nombre_key" ON "cat_unidades_medida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cli_lista_deseos_cliente_id_key" ON "cli_lista_deseos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cli_lista_deseos_productos_lista_id_producto_id_key" ON "cli_lista_deseos_productos"("lista_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "ord_carritos_cliente_id_key" ON "ord_carritos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "ord_estados_orden_nombre_key" ON "ord_estados_orden"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ord_metodos_envio_nombre_key" ON "ord_metodos_envio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "inv_stock_producto_producto_id_key" ON "inv_stock_producto"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "seg_refresh_tokens_token_key" ON "seg_refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "cat_categorias" ADD CONSTRAINT "cat_categorias_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "cat_categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "cat_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "cat_marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "cat_unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "ord_estados_orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_direccion_envio_id_fkey" FOREIGN KEY ("direccion_envio_id") REFERENCES "cli_direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_metodo_envio_id_fkey" FOREIGN KEY ("metodo_envio_id") REFERENCES "ord_metodos_envio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pag_pagos" ADD CONSTRAINT "pag_pagos_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_usuarios" ADD CONSTRAINT "seg_usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seg_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_rol_permiso" ADD CONSTRAINT "seg_rol_permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seg_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_rol_permiso" ADD CONSTRAINT "seg_rol_permiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "seg_permisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_imagenes_producto" ADD CONSTRAINT "cat_imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_producto_atributo" ADD CONSTRAINT "cat_producto_atributo_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_direcciones" ADD CONSTRAINT "cli_direcciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_lista_deseos" ADD CONSTRAINT "cli_lista_deseos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_lista_deseos_productos" ADD CONSTRAINT "cli_lista_deseos_productos_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "cli_lista_deseos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_lista_deseos_productos" ADD CONSTRAINT "cli_lista_deseos_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_carritos" ADD CONSTRAINT "ord_carritos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_carrito" ADD CONSTRAINT "ord_items_carrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "ord_carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_carrito" ADD CONSTRAINT "ord_items_carrito_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_orden" ADD CONSTRAINT "ord_items_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_orden" ADD CONSTRAINT "ord_items_orden_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_historial_estados" ADD CONSTRAINT "ord_historial_estados_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_historial_estados" ADD CONSTRAINT "ord_historial_estados_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "ord_estados_orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_historial_estados" ADD CONSTRAINT "ord_historial_estados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_stock_producto" ADD CONSTRAINT "inv_stock_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_movimientos_inventario" ADD CONSTRAINT "inv_movimientos_inventario_producto_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_movimientos_inventario" ADD CONSTRAINT "inv_movimientos_inventario_stock_fkey" FOREIGN KEY ("producto_id") REFERENCES "inv_stock_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_movimientos_inventario" ADD CONSTRAINT "inv_movimientos_inventario_usuario_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_refresh_tokens" ADD CONSTRAINT "seg_refresh_tokens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
