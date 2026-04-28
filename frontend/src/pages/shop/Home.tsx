import React, { useEffect, useState } from 'react';
import { ShopNavbar } from '../../components/ShopNavbar';
import { carritoService } from '../../services/carrito.service';

export const Home: React.FC = () => {
  const [carritoCount, setCarritoCount] = useState(0);

  useEffect(() => {
    cargarCarritoCount();
  }, []);

  const cargarCarritoCount = async () => {
    try {
      const response = await carritoService.getCarrito();
      setCarritoCount(response.data?.items?.length || 0);
    } catch (error) {
      console.error('Error al cargar contador de carrito');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={carritoCount} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Bienvenido a MiTienda
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Descubre nuestros productos de alta calidad y disfruta de la mejor experiencia de compra online
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/catalogo" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Ver Catálogo
              </a>
              <a 
                href="/carrito" 
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border-2 border-white"
              >
                Mi Carrito
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Gran Variedad</h3>
            <p className="text-gray-600 text-center">Productos de alta calidad para todas tus necesidades</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Envío Rápido</h3>
            <p className="text-gray-600 text-center">Recibe tus pedidos en tiempo récord</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Pago Seguro</h3>
            <p className="text-gray-600 text-center">Transacciones protegidas y confiables</p>
          </div>
        </div>
      </div>
    </div>
  );
};