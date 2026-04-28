import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export const productoService = {
  async list({ page, limit, filters }: { page: number; limit: number; filters: any }) {
    const skip = (page - 1) * limit;
    
    const where: any = { activo: true };
    
    if (filters?.categoria) {
      where.categoria_id = Number(filters.categoria);
    }
    
    if (filters?.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { descripcion_corta: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [productos, total] = await Promise.all([
      prisma.cat_productos.findMany({
        where,
        include: {
          categoria: true,
          marca: true,
          unidad_medida: true,
          imagenes: true,
          stock: true
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.cat_productos.count({ where })
    ]);

    return {
      productos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async getById(id: number) {
    const producto = await prisma.cat_productos.findFirst({
      where: { id, activo: true },
      include: {
        categoria: true,
        marca: true,
        unidad_medida: true,
        imagenes: true,
        stock: true,
        atributos: true
      }
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    return producto;
  },

  async create(data: any, userId: number) {
    // Extraer stock para manejarlo por separado
    const { stock, stock_minimo, ...productoData } = data;

    // Generar SKU automáticamente si no se proporciona
    let sku = productoData.sku;
    if (!sku) {
      const categoria = await prisma.cat_categorias.findUnique({
        where: { id: productoData.categoria_id }
      });
      const prefix = categoria ? categoria.nombre.substring(0, 3).toUpperCase() : 'PRD';
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      sku = `${prefix}-${random}`;
    }

    const producto = await prisma.cat_productos.create({
      data: {
        ...productoData,
        sku,
        stock_minimo: stock_minimo || 0,
        created_by: userId,
        updated_by: userId
      },
      include: {
        categoria: true,
        marca: true,
        unidad_medida: true
      }
    });

    // Crear registro de stock (usar upsert para evitar duplicados)
    await prisma.inv_stock_producto.upsert({
      where: { producto_id: producto.id },
      update: {
        cantidad: stock || 0,
        disponible: stock || 0
      },
      create: {
        producto_id: producto.id,
        cantidad: stock || 0,
        disponible: stock || 0
      }
    });

    return producto;
  },

  async update(id: number, data: any, userId: number) {
    const productoExistente = await prisma.cat_productos.findFirst({
      where: { id, activo: true }
    });

    if (!productoExistente) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Extraer stock para manejarlo por separado
    const { stock, stock_minimo, ...productoData } = data;

    const producto = await prisma.cat_productos.update({
      where: { id },
      data: {
        ...productoData,
        stock_minimo: stock_minimo !== undefined ? stock_minimo : undefined,
        updated_by: userId
      },
      include: {
        categoria: true,
        marca: true,
        unidad_medida: true
      }
    });

    // Actualizar stock si se proporciona
    if (stock !== undefined) {
      await prisma.inv_stock_producto.upsert({
        where: { producto_id: producto.id },
        update: {
          cantidad: stock,
          disponible: stock
        },
        create: {
          producto_id: producto.id,
          cantidad: stock,
          disponible: stock
        }
      });
    }

    return producto;
  },

  async delete(id: number, userId: number) {
    const productoExistente = await prisma.cat_productos.findFirst({
      where: { id, activo: true }
    });

    if (!productoExistente) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Soft delete
    await prisma.cat_productos.update({
      where: { id },
      data: {
        activo: false,
        updated_by: userId
      }
    });
  }
};