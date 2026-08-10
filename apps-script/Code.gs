/**
 * Backend de la calculadora de precios de Excavalia Canarias.
 *
 * Este script va vinculado a la Google Sheet que contiene las tarifas
 * (Extensiones > Apps Script desde la propia hoja), así que
 * SpreadsheetApp.getActiveSpreadsheet() ya apunta a la hoja correcta
 * sin necesidad de guardar ningún ID.
 *
 * Endpoint expuesto: GET (al desplegar como aplicación web) — devuelve
 * las tarifas por tipo de transporte y la configuración general en JSON.
 * Ver apps-script/README.md para las instrucciones de despliegue.
 */

const HOJA_TIPOS = 'TiposTransporte'
const HOJA_CONFIG = 'Config'

function doGet() {
  const datos = {
    tipos: leerTiposTransporte(),
    config: leerConfig(),
  }
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON)
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
