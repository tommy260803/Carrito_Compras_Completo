import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavItem: React.FC<{ to: string; end?: boolean; icon: React.ReactNode; children: React.ReactNode }> = ({ to, end, icon, children }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
    }
  >
    <span className="w-5 h-5 flex items-center justify-center text-current">{icon}</span>
    <span className="truncate">{children}</span>
  </NavLink>
);

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.nombre || 'A').split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 shadow-xl p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">MT</div>
          <div>
            <div className="text-sm font-semibold text-white">MiTienda Admin</div>
            <div className="text-xs text-slate-400">Panel Administrativo</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Principal</p>
            <NavItem to="/admin" end icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125A2.625 2.625 0 007.125 22.5h9.75A2.625 2.625 0 0019.5 19.875V9.75"/></svg>}>Dashboard</NavItem>
            <NavItem to="/admin/analitica" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/></svg>}>Analítica</NavItem>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Catálogo</p>
            <NavItem to="/admin/productos" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2h-6"/></svg>}>Productos</NavItem>
            <NavItem to="/admin/categorias" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>}>Categorías</NavItem>
            <NavItem to="/admin/inventario" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>}>Inventario</NavItem>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Ventas</p>
            <NavItem to="/admin/ordenes" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>}>Órdenes</NavItem>
            <NavItem to="/admin/clientes" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.879 6.196"/></svg>}>Clientes</NavItem>
            <NavItem to="/admin/pagos" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>}>Pagos</NavItem>
            <NavItem to="/admin/reportes" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>}>Reportes</NavItem>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Sistema</p>
            <NavItem to="/admin/configuracion" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"/></svg>}>Configuración</NavItem>
          </div>
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">{initials}</div>
              <div>
                <div className="text-sm font-medium text-white">{user?.nombre || 'Administrador'}</div>
                <div className="text-xs text-slate-400">{user?.email ?? ''}</div>
              </div>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión" className="p-2 rounded-md hover:bg-slate-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 hover:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">Panel de Administración</h1>
              <div className="text-sm text-gray-500">Administración y Gestión</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input placeholder="Buscar en admin..." className="bg-transparent outline-none text-sm w-64" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">{user?.nombre ?? 'Admin'}</div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">{initials}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

