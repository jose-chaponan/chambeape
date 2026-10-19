import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '../../../app/AppProviders'
import { AppRoutes } from '../../../app/routes/AppRouter'
import { useAuthStore } from '../state/useAuthStore'

function renderLogin() {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={['/login']}><AppRoutes /></MemoryRouter>
    </AppProviders>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('shows a generic message for invalid local credentials', () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'equivocada' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('shows the one-second loader then transitions to Home', () => {
    vi.useFakeTimers()
    renderLogin()
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'yulianariosdelaguila@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234567890' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Iniciando sesión…')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1000) })
    act(() => { vi.advanceTimersByTime(300) })

    expect(screen.getByRole('heading', { name: 'Hola, Yuliana Kelly.' })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
