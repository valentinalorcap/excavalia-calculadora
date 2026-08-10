// Modelo del trayecto:
//   Tramo 1 (una vez, ida y vuelta):   base <-> inicio del servicio
//   Tramo 2 (N veces, ida y vuelta):   inicio del servicio <-> fin del servicio
//
// `tramos` trae siempre tramo1Km/tramo2Km. Si además trae tramo1Min/tramo2Min
// y tramo1AscensoM/tramo2AscensoM (ruta real de OpenRouteService), se usan en
// vez de estimarlos con la velocidad media y el desnivel de ejemplo.
export function calcularPrecio({ tipoConfig, tramos, n, horasCargaDescarga, precioDiesel, config }) {
  const { velocidadMediaKmh, jornadaHoras } = config
  const tarifaMinima = tipoConfig.tarifaMinima
  const { tramo1Km, tramo2Km, tramo1Min, tramo2Min, tramo1AscensoM, tramo2AscensoM } = tramos

  const distanciaTotal = tramo1Km * 2 + n * 2 * tramo2Km

  const minTramo1 = tramo1Min != null ? tramo1Min * 2 : ((tramo1Km * 2) / velocidadMediaKmh) * 60
  const minTramo2Total = tramo2Min != null ? tramo2Min * 2 * n : ((tramo2Km * 2 * n) / velocidadMediaKmh) * 60
  const minCargaDescarga = horasCargaDescarga * 60 * n
  const minTotal = minTramo1 + minTramo2Total + minCargaDescarga

  const ascensoTotalM =
    tramo1AscensoM != null && tramo2AscensoM != null
      ? tramo1AscensoM * 2 + tramo2AscensoM * 2 * n
      : distanciaTotal * 6 // desnivel de ejemplo (6 m/km) hasta tener el dato real

  const litros =
    (distanciaTotal / 100) * tipoConfig.consumoBase + (ascensoTotalM / 100) * tipoConfig.factorPendiente
  const costeCombustible = litros * precioDiesel

  const precioCalculado =
    tipoConfig.tarifaBase +
    distanciaTotal * tipoConfig.tarifaKm +
    (minTotal / 60) * tipoConfig.tarifaHora +
    costeCombustible

  const aplicaMinima = precioCalculado < tarifaMinima
  const precioFinal = Math.max(precioCalculado, tarifaMinima)

  const minTramo2PorRepeticion = tramo2Min != null ? tramo2Min * 2 : ((tramo2Km * 2) / velocidadMediaKmh) * 60
  const minPorRepeticion = minTramo2PorRepeticion + horasCargaDescarga * 60
  const minDisponibleJornada = jornadaHoras * 60 - minTramo1
  const nMaxJornada = Math.max(0, Math.floor(minDisponibleJornada / Math.max(1, minPorRepeticion)))

  return { precioFinal, aplicaMinima, tarifaMinima, distanciaTotal, minTotal, nMaxJornada }
}
