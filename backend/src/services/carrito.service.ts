import { prisma } from '../config/prisma';
import { agregarItemDto, actualizarItemDto } from '../schemas/carrito.schema';

export const carritoService = {
  async obtenerCarrito(clienteId: number) {
    let carrito = await prisma.ord_carritos.findFirst({
      where: { cliente_id: clienteId, activo: true },
      include: {
        items: {
          orderBy: {
            id: 'asc',
          },
          include: {
            producto: {
              include: {
                imagenes: true,
                categoria: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!carrito) {
      carrito = await prisma.ord_carritos.create({
        data: { cliente_id: clienteId },
        include: {
          items: {
            include: {
              producto: {
                include: {
                  imagenes: true,
                  categoria: true,
                  stock: true,
                },
              },
            },
          },
        },
      });
    }

    return carrito;
  },

  async agregarItem(clienteId: number, data: agregarItemDto) {
    const carrito = await this.obtenerCarrito(clienteId);
    
    const itemExistente = await prisma.ord_items_carrito.findFirst({
      where: {
        carrito_id: carrito.id,
        producto_id: data.producto_id,
      },
    });

    if (itemExistente) {
      return await prisma.ord_items_carrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + data.cantidad },
        include: {
          producto: {
            include: {
              imagenes: true,
              categoria: true,
            },
          },
        },
      });
    }

    return await prisma.ord_items_carrito.create({
      data: {
        carrito_id: carrito.id,
        producto_id: data.producto_id,
        cantidad: data.cantidad,
      },
      include: {
        producto: {
          include: {
            imagenes: true,
            categoria: true,
          },
        },
      },
    });
  },

  async actualizarItem(itemId: number, data: actualizarItemDto) {
    return await prisma.ord_items_carrito.update({
      where: { id: itemId },
      data: { cantidad: data.cantidad },
      include: {
        producto: {
          include: {
            imagenes: true,
            categoria: true,
          },
        },
      },
    });
  },

  async eliminarItem(itemId: number) {
    await prisma.ord_items_carrito.delete({
      where: { id: itemId },
    });
  },

  async vaciarCarrito(clienteId: number) {
    const carrito = await this.obtenerCarrito(clienteId);
    await prisma.ord_items_carrito.deleteMany({
      where: { carrito_id: carrito.id },
    });
  },
};