// URL de la aplicación web de Apps Script, una vez desplegada (ver apps-script/README.md).
// Se configura con la variable de entorno VITE_APPS_SCRIPT_URL (archivo .env, ver .env.example).
const URL_APPS_SCRIPT = import.meta.env.VITE_APPS_SCRIPT_URL

// Devuelve { tipos, config } leído de la Google Sheet vía Apps Script,
// o null si no hay URL configurada o la petición falla — en ese caso
// quien llame debe usar las tarifas de ejemplo de src/config/rates.js.
export async function obtenerDatosDesdeSheet() {
  if (!URL_APPS_SCRIPT) return null

  try {
    const respuesta = await fetch(URL_APPS_SCRIPT)
    if (!respuesta.ok) throw new Error(`Apps Script respondió ${respuesta.status}`)
    return await respuesta.json()
  } catch (error) {
    console.warn('No se pudieron leer las tarifas desde la Google Sheet, se usan las de ejemplo.', error)
    return null
  }
}

// Devuelve { tramo1: {km, minutos, ascensoM}, tramo2: {...} } calculado por
// OpenRouteService a través de Apps Script, o null si no está disponible
// (sin URL configurada, sin clave de ORS, o la petición falla) — en ese
// caso quien llame debe usar la estimación en línea recta (src/lib/geo.js).
//
// Importante: el body se manda como string plano (sin fijar Content-Type a
// application/json) a propósito, para que el navegador la trate como una
// petición CORS "simple" y no dispare un preflight OPTIONS, que Apps Script
// no gestiona bien.
export async function obtenerRutaReal(puntos) {
  if (!URL_APPS_SCRIPT) return null

  try {
    const respuesta = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify({ puntos }),
    })
    if (!respuesta.ok) throw new Error(`Apps Script respondió ${respuesta.status}`)
    const datos = await respuesta.json()
    if (datos.error) throw new Error(datos.error)
    return datos
  } catch (error) {
    console.warn('No se pudo calcular la ruta real con OpenRouteService, se usa la estimación en línea recta.', error)
    return null
  }
}
