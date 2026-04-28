import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reportesService } from '../../services/reportes.service';

const API_URL = 'http://localhost:4000/api/v1';

export const Reportes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
  const [top, setTop] = useState<any[]>([]);
  const [descargando, setDescargando] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` };
        const [k, t] = await Promise.all([
          fetch(`${API_URL}/reportes/kpis`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/reportes/productos-mas-vendidos?limit=10`, { headers }).then((r) => r.json()),
        ]);
        setKpis(k.data);
        setTop(t.data ?? []);
      } catch (e) {
        toast.error('No se pudieron cargar los reportes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const descargarReporte = async (tipo: string, fn: () => Promise<void>) => {
    try {
      setDescargando(tipo);
      await fn();
      toast.success('Reporte descargado exitosamente');
    } catch (e) {
      toast.error('Error al descargar el reporte');
    } finally {
      setDescargando(null);
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
      <h2 className="text-2xl font-semibold text-gray-900">Centro de Reportes</h2>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Descargar Reportes PDF</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              className="btn-primary btn-lg w-full flex items-center justify-center"
              onClick={() => descargarReporte('ventas', () => reportesService.descargarVentasPDF())}
              disabled={descargando === 'ventas'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              {descargando === 'ventas' ? 'Descargando...' : 'Ventas'}
            </button>
            <button
              className="btn-primary btn-lg w-full flex items-center justify-center"
              onClick={() => descargarReporte('inventario', () => reportesService.descargarInventarioPDF())}
              disabled={descargando === 'inventario'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M4 12l8 4m8-4l-8 4"/></svg>
              {descargando === 'inventario' ? 'Descargando...' : 'Inventario'}
            </button>
            <button
              className="btn-primary btn-lg w-full flex items-center justify-center"
              onClick={() => descargarReporte('ordenes', () => reportesService.descargarOrdenesPDF())}
              disabled={descargando === 'ordenes'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              {descargando === 'ordenes' ? 'Descargando...' : 'Órdenes'}
            </button>
            <button
              className="btn-primary btn-lg w-full flex items-center justify-center"
              onClick={() => descargarReporte('pagos', () => reportesService.descargarPagosPDF())}
              disabled={descargando === 'pagos'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V5a3 3 0 00-3-3H6a3 3 0 00-3 3v11a3 3 0 003 3z"/></svg>
              {descargando === 'pagos' ? 'Descargando...' : 'Pagos'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Ventas totales</div>
            <div className="text-2xl font-bold text-blue-600">${kpis?.ventasTotales ?? 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Ticket promedio</div>
            <div className="text-2xl font-bold text-green-600">${kpis?.ticketPromedio ?? 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Órdenes pendientes</div>
            <div className="text-2xl font-bold text-orange-600">{kpis?.ordenesPendientes ?? 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Productos sin stock</div>
            <div className="text-2xl font-bold text-red-600">{kpis?.productosSinStock ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Productos más vendidos</h3>
        </div>
        <div className="card-body">
          {top.length === 0 ? (
            <div className="text-gray-500 text-center py-6">Sin datos</div>
          ) : (
            <div className="space-y-2">
              {top.map((p, idx) => (
                <div key={p.producto_id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                    <div className="font-semibold text-gray-900">{p.nombre}</div>
                  </div>
                  <div className="text-sm text-gray-500">Cantidad: <span className="font-semibold text-gray-900">{p.cantidad}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

