import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Crear roles
  const rolAdmin = await prisma.seg_roles.upsert({
    where: { nombre: 'administrador' },
    update: {},
    create: {
      nombre: 'administrador',
      descripcion: 'Administrador del sistema'
    }
  });

  const rolCliente = await prisma.seg_roles.upsert({
    where: { nombre: 'cliente' },
    update: {},
    create: {
      nombre: 'cliente',
      descripcion: 'Cliente del e-commerce'
    }
  });

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.seg_usuarios.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password_hash: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol_id: rolAdmin.id
    }
  });

  const clienteUser = await prisma.seg_usuarios.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      password_hash: hashedPassword,
      nombre: 'Juan',
      apellido: 'Pérez',
      rol_id: rolCliente.id
    }
  });

  // Crear categorías
  const catElectronica = await prisma.cat_categorias.upsert({
    where: { slug: 'electronica' },
    update: {},
    create: {
      nombre: 'Electrónica',
      slug: 'electronica'
    }
  });

  const catRopa = await prisma.cat_categorias.upsert({
    where: { slug: 'ropa' },
    update: {},
    create: {
      nombre: 'Ropa',
      slug: 'ropa'
    }
  });

  const catHogar = await prisma.cat_categorias.upsert({
    where: { slug: 'hogar' },
    update: {},
    create: {
      nombre: 'Hogar',
      slug: 'hogar'
    }
  });

  // Crear marcas
  const marcaSony = await prisma.cat_marcas.upsert({
    where: { nombre: 'Sony' },
    update: {},
    create: {
      nombre: 'Sony'
    }
  });

  const marcaNike = await prisma.cat_marcas.upsert({
    where: { nombre: 'Nike' },
    update: {},
    create: {
      nombre: 'Nike'
    }
  });

  // Crear productos
  const productos = [
    {
      sku: 'LAP001',
      nombre: 'Laptop Sony Vaio 15"',
      descripcion_corta: 'Laptop de alto rendimiento',
      descripcion_larga: 'Laptop Sony Vaio con procesador Intel i7, 16GB RAM, 512GB SSD',
      categoria_id: catElectronica.id,
      marca_id: marcaSony.id,
      precio_costo: 800,
      precio_venta: 1200,
      stock_minimo: 5,
      stock: 25,
      imagen_url: 'https://m.media-amazon.com/images/I/31Z6g+eCEZL._AC_UF1000,1000_QL80_.jpg' // Reemplaza con tu URL
    },
    {
      sku: 'ZAP001',
      nombre: 'Zapatillas Nike Air Max',
      descripcion_corta: 'Zapatillas deportivas cómodas',
      descripcion_larga: 'Zapatillas Nike Air Max con tecnología de amortiguación',
      categoria_id: catRopa.id,
      marca_id: marcaNike.id,
      precio_costo: 60,
      precio_venta: 100,
      stock_minimo: 10,
      stock: 50,
      imagen_url: 'https://www.nike.com.pe/on/demandware.static/-/Sites-catalog-equinox/default/dw54c68f50/images/hi-res/197596413915_1_20240819-mrtPeru.jpg' // Reemplaza con tu URL
    },
    {
      sku: 'LAMP001',
      nombre: 'Lámpara LED Moderna',
      descripcion_corta: 'Lámpara de diseño moderno',
      descripcion_larga: 'Lámpara LED con luz regulable y diseño minimalista',
      categoria_id: catHogar.id,
      precio_costo: 30,
      precio_venta: 60,
      stock_minimo: 8,
      stock: 30,
      imagen_url: 'https://m.media-amazon.com/images/I/61G+PVE-40L._AC_UF894,1000_QL80_.jpg' // Reemplaza con tu URL
    }
  ];

  for (const productoData of productos) {
    const { stock, imagen_url, ...productoSinStock } = productoData;
    const producto = await prisma.cat_productos.upsert({
      where: { sku: productoData.sku },
      update: {},
      create: {
        ...productoSinStock,
        created_by: adminUser.id,
        updated_by: adminUser.id
      }
    });

    // Crear stock
    await prisma.inv_stock_producto.upsert({
      where: { producto_id: producto.id },
      update: {
        cantidad: productoData.stock,
        disponible: productoData.stock
      },
      create: {
        producto_id: producto.id,
        cantidad: productoData.stock,
        disponible: productoData.stock
      }
    });

    // Crear imagen específica para cada producto
    await prisma.cat_imagenes_producto.create({
      data: {
        producto_id: producto.id,
        url: imagen_url || `https://via.placeholder.com/400x300?text=${encodeURIComponent(productoData.nombre)}`,
        alt: productoData.nombre,
        orden: 0
      }
    });
  }

  // Crear cliente para el usuario cliente
  let cliente = await prisma.cli_clientes.findFirst({
    where: { email: 'cliente@ejemplo.com' }
  });
  
  if (!cliente) {
    cliente = await prisma.cli_clientes.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'cliente@ejemplo.com',
        telefono: '123456789',
        password_hash: hashedPassword
      }
    });
  }

  // Crear dirección para el cliente
  await prisma.cli_direcciones.create({
    data: {
      cliente_id: cliente.id,
      nombre: 'Dirección Principal',
      direccion: 'Calle Principal #123',
      ciudad: 'Ciudad Ejemplo',
      provincia: 'Provincia Ejemplo',
      codigo_postal: '12345',
      es_principal: true
    }
  });

  // Crear estados de orden mínimos (si no existen)
  const estados = [
    { id: 1, nombre: 'pendiente_pago', descripcion: 'Pendiente de pago' },
    { id: 2, nombre: 'pagada', descripcion: 'Pago confirmado' },
    { id: 3, nombre: 'en_proceso', descripcion: 'Preparando pedido' },
    { id: 4, nombre: 'enviada', descripcion: 'En tránsito' },
    { id: 5, nombre: 'entregada', descripcion: 'Entregada' },
    { id: 6, nombre: 'cancelada', descripcion: 'Cancelada' },
  ];

  for (const e of estados) {
    await prisma.ord_estados_orden.upsert({
      where: { id: e.id },
      update: { nombre: e.nombre, descripcion: e.descripcion },
      create: { id: e.id, nombre: e.nombre, descripcion: e.descripcion },
    });
  }

  // Obtener productos creados
  const productosCreados = await prisma.cat_productos.findMany();
  
  // Crear órdenes históricas para los gráficos
  const estadosOrden = [2, 3, 4, 5]; // pagada, en_proceso, enviada, entregada
  const metodosPago = ['tarjeta', 'transferencia', 'efectivo'];
  
  for (let i = 0; i < 30; i++) {
    // Seleccionar productos aleatorios
    const productosOrden = productosCreados
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const total = productosOrden.reduce((sum, p) => sum + Number(p.precio_venta), 0);
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días
    
    // Crear orden
    const orden = await prisma.ord_ordenes.create({
      data: {
        cliente_id: cliente.id,
        direccion_envio_id: (await prisma.cli_direcciones.findFirst({ where: { cliente_id: cliente.id } }))!.id,
        estado_id: estadosOrden[Math.floor(Math.random() * estadosOrden.length)],
        codigo: `ORD-${Date.now()}-${i}`,
        subtotal: total,
        impuestos: total * 0.16,
        total: total * 1.16,
        fecha_orden: fecha,
        created_at: fecha,
        updated_at: fecha
      }
    });
    
    // Crear items de la orden
    for (const producto of productosOrden) {
      await prisma.ord_items_orden.create({
        data: {
          orden_id: orden.id,
          producto_id: producto.id,
          cantidad: Math.floor(Math.random() * 3) + 1,
          precio_unitario: Number(producto.precio_venta),
          subtotal: Number(producto.precio_venta) * (Math.floor(Math.random() * 3) + 1)
        }
      });
    }
    
    // Crear pago
    await prisma.pag_pagos.create({
      data: {
        orden_id: orden.id,
        metodo: metodosPago[Math.floor(Math.random() * metodosPago.length)],
        monto: orden.total,
        estado: 'pagado',
        referencia: `REF-${Date.now()}-${i}`,
        transaccion_id: `TXN-${Date.now()}-${i}`,
        created_at: fecha
      }
    });
  }

  console.log('✅ Seed completado exitosamente!');
  console.log('👤 Admin: admin@ecommerce.com / password123');
  console.log('👤 Cliente: cliente@ejemplo.com / password123');
  console.log('📊 Se crearon 30 órdenes históricas para los gráficos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });