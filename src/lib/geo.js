const RADIO_TIERRA_KM = 6371
// Las carreteras nunca son una línea recta; mientras no esté conectado
// OpenRouteService, aproximamos la distancia real por carretera con este
// factor sobre la distancia en línea recta (razonable para terreno de Canarias).
const FACTOR_CARRETERA = 1.35

function aRadianes(grados) {
  return (grados * Math.PI) / 180
}

// TODO: sustituir por una llamada a OpenRouteService (vía Apps Script) que
// devuelva distancia, tiempo y desnivel reales por carretera. Esta función
// es un fallback en línea recta + factor de corrección para poder demostrar
// el flujo completo de la calculadora sin esa integración todavía.
export function distanciaEnLineaRecta(puntoA, puntoB) {
  const dLat = aRadianes(puntoB.lat - puntoA.lat)
  const dLng = aRadianes(puntoB.lng - puntoA.lng)
  const lat1 = aRadianes(puntoA.lat)
  const lat2 = aRadianes(puntoB.lat)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return RADIO_TIERRA_KM * c * FACTOR_CARRETERA
}
