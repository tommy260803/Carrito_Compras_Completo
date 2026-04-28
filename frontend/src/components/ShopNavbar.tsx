import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ShopNavbarProps {
  carritoCount?: number;
}

export const ShopNavbar: React.FC<ShopNavbarProps> = ({ carritoCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">MiTienda</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Inicio
            </a>
            <a href="/catalogo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Catálogo
            </a>
            <a href="/mis-ordenes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Mis Órdenes
            </a>
            <a href="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Lista de Deseos
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <a href="/carrito" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {carritoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {carritoCount}
                </span>
              )}
            </a>

            {/* User */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.nombre || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 border-t">
        <div className="flex space-x-4">
          <a href="/" className="text-gray-700 hover:text-blue-600">Inicio</a>
          <a href="/catalogo" className="text-gray-700 hover:text-blue-600">Catálogo</a>
          <a href="/mis-ordenes" className="text-gray-700 hover:text-blue-600">Órdenes</a>
        </div>
      </div>
    </nav>
  );
};
