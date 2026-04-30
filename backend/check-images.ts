import { prisma } from './src/config/prisma';

(async () => {
  const imgs = await prisma.cat_imagenes_producto.findMany({
    include: { producto: { select: { nombre: true } } }
  });
  
  imgs.forEach(i => {
    console.log(`${i.producto.nombre}: ${i.url}`);
  });
  
  process.exit(0);
})();
