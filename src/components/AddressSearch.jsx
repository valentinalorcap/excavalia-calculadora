import { useEffect, useRef, useState } from 'react'
import { buscarDireccion } from '../services/geocoding'

export function AddressSearch({ etiquetaSiguiente, onSeleccionar }) {
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const temporizadorRef = useRef(null)

  useEffect(() => {
    clearTimeout(temporizadorRef.current)
    if (consulta.trim().length < 3) {
      setResultados([])
      return
    }
    temporizadorRef.current = setTimeout(async () => {
      setBuscando(true)
      const encontrados = await buscarDireccion(consulta)
      setResultados(encontrados)
      setBuscando(false)
      setAbierto(true)
    }, 450)
    return () => clearTimeout(temporizadorRef.current)
  }, [consulta])

  function seleccionar(resultado) {
    onSeleccionar(resultado.lat, resultado.lng)
    setConsulta('')
    setResultados([])
    setAbierto(false)
  }

  return (
    <div className="address-search">
      <input
        type="text"
        placeholder={`Buscar dirección para ${etiquetaSiguiente}…`}
        value={consulta}
        onChange={(e) => setConsulta(e.target.value)}
        onFocus={() => resultados.length > 0 && setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
      />
      {buscando && <div className="address-search__status">Buscando…</div>}
      {abierto && resultados.length > 0 && (
        <ul className="address-search__results">
          {resultados.map((resultado, i) => (
            <li key={i}>
              <button type="button" onMouseDown={() => seleccionar(resultado)}>
                {resultado.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
