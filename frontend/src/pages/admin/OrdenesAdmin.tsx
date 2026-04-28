import React, { useEffect, useMemo, useState } from 'react';
import { EstadoBadge } from '../../components/EstadoBadge';
import toast from 'react-hot-toast';
import { adminOrdenService } from '../../services/adminOrden.service';
import { reportesService } from '../../services/reportes.service';

export const OrdenesAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number } | null>(null);
  const [estados, setEstados] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estadoId, setEstadoId] = useState<number | ''>('');
  const [descargando, setDescargando] = useState(false);

  const pages = useMemo(() => {
    if (!pagination) return 1;
    return Math.max(1, Math.ceil(pagination.total / pagination.limit));
  }, [pagination]);

  const cargar = async () => {
    try {
      setLoading(true);
      const [e, o] = await Promise.all([
        adminOrdenService.estados(),
        adminOrdenService.listar({ page, limit: 20, search: search || undefined, estado_id: estadoId === '' ? undefined : estadoId }),
      ]);
      setEstados(e.data);
      setOrdenes(o.data.ordenes);
      setPagination(o.data.pagination);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const cargarDetalle = async (id: number) => {
    try {
      const res = await adminOrdenService.obtener(id);
      setDetalle(res.data);
      setSelectedId(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo cargar el detalle');
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    await cargar();
  };

  const onFiltrarEstado = async (value: string) => {
    setEstadoId(value ? Number(value) : '');
    setPage(1);
    await cargar();
  };

  const onCambiarEstado = async (nuevoEstadoId: number) => {
    if (!selectedId) return;
    try {
      await adminOrdenService.cambiarEstado(selectedId, { estado_id: nuevoEstadoId });
      toast.success('Estado actualizado');
      await cargarDetalle(selectedId);
      await cargar();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo cambiar el estado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Órdenes</h2>
        <button
          className="btn-primary btn-lg"
          onClick={async () => {
            try {
              setDescargando(true);
              await reportesService.descargarOrdenesPDF();
              toast.success('Reporte descargado exitosamente');
            } catch (e) {
              toast.error('Error al descargar el reporte');
            } finally {
              setDescargando(false);
            }
          }}
          disabled={descargando}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          {descargando ? 'Descargando...' : 'Descargar PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="card-body">
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={onBuscar}>
                <input
                  className="flex-1 form-input"
                  placeholder="Buscar por código o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="form-select"
                  value={estadoId === '' ? '' : String(estadoId)}
                  onChange={(e) => onFiltrarEstado(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  {estados.map((es) => (
                    <option key={es.id} value={String(es.id)}>
                      {es.nombre}
                    </option>
                  ))}
                </select>
                <button className="btn-primary" type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Buscar
                </button>
              </form>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="divide-y">
              {ordenes.map((o) => {
                const totalItems = o.items?.reduce((sum: number, item: any) => sum + item.cantidad, 0) || 0;
                const productosResumen = o.items?.slice(0, 2).map((item: any) => item.producto?.nombre || `Producto ${item.producto_id}`).join(', ');
                const masProductos = (o.items?.length || 0) > 2;

                return (
                  <button
                    key={o.id}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedId === o.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                    onClick={() => cargarDetalle(o.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">#{o.codigo}</span>
                          <EstadoBadge estado={o.estado} />
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{o.cliente?.email}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          {o.fecha_orden ? new Date(o.fecha_orden).toLocaleString() : ''}
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="text-gray-500">Productos:</span>
                          <span className="ml-1">{productosResumen}</span>
                          {masProductos && <span className="ml-1 text-gray-500">+{o.items.length - 2} más</span>}
                          <span className="ml-2 text-gray-500">({totalItems} items)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 text-lg">${Number(o.total).toFixed(2)}</div>
                        <div className="text-xs text-gray-500 capitalize">{o.metodo_pago || 'N/A'}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="card-footer flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {pagination?.page ?? 1} de {pages} ({pagination?.total ?? 0} órdenes)
              </div>
              <div className="space-x-2">
                <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </button>
                <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Detalle de Orden</h2>
            </div>
            <div className="card-body space-y-4">
              {!detalle ? (
                <div className="text-gray-500 text-center py-6">Selecciona una orden para ver detalle.</div>
              ) : (
                <>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Código</div>
                    <div className="font-semibold text-gray-900">#{detalle.codigo}</div>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Cliente</div>
                    <div className="font-semibold text-gray-900">{detalle.cliente?.email}</div>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Estado actual</div>
                    <EstadoBadge estado={detalle.estado} />
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Método de pago</div>
                    <div className="font-semibold text-gray-900 capitalize">{detalle.metodo_pago || 'N/A'}</div>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="font-bold text-blue-600 text-lg">${Number(detalle.total).toFixed(2)}</div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-2 font-medium">Cambiar estado</div>
                    <div className="grid grid-cols-1 gap-2">
                      {estados.map((es) => (
                        <button
                          key={es.id}
                          className="btn-secondary text-sm"
                          onClick={() => onCambiarEstado(es.id)}
                          disabled={es.id === detalle.estado_id}
                        >
                          {es.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {detalle.items && detalle.items.length > 0 && (
                    <div className="border border-gray-100 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-2 font-medium">Productos ({detalle.items.length})</div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {detalle.items.map((item: any) => (
                          <div key={item.id} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                            <div className="font-medium text-gray-900">{item.producto?.nombre || `Producto ${item.producto_id}`}</div>
                            <div className="text-gray-600">Cantidad: {item.cantidad} × ${Number(item.precio_unitario).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

