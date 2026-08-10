const comunes = {
  viewBox: '0 0 48 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.3,
  strokeLinejoin: 'round',
}

export function IconPlancha(props) {
  return (
    <svg {...comunes} {...props}>
      <rect x="2" y="16" width="30" height="6" />
      <rect x="10" y="7" width="14" height="9" />
      <circle cx="16" cy="4" r="2.2" />
      <rect x="32" y="10" width="10" height="12" />
      <circle cx="9" cy="24" r="3" />
      <circle cx="38" cy="24" r="3" />
    </svg>
  )
}

export function IconBanera(props) {
  return (
    <svg {...comunes} {...props}>
      <rect x="2" y="10" width="12" height="12" />
      <polygon points="16,22 16,8 34,10 34,22" />
      <circle cx="9" cy="24" r="3" />
      <circle cx="27" cy="24" r="3" />
    </svg>
  )
}

export function IconMultilift(props) {
  return (
    <svg {...comunes} {...props}>
      <rect x="2" y="12" width="12" height="10" />
      <rect x="18" y="6" width="18" height="14" />
      <line x1="14" y1="10" x2="18" y2="6" />
      <circle cx="9" cy="24" r="3" />
      <circle cx="29" cy="24" r="3" />
    </svg>
  )
}

export function IconFurgo(props) {
  return (
    <svg {...comunes} {...props}>
      <rect x="3" y="8" width="34" height="14" rx="2.5" />
      <line x1="29" y1="8" x2="29" y2="22" />
      <line x1="8" y1="13" x2="24" y2="13" />
      <circle cx="13" cy="24" r="3" />
      <circle cx="31" cy="24" r="3" />
    </svg>
  )
}

export const ICONOS_TIPO = {
  plancha: IconPlancha,
  banera: IconBanera,
  multilift: IconMultilift,
  furgo: IconFurgo,
}
