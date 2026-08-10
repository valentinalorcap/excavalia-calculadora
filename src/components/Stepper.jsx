export function Stepper({ label, unidad, valor, min = 0, max = 20, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="stepper">
        <button type="button" aria-label={`Menos ${label}`} onClick={() => onChange(Math.max(min, valor - 1))}>
          −
        </button>
        <div className="val">
          <span>{valor}</span> {unidad}
        </div>
        <button type="button" aria-label={`Más ${label}`} onClick={() => onChange(Math.min(max, valor + 1))}>
          +
        </button>
      </div>
    </div>
  )
}
