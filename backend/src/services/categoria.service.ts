import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export const categoriaService = {
  async list() {
    const categorias = await prisma.cat_categorias.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        padre: {
          select: { id: true, nombre: true }
        }
      }
    });
    return categorias;
  },

  async getById(id: number) {
    const categoria = await prisma.cat_categorias.findFirst({
      where: { id, activo: true },
      include: {
        padre: true,
        hijos: {
          where: { activo: true }
        }
      }
    });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    return categoria;
  },

  async create(data: { nombre: string; slug?: string; padre_id?: number }) {
    const slug = data.slug || data.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const categoria = await prisma.cat_categorias.create({
      data: {
        nombre: data.nombre,
        slug,
        padre_id: data.padre_id
      }
    });

    return categoria;
  },

  async update(id: number, data: { nombre?: string; slug?: string; padre_id?: number; activo?: boolean }) {
    const categoriaExistente = await prisma.cat_categorias.findFirst({
      where: { id }
    });

    if (!categoriaExistente) {
      throw new AppError('Categoría no encontrada', 404);
    }

    const updateData: any = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.padre_id !== undefined) updateData.padre_id = data.padre_id;
    if (data.activo !== undefined) updateData.activo = data.activo;

    const categoria = await prisma.cat_categorias.update({
      where: { id },
      data: updateData
    });

    return categoria;
  },

  async delete(id: number) {
    const categoriaExistente = await prisma.cat_categorias.findFirst({
      where: { id }
    });

    if (!categoriaExistente) {
      throw new AppError('Categoría no encontrada', 404);
    }

    // Verificar si tiene productos asociados
    const productosCount = await prisma.cat_productos.count({
      where: { categoria_id: id }
    });

    if (productosCount > 0) {
      throw new AppError('No se puede eliminar la categoría porque tiene productos asociados', 400);
    }

    // Soft delete
    await prisma.cat_categorias.update({
      where: { id },
      data: { activo: false }
    });
  }
};
