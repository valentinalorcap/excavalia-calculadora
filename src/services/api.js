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
