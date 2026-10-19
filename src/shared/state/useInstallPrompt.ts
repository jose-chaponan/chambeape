import { useCallback, useEffect, useState } from 'react'

export const INSTALL_DISMISSED_KEY = 'chambea-pe-install-dismissed'
const DISMISS_DAYS = 30

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * - `native`: el navegador permite instalar con un clic (Chrome, Edge, Android).
 * - `ios`: iPhone y iPad no tienen ese aviso; hay que explicar "Añadir a pantalla de inicio".
 */
export type InstallMode = 'native' | 'ios'

function wasDismissedRecently(): boolean {
  try {
    const dismissedAt = Number(window.localStorage.getItem(INSTALL_DISMISSED_KEY))
    return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()))
  } catch {
    // Sin almacenamiento: el aviso volverá a aparecer en la próxima visita, no pasa nada.
  }
}

function isAlreadyInstalled(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  // Los iPad recientes se presentan como Mac: se distinguen por la pantalla táctil.
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(() => wasDismissedRecently() || isAlreadyInstalled())
  const [ios] = useState(isIos)

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      // Se guarda el aviso nativo para lanzarlo desde nuestro propio botón.
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setDeferredPrompt(null)
      setHidden(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    rememberDismissal()
    setHidden(true)
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    // El aviso nativo solo puede usarse una vez.
    setDeferredPrompt(null)
    if (outcome === 'accepted') {
      setHidden(true)
    } else {
      dismiss()
    }
  }, [deferredPrompt, dismiss])

  let mode: InstallMode | null = null
  if (!hidden) {
    if (deferredPrompt) mode = 'native'
    else if (ios) mode = 'ios'
  }

  return { mode, install, dismiss }
}
