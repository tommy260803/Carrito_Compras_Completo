import { prisma } from './src/config/prisma';

(async () => {
  // Eliminar todas las imágenes
  await prisma.cat_imagenes_producto.deleteMany({});
  console.log('✅ Imágenes eliminadas');

  // Crear solo las imágenes correctas (una por producto)
  const imagenes = [
    { sku: 'LAP001', url: 'https://m.media-amazon.com/images/I/31Z6g+eCEZL._AC_UF1000,1000_QL80_.jpg', alt: 'Laptop Sony Vaio 15"' },
    { sku: 'ZAP001', url: 'https://www.nike.com.pe/on/demandware.static/-/Sites-catalog-equinox/default/dw54c68f50/images/hi-res/197596413915_1_20240819-mrtPeru.jpg', alt: 'Zapatillas Nike Air Max' },
    { sku: 'LAMP001', url: 'https://m.media-amazon.com/images/I/61G+PVE-40L._AC_UF894,1000_QL80_.jpg', alt: 'Lámpara LED Moderna' }
  ];

  for (const img of imagenes) {
    const producto = await prisma.cat_productos.findFirst({
      where: { sku: img.sku }
    });

    if (producto) {
      await prisma.cat_imagenes_producto.create({
        data: {
          producto_id: producto.id,
          url: img.url,
          alt: img.alt,
          orden: 0
        }
      });
      console.log(`✅ Imagen creada para ${img.alt}`);
    }
  }

  process.exit(0);
})();
