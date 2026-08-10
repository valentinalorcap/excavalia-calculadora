export function formatEUR(valor) {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €'
}

export function formatKm(valor) {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km'
}

export function formatTiempo(minutos) {
  const horas = Math.floor(minutos / 60)
  const resto = Math.round(minutos % 60)
  return `${horas}h ${resto < 10 ? '0' : ''}${resto}m`
}
