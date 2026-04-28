import React, { useEffect, useState } from 'react';
import { ShopNavbar } from '../../components/ShopNavbar';
import { EstadoBadge } from '../../components/EstadoBadge';
import toast from 'react-hot-toast';
import { ordenService } from '../../services/orden.service';

export const MisOrdenes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await ordenService.misOrdenes();
        setOrdenes(res.data);
      } catch (e) {
        toast.error('No se pudieron cargar tus órdenes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={0} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Órdenes</h1>
          <p className="text-gray-600">Revisa el historial de tus compras</p>
        </div>

        {ordenes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">Aún no tienes órdenes</p>
            <a href="/catalogo" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Ir al Catálogo
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map((o) => {
              const totalItems = o.items?.reduce((sum: number, item: any) => sum + item.cantidad, 0) || 0;
              const productosResumen = o.items?.slice(0, 2).map((item: any) => item.producto?.nombre || `Producto ${item.producto_id}`).join(', ');
              const masProductos = (o.items?.length || 0) > 2;

              return (
                <a
                  key={o.id}
                  href={`/mis-ordenes/${o.id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Orden #{o.codigo}</h3>
                        <EstadoBadge estado={o.estado} />
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {o.fecha_orden ? new Date(o.fecha_orden).toLocaleString() : ''}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Productos:</span>
                          <span className="ml-1 font-medium text-gray-900">{totalItems} items</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Método de pago:</span>
                          <span className="ml-1 font-medium text-gray-900 capitalize">{o.metodo_pago || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700">
                        <span className="text-gray-500">Productos:</span>
                        <span className="ml-1">{productosResumen}</span>
                        {masProductos && <span className="ml-1 text-gray-500">+{o.items.length - 2} más</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">${Number(o.total).toFixed(2)}</div>
                      <div className="text-sm text-gray-500 mt-1">Total pagado</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

