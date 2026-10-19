import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '../../../app/AppProviders'
import { AppRoutes } from '../../../app/routes/AppRouter'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import type { User } from '../domain/User'
import { PROFILE_STORAGE_KEY, useProfileStore } from '../state/useProfileStore'

vi.mock('../infrastructure/avatarImage', () => ({
  fileToAvatarDataUrl: vi.fn(async (file: File) =>
    file.type === 'image/png'
      ? { ok: true, dataUrl: 'data:image/jpeg;base64,AAAA' }
      : { ok: false, message: 'Usa una imagen JPG, PNG o WebP.' },
  ),
}))

const user: User = {
  id: 'usr-yuliana-rios-del-aguila',
  email: 'yulianariosdelaguila@gmail.com',
  password: '1234567890',
  firstNames: 'Yuliana Kelly',
  lastNames: 'Ríos del Aguila',
}

function renderProfile() {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={['/perfil']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ session: null })
    useProfileStore.setState({ profiles: {} })
    useAuthStore.getState().startSession(user)
  })

  it('shows the form with the domain data and a read-only email', () => {
    renderProfile()

    expect(screen.getByLabelText(/Nombres/)).toHaveValue('Yuliana Kelly')
    expect(screen.getByLabelText(/Apellidos/)).toHaveValue('Ríos del Aguila')
    expect(screen.getByLabelText('Correo electrónico')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled()
  })

  it('validates required fields and the phone number', () => {
    renderProfile()

    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: '  ' } })
    fireEvent.change(screen.getByLabelText('Celular'), { target: { value: '12345' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Ingresa tus nombres.')).toBeInTheDocument()
    expect(screen.getByText(/celular peruano de 9 dígitos/)).toBeInTheDocument()
    expect(useProfileStore.getState().profiles).toEqual({})
  })

  it('saves the edited data in localStorage and uses it instead of the domain data', () => {
    renderProfile()

    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: 'Yuli' } })
    fireEvent.change(screen.getByLabelText('Celular'), { target: { value: '987654321' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Tus datos se actualizaron.')).toBeInTheDocument()
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? '{}')
    expect(stored.state.profiles[user.id]).toMatchObject({ firstNames: 'Yuli', phone: '987654321' })
    expect(screen.getByRole('heading', { name: 'Yuli Ríos del Aguila' })).toBeInTheDocument()
  })

  it('restores the saved edits after a reload', () => {
    useProfileStore.getState().saveProfile(user.id, {
      firstNames: 'Yuli',
      lastNames: 'Ríos',
      phone: '',
      gender: '',
      birthDate: '',
      avatarUrl: '',
    })
    renderProfile()

    expect(screen.getByLabelText(/Nombres/)).toHaveValue('Yuli')
  })

  it('updates the profile photo and lets the user remove it', async () => {
    renderProfile()

    const input = screen.getByLabelText('Elegir foto de perfil')
    fireEvent.change(input, { target: { files: [new File(['x'], 'foto.png', { type: 'image/png' })] } })

    await waitFor(() => expect(screen.getByText('Foto de perfil actualizada.')).toBeInTheDocument())
    expect(useProfileStore.getState().profiles[user.id].avatarUrl).toBe('data:image/jpeg;base64,AAAA')

    fireEvent.click(screen.getByRole('button', { name: 'Quitar foto' }))
    expect(useProfileStore.getState().profiles[user.id].avatarUrl).toBe('')
  })

  it('rejects files that are not images', async () => {
    renderProfile()

    fireEvent.change(screen.getByLabelText('Elegir foto de perfil'), {
      target: { files: [new File(['x'], 'doc.pdf', { type: 'application/pdf' })] },
    })

    await waitFor(() => expect(screen.getByText('Usa una imagen JPG, PNG o WebP.')).toBeInTheDocument())
    expect(useProfileStore.getState().profiles[user.id]).toBeUndefined()
  })
})
