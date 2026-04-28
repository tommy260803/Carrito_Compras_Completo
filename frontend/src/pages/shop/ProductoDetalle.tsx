import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopNavbar } from '../../components/ShopNavbar';
import { productoService } from '../../services/producto.service';
import { carritoService } from '../../services/carrito.service';
import toast from 'react-hot-toast';

interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio_venta: number;
  precio_oferta?: number;
  oferta_inicio?: string;
  oferta_fin?: string;
  categoria: { nombre: string };
  imagenes: Array<{ url: string; alt: string }>;
  stock?: { disponible: number };
  activo: boolean;
}

export const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [carritoCount, setCarritoCount] = useState(0);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);

  useEffect(() => {
    if (id) {
      cargarProducto(Number(id));
      cargarCarritoCount();
    }
  }, [id]);

  const cargarProducto = async (productoId: number) => {
    try {
      setLoading(true);
      const response = await productoService.getProducto(productoId);
      setProducto(response.data);
    } catch (error) {
      toast.error('Error al cargar el producto');
      console.error(error);
      navigate('/catalogo');
    } finally {
      setLoading(false);
    }
  };

  const cargarCarritoCount = async () => {
    try {
      const response = await carritoService.getCarrito();
      setCarritoCount(response.data?.items?.length || 0);
    } catch (error) {
      console.error('Error al cargar contador de carrito');
    }
  };

  const agregarAlCarrito = async () => {
    if (!producto) return;
    
    try {
      await carritoService.agregarItem({ producto_id: producto.id, cantidad });
      toast.success('Producto agregado al carrito');
      cargarCarritoCount();
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={carritoCount} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={carritoCount} />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const stockDisponible = producto.stock?.disponible ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={carritoCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <a href="/" className="text-blue-600 hover:text-blue-800">Inicio</a>
          <span className="mx-2 text-gray-400">/</span>
          <a href="/catalogo" className="text-blue-600 hover:text-blue-800">Catálogo</a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{producto.nombre}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imágenes */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {producto.imagenes.length > 0 ? (
                  <img
                    src={producto.imagenes[imagenPrincipal]?.url}
                    alt={producto.imagenes[imagenPrincipal]?.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {producto.imagenes.length > 1 && (
                <div className="flex space-x-2">
                  {producto.imagenes.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenPrincipal(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        imagenPrincipal === index ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-2">{producto.categoria.nombre}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
                <p className="text-gray-600">{producto.descripcion_corta}</p>
              </div>

              <div className="flex items-center space-x-4">
                {producto.precio_oferta && new Date() >= new Date(producto.oferta_inicio || '') && new Date() <= new Date(producto.oferta_fin || '') ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      ${Number(producto.precio_oferta).toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${Number(producto.precio_venta).toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Oferta
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    ${Number(producto.precio_venta).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stockDisponible > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {stockDisponible > 0 ? `Stock: ${stockDisponible} disponibles` : 'Agotado'}
                </span>
                <span className="text-sm text-gray-500">SKU: {producto.sku}</span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 whitespace-pre-line">{producto.descripcion_larga || producto.descripcion_corta}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-gray-700 font-medium">Cantidad:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                      disabled={cantidad >= stockDisponible}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-bold text-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={agregarAlCarrito}
                  disabled={stockDisponible === 0}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{stockDisponible === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <a href="/catalogo" className="text-blue-600 hover:text-blue-800 font-medium">
                  ← Volver al catálogo
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
