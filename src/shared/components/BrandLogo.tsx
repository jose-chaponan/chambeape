import { Box } from '@mui/material'
import isologo from '../assets/brand/isologo.png'
import logo from '../assets/brand/logo.png'

interface BrandLogoProps {
  compact?: boolean
}

export function BrandLogo({ compact = false }: Readonly<BrandLogoProps>) {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', height: compact ? 52 : 96, overflow: 'hidden' }}
    >
      <Box
        component="img"
        src={logo}
        alt="Chambea Pe"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: compact ? 148 : { sm: 228, md: 268 },
          height: compact ? 92 : { sm: 142, md: 166 },
          objectFit: 'contain',
        }}
      />
      <Box
        component="img"
        src={isologo}
        alt="Chambea Pe"
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: compact ? 58 : 112,
          height: compact ? 58 : 112,
          objectFit: 'contain',
        }}
      />
    </Box>
  )
}
