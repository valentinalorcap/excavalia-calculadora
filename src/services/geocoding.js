// La búsqueda de direcciones pasa por Apps Script (que a su vez consulta el
// geocodificador de OpenRouteService) — llamarlo directo desde el navegador
// no es una opción: Nominatim no da cabeceras CORS, y la clave de ORS no
// puede quedar expuesta en el frontend.
const URL_APPS_SCRIPT = import.meta.env.VITE_APPS_SCRIPT_URL

export async function buscarDireccion(consulta) {
  if (!URL_APPS_SCRIPT || !consulta || consulta.trim().length < 3) return []

  try {
    const respuesta = await fetch(`${URL_APPS_SCRIPT}?buscar=${encodeURIComponent(consulta)}`)
    if (!respuesta.ok) throw new Error(`Apps Script respondió ${respuesta.status}`)
    const datos = await respuesta.json()
    return datos.resultados || []
  } catch (error) {
    console.warn('No se pudo buscar la dirección.', error)
    return []
  }
}
