import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminInventarioService } from '../../services/adminInventario.service';
import { reportesService } from '../../services/reportes.service';

interface Producto {
  id: number;
  sku: string;
  nombre: string;
  stock_minimo: number;
  stock?: {
    cantidad: number;
    reservado: number;
    disponible: number;
  };
  categoria?: {
    nombre: string;
  };
}

export const InventarioAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [stockBajo, setStockBajo] = useState<Producto[]>([]);
  const [agotados, setAgotados] = useState<Producto[]>([]);
  const [tab, setTab] = useState<'todos' | 'bajo' | 'agotados'>('todos');
  const [descargando, setDescargando] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const [todos, sb, ag] = await Promise.all([
        adminInventarioService.listar(),
        adminInventarioService.stockBajo(),
        adminInventarioService.agotados(),
      ]);
      setProductos(todos.data);
      setStockBajo(sb.data);
      setAgotados(ag.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const ajustarStock = async (productoId: number, disponibleActual: number) => {
    const raw = prompt('Nueva cantidad disponible (número entero >= 0):', String(disponibleActual));
    if (raw === null) return;
    const cantidad = Number(raw);
    if (!Number.isFinite(cantidad) || cantidad < 0) {
      toast.error('Cantidad inválida');
      return;
    }
    try {
      await adminInventarioService.ajustarStock(productoId, Math.floor(cantidad));
      toast.success('Stock actualizado');
      await cargar();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo actualizar stock');
    }
  };

  const actualizarStockMinimo = async (productoId: number, actual: number) => {
    const raw = prompt('Nuevo stock mínimo (número entero >= 0):', actual.toString());
    if (raw === null) return;
    const stockMinimo = Number(raw);
    if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {
      toast.error('Stock mínimo inválido');
      return;
    }
    try {
      await adminInventarioService.actualizarStockMinimo(productoId, Math.floor(stockMinimo));
      toast.success('Stock mínimo actualizado');
      await cargar();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo actualizar stock mínimo');
    }
  };

  const productosAMostrar = tab === 'todos' ? productos : tab === 'bajo' ? stockBajo : agotados;

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
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h2>
        <div className="flex gap-3">
          <button
            className="btn-primary btn-lg"
            onClick={async () => {
              try {
                setDescargando(true);
                await reportesService.descargarInventarioPDF();
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
          <button className="btn-secondary btn-lg" onClick={cargar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualizar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-100">
          <button
            className={`px-6 py-3 font-medium text-sm transition ${tab === 'todos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTab('todos')}
          >
            Todos ({productos.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition ${tab === 'bajo' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTab('bajo')}
          >
            Stock Bajo ({stockBajo.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition ${tab === 'agotados' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTab('agotados')}
          >
            Agotados ({agotados.length})
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Actual</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {productosAMostrar.map((p) => {
                const disponible = p.stock?.disponible ?? 0;
                const minimo = p.stock_minimo;
                const estado = disponible === 0 ? 'agotado' : disponible <= minimo ? 'bajo' : 'normal';
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{p.sku}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.categoria?.nombre || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{disponible}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{minimo}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        estado === 'agotado' ? 'badge-danger' :
                        estado === 'bajo' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {estado === 'agotado' ? 'Agotado' : estado === 'bajo' ? 'Stock Bajo' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                      <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" onClick={() => ajustarStock(p.id, disponible)}>
                        Ajustar
                      </button>
                      <button className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-sm rounded hover:bg-green-100" onClick={() => actualizarStockMinimo(p.id, minimo)}>
                        Mínimo
                      </button>
                    </td>
                  </tr>
                );
              })}
              {productosAMostrar.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={7}>
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

