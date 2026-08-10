import { TopBar } from './components/TopBar'
import { TransportTypeSelector } from './components/TransportTypeSelector'
import { TimeFuelForm } from './components/TimeFuelForm'
import { RouteMap } from './components/RouteMap'
import { ResultPanel } from './components/ResultPanel'
import { useCalculator } from './hooks/useCalculator'
import { useTarifas } from './hooks/useTarifas'

function App() {
  const { tipos, config, fuente } = useTarifas()
  const calc = useCalculator(tipos, config)

  return (
    <>
      <TopBar />

      <div className="shell">
        <div className="grid">
          <div className="col-form">
            <TransportTypeSelector tipos={tipos} tipo={calc.tipo} onChange={calc.setTipo} />
            <TimeFuelForm
              horasCargaDescarga={calc.horasCargaDescarga}
              onHorasChange={calc.setHorasCargaDescarga}
              precioDiesel={calc.precioDiesel}
              onDieselChange={calc.setPrecioDiesel}
            />
            <button className="calc-btn" type="button" onClick={calc.calcular}>
              Calcular servicio
            </button>
          </div>

          <RouteMap
            puntos={calc.puntos}
            siguienteRol={calc.siguienteRol}
            onAgregarPunto={calc.agregarPunto}
            onReiniciar={calc.reiniciarPuntos}
            n={calc.n}
            onNChange={calc.setN}
            tramos={calc.tramos}
            origenTramos={calc.origenTramos}
            cargandoRuta={calc.cargandoRuta}
          />
        </div>
      </div>

      <ResultPanel resultado={calc.resultado} />

      <p className="foot-note">
        Tarifas: {fuente === 'sheet' ? 'leídas de la Google Sheet en vivo.' : 'de ejemplo (aún no hay Apps Script conectado, ver .env.example).'}
      </p>
    </>
  )
}

export default App
