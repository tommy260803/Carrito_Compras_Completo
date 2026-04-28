-- database.sql
CREATE DATABASE ecommerce_db
    WITH ENCODING 'UTF8'
    OWNER ecommerce_user;

\c ecommerce_db;

-- ========================
-- Módulo Catálogo
-- ========================
CREATE TABLE IF NOT EXISTS cat_categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    padre_id INT REFERENCES cat_categorias(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cat_marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cat_unidades_medida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    abreviatura VARCHAR(5)
);

CREATE TABLE IF NOT EXISTS cat_productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion_corta VARCHAR(300),
    descripcion_larga TEXT,
    categoria_id INT NOT NULL REFERENCES cat_categorias(id),
    marca_id INT REFERENCES cat_marcas(id),
    unidad_medida_id INT REFERENCES cat_unidades_medida(id),
    precio_costo DECIMAL(12,2) NOT NULL CHECK (precio_costo >= 0),
    precio_venta DECIMAL(12,2) NOT NULL CHECK (precio_venta >= 0),
    precio_oferta DECIMAL(12,2) CHECK (precio_oferta >= 0),
    oferta_inicio DATE,
    oferta_fin DATE,
    peso DECIMAL(10,2),
    dimensiones VARCHAR(100),
    stock_minimo INT DEFAULT 0 CHECK (stock_minimo >= 0),
    activo BOOLEAN DEFAULT TRUE,
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cat_imagenes_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    orden INT DEFAULT 0,
    principal BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cat_atributos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cat_valores_atributo (
    id SERIAL PRIMARY KEY,
    atributo_id INT NOT NULL REFERENCES cat_atributos(id),
    valor VARCHAR(100) NOT NULL,
    UNIQUE(atributo_id, valor)
);

CREATE TABLE IF NOT EXISTS cat_producto_atributo (
    producto_id INT REFERENCES cat_productos(id) ON DELETE CASCADE,
    valor_atributo_id INT REFERENCES cat_valores_atributo(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, valor_atributo_id)
);

-- ========================
-- Módulo Clientes y Seguridad
-- ========================
CREATE TABLE IF NOT EXISTS seg_roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS seg_permisos (
    id SERIAL PRIMARY KEY,
    modulo VARCHAR(50),
    accion VARCHAR(20),
    descripcion TEXT,
    UNIQUE(modulo, accion)
);

CREATE TABLE IF NOT EXISTS seg_rol_permiso (
    rol_id INT REFERENCES seg_roles(id) ON DELETE CASCADE,
    permiso_id INT REFERENCES seg_permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS cli_clientes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    apellido VARCHAR(80) NOT NULL,
    telefono VARCHAR(20),
    email_verificado BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cli_direcciones (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(160),
    direccion_linea1 VARCHAR(200) NOT NULL,
    direccion_linea2 VARCHAR(200),
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(20),
    principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cli_lista_deseos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id) ON DELETE CASCADE,
    nombre VARCHAR(50) DEFAULT 'Lista de deseos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cli_items_lista_deseos (
    id SERIAL PRIMARY KEY,
    lista_id INT NOT NULL REFERENCES cli_lista_deseos(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lista_id, producto_id)
);

-- ========================
-- Módulo Carrito y Órdenes
-- ========================
CREATE TABLE IF NOT EXISTS ord_estados_orden (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS ord_metodos_envio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    costo DECIMAL(10,2) DEFAULT 0,
    tiempo_estimado_dias INT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ord_carritos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES cli_clientes(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ord_items_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id INT NOT NULL REFERENCES ord_carritos(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    variante_seleccionada JSONB,
    precio_unitario DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(carrito_id, producto_id, variante_seleccionada)
);

CREATE TABLE IF NOT EXISTS ord_ordenes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id),
    estado_id INT NOT NULL REFERENCES ord_estados_orden(id),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    impuestos DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    direccion_envio_id INT NOT NULL REFERENCES cli_direcciones(id),
    metodo_envio_id INT REFERENCES ord_metodos_envio(id),
    metodo_pago VARCHAR(50),
    pago_referencia VARCHAR(100),
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_pago TIMESTAMP,
    fecha_envio TIMESTAMP,
    fecha_entrega TIMESTAMP,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ord_items_orden (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL,
    variante_seleccionada JSONB,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE IF NOT EXISTS ord_historial_estados (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id) ON DELETE CASCADE,
    estado_id INT NOT NULL REFERENCES ord_estados_orden(id),
    usuario_id INT,
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- Módulo Inventario
-- ========================
CREATE TABLE IF NOT EXISTS inv_stock_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL UNIQUE REFERENCES cat_productos(id) ON DELETE CASCADE,
    stock_fisico INT NOT NULL DEFAULT 0 CHECK (stock_fisico >= 0),
    stock_reservado INT NOT NULL DEFAULT 0 CHECK (stock_reservado >= 0),
    stock_disponible INT GENERATED ALWAYS AS (stock_fisico - stock_reservado) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inv_movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES cat_productos(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada','salida','ajuste','reserva','liberacion')),
    cantidad INT NOT NULL,
    motivo VARCHAR(100),
    orden_venta_id INT REFERENCES ord_ordenes(id) ON DELETE SET NULL,
    orden_compra_id INT,
    usuario_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inv_proveedores (
    id SERIAL PRIMARY KEY,
    razon_social VARCHAR(120) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- ========================
-- Auditoría
-- ========================
CREATE TABLE IF NOT EXISTS auditoria_registro (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(20),
    modulo VARCHAR(50),
    tabla_afectada VARCHAR(50),
    registro_id INT,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- Índices
-- ========================
CREATE INDEX idx_productos_categoria ON cat_productos(categoria_id);
CREATE INDEX idx_productos_marca ON cat_productos(marca_id);
CREATE INDEX idx_productos_sku ON cat_productos(sku);
CREATE INDEX idx_productos_nombre ON cat_productos USING GIN (to_tsvector('spanish', nombre));
CREATE INDEX idx_ordenes_cliente ON ord_ordenes(cliente_id);
CREATE INDEX idx_ordenes_estado ON ord_ordenes(estado_id);
CREATE INDEX idx_ordenes_fecha ON ord_ordenes(fecha_orden);
CREATE INDEX idx_carrito_session ON ord_carritos(session_id);
CREATE INDEX idx_inv_movimientos_producto ON inv_movimientos_inventario(producto_id);

-- ========================
-- Restricciones CHECK adicionales
-- ========================
ALTER TABLE cat_productos ADD CONSTRAINT check_ofertas CHECK (
    (precio_oferta IS NULL) OR (precio_oferta < precio_venta)
);

-- ========================
-- Datos semilla (roles, permisos, categorías, productos)
-- ========================
INSERT INTO seg_roles (nombre) VALUES 
('cliente'), ('administrador'), ('gerente_ventas'), ('gerente_inventario'), ('vendedor') 
ON CONFLICT DO NOTHING;

INSERT INTO seg_permisos (modulo, accion) VALUES
('productos', 'leer'), ('productos', 'crear'), ('productos', 'editar'), ('productos', 'eliminar'),
('ordenes', 'leer'), ('ordenes', 'cambiar_estado'), ('ordenes', 'cancelar'),
('clientes', 'leer'), ('clientes', 'editar'), ('inventario', 'gestionar'),
('reportes', 'generar'), ('dashboard', 'ver')
ON CONFLICT DO NOTHING;

-- Asignar permisos a administrador (rol id 2)
INSERT INTO seg_rol_permiso (rol_id, permiso_id)
SELECT 2, id FROM seg_permisos ON CONFLICT DO NOTHING;

INSERT INTO ord_estados_orden (nombre, codigo) VALUES
('Pendiente pago', 'PENDING_PAY'),
('Pagada', 'PAID'),
('En proceso', 'PROCESSING'),
('Enviada', 'SHIPPED'),
('Entregada', 'DELIVERED'),
('Cancelada', 'CANCELLED'),
('Devuelta', 'RETURNED')
ON CONFLICT DO NOTHING;

INSERT INTO cat_categorias (nombre, slug) VALUES
('Electrónica', 'electronica'),
('Ropa', 'ropa'),
('Hogar', 'hogar'),
('Deportes', 'deportes')
ON CONFLICT DO NOTHING;

INSERT INTO cat_marcas (nombre) VALUES ('Samsung'), ('Nike'), ('Sony'), ('Adidas') ON CONFLICT DO NOTHING;

INSERT INTO cat_unidades_medida (nombre, abreviatura) VALUES ('Unidad', 'u'), ('Par', 'par'), ('Kilogramo', 'kg') ON CONFLICT DO NOTHING;

-- 20 productos de ejemplo (datos resumidos)
INSERT INTO cat_productos (sku, nombre, descripcion_corta, categoria_id, marca_id, unidad_medida_id, precio_venta, stock_minimo) VALUES
('SKU001', 'Smart TV 55"', 'Televisor 4K UHD', 1, 1, 1, 499.99, 5),
('SKU002', 'Zapatillas Running', 'Zapatillas ligeras', 2, 2, 2, 89.99, 10),
('SKU003', 'Auriculares Bluetooth', 'Sonido envolvente', 1, 3, 1, 59.99, 15),
('SKU004', 'Set de Toallas', 'Juego 3 piezas', 3, NULL, 1, 29.99, 8),
('SKU005', 'Pelota Fútbol', 'Talla oficial', 4, 4, 1, 24.99, 20)
-- (continuar hasta 20)
ON CONFLICT DO NOTHING;

-- Insertar stock inicial
INSERT INTO inv_stock_producto (producto_id, stock_fisico) 
SELECT id, 100 FROM cat_productos ON CONFLICT DO NOTHING;

COMMIT;
sql
-- ========================
-- Tablas faltantes
-- ========================
-- Usuarios del sistema (unifica clientes y administradores)
CREATE TABLE IF NOT EXISTS seg_usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nombre VARCHAR(80),
    apellido VARCHAR(80),
    telefono VARCHAR(20),
    rol_id INT NOT NULL REFERENCES seg_roles(id),
    activo BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación usuario-rol (ya incluida en seg_usuarios.rol_id, pero por spec se deja tabla aparte)
CREATE TABLE IF NOT EXISTS seg_usuario_rol (
    usuario_id INT REFERENCES seg_usuarios(id),
    rol_id INT REFERENCES seg_roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

-- Monedas y tipo de cambio
CREATE TABLE IF NOT EXISTS monedas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    nombre VARCHAR(30),
    simbolo VARCHAR(5),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tipo_cambio (
    id SERIAL PRIMARY KEY,
    moneda_origen_id INT REFERENCES monedas(id),
    moneda_destino_id INT REFERENCES monedas(id),
    tasa DECIMAL(12,4),
    fecha DATE DEFAULT CURRENT_DATE
);

-- Configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    clave VARCHAR(50) PRIMARY KEY,
    valor TEXT,
    descripcion TEXT,
    actualizado_por INT REFERENCES seg_usuarios(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Etiquetas de productos
CREATE TABLE IF NOT EXISTS cat_etiquetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cat_producto_etiqueta (
    producto_id INT REFERENCES cat_productos(id) ON DELETE CASCADE,
    etiqueta_id INT REFERENCES cat_etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, etiqueta_id)
);

-- Pagos y transacciones
CREATE TABLE IF NOT EXISTS ord_pagos (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id),
    monto DECIMAL(12,2) NOT NULL,
    metodo_pago VARCHAR(50),
    referencia VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_pago TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ord_transacciones_pago (
    id SERIAL PRIMARY KEY,
    pago_id INT REFERENCES ord_pagos(id),
    transaccion_id VARCHAR(100) UNIQUE,
    gateway_respuesta JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Módulo de inventario completo
CREATE TABLE IF NOT EXISTS inv_ajustes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    motivo VARCHAR(100),
    usuario_id INT REFERENCES seg_usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inv_detalle_ajuste (
    id SERIAL PRIMARY KEY,
    ajuste_id INT REFERENCES inv_ajustes(id) ON DELETE CASCADE,
    producto_id INT REFERENCES cat_productos(id),
    cantidad INT NOT NULL,
    tipo_ajuste VARCHAR(10) CHECK (tipo_ajuste IN ('positivo','negativo'))
);

CREATE TABLE IF NOT EXISTS inv_ordenes_compra (
    id SERIAL PRIMARY KEY,
    proveedor_id INT REFERENCES inv_proveedores(id),
    fecha_orden DATE,
    fecha_esperada DATE,
    estado VARCHAR(20),
    total DECIMAL(12,2),
    created_by INT REFERENCES seg_usuarios(id)
);

CREATE TABLE IF NOT EXISTS inv_detalle_orden_compra (
    id SERIAL PRIMARY KEY,
    orden_compra_id INT REFERENCES inv_ordenes_compra(id),
    producto_id INT REFERENCES cat_productos(id),
    cantidad INT,
    precio_unitario DECIMAL(12,2)
);

CREATE TABLE IF NOT EXISTS inv_recepciones (
    id SERIAL PRIMARY KEY,
    orden_compra_id INT REFERENCES inv_ordenes_compra(id),
    fecha_recepcion DATE,
    usuario_id INT REFERENCES seg_usuarios(id),
    observaciones TEXT
);

-- Reseñas de productos
CREATE TABLE IF NOT EXISTS cli_resenas_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES cat_productos(id),
    cliente_id INT REFERENCES cli_clientes(id),
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderado BOOLEAN DEFAULT FALSE
);

-- Historial de navegación (para análisis)
CREATE TABLE IF NOT EXISTS cli_historial_navegacion (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES cli_clientes(id),
    producto_id INT REFERENCES cat_productos(id),
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migrar datos de clientes existentes a seg_usuarios (si se requiere)
INSERT INTO seg_usuarios (email, password_hash, nombre, apellido, rol_id, email_verificado)
SELECT email, password_hash, nombre, apellido, 1, email_verificado FROM cli_clientes
ON CONFLICT DO NOTHING;

-- Índices adicionales
CREATE INDEX idx_ordenes_cliente ON ord_ordenes(cliente_id);
CREATE INDEX idx_pagos_orden ON ord_pagos(orden_id);
CREATE INDEX idx_resenas_producto ON cli_resenas_producto(producto_id);
