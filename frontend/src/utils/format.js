/**
 * Formatea un monto como dinero: "$ 64.000" (sin decimales, separador de miles con punto).
 * Se usa en el Dashboard para las tarjetas de moneda y la gráfica de ventas.
 */
export function formatMoney(valor) {
  const numero = Number(valor) || 0;
  return `$ ${numero.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}
