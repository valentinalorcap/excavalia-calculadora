/**
 * Backend de la calculadora de precios de Excavalia Canarias.
 *
 * Aunque el script esté vinculado a la Sheet (Extensiones > Apps Script),
 * SpreadsheetApp.getActiveSpreadsheet() no es fiable cuando el script se
 * ejecuta como aplicación web (no hay una "hoja activa" en ese contexto) —
 * por eso se abre siempre por ID, guardado como propiedad del script.
 *
 * Endpoints expuestos (al desplegar como aplicación web):
 *   GET  ?buscar=<texto>  -> búsqueda de direcciones (proxy a Nominatim, que
 *                            no admite llamadas directas desde el navegador
 *                            por no dar cabeceras CORS)
 *   GET  (sin parámetros) -> tarifas por tipo de transporte y configuración general
 *   POST -> ruta real (distancia, tiempo, desnivel) entre los puntos del mapa,
 *           vía OpenRouteService
 *
 * Ver apps-script/README.md para las instrucciones de despliegue y para
 * configurar la clave de OpenRouteService y el ID de la Sheet.
 */

const HOJA_TIPOS = 'TiposTransporte'
const HOJA_CONFIG = 'Config'
const PERFIL_ORS = 'driving-hgv' // vehículo pesado: evita restricciones no aptas para camiones
const VIEWBOX_CANARIAS = '-18.5,29.5,-13.0,27.0'

function doGet(e) {
  const consulta = e && e.parameter && e.parameter.buscar
  if (consulta) {
    return responderJSON({ resultados: buscarDireccionNominatim(consulta) })
  }

  return responderJSON({
    tipos: leerTiposTransporte(),
    config: leerConfig(),
  })
}

function buscarDireccionNominatim(consulta) {
  const parametros = {
    format: 'json',
    q: consulta,
    limit: '5',
    countrycodes: 'es',
    viewbox: VIEWBOX_CANARIAS,
    bounded: '1',
  }
  const queryString = Object.keys(parametros)
    .map((clave) => `${clave}=${encodeURIComponent(parametros[clave])}`)
    .join('&')

  const respuesta = UrlFetchApp.fetch(`https://nominatim.openstreetmap.org/search?${queryString}`, {
    headers: { 'User-Agent': 'ExcavaliaCalculadora/1.0 (+https://valentinalorcap.github.io/excavalia-calculadora/)' },
    muteHttpExceptions: true,
  })

  const datos = JSON.parse(respuesta.getContentText())
  return datos.map((r) => ({ etiqueta: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }))
}

// Recibe { puntos: [base, inicio, fin] } (cada uno con lat/lng) y devuelve
// la ruta real por carretera de cada tramo vía OpenRouteService.
function doPost(e) {
  try {
    const cuerpo = JSON.parse(e.postData.contents)
    const [base, inicio, fin] = cuerpo.puntos

    return responderJSON({
      tramo1: consultarRutaORS(base, inicio),
      tramo2: consultarRutaORS(inicio, fin),
    })
  } catch (error) {
    return responderJSON({ error: String(error) })
  }
}

function consultarRutaORS(origen, destino) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ORS_API_KEY')
  if (!apiKey) {
    throw new Error('Falta configurar la propiedad de script ORS_API_KEY (ver apps-script/README.md).')
  }

  const respuesta = UrlFetchApp.fetch(`https://api.openrouteservice.org/v2/directions/${PERFIL_ORS}/geojson`, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: apiKey },
    payload: JSON.stringify({
      coordinates: [
        [origen.lng, origen.lat],
        [destino.lng, destino.lat],
      ],
      elevation: true,
    }),
    muteHttpExceptions: true,
  })

  const datos = JSON.parse(respuesta.getContentText())
  if (datos.error) {
    const mensaje = typeof datos.error === 'string' ? datos.error : datos.error.message
    throw new Error(`OpenRouteService: ${mensaje || 'error desconocido'}`)
  }

  const propiedades = datos.features[0].properties
  // geometry.coordinates viene como [lng, lat, elevación] por punto de la
  // carretera real; lo pasamos como [lat, lng] para dibujarlo directo en Leaflet.
  const ruta = datos.features[0].geometry.coordinates.map((c) => [c[1], c[0]])

  return {
    km: propiedades.summary.distance / 1000,
    minutos: propiedades.summary.duration / 60,
    ascensoM: propiedades.ascent || 0,
    ruta: ruta,
  }
}

function obtenerSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  if (!id) {
    throw new Error('Falta configurar la propiedad de script SHEET_ID (ver apps-script/README.md).')
  }
  return SpreadsheetApp.openById(id)
}

function leerTiposTransporte() {
  const hoja = obtenerSpreadsheet().getSheetByName(HOJA_TIPOS)
  const filas = hoja.getDataRange().getValues()
  const cabecera = filas[0]
  const tipos = {}

  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i]
    const clave = fila[0]
    if (!clave) continue

    const registro = {}
    cabecera.forEach((nombreColumna, columna) => {
      if (columna === 0) return
      registro[nombreColumna] = fila[columna]
    })
    tipos[clave] = registro
  }

  return tipos
}

function leerConfig() {
  const hoja = obtenerSpreadsheet().getSheetByName(HOJA_CONFIG)
  const filas = hoja.getDataRange().getValues()
  const config = {}

  for (let i = 1; i < filas.length; i++) {
    const [clave, valor] = filas[i]
    if (!clave) continue
    config[clave] = valor
  }

  return config
}

function responderJSON(datos) {
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON)
}
