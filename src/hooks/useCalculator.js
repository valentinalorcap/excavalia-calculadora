import { useState, useMemo } from 'react'
import { distanciaEnLineaRecta } from '../lib/geo'
import { calcularPrecio } from '../lib/pricing'

const ROLES_PUNTO = ['base', 'inicio', 'fin']

export function useCalculator(tipos, config) {
  const [tipo, setTipo] = useState(null)
  const [n, setN] = useState(1)
  const [horasCargaDescarga, setHorasCargaDescarga] = useState(1)
  const [precioDiesel, setPrecioDiesel] = useState(1.55)
  const [puntos, setPuntos] = useState([])
  const [resultado, setResultado] = useState(null)

  const siguienteRol = puntos.length < 3 ? ROLES_PUNTO[puntos.length] : null

  function agregarPunto(lat, lng) {
    if (puntos.length >= 3) return
    setPuntos((prev) => [...prev, { rol: ROLES_PUNTO[prev.length], lat, lng }])
    setResultado(null)
  }

  function reiniciarPuntos() {
    setPuntos([])
    setResultado(null)
  }

  const tramos = useMemo(() => {
    if (puntos.length < 3) return null
    const tramo1Km = distanciaEnLineaRecta(puntos[0], puntos[1])
    const tramo2Km = distanciaEnLineaRecta(puntos[1], puntos[2])
    return { tramo1Km, tramo2Km }
  }, [puntos])

  function calcular() {
    if (!tipo || !tramos) return
    const r = calcularPrecio({
      tipoConfig: tipos[tipo],
      tramo1Km: tramos.tramo1Km,
      tramo2Km: tramos.tramo2Km,
      n,
      horasCargaDescarga,
      precioDiesel,
      config,
    })
    setResultado(r)
  }

  return {
    tipo,
    setTipo,
    n,
    setN,
    horasCargaDescarga,
    setHorasCargaDescarga,
    precioDiesel,
    setPrecioDiesel,
    puntos,
    siguienteRol,
    agregarPunto,
    reiniciarPuntos,
    tramos,
    resultado,
    calcular,
    tarifaMinima: config.tarifaMinima,
  }
}
