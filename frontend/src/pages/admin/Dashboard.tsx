import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { dashboardService } from '../../services/dashboard.service';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>({});
  const [ventasDiarias, setVentasDiarias] = useState<any[]>([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [k, vd, vpc] = await Promise.all([
          dashboardService.getKPIs(),
          dashboardService.getVentasDiarias(),
          dashboardService.getVentasPorCategoria()
        ]);
        setKpis(k);
        setVentasDiarias(vd);
        setVentasPorCategoria(vpc);
      } catch (e) {
        toast.error('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Ventas totales</div>
                <div className="text-2xl font-bold mt-1">${kpis.ventasTotales?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Ticket promedio</div>
                <div className="text-2xl font-bold mt-1">${kpis.ticketPromedio?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Órdenes pendientes</div>
                <div className="text-2xl font-bold mt-1">{kpis.ordenesPendientes || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Productos sin stock</div>
                <div className="text-2xl font-bold mt-1">{kpis.productosSinStock || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Ventas diarias</h3>
            {ventasDiarias.length === 0 ? (
              <div className="text-gray-500">No hay datos de ventas disponibles</div>
            ) : (
              <AreaChart width={600} height={300} data={ventasDiarias}>
                <XAxis dataKey="fecha" tickFormatter={(value) => value} />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Ventas por categoría</h3>
            {ventasPorCategoria.length === 0 ? (
              <div className="text-gray-500">No hay datos de ventas por categoría disponibles</div>
            ) : (
              <BarChart width={600} height={300} data={ventasPorCategoria}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
