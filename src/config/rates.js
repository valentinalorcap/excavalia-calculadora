// Tarifas de ejemplo por tipo de transporte.
// Se sustituyen por las de la Google Sheet en cuanto Apps Script está
// desplegado (ver apps-script/Code.gs y src/hooks/useTarifas.js).

export const TIPOS_TRANSPORTE = {
  plancha: {
    etiqueta: 'Plancha porta vehículo',
    consumoBase: 38, // L/100km
    factorPendiente: 0.9, // L extra por cada 100m de ascenso
    tarifaKm: 1.85, // €/km
    tarifaHora: 42, // €/h
    tarifaBase: 60, // €
    tarifaMinima: 90, // € — mínimo que se cobra por un servicio con este tipo de transporte
  },
  banera: {
    etiqueta: 'Bañera (áridos)',
    consumoBase: 42,
    factorPendiente: 1.1,
    tarifaKm: 1.95,
    tarifaHora: 45,
    tarifaBase: 65,
    tarifaMinima: 90,
  },
  multilift: {
    etiqueta: 'Multilift (cubetas)',
    consumoBase: 35,
    factorPendiente: 0.8,
    tarifaKm: 1.70,
    tarifaHora: 38,
    tarifaBase: 55,
    tarifaMinima: 75,
  },
  furgo: {
    etiqueta: 'Furgo',
    consumoBase: 12,
    factorPendiente: 0.3,
    tarifaKm: 0.95,
    tarifaHora: 28,
    tarifaBase: 35,
    tarifaMinima: 50,
  },
}

export const CONFIG_GENERAL = {
  velocidadMediaKmh: 45, // usada para estimar tiempo de conducción hasta tener rutas reales de OpenRouteService
  jornadaHoras: 8,
}
