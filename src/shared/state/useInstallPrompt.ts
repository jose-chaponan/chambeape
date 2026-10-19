import { useCallback, useState, useSyncExternalStore } from 'react'

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

// El navegador lanza `beforeinstallprompt` una sola vez por carga de página, y cada pantalla monta su propio
// aviso al navegar. Por eso el evento se guarda fuera de React: así sigue disponible en todas las pantallas.
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

function setDeferredPrompt(event: BeforeInstallPromptEvent | null) {
  deferredPrompt = event
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Se guarda el aviso nativo para lanzarlo desde nuestro propio botón.
    event.preventDefault()
    setDeferredPrompt(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => setDeferredPrompt(null))
}

/** Solo para tests: olvida el aviso nativo guardado. */
export function resetInstallPromptForTests() {
  setDeferredPrompt(null)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => deferredPrompt

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
  const nativePrompt = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const [hidden, setHidden] = useState(() => wasDismissedRecently() || isAlreadyInstalled())
  const [ios] = useState(isIos)

  const dismiss = useCallback(() => {
    rememberDismissal()
    setHidden(true)
  }, [])

  const install = useCallback(async () => {
    if (!nativePrompt) return
    await nativePrompt.prompt()
    const { outcome } = await nativePrompt.userChoice
    // El aviso nativo solo puede usarse una vez.
    setDeferredPrompt(null)
    if (outcome === 'accepted') {
      setHidden(true)
    } else {
      dismiss()
    }
  }, [nativePrompt, dismiss])

  let mode: InstallMode | null = null
  if (!hidden) {
    if (nativePrompt) mode = 'native'
    else if (ios) mode = 'ios'
  }

  return { mode, install, dismiss }
}
