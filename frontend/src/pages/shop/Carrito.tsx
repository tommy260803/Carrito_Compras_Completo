import React, { useEffect, useState } from 'react';
import { ShopNavbar } from '../../components/ShopNavbar';
import { carritoService } from '../../services/carrito.service';
import toast from 'react-hot-toast';

interface CarritoItem {
  id: number;
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    descripcion_corta: string;
    precio_venta: number;
    categoria: { nombre: string };
    imagenes: Array<{ url: string; alt: string }>;
    stock?: { disponible: number };
  };
}

interface Carrito {
  id: number;
  items: CarritoItem[];
}

export const Carrito: React.FC = () => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const response = await carritoService.getCarrito();
      setCarrito(response.data);
    } catch (error) {
      toast.error('Error al cargar el carrito');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (itemId: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    
    try {
      await carritoService.actualizarItem(itemId, { cantidad: nuevaCantidad });
      toast.success('Cantidad actualizada');
      cargarCarrito();
    } catch (error) {
      toast.error('Error al actualizar cantidad');
      console.error(error);
    }
  };

  const eliminarItem = async (itemId: number) => {
    try {
      await carritoService.eliminarItem(itemId);
      toast.success('Producto eliminado del carrito');
      cargarCarrito();
    } catch (error) {
      toast.error('Error al eliminar producto');
      console.error(error);
    }
  };

  const calcularTotal = () => {
    if (!carrito) return 0;
    return carrito.items.reduce((total, item) => total + (Number(item.producto.precio_venta) * item.cantidad), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={carrito?.items?.length || 0} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={carrito?.items?.length || 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Carrito</h1>
          <p className="text-gray-600">Revisa tus productos antes de proceder al pago</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {!carrito || carrito.items.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
              <a href="/catalogo" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Ir al Catálogo
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {carrito.items.map((item) => {
                  const stockDisponible = item.producto.stock?.disponible ?? 0;
                  const subtotal = Number(item.producto.precio_venta) * item.cantidad;
                  
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg hover:border-blue-300 transition-colors overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Imagen */}
                        <div className="w-full sm:w-32 h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                          {item.producto.imagenes.length > 0 ? (
                            <img 
                              src={item.producto.imagenes[0].url} 
                              alt={item.producto.imagenes[0].alt}
                              className="w-full h-full object-contain object-center"
                            />
                          ) : (
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.producto.nombre}</h3>
                              <p className="text-sm text-blue-600 font-medium mb-2">{item.producto.categoria.nombre}</p>
                              <p className="text-gray-600 text-sm mb-3">{item.producto.descripcion_corta}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Precio unitario:</span>
                                  <span className="ml-1 font-semibold text-gray-900">${Number(item.producto.precio_venta).toFixed(2)}</span>
                                </div>
                                {stockDisponible > 0 && (
                                  <div>
                                    <span className="text-gray-500">Stock disponible:</span>
                                    <span className="ml-1 font-semibold text-gray-900">{stockDisponible}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Controles y subtotal */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                  className="w-9 h-9 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-bold text-gray-700"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center text-lg font-semibold">{item.cantidad}</span>
                                <button 
                                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                  disabled={item.cantidad >= stockDisponible}
                                  className="w-9 h-9 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-bold text-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="text-xl font-bold text-blue-600">${subtotal.toFixed(2)}</p>
                              </div>

                              <button 
                                onClick={() => eliminarItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${calcularTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <a href="/catalogo" className="flex-1 text-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Seguir Comprando
                  </a>
                  <a href="/checkout" className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Proceder al Pago
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};