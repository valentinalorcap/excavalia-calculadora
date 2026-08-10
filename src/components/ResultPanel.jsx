import { formatEUR, formatKm, formatTiempo } from '../lib/format'

export function ResultPanel({ resultado, tarifaMinima }) {
  return (
    <div className="result-band">
      <div className="result-inner">
        <div className="price-block">
          <div className="price-lbl">Precio del servicio</div>
          <div className="price">{resultado ? formatEUR(resultado.precioFinal) : '— €'}</div>
          <div className="min-note">
            {resultado?.aplicaMinima ? `Se aplica la tarifa mínima de ${formatEUR(tarifaMinima)}` : ''}
          </div>
        </div>
        <div className="result-divider" />
        <div className="result-stats">
          <div className="stat">
            <span>Distancia total</span>
            <b>{resultado ? formatKm(resultado.distanciaTotal) : '–'}</b>
          </div>
          <div className="stat">
            <span>Tiempo total</span>
            <b>{resultado ? formatTiempo(resultado.minTotal) : '–'}</b>
          </div>
          <div className="stat">
            <span>Máx. repeticiones / jornada 8h</span>
            <b>{resultado ? resultado.nMaxJornada : '–'}</b>
          </div>
        </div>
      </div>
    </div>
  )
}
