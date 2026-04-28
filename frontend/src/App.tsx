import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Home } from './pages/shop/Home';
import { Catalogo } from './pages/shop/Catalogo';
import { Carrito } from './pages/shop/Carrito';
import { Checkout } from './pages/shop/Checkout';
import { MisOrdenes } from './pages/shop/MisOrdenes';
import { DetalleOrden } from './pages/shop/DetalleOrden';
import { Wishlist } from './pages/shop/Wishlist';
import { ProductoDetalle } from './pages/shop/ProductoDetalle';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductosAdmin } from './pages/admin/ProductosAdmin';
import { Reportes } from './pages/admin/Reportes';
import { OrdenesAdmin } from './pages/admin/OrdenesAdmin';
import { InventarioAdmin } from './pages/admin/InventarioAdmin';
import { PagosAdmin } from './pages/admin/PagosAdmin';
import { ClientesAdmin } from './pages/admin/ClientesAdmin';
import { AnaliticaAdmin } from './pages/admin/AnaliticaAdmin';
import { CategoriasAdmin } from './pages/admin/CategoriasAdmin';
import { ConfiguracionAdmin } from './pages/admin/ConfiguracionAdmin';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/auth/Login';
import { Unauthorized } from './pages/Unauthorized';

const ProtectedHome = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  return user ? <Home /> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mis-ordenes" element={<MisOrdenes />} />
            <Route path="/mis-ordenes/:id" element={<DetalleOrden />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={[1]} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="analitica" element={<AnaliticaAdmin />} />
                <Route path="productos" element={<ProductosAdmin />} />
                <Route path="categorias" element={<CategoriasAdmin />} />
                <Route path="inventario" element={<InventarioAdmin />} />
                <Route path="ordenes" element={<OrdenesAdmin />} />
                <Route path="clientes" element={<ClientesAdmin />} />
                <Route path="pagos" element={<PagosAdmin />} />
                <Route path="reportes" element={<Reportes />} />
                <Route path="configuracion" element={<ConfiguracionAdmin />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
