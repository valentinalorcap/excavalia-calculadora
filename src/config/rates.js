// Tarifas de ejemplo por tipo de transporte.
// TODO: sustituir por una llamada a la API de Apps Script cuando esté desplegada
// (ver apps-script/Code.gs) — la Google Sheet será la fuente real de estos datos.

export const TIPOS_TRANSPORTE = {
  plancha: {
    etiqueta: 'Plancha porta vehículo',
    consumoBase: 38, // L/100km
    factorPendiente: 0.9, // L extra por cada 100m de ascenso
    tarifaKm: 1.85, // €/km
    tarifaHora: 42, // €/h
    tarifaBase: 60, // €
  },
  banera: {
    etiqueta: 'Bañera (áridos)',
    consumoBase: 42,
    factorPendiente: 1.1,
    tarifaKm: 1.95,
    tarifaHora: 45,
    tarifaBase: 65,
  },
  multilift: {
    etiqueta: 'Multilift (cubetas)',
    consumoBase: 35,
    factorPendiente: 0.8,
    tarifaKm: 1.70,
    tarifaHora: 38,
    tarifaBase: 55,
  },
  furgo: {
    etiqueta: 'Furgo',
    consumoBase: 12,
    factorPendiente: 0.3,
    tarifaKm: 0.95,
    tarifaHora: 28,
    tarifaBase: 35,
  },
}

export const CONFIG_GENERAL = {
  tarifaMinima: 90, // €
  velocidadMediaKmh: 45, // usada para estimar tiempo de conducción hasta tener rutas reales de OpenRouteService
  jornadaHoras: 8,
}
