import { useState, useEffect } from 'react'
import { distanciaEnLineaRecta } from '../lib/geo'
import { calcularPrecio } from '../lib/pricing'
import { obtenerRutaReal } from '../services/api'

const ROLES_PUNTO = ['base', 'inicio', 'fin']

export function useCalculator(tipos, config) {
  const [tipo, setTipo] = useState(null)
  const [n, setN] = useState(1)
  const [horasCargaDescarga, setHorasCargaDescarga] = useState(1)
  const [precioDiesel, setPrecioDiesel] = useState(1.55)
  const [puntos, setPuntos] = useState([])
  const [resultado, setResultado] = useState(null)

  const [tramos, setTramos] = useState(null)
  const [origenTramos, setOrigenTramos] = useState(null) // 'openrouteservice' | 'estimado'
  const [cargandoRuta, setCargandoRuta] = useState(false)

  const siguienteRol = puntos.length < 3 ? ROLES_PUNTO[puntos.length] : null

  function agregarPunto(lat, lng) {
    if (puntos.length >= 3) return
    setPuntos((prev) => [...prev, { rol: ROLES_PUNTO[prev.length], lat, lng }])
    setResultado(null)
  }

  function reiniciarPuntos() {
    setPuntos([])
    setTramos(null)
    setOrigenTramos(null)
    setResultado(null)
  }

  useEffect(() => {
    if (puntos.length < 3) {
      setTramos(null)
      setOrigenTramos(null)
      return
    }

    let cancelado = false
    setCargandoRuta(true)

    obtenerRutaReal(puntos).then((real) => {
      if (cancelado) return
      if (real) {
        setTramos({
          tramo1Km: real.tramo1.km,
          tramo2Km: real.tramo2.km,
          tramo1Min: real.tramo1.minutos,
          tramo2Min: real.tramo2.minutos,
          tramo1AscensoM: real.tramo1.ascensoM,
          tramo2AscensoM: real.tramo2.ascensoM,
        })
        setOrigenTramos('openrouteservice')
      } else {
        setTramos({
          tramo1Km: distanciaEnLineaRecta(puntos[0], puntos[1]),
          tramo2Km: distanciaEnLineaRecta(puntos[1], puntos[2]),
        })
        setOrigenTramos('estimado')
      }
      setCargandoRuta(false)
    })

    return () => {
      cancelado = true
    }
  }, [puntos])

  function calcular() {
    if (!tipo || !tramos) return
    const r = calcularPrecio({
      tipoConfig: tipos[tipo],
      tramos,
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
    origenTramos,
    cargandoRuta,
    resultado,
    calcular,
    tarifaMinima: config.tarifaMinima,
  }
}
