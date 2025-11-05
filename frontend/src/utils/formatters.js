/**
 * Formatea un valor numérico a pesos colombianos (COP)
 * @param {number} amount - El monto a formatear
 * @returns {string} - El monto formateado en pesos colombianos
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea una fecha a formato colombiano
 * @param {string|Date} dateString - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
