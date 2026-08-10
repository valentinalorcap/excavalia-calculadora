import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatKm } from '../lib/format'

// Excavalia Canarias opera desde Gran Canaria — centramos el mapa ahí por defecto.
const CENTRO_INICIAL = [27.95, -15.55]
const ZOOM_INICIAL = 10

const ETIQUETA_ROL = { base: 'Base', inicio: 'Inicio servicio', fin: 'Fin servicio' }

function iconoPunto(rol) {
  return L.divIcon({
    className: '',
    html: `<div class="map-pin map-pin--${rol}"><span class="map-pin__tag">${ETIQUETA_ROL[rol]}</span></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  })
}

function ClicksDelMapa({ onClic }) {
  useMapEvents({
    click(e) {
      onClic(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function RouteMap({
  puntos,
  siguienteRol,
  onAgregarPunto,
  onReiniciar,
  n,
  onNChange,
  tramos,
  origenTramos,
  cargandoRuta,
}) {
  const puntosLatLng = puntos.map((p) => [p.lat, p.lng])

  return (
    <div className="col-map">
      <div className="map-card">
        <div className="map-toolbar">
          <div className="hint">
            {siguienteRol ? (
              <>Haz clic en el mapa para fijar <b>{ETIQUETA_ROL[siguienteRol]}</b></>
            ) : cargandoRuta ? (
              'Calculando ruta…'
            ) : tramos ? (
              <>Puntos fijados · <b>{formatKm(tramos.tramo1Km * 2 + n * 2 * tramos.tramo2Km)}</b> en total</>
            ) : null}
          </div>
          <button className="reset-btn" type="button" onClick={onReiniciar}>
            Reiniciar puntos
          </button>
        </div>

        <div className="map-area">
          <MapContainer center={CENTRO_INICIAL} zoom={ZOOM_INICIAL} scrollWheelZoom style={{ height: '420px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClicksDelMapa onClic={onAgregarPunto} />

            {puntos.map((p, i) => (
              <Marker key={i} position={[p.lat, p.lng]} icon={iconoPunto(p.rol)} />
            ))}

            {puntos.length >= 2 && (
              <Polyline
                positions={tramos?.tramo1Ruta ?? [puntosLatLng[0], puntosLatLng[1]]}
                pathOptions={
                  tramos?.tramo1Ruta
                    ? { color: '#15140f', weight: 4 }
                    : { color: '#15140f', dashArray: '6 4', weight: 3 }
                }
              />
            )}
            {puntos.length >= 3 && (
              <Polyline
                positions={tramos?.tramo2Ruta ?? [puntosLatLng[1], puntosLatLng[2]]}
                pathOptions={
                  tramos?.tramo2Ruta
                    ? { color: '#c99a05', weight: 4 }
                    : { color: '#c99a05', dashArray: '1 6', weight: 3, lineCap: 'round' }
                }
              />
            )}
          </MapContainer>
        </div>

        <div className="map-toolbar" style={{ borderTop: '1px solid var(--line)', borderBottom: 'none' }}>
          <div className="rep-inline">
            <label>Repeticiones del tramo inicio ↔ fin</label>
            <div className="stepper stepper--compact">
              <button type="button" aria-label="Menos repeticiones" onClick={() => onNChange(Math.max(1, n - 1))}>−</button>
              <div className="val"><span>{n}</span></div>
              <button type="button" aria-label="Más repeticiones" onClick={() => onNChange(Math.min(20, n + 1))}>+</button>
            </div>
          </div>
          {tramos && (
            <div className="hint">
              {formatKm(tramos.tramo1Km)} base↔inicio · {formatKm(tramos.tramo2Km)} inicio↔fin
            </div>
          )}
        </div>

        <div className="map-legend">
          <span>◆ negro — base · ◆ dorado — inicio / fin de servicio</span>
          <span>
            {origenTramos === 'openrouteservice'
              ? 'Ruta real por carretera (OpenRouteService)'
              : origenTramos === 'estimado'
                ? 'Estimación en línea recta — no se pudo consultar OpenRouteService'
                : 'La ruta se calcula al fijar los 3 puntos'}
          </span>
        </div>
      </div>
    </div>
  )
}
