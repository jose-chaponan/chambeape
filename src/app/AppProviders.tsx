import { CssBaseline, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'
import { appTheme } from './theme/appTheme'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  )
}
