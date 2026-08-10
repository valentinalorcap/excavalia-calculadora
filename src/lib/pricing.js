// Modelo del trayecto:
//   Tramo 1 (una vez, ida y vuelta):   base <-> inicio del servicio
//   Tramo 2 (N veces, ida y vuelta):   inicio del servicio <-> fin del servicio
export function calcularPrecio({ tipoConfig, tramo1Km, tramo2Km, n, horasCargaDescarga, precioDiesel, config }) {
  const { velocidadMediaKmh, jornadaHoras, tarifaMinima } = config

  const distanciaTotal = tramo1Km * 2 + n * 2 * tramo2Km

  const minConduccion =
    ((tramo1Km * 2) / velocidadMediaKmh) * 60 + ((n * 2 * tramo2Km) / velocidadMediaKmh) * 60
  const minCargaDescarga = horasCargaDescarga * 60 * n
  const minTotal = minConduccion + minCargaDescarga

  // Desnivel de ejemplo (6 m de ascenso por km) hasta tener el dato real de OpenRouteService.
  const ascensoTotalM = distanciaTotal * 6
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

  const minPorRepeticion = ((tramo2Km * 2) / velocidadMediaKmh) * 60 + horasCargaDescarga * 60
  const minDisponibleJornada = jornadaHoras * 60 - ((tramo1Km * 2) / velocidadMediaKmh) * 60
  const nMaxJornada = Math.max(0, Math.floor(minDisponibleJornada / Math.max(1, minPorRepeticion)))

  return { precioFinal, aplicaMinima, distanciaTotal, minTotal, nMaxJornada }
}
