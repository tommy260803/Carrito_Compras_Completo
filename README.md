# Carrito de Compras - Proyecto E-commerce

Un proyecto completo de carrito de compras con backend en Node.js/TypeScript y frontend en React/TypeScript.

## 🚀 Características

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Autenticación**: JWT con refresh tokens
- **Base de datos**: PostgreSQL con Prisma ORM
- **Arquitectura**: MVC con servicios separados
- **Estilos**: TailwindCSS con diseño responsive

## 📁 Estructura del Proyecto

```
Carrito_Compra/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Lógica de negocio
│   │   ├── routes/          # Rutas API
│   │   ├── middlewares/     # Middlewares
│   │   ├── schemas/         # Validaciones Zod
│   │   ├── utils/           # Utilidades
│   │   └── config/          # Configuración
│   ├── prisma/              # Schema y migraciones
│   └── package.json
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── pages/           # Páginas
│   │   ├── components/      # Componentes
│   │   ├── contexts/        # Contextos React
│   │   ├── services/        # API services
│   │   ├── hooks/           # Hooks personalizados
│   │   └── stores/          # Estado global
│   └── package.json
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### 1. Configurar Base de Datos

1. Crea una base de datos PostgreSQL:
```sql
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
```

2. Copia el archivo de entorno del backend:
```bash
cd backend
cp .env.example .env
```

3. Configura las variables de entorno en `backend/.env`:
```env
PORT=4000
DATABASE_URL="postgresql://ecommerce_user:password@localhost:5432/ecommerce_db"
JWT_ACCESS_SECRET="supersecret_change_in_production"
JWT_REFRESH_SECRET="refreshsecret_change_in_production"
FRONTEND_URL="http://localhost:5173"
```

### 2. Instalar Dependencias y Configurar Backend

```bash
cd backend
npm install
npm run db:generate
npm run db:push  # O npm run db:migrate si tienes migraciones
npm run dev
```

El backend estará disponible en `http://localhost:4000`

### 3. Instalar Dependencias y Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📊 Modelos de Datos

El proyecto incluye los siguientes modelos principales:

- **Usuarios**: Clientes y administradores
- **Productos**: Catálogo de productos con categorías
- **Carrito**: Sistema de carrito de compras
- **Órdenes**: Gestión de pedidos
- **Inventario**: Control de stock
- **Autenticación**: Roles y permisos

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/refresh` - Refrescar token
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener perfil

### Productos
- `GET /api/v1/productos` - Listar productos
- `POST /api/v1/productos` - Crear producto (admin)
- `PUT /api/v1/productos/:id` - Actualizar producto (admin)
- `DELETE /api/v1/productos/:id` - Eliminar producto (admin)

### Carrito
- `GET /api/v1/carrito` - Obtener carrito
- `POST /api/v1/carrito/items` - Agregar item
- `PUT /api/v1/carrito/items/:id` - Actualizar item
- `DELETE /api/v1/carrito/items/:id` - Eliminar item
- `DELETE /api/v1/carrito/vaciar` - Vaciar carrito

## 🎨 Páginas del Frontend

### Tienda (Públicas)
- **Home** (`/`) - Página principal
- **Catálogo** (`/catalogo`) - Listado de productos
- **Carrito** (`/carrito`) - Gestión del carrito
- **Checkout** (`/checkout`) - Proceso de pago

### Administración (Protegidas)
- **Dashboard** (`/admin`) - Panel principal
- **Productos** (`/admin/productos`) - Gestión de productos

## 🔐 Seguridad

- Autenticación con JWT
- Refresh tokens para mayor seguridad
- Middleware de autenticación
- Validación de datos con Zod
- CORS configurado
- Rate limiting implementado

## 🚀 Scripts Disponibles

### Backend
```bash
npm run dev          # Servidor en desarrollo
npm run build        # Compilar TypeScript
npm run start        # Servidor en producción
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:push      # Hacer push del schema
npm run db:studio    # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar producción
npm run lint         # Linter ESLint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT.
