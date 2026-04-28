import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:4000/api/v1';

export const Wishlist: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
      });
      const json = await res.json();
      const productos = json.data?.productos ?? [];
      setItems(productos);
    } catch (e) {
      toast.error('No se pudo cargar la wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const quitar = async (productoId: number) => {
    try {
      await fetch(`${API_URL}/wishlist/items/${productoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
      });
      toast.success('Eliminado de wishlist');
      cargar();
    } catch (e) {
      toast.error('No se pudo eliminar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
            <nav className="flex space-x-8">
              <a href="/catalogo" className="text-gray-700 hover:text-blue-600">Catálogo</a>
              <a href="/carrito" className="text-gray-700 hover:text-blue-600">Carrito</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Tu wishlist está vacía.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {items.map((it) => {
              const p = it.producto;
              return (
                <div key={it.id} className="flex items-center justify-between border rounded p-4">
                  <div>
                    <div className="font-semibold">{p?.nombre ?? 'Producto'}</div>
                    <div className="text-sm text-gray-600">{p?.categoria?.nombre ?? ''}</div>
                  </div>
                  <button className="text-red-600 hover:text-red-800" onClick={() => quitar(p.id)}>
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

