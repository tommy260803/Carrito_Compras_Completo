import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso No Autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta sección. Solo los administradores pueden ver el panel de control.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
