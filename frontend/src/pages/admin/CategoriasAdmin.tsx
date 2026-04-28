import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoriaService } from '../../services/categoria.service';

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  padre_id?: number;
  activo: boolean;
}

export const CategoriasAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: '', slug: '' });

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudieron cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ nombre: '', slug: '' });
  };

  const onCrear = () => {
    resetForm();
    setShowForm(true);
  };

  const onEditar = (cat: Categoria) => {
    setEditingId(cat.id);
    setForm({ nombre: cat.nombre, slug: cat.slug });
    setShowForm(true);
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error('Nombre es obligatorio');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await categoriaService.actualizar(editingId, {
          nombre: form.nombre,
          slug: form.slug || undefined
        });
        toast.success('Categoría actualizada');
      } else {
        await categoriaService.crear({
          nombre: form.nombre,
          slug: form.slug || undefined
        });
        toast.success('Categoría creada');
      }
      setShowForm(false);
      resetForm();
      await cargar();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo guardar categoría');
    } finally {
      setSaving(false);
    }
  };

  const onEliminar = async (cat: Categoria) => {
    if (!confirm(`¿Eliminar "${cat.nombre}"?`)) return;
    try {
      await categoriaService.eliminar(cat.id);
      toast.success('Categoría eliminada');
      await cargar();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo eliminar categoría');
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
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Categorías</h2>
        <button className="btn-primary btn-lg" onClick={onCrear}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Agregar Categoría
        </button>
      </div>

      {showForm ? (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">{editingId ? 'Editar categoría' : 'Nueva categoría'}</h3>
          </div>
          <form className="card-body space-y-4" onSubmit={onSubmitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Nombre <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  placeholder="Ej: Electrónica"
                  className="form-input"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: electronica"
                  className="form-input"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cat.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.nombre}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`badge-${cat.activo ? 'success' : 'warning'}`}>
                      {cat.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" onClick={() => onEditar(cat)}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => onEliminar(cat)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>
                    No hay categorías para mostrar.
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

