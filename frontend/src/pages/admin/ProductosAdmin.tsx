import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminProductoService } from '../../services/adminProducto.service';
import { categoriaService } from '../../services/categoria.service';

interface ProductoRow {
  id: number;
  sku: string;
  nombre: string;
  precio_venta: number;
  activo: boolean;
  categoria?: { nombre: string };
  stock?: { disponible: number };
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

interface FormState {
  sku: string;
  nombre: string;
  categoria_id: number;
  precio_venta: number;
  precio_costo: number;
  stock: number;
  stock_minimo: number;
}

export const ProductosAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<ProductoRow[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<FormState>({
    sku: '',
    nombre: '',
    categoria_id: 0,
    precio_venta: 0,
    precio_costo: 0,
    stock: 0,
    stock_minimo: 0,
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      sku: '',
      nombre: '',
      categoria_id: 0,
      precio_venta: 0,
      precio_costo: 0,
      stock: 0,
      stock_minimo: 0,
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const cargar = async (nextPage?: number) => {
    const requestedPage = nextPage ?? page;
    try {
      setLoading(true);
      const res = await adminProductoService.listar({
        page: requestedPage,
        limit,
        search: search || undefined,
      });
      setProductos(res.data.productos);
      setTotal(res.data.pagination.total);
      setPage(res.data.pagination.page);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudieron cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (e: any) {
      toast.error('No se pudieron cargar categorías');
    }
  };

  useEffect(() => {
    cargar();
    cargarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const onBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    await cargar(1);
  };

  const onCrear = () => {
    resetForm();
    setShowForm(true);
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error('Nombre es obligatorio');
      return;
    }
    if (form.categoria_id <= 0 || form.precio_venta <= 0 || form.stock < 0) {
      toast.error('Verifica los valores numéricos');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await adminProductoService.actualizar(editingId, {
          nombre: form.nombre,
          categoria_id: Number(form.categoria_id),
          precio_venta: Number(form.precio_venta),
          precio_costo: form.precio_costo > 0 ? Number(form.precio_costo) : undefined,
          activo: true,
        });
        toast.success('Producto actualizado');
      } else {
        await adminProductoService.crear({
          sku: form.sku.trim() || undefined,
          nombre: form.nombre,
          categoria_id: Number(form.categoria_id),
          precio_venta: Number(form.precio_venta),
          precio_costo: form.precio_costo > 0 ? Number(form.precio_costo) : undefined,
          stock: Number(form.stock),
          stock_minimo: Number(form.stock_minimo),
          activo: true,
        });
        toast.success('Producto creado');
      }
      setShowForm(false);
      resetForm();
      await cargar(editingId ? page : 1);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const onEditar = (p: ProductoRow) => {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      nombre: p.nombre,
      categoria_id: 1,
      precio_venta: Number(p.precio_venta),
      precio_costo: Number(p.precio_venta),
      stock: Number(p.stock?.disponible ?? 0),
      stock_minimo: 0,
    });
    setShowForm(true);
  };

  const onEliminar = async (p: ProductoRow) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await adminProductoService.eliminar(p.id);
      toast.success('Producto eliminado');
      const newPage = productos.length === 1 && page > 1 ? page - 1 : page;
      await cargar(newPage);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo eliminar producto');
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
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Productos</h2>
        <button className="btn-primary btn-lg" onClick={onCrear}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Agregar Producto
        </button>
      </div>

      {showForm ? (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">{editingId ? 'Editar producto' : 'Nuevo producto'}</h3>
          </div>
          <form className="card-body space-y-4" onSubmit={onSubmitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">SKU (opcional - se genera automáticamente)</label>
                <input
                  type="text"
                  placeholder="Dejar vacío para generar automáticamente"
                  className="form-input"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  disabled={!!editingId}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre del Producto <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  placeholder="Ej: Laptop Sony Vaio 15"
                  className="form-input"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría <span className="text-red-600">*</span></label>
                <select
                  className="form-select"
                  value={form.categoria_id}
                  onChange={(e) => setForm((f) => ({ ...f, categoria_id: Number(e.target.value) }))}
                >
                  <option value={0}>Seleccionar categoría...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Precio de Venta <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  min={0.01}
                  step="0.01"
                  placeholder="Ej: 1200.00"
                  className="form-input"
                  value={form.precio_venta}
                  onChange={(e) => setForm((f) => ({ ...f, precio_venta: Number(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio de Costo (opcional)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Ej: 800.00"
                  className="form-input"
                  value={form.precio_costo}
                  onChange={(e) => setForm((f) => ({ ...f, precio_costo: Number(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Inicial <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  min={0}
                  placeholder="Ej: 25"
                  className="form-input"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                  disabled={!!editingId}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Mínimo (para alertas)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Ej: 5"
                  className="form-input"
                  value={form.stock_minimo}
                  onChange={(e) => setForm((f) => ({ ...f, stock_minimo: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="btn-primary btn-lg" type="submit" disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button
                className="btn-secondary btn-lg"
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="card">
        <div className="card-header border-b-0">
          <form className="flex flex-wrap gap-4" onSubmit={onBuscar}>
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="form-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-secondary" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buscar
            </button>
          </form>
        </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-400">Img</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{p.nombre}</div>
                          <div className="text-sm text-gray-500 truncate">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{p.categoria?.nombre ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${Number(p.precio_venta).toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{p.stock?.disponible ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                      <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" onClick={() => onEditar(p)}>
                        Editar
                      </button>
                      <button className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100" onClick={() => onEliminar(p)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
                      No hay productos para mostrar.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span> | Total:{' '}
              <span className="font-medium">{total}</span>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => cargar(page - 1)}>
                Anterior
              </button>
              <button className="btn-secondary" disabled={page >= totalPages} onClick={() => cargar(page + 1)}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};
