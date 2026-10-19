import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import type { ReactElement } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

export const BOTTOM_NAV_HEIGHT = 64

const items: { value: string; label: string; to: string; icon: ReactElement }[] = [
  { value: 'home', label: 'Home', to: '/home', icon: <HomeRoundedIcon /> },
  { value: 'mine', label: 'Mi emprendimiento', to: '/mi-emprendimiento', icon: <StorefrontRoundedIcon /> },
  { value: 'profile', label: 'Perfil', to: '/perfil', icon: <PersonRoundedIcon /> },
]

function activeItem(pathname: string): string {
  if (pathname.startsWith('/mi-emprendimiento')) return 'mine'
  if (pathname.startsWith('/perfil')) return 'profile'
  return 'home'
}

/** Barra de navegación fija inferior, solo en móvil, que imita la de una app instalada. */
export function MobileBottomNav() {
  const { pathname } = useLocation()

  return (
    <Paper
      component="nav"
      aria-label="Navegación principal"
      elevation={0}
      square
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom)',
        bgcolor: 'background.paper',
      }}
    >
      <BottomNavigation showLabels value={activeItem(pathname)} sx={{ height: BOTTOM_NAV_HEIGHT, bgcolor: 'transparent' }}>
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            component={RouterLink}
            to={item.to}
            value={item.value}
            label={item.label}
            aria-current={activeItem(pathname) === item.value ? 'page' : undefined}
            icon={
              <Box
                className="nav-icon"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 56,
                  height: 30,
                  borderRadius: 4,
                  transition: 'background-color 200ms ease',
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                {item.icon}
              </Box>
            }
            sx={{
              minWidth: 0,
              px: 0.5,
              color: 'text.secondary',
              '& .MuiBottomNavigationAction-label': { fontSize: '0.72rem', fontWeight: 600, mt: 0.25 },
              '&.Mui-selected': { color: 'text.primary' },
              '&.Mui-selected .MuiBottomNavigationAction-label': { fontSize: '0.72rem', fontWeight: 800 },
              '&.Mui-selected .nav-icon': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
              '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: -3 },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
