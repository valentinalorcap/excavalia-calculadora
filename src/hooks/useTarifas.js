import { useEffect, useState } from 'react'
import { TIPOS_TRANSPORTE, CONFIG_GENERAL } from '../config/rates'
import { obtenerDatosDesdeSheet } from '../services/api'

// Tarifas + configuración general, con las de ejemplo como valor inicial
// y sustituidas por las reales de la Google Sheet en cuanto llegan.
export function useTarifas() {
  const [tipos, setTipos] = useState(TIPOS_TRANSPORTE)
  const [config, setConfig] = useState(CONFIG_GENERAL)
  const [fuente, setFuente] = useState('ejemplo')

  useEffect(() => {
    let cancelado = false

    obtenerDatosDesdeSheet().then((datos) => {
      if (cancelado || !datos) return
      if (datos.tipos) setTipos(datos.tipos)
      if (datos.config) setConfig({ ...CONFIG_GENERAL, ...datos.config })
      setFuente('sheet')
    })

    return () => {
      cancelado = true
    }
  }, [])

  return { tipos, config, fuente }
}
