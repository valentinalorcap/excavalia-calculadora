import { Stepper } from './Stepper'

export function TimeFuelForm({ horasCargaDescarga, onHorasChange, precioDiesel, onDieselChange }) {
  return (
    <div className="card">
      <h2>Tiempos y combustible</h2>
      <Stepper
        label="Horas de carga y descarga (por cada repetición)"
        unidad="h"
        valor={horasCargaDescarga}
        min={0}
        max={8}
        onChange={onHorasChange}
      />
      <div className="field">
        <label>Precio del diésel hoy</label>
        <div className="euro-field">
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={precioDiesel}
            onChange={(e) => onDieselChange(Number(e.target.value) || 0)}
          />
          <span>€ / L</span>
        </div>
      </div>
    </div>
  )
}
