import logoExcavalia from '../assets/logo-excavalia.png'

export function TopBar() {
  return (
    <div className="topbar">
      <div className="logo-wrap">
        <img src={logoExcavalia} alt="Excavalia Canarias" />
      </div>
      <div className="tt">
        <h1>Calculadora de precios</h1>
        <p>Transporte con camión · uso interno de administración</p>
      </div>
    </div>
  )
}
