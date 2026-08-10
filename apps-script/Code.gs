/**
 * Backend de la calculadora de precios de Excavalia Canarias.
 *
 * Este script va vinculado a la Google Sheet que contiene las tarifas
 * (Extensiones > Apps Script desde la propia hoja), así que
 * SpreadsheetApp.getActiveSpreadsheet() ya apunta a la hoja correcta
 * sin necesidad de guardar ningún ID.
 *
 * Endpoints expuestos (al desplegar como aplicación web):
 *   GET  -> tarifas por tipo de transporte y configuración general
 *   POST -> ruta real (distancia, tiempo, desnivel) entre los puntos del mapa,
 *           vía OpenRouteService
 *
 * Ver apps-script/README.md para las instrucciones de despliegue y para
 * configurar la clave de OpenRouteService.
 */

const HOJA_TIPOS = 'TiposTransporte'
const HOJA_CONFIG = 'Config'
const PERFIL_ORS = 'driving-hgv' // vehículo pesado: evita restricciones no aptas para camiones

function doGet() {
  return responderJSON({
    tipos: leerTiposTransporte(),
    config: leerConfig(),
  })
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
    throw new Error(datos.error.message || 'Error de OpenRouteService')
  }

  const propiedades = datos.features[0].properties
  return {
    km: propiedades.summary.distance / 1000,
    minutos: propiedades.summary.duration / 60,
    ascensoM: propiedades.ascent || 0,
  }
}

function leerTiposTransporte() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_TIPOS)
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
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CONFIG)
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
