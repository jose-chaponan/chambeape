import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { INSTALL_DISMISSED_KEY } from '../state/useInstallPrompt'
import { InstallPrompt } from './InstallPrompt'

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'

function setUserAgent(value: string) {
  vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(value)
}

function fireBeforeInstallPrompt(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const prompt = vi.fn(async () => undefined)
  const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
    prompt,
    userChoice: Promise.resolve({ outcome }),
  })
  act(() => {
    window.dispatchEvent(event)
  })
  return { prompt, event }
}

describe('InstallPrompt', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia
  })

  afterEach(() => vi.restoreAllMocks())

  it('shows nothing when the browser offers no installation and it is not an iPhone', () => {
    render(<InstallPrompt />)
    expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument()
  })

  it('offers the native install button when the browser allows it', async () => {
    render(<InstallPrompt />)
    const { prompt, event } = fireBeforeInstallPrompt('accepted')

    expect(event.defaultPrevented).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Instalar' }))

    await waitFor(() => expect(prompt).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument(),
    )
  })

  it('remembers when the user declines the native prompt', async () => {
    render(<InstallPrompt />)
    fireBeforeInstallPrompt('dismissed')

    fireEvent.click(screen.getByRole('button', { name: 'Instalar' }))

    await waitFor(() => expect(window.localStorage.getItem(INSTALL_DISMISSED_KEY)).not.toBeNull())
    expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument()
  })

  it('explains Add to Home Screen on iPhone, where there is no install prompt', () => {
    setUserAgent(IPHONE_UA)
    render(<InstallPrompt />)

    expect(screen.getByRole('region', { name: 'Instalar la aplicación' })).toBeInTheDocument()
    expect(screen.getByText('Añadir a pantalla de inicio')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Instalar' })).not.toBeInTheDocument()
  })

  it('stays hidden for a while after the user dismisses it', () => {
    setUserAgent(IPHONE_UA)
    const first = render(<InstallPrompt />)

    fireEvent.click(screen.getByRole('button', { name: 'Entendido' }))
    expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument()
    first.unmount()

    render(<InstallPrompt />)
    expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument()
  })

  it('does not show when the app is already installed', () => {
    setUserAgent(IPHONE_UA)
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia
    render(<InstallPrompt />)

    expect(screen.queryByRole('region', { name: 'Instalar la aplicación' })).not.toBeInTheDocument()
  })
})
