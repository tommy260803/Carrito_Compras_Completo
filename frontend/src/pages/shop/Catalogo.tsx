import React, { useEffect, useState } from 'react';
import { ShopNavbar } from '../../components/ShopNavbar';
import { productoService } from '../../services/producto.service';
import { carritoService } from '../../services/carrito.service';
import toast from 'react-hot-toast';

interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion_corta: string;
  precio_venta: number;
  categoria: { nombre: string };
  imagenes: Array<{ url: string; alt: string }>;
  stock?: { disponible: number };
}

interface CantidadEnCarrito {
  [productoId: number]: number;
}

interface ItemIdEnCarrito {
  [productoId: number]: number;
}

export const Catalogo: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [carritoCount, setCarritoCount] = useState(0);
  const [cantidadesEnCarrito, setCantidadesEnCarrito] = useState<CantidadEnCarrito>({});
  const [itemIdsEnCarrito, setItemIdsEnCarrito] = useState<ItemIdEnCarrito>({});
  const [actualizandoProducto, setActualizandoProducto] = useState<Record<number, boolean>>({});

  useEffect(() => {
    cargarProductos();
  }, [categoriaSeleccionada]);

  useEffect(() => {
    cargarCantidadesCarrito();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const params = categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {};
      const response = await productoService.getProductos(params);
      setProductos(response.data.productos);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCantidadesCarrito = async () => {
    try {
      const response = await carritoService.getCarrito();
      const items = response.data?.items || [];
      const cantidades: CantidadEnCarrito = {};
      const itemIds: ItemIdEnCarrito = {};
      items.forEach((item: any) => {
        cantidades[item.producto.id] = item.cantidad;
        itemIds[item.producto.id] = item.id;
      });
      setCantidadesEnCarrito(cantidades);
      setItemIdsEnCarrito(itemIds);
      setCarritoCount(items.length);
    } catch (error) {
      console.error('Error al cargar cantidades del carrito');
    }
  };

  const agregarAlCarrito = async (productoId: number) => {
    if (actualizandoProducto[productoId]) return;

    const itemIdExistente = itemIdsEnCarrito[productoId];
    const cantidadPrev = cantidadesEnCarrito[productoId] || 0;
    const cantidadNueva = cantidadPrev + 1;

    setActualizandoProducto((prev) => ({ ...prev, [productoId]: true }));
    setCantidadesEnCarrito((prev) => ({ ...prev, [productoId]: cantidadNueva }));
    if (cantidadPrev === 0) {
      setCarritoCount((prev) => prev + 1);
    }

    try {
      if (itemIdExistente) {
        await carritoService.actualizarItem(itemIdExistente, { cantidad: cantidadNueva });
      } else {
        const response = await carritoService.agregarItem({ producto_id: productoId, cantidad: 1 });
        const nuevoItemId = response?.data?.id;
        if (nuevoItemId) {
          setItemIdsEnCarrito((prev) => ({ ...prev, [productoId]: nuevoItemId }));
        }
      }
    } catch (error) {
      setCantidadesEnCarrito((prev) => ({ ...prev, [productoId]: cantidadPrev }));
      if (cantidadPrev === 0) {
        setCarritoCount((prev) => Math.max(prev - 1, 0));
      }
      toast.error('Error al agregar al carrito');
      console.error(error);
    } finally {
      setActualizandoProducto((prev) => ({ ...prev, [productoId]: false }));
    }
  };

  const actualizarCantidadEnCarrito = async (productoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 0 || actualizandoProducto[productoId]) return;

    const itemId = itemIdsEnCarrito[productoId];
    const cantidadPrev = cantidadesEnCarrito[productoId] || 0;

    if (!itemId && nuevaCantidad === 0) return;

    setActualizandoProducto((prev) => ({ ...prev, [productoId]: true }));
    setCantidadesEnCarrito((prev) => ({ ...prev, [productoId]: nuevaCantidad }));
    if (cantidadPrev > 0 && nuevaCantidad === 0) {
      setCarritoCount((prev) => Math.max(prev - 1, 0));
    }
    if (cantidadPrev === 0 && nuevaCantidad > 0) {
      setCarritoCount((prev) => prev + 1);
    }
    
    try {
      if (itemId) {
        if (nuevaCantidad === 0) {
          await carritoService.eliminarItem(itemId);
          setItemIdsEnCarrito((prev) => {
            const copy = { ...prev };
            delete copy[productoId];
            return copy;
          });
        } else {
          await carritoService.actualizarItem(itemId, { cantidad: nuevaCantidad });
        }
      } else if (nuevaCantidad > 0) {
        const response = await carritoService.agregarItem({ producto_id: productoId, cantidad: nuevaCantidad });
        const nuevoItemId = response?.data?.id;
        if (nuevoItemId) {
          setItemIdsEnCarrito((prev) => ({ ...prev, [productoId]: nuevoItemId }));
        }
      }
    } catch (error) {
      setCantidadesEnCarrito((prev) => ({ ...prev, [productoId]: cantidadPrev }));
      if (cantidadPrev > 0 && nuevaCantidad === 0) {
        setCarritoCount((prev) => prev + 1);
      }
      if (cantidadPrev === 0 && nuevaCantidad > 0) {
        setCarritoCount((prev) => Math.max(prev - 1, 0));
      }
      toast.error('Error al actualizar cantidad');
      console.error(error);
    } finally {
      setActualizandoProducto((prev) => ({ ...prev, [productoId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={carritoCount} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={carritoCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
          <p className="text-gray-600">Descubre nuestra selección de productos</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                categoriaSeleccionada === null 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setCategoriaSeleccionada(1)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                categoriaSeleccionada === 1 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Electrónica
            </button>
            <button 
              onClick={() => setCategoriaSeleccionada(2)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                categoriaSeleccionada === 2 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Ropa
            </button>
            <button 
              onClick={() => setCategoriaSeleccionada(3)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                categoriaSeleccionada === 3 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Hogar
            </button>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => {
              const cantidadEnCarrito = cantidadesEnCarrito[producto.id] || 0;
              const stockDisponible = producto.stock?.disponible ?? 0;
              
              return (
                <div key={producto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Imagen */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                    {producto.imagenes.length > 0 ? (
                      <img 
                        src={producto.imagenes[0].url} 
                        alt={producto.imagenes[0].alt}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {stockDisponible === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Agotado
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <a href={`/producto/${producto.id}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {producto.nombre}
                      </h3>
                    </a>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion_corta}</p>
                    <p className="text-xs text-gray-500 mb-3">{producto.categoria.nombre}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${Number(producto.precio_venta).toFixed(2)}
                      </span>
                      {stockDisponible > 0 && (
                        <span className="text-sm text-gray-500">
                          Stock: {stockDisponible}
                        </span>
                      )}
                    </div>

                    {/* Controles de cantidad */}
                    {stockDisponible === 0 ? (
                      <button 
                        disabled
                        className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                      >
                        Agotado
                      </button>
                    ) : cantidadEnCarrito > 0 ? (
                      <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                        <button 
                          onClick={() => actualizarCantidadEnCarrito(producto.id, cantidadEnCarrito - 1)}
                          disabled={actualizandoProducto[producto.id]}
                          className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-12 text-center">
                          {cantidadEnCarrito}
                        </span>
                        <button 
                          onClick={() => actualizarCantidadEnCarrito(producto.id, cantidadEnCarrito + 1)}
                          disabled={cantidadEnCarrito >= stockDisponible || actualizandoProducto[producto.id]}
                          className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => agregarAlCarrito(producto.id)}
                        disabled={actualizandoProducto[producto.id]}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Agregar al Carrito</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};