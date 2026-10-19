import { Box, Button, Stack, Typography } from '@mui/material'
import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la interfaz', error, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 420, textAlign: 'center' }} role="alert">
          <Typography component="h1" variant="h5">Algo salió mal</Typography>
          <Typography color="text.secondary">
            Ocurrió un error inesperado. Recarga la página para intentarlo de nuevo.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </Stack>
      </Box>
    )
  }
}
