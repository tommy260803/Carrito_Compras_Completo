import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopNavbar } from '../../components/ShopNavbar';
import { EstadoBadge } from '../../components/EstadoBadge';
import toast from 'react-hot-toast';
import { ordenService } from '../../services/orden.service';
import { pagoService } from '../../services/pago.service';

export const DetalleOrden: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState<any>(null);
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const o = await ordenService.detalleMiOrden(id);
        setOrden(o.data);
        const p = await pagoService.pagosDeOrden(id);
        setPagos(p.data);
      } catch (e) {
        toast.error('No se pudo cargar el detalle de la orden');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={0} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando orden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={0} />
        <div className="flex items-center justify-center py-20 text-gray-600">
          Orden no encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a href="/mis-ordenes" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Mis Órdenes
          </a>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orden #{orden.codigo}</h1>
          <p className="text-gray-600">
            {orden.fecha_orden ? new Date(orden.fecha_orden).toLocaleString() : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la orden */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Información de la Orden</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Estado</div>
                  <EstadoBadge estado={orden.estado} />
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Método de Pago</div>
                  <div className="font-semibold text-gray-900 capitalize">{orden.metodo_pago || 'N/A'}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Subtotal</div>
                  <div className="font-semibold text-gray-900">${Number(orden.subtotal).toFixed(2)}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Impuestos</div>
                  <div className="font-semibold text-gray-900">${Number(orden.impuestos).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Items de la orden */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Productos</h2>
              <div className="space-y-4">
                {orden.items?.map((it: any) => (
                  <div key={it.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {it.producto?.nombre ?? `Producto ${it.producto_id}`}
                        </h3>
                        <div className="text-sm text-gray-600 mb-2">
                          Cantidad: {it.cantidad} × ${Number(it.precio_unitario).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          ${Number(it.subtotal).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Subtotal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirección de envío */}
            {orden.direccion_envio && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
                <div className="text-gray-700">
                  <p className="font-semibold">{orden.direccion_envio.nombre}</p>
                  <p>{orden.direccion_envio.direccion}</p>
                  <p>{orden.direccion_envio.ciudad}, {orden.direccion_envio.provincia}</p>
                  <p>{orden.direccion_envio.codigo_postal}</p>
                  {orden.direccion_envio.telefono && <p>Tel: {orden.direccion_envio.telefono}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Resumen */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${Number(orden.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="font-medium">${Number(orden.impuestos).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${Number(orden.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pagos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Pagos</h2>
              {pagos.length === 0 ? (
                <div className="text-gray-500 text-sm">Sin pagos registrados.</div>
              ) : (
                <div className="space-y-3">
                  {pagos.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <EstadoBadge estado={p.estado} />
                        <span className="font-bold text-gray-900">${Number(p.monto).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {p.metodo && <div>Método: {p.metodo}</div>}
                        {p.created_at && (
                          <div>{new Date(p.created_at).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historial de estados */}
            {orden.historial_estados && orden.historial_estados.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Historial de Estados</h2>
                <div className="space-y-3">
                  {orden.historial_estados.map((h: any, index: number) => (
                    <div key={h.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        {index < orden.historial_estados.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <EstadoBadge estado={h.estado} />
                          <span className="text-sm text-gray-500">
                            {h.fecha ? new Date(h.fecha).toLocaleString() : ''}
                          </span>
                        </div>
                        {h.notas && <p className="text-sm text-gray-600">{h.notas}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

