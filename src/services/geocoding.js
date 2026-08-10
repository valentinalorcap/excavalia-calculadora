const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
// Limita la búsqueda a Canarias, donde opera Excavalia (lon,lat esquina sup-izq / inf-der).
const VIEWBOX_CANARIAS = '-18.5,29.5,-13.0,27.0'

// Devuelve hasta 5 direcciones que coinciden con la búsqueda, o [] si no
// hay resultados o falla la petición (Nominatim es gratuito, sin clave).
export async function buscarDireccion(consulta) {
  if (!consulta || consulta.trim().length < 3) return []

  const params = new URLSearchParams({
    format: 'json',
    q: consulta,
    limit: '5',
    countrycodes: 'es',
    viewbox: VIEWBOX_CANARIAS,
    bounded: '1',
  })

  try {
    const respuesta = await fetch(`${NOMINATIM_URL}?${params}`)
    if (!respuesta.ok) throw new Error(`Nominatim respondió ${respuesta.status}`)
    const resultados = await respuesta.json()
    return resultados.map((r) => ({ etiqueta: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }))
  } catch (error) {
    console.warn('No se pudo buscar la dirección.', error)
    return []
  }
}
