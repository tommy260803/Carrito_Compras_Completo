// PDF quedó fuera por dependencias faltantes (pdfkit/puppeteer no están instaladas).
// Si luego quieres reportes PDF, se reinstala con dependencias y un endpoint dedicado.
export async function generarReporteOrdenes() {
  throw new Error('PDF no disponible: faltan dependencias (pdfkit).');
}
