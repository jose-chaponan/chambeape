import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { Tooltip } from '@mui/material'

export const VERIFIED_LABEL = 'Emprendimiento verificado'

// Azul de "cuenta verificada" (el que ya reconoce la gente); 3.5:1 sobre blanco, suficiente para un gráfico.
const VERIFIED_COLOR = '#1a8cd8'

interface VerifiedBadgeProps {
  size?: number | string
  /** Cuando el texto "Emprendimiento verificado" ya está en pantalla, el ícono solo decora. */
  decorative?: boolean
}

export function VerifiedBadge({ size = 20, decorative = false }: Readonly<VerifiedBadgeProps>) {
  const sx = { fontSize: size, color: VERIFIED_COLOR, flexShrink: 0, verticalAlign: 'text-bottom' }

  if (decorative) {
    return <VerifiedRoundedIcon aria-hidden="true" sx={sx} />
  }

  return (
    <Tooltip title={VERIFIED_LABEL}>
      <VerifiedRoundedIcon titleAccess={VERIFIED_LABEL} sx={sx} />
    </Tooltip>
  )
}
