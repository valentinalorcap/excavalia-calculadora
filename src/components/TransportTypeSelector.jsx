import { ICONOS_TIPO } from './TransportIcons'

export function TransportTypeSelector({ tipos, tipo, onChange }) {
  const config = tipo ? tipos[tipo] : null

  return (
    <div className="card">
      <h2>Tipo de transporte</h2>
      <div className="type-grid">
        {Object.entries(tipos).map(([clave, info]) => {
          const Icono = ICONOS_TIPO[clave] ?? ICONOS_TIPO.furgo
          const seleccionado = tipo === clave
          return (
            <button
              key={clave}
              type="button"
              className={`type-opt${seleccionado ? ' sel' : ''}`}
              onClick={() => onChange(clave)}
            >
              <Icono className="ticon" />
              {info.etiqueta.split(' ')[0]}
            </button>
          )
        })}
      </div>

      <div className="rate-detail">
        {config ? (
          <>
            <span><b>{Number(config.tarifaKm).toFixed(2)} €</b>/km</span>
            <span><b>{config.tarifaHora} €</b>/h</span>
            <span>base <b>{config.tarifaBase} €</b></span>
            <span>mínima <b>{config.tarifaMinima} €</b></span>
            <span><b>{config.consumoBase}</b> L/100km</span>
          </>
        ) : (
          'Elige un tipo de transporte para ver sus tarifas.'
        )}
      </div>
    </div>
  )
}
