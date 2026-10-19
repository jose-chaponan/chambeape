import { Box } from '@mui/material'
import { useState, type ReactNode } from 'react'
import { InstallPrompt } from '../../../../shared/components/InstallPrompt'
import { useAuthStore } from '../../../authentication/state/useAuthStore'
import { useCurrentUser } from '../../../users/state/useCurrentUser'
import { AccountDrawer } from './AccountDrawer'
import { HomeHeader } from './HomeHeader'
import { BOTTOM_NAV_HEIGHT, MobileBottomNav } from './MobileBottomNav'

/** Marco común de las páginas autenticadas: barra superior y menú de cuenta. */
export function PageShell({ children }: Readonly<{ children: ReactNode }>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useCurrentUser()
  const logout = useAuthStore((state) => state.logout)

  if (!user) {
    return null
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        // Reserva el espacio de la barra inferior fija (solo móvil).
        pb: { xs: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`, md: 0 },
      }}
    >
      <HomeHeader onOpenMenu={() => setIsMenuOpen(true)} />
      <AccountDrawer
        open={isMenuOpen}
        user={user}
        onClose={() => setIsMenuOpen(false)}
        onLogout={logout}
      />
      {children}
      <MobileBottomNav />
      <InstallPrompt />
    </Box>
  )
}
