import { prisma } from './src/config/prisma';

(async () => {
  const estados = await prisma.ord_estados_orden.findMany();
  console.log('=== ESTADOS ===');
  estados.forEach(e => console.log(`ID: ${e.id}, Nombre: ${e.nombre}`));
  
  const pendientes = await prisma.ord_ordenes.count({ where: { estado_id: 1 } });
  console.log(`\n=== ÓRDENES CON estado_id=1: ${pendientes}`);
  
  const ordenes = await prisma.ord_ordenes.findMany({ 
    select: { id: true, codigo: true, estado_id: true, estado: { select: { nombre: true } } },
    take: 5
  });
  console.log('\n=== PRIMERAS 5 ÓRDENES ===');
  ordenes.forEach(o => console.log(`#${o.codigo}: estado_id=${o.estado_id}, nombre=${o.estado?.nombre}`));
  
  process.exit(0);
})();
