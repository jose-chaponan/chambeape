import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useInstallPrompt } from '../state/useInstallPrompt'

// Alto de la barra inferior móvil (64 px) más un respiro, para que el aviso no la tape.
const ABOVE_BOTTOM_NAV = 'calc(64px + env(safe-area-inset-bottom) + 12px)'

/** Invita a instalar Chambea Pe: botón nativo donde existe y pasos de "Añadir a pantalla de inicio" en iPhone. */
export function InstallPrompt() {
  const { mode, install, dismiss } = useInstallPrompt()

  if (!mode) {
    return null
  }

  return (
    <Paper
      component="aside"
      role="region"
      aria-label="Instalar la aplicación"
      elevation={0}
      sx={{
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.appBar,
        insetInline: 16,
        bottom: { xs: ABOVE_BOTTOM_NAV, md: 24 },
        insetInlineStart: { md: 'auto' },
        insetInlineEnd: { md: 24 },
        width: { md: 380 },
        p: 2,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 12px 32px rgba(40, 19, 35, 0.18)',
        animation: 'install-rise 420ms cubic-bezier(0.16, 1, 0.3, 1) both',
        '@keyframes install-rise': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Box
          component="img"
          src="/icon-192.png"
          alt=""
          width={44}
          height={44}
          sx={{ flexShrink: 0, borderRadius: 1.5, bgcolor: 'background.default' }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>Instala Chambea Pe</Typography>
          {mode === 'native' ? (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              Ábrela como una app, directo desde tu pantalla de inicio.
            </Typography>
          ) : (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              Toca{' '}
              <IosShareRoundedIcon
                aria-label="Compartir"
                sx={{ fontSize: 18, verticalAlign: 'text-bottom', color: 'text.primary' }}
              />{' '}
              <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>.
            </Typography>
          )}
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
        <Button color="inherit" onClick={dismiss} sx={{ minHeight: 40 }}>
          {mode === 'native' ? 'Ahora no' : 'Entendido'}
        </Button>
        {mode === 'native' && (
          <Button variant="contained" onClick={install} sx={{ minHeight: 40 }}>
            Instalar
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
