import React, { useEffect, useMemo, useState } from 'react';
import { ShopNavbar } from '../../components/ShopNavbar';
import toast from 'react-hot-toast';
import { carritoService } from '../../services/carrito.service';
import { clienteService } from '../../services/cliente.service';
import { ordenService } from '../../services/orden.service';
import { pagoService } from '../../services/pago.service';

interface CarritoItem {
  id: number;
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    precio_venta: number;
  };
}

interface Carrito {
  id: number;
  items: CarritoItem[];
}

export const Checkout: React.FC = () => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [carritoCount, setCarritoCount] = useState(0);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    telefono: '',
    metodo_pago: 'tarjeta',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await carritoService.getCarrito();
        setCarrito(resp.data);
        setCarritoCount(resp.data?.items?.length || 0);
      } catch (e) {
        toast.error('No se pudo cargar el carrito');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const subtotal = useMemo(() => {
    if (!carrito) return 0;
    return carrito.items.reduce((acc, it) => acc + Number(it.producto.precio_venta) * it.cantidad, 0);
  }, [carrito]);

  const total = subtotal; // impuestos/envío aún no implementados en backend

  const onConfirmar = async () => {
    if (!carrito || carrito.items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    if (!form.nombre || !form.direccion || !form.ciudad || !form.provincia || !form.codigo_postal) {
      toast.error('Completa la información de envío');
      return;
    }

    try {
      setSubmitting(true);

      const dirResp = await clienteService.crearDireccion({
        nombre: form.nombre,
        direccion: form.direccion,
        ciudad: form.ciudad,
        provincia: form.provincia,
        codigo_postal: form.codigo_postal,
        telefono: form.telefono || undefined,
        es_principal: true,
      });

      const ordenResp = await ordenService.crearOrden({
        carrito_id: carrito.id,
        direccion_envio_id: dirResp.data.id,
        metodo_pago: form.metodo_pago,
      });

      await pagoService.registrarPago({
        orden_id: ordenResp.data.id,
        metodo: form.metodo_pago,
        monto: total,
        estado: 'pagado',
      });

      toast.success(`Orden creada: ${ordenResp.data.codigo}`);
      window.location.href = '/carrito';
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Error al confirmar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar carritoCount={carritoCount} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar carritoCount={carritoCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a href="/carrito" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Carrito
          </a>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Completa la información para procesar tu pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre (para la dirección)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Casa / Oficina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.direccion}
                    onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                    placeholder="Calle y número"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.ciudad}
                      onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                      placeholder="Ciudad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.provincia}
                      onChange={(e) => setForm((f) => ({ ...f, provincia: e.target.value }))}
                      placeholder="Provincia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.codigo_postal}
                      onChange={(e) => setForm((f) => ({ ...f, codigo_postal: e.target.value }))}
                      placeholder="Código postal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.telefono}
                    onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                    placeholder="Tu teléfono"
                  />
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="mr-2"
                    checked={form.metodo_pago === 'tarjeta'}
                    onChange={() => setForm((f) => ({ ...f, metodo_pago: 'tarjeta' }))}
                  />
                  <span>Tarjeta de Crédito/Débito</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="mr-2"
                    checked={form.metodo_pago === 'paypal'}
                    onChange={() => setForm((f) => ({ ...f, metodo_pago: 'paypal' }))}
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="mr-2"
                    checked={form.metodo_pago === 'transferencia'}
                    onChange={() => setForm((f) => ({ ...f, metodo_pago: 'transferencia' }))}
                  />
                  <span>Transferencia Bancaria</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
              <div className="space-y-2 mb-4">
                {!carrito || carrito.items.length === 0 ? (
                  <div className="text-gray-500">Tu carrito está vacío</div>
                ) : (
                  carrito.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.producto.nombre} x{it.cantidad}</span>
                      <span>${(Number(it.producto.precio_venta) * it.cantidad).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full btn-primary mt-6" onClick={onConfirmar} disabled={submitting}>
                {submitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
