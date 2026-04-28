import React from 'react';

export const ConfiguracionAdmin: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Configuración y Roles</h1>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Información de Sistema</h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-gray-700">Roles operativos del sistema:</p>
          <div className="space-y-2">
            <div className="border border-gray-100 rounded-lg p-3 flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0">👤</div>
              <div>
                <div className="font-semibold text-gray-900">Administrador</div>
                <div className="text-sm text-gray-600">Gestión total de módulos, inventario, órdenes, reportes y configuración</div>
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3 flex items-start gap-3">
              <div className="bg-green-100 text-green-700 w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0">🛍️</div>
              <div>
                <div className="font-semibold text-gray-900">Cliente</div>
                <div className="text-sm text-gray-600">Acceso a catálogo, carrito, checkout, órdenes y lista de deseos</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="text-sm text-blue-800">
              <strong>Nota:</strong> El control de acceso se aplica mediante middleware RBAC en backend y rutas protegidas en frontend para garantizar la seguridad.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

