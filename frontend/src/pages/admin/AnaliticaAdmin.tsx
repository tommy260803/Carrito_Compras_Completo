import React, { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboardService } from '../../services/dashboard.service';
import toast from 'react-hot-toast';

export const AnaliticaAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [ventasDiarias, setVentasDiarias] = useState<any[]>([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [vd, vpc] = await Promise.all([
          dashboardService.getVentasDiarias(),
          dashboardService.getVentasPorCategoria()
        ]);
        setVentasDiarias(vd);
        setVentasPorCategoria(vpc);
      } catch (e) {
        toast.error('No se pudieron cargar los datos de analítica');
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Análitica y Gráficos</h2>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Ventas diarias</h3>
        </div>
        <div className="card-body flex justify-center">
          {ventasDiarias.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No hay datos de ventas disponibles</div>
          ) : (
            <AreaChart width={800} height={400} data={ventasDiarias} className="w-full">
              <XAxis dataKey="fecha" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area type="monotone" dataKey="total" stroke="#6366f1" fill="#6366f1" />
            </AreaChart>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Ventas por categoría</h3>
        </div>
        <div className="card-body flex justify-center">
          {ventasPorCategoria.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No hay datos de ventas por categoría disponibles</div>
          ) : (
            <BarChart width={800} height={400} data={ventasPorCategoria} className="w-full">
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  );
};

