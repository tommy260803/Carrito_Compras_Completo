export function calcularImpuestos(subtotal: number) {
  // Mantener simple: IVA/Impuesto 0 por defecto si no se definió otra regla
  // Ajustable luego sin romper el contrato del servicio.
  return 0;
}

export async function generarCodigoOrden() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `O${y}${m}${d}-${rand}`;
}

