import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:4000/api/v1';

export const ClientesAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);

  const cargar = async (q?: string) => {
    try {
      setLoading(true);
      const params = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`${API_URL}/clientes/admin${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
      });
      const json = await res.json();
      setClientes(json.data ?? []);
    } catch (e) {
      toast.error('No se pudieron cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const onBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    await cargar(search.trim() || undefined);
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
      <h1 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h1>

      <div className="card">
        <div className="card-body">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={onBuscar}>
            <input
              className="flex-1 form-input"
              placeholder="Buscar por nombre, apellido o email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Órdenes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gasto total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Última orden</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{c.nombre} {c.apellido}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{c.email}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{c.total_ordenes}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-blue-600">${Number(c.gasto_total ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {c.ultima_orden ? new Date(c.ultima_orden).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {clientes.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>Sin clientes para mostrar.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

