import React from 'react';

interface EstadoBadgeProps {
  estado: string | number | { nombre?: string; id?: number };
  className?: string;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, className = '' }) => {
  const estadoNombre = typeof estado === 'object' ? estado.nombre ?? '' : String(estado);

  const getBadgeStyle = () => {
    const nombreLower = estadoNombre.toLowerCase();
    
    if (nombreLower.includes('pendiente') || nombreLower.includes('pending')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (nombreLower.includes('procesando') || nombreLower.includes('processing') || nombreLower.includes('en proceso')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (nombreLower.includes('completado') || nombreLower.includes('completa') || nombreLower.includes('entregado') || nombreLower.includes('delivered') || nombreLower.includes('completed')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (nombreLower.includes('cancelado') || nombreLower.includes('cancelada') || nombreLower.includes('cancelled') || nombreLower.includes('canceled')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (nombreLower.includes('pagado') || nombreLower.includes('paid')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (nombreLower.includes('fallido') || nombreLower.includes('failed')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    // Default gray for unknown states
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyle()} ${className}`}>
      {estadoNombre}
    </span>
  );
};
