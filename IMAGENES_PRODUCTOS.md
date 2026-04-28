# Manejo de Imágenes de Productos

## Estructura en Base de Datos

Las imágenes de productos se almacenan en la tabla `cat_imagenes_producto`:

```prisma
model cat_imagenes_producto {
  id         Int      @id @default(autoincrement())
  producto_id Int
  url        String   @db.VarChar(500)
  alt        String?  @db.VarChar(200)
  orden      Int      @default(0)
  created_at DateTime @default(now()) @db.Timestamp
  updated_at DateTime @updatedAt @db.Timestamp

  producto cat_productos @relation(fields: [producto_id], references: [id], onDelete: Cascade)
}
```

## Opciones para Manejar Imágenes

### Opción 1: URLs Externas (Recomendado para producción)

Usar servicios de almacenamiento en la nube como Cloudinary, AWS S3, Google Cloud Storage, etc.

**Ventajas:**
- Escalabilidad automática
- Optimización de imágenes
- CDN global
- Backup automático

**Cómo usar:**
1. Sube las imágenes a tu servicio de almacenamiento
2. Copia la URL pública de cada imagen
3. Al crear/editar un producto, ingresa la URL en el campo `url` de la imagen

**Ejemplo:**
```typescript
await prisma.cat_imagenes_producto.create({
  data: {
    producto_id: productoId,
    url: 'https://res.cloudinary.com/tu-cloud/image.jpg',
    alt: 'Nombre del producto',
    orden: 0
  }
});
```

### Opción 2: URLs Locales (Para desarrollo)

Usar imágenes almacenadas en el servidor local.

**Ventajas:**
- Sin costos adicionales
- Control total
- Rápido para desarrollo

**Cómo usar:**
1. Crea una carpeta `public/images/productos` en el frontend
2. Coloca las imágenes ahí
3. Usa rutas relativas como `/images/productos/nombre.jpg`

**Ejemplo:**
```typescript
await prisma.cat_imagenes_producto.create({
  data: {
    producto_id: productoId,
    url: '/images/productos/laptop.jpg',
    alt: 'Laptop HP',
    orden: 0
  }
});
```

### Opción 3: Placeholders (Actual)

El seed actual usa placeholders de via.placeholder.com.

**No recomendado para producción** - solo para desarrollo/pruebas.

## Implementación Actual

### Backend
- El modelo `cat_productos` tiene una relación `imagenes` con `cat_imagenes_producto`
- Al consultar productos, se incluyen las imágenes con `include: { imagenes: true }`

### Frontend
- Las cards de productos muestran la primera imagen: `producto.imagenes[0]?.url`
- Si no hay imágenes, muestra un icono SVG placeholder
- La vista de detalle permite navegar entre múltiples imágenes

## Agregar Imágenes a Productos

### Desde el Admin (Pendiente de implementar)

Actualmente no hay UI para agregar imágenes desde el admin. Para agregar imágenes manualmente:

1. **Usa Prisma Studio:**
   ```bash
   npm run db:studio
   ```
   Navega a la tabla `cat_imagenes_producto` y agrega registros.

2. **Usa script SQL directo:**
   ```sql
   INSERT INTO cat_imagenes_producto (producto_id, url, alt, orden)
   VALUES (1, 'https://tu-url.com/imagen.jpg', 'Descripción', 0);
   ```

3. **Usa el seed modificado:**
   Edita `backend/prisma/seed.ts` y agrega tus URLs de imágenes.

## Recomendaciones

1. **Para producción:** Usa Cloudinary o AWS S3
2. **Para desarrollo:** Usa la carpeta `public/images`
3. **Tamaño de imágenes:** Recomendado 800x800px para productos
4. **Formato:** WebP para mejor compresión, o JPEG/PNG
5. **Alt text:** Siempre incluye descripción para accesibilidad
6. **Orden:** Usa el campo `orden` para definir qué imagen aparece primero

## Próximos Pasos (Opcionales)

- Implementar UI en el admin para subir imágenes
- Integrar con Cloudinary SDK para upload directo
- Agregar crop/resize automático de imágenes
- Implementar galería de imágenes en el detalle
