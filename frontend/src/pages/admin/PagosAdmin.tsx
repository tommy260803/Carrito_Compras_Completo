import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminPagoService } from '../../services/adminPago.service';
import { reportesService } from '../../services/reportes.service';

export const PagosAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pagos, setPagos] = useState<any[]>([]);
  const [estado, setEstado] = useState('');
  const [ordenCodigo, setOrdenCodigo] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [descargando, setDescargando] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await adminPagoService.listar({
        estado: estado || undefined,
        orden_codigo: ordenCodigo || undefined,
        cliente_email: clienteEmail || undefined,
      });
      setPagos(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudieron cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    await cargar();
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
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Pagos</h2>
        <button
          className="btn-primary btn-lg"
          onClick={async () => {
            try {
              setDescargando(true);
              await reportesService.descargarPagosPDF();
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

      <div className="card">
        <div className="card-body">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={onBuscar}>
            <input
              className="flex-1 form-input"
              placeholder="Código de orden"
              value={ordenCodigo}
              onChange={(e) => setOrdenCodigo(e.target.value)}
            />
            <input
              className="flex-1 form-input"
              placeholder="Email cliente"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
            />
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="fallido">Fallido</option>
              <option value="reembolsado">Reembolsado</option>
            </select>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {pagos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {p.created_at ? new Date(p.created_at).toLocaleString() : ''}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.orden?.codigo ?? p.orden_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {p.orden?.cliente?.email ?? ''}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.estado === 'pagado' ? 'badge-success' :
                      p.estado === 'pendiente' ? 'badge-warning' :
                      p.estado === 'fallido' ? 'badge-danger' :
                      'badge-info'
                    }`}>
                      {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{p.metodo ?? ''}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ${Number(p.monto).toFixed(2)}
                  </td>
                </tr>
              ))}
              {pagos.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={6}>
                    Sin pagos para los filtros seleccionados.
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

