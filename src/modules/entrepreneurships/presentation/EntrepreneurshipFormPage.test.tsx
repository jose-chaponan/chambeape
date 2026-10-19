import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '../../../app/AppProviders'
import { AppRoutes } from '../../../app/routes/AppRouter'
import { localDatabase } from '../../../data/localDatabase'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import type { User } from '../../users/domain/User'
import { ENTREPRENEURSHIP_STORAGE_KEY, useEntrepreneurshipStore } from '../state/useEntrepreneurshipStore'

vi.mock('../../../shared/infrastructure/photoImage', () => ({
  fileToPhotoDataUrl: vi.fn(async (file: File) =>
    file.type.startsWith('image/')
      ? { ok: true, dataUrl: 'data:image/jpeg;base64,QUJD' }
      : { ok: false, message: 'Usa una imagen JPG, PNG o WebP.' },
  ),
}))

const newUser: User = {
  id: 'usr-nuevo',
  email: 'nuevo@example.com',
  password: '1234567890',
  firstNames: 'Nuevo',
  lastNames: 'Emprendedor',
}

const admin: User = {
  id: 'usr-administrador-sistema',
  email: 'admin@gmail.com',
  password: '1234567890',
  firstNames: 'Administrador',
  lastNames: 'Del sistema',
}

function renderAt(route: string) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  )
}

function chooseOption(label: RegExp, option: string) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: label }))
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: option }))
}

function type(label: RegExp | string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

async function fillValidForm() {
  type(/Nombre del emprendimiento/, 'Dulces Pachacámac')
  chooseOption(/Categoría/, 'Alimentos y bebidas')
  type(/Descripción corta/, 'Dulces tradicionales hechos en casa.')
  type(/Tu historia/, 'Empezamos vendiendo a los vecinos y hoy llegamos a toda Lima.')
  fireEvent.change(screen.getByLabelText('Producto o servicio'), { target: { value: 'Suspiro limeño' } })
  fireEvent.keyDown(screen.getByLabelText('Producto o servicio'), { key: 'Enter' })
  chooseOption(/Distrito/, 'Pachacámac')
  fireEvent.change(screen.getByLabelText('Elegir foto de portada'), {
    target: { files: [new File(['x'], 'portada.png', { type: 'image/png' })] },
  })
  await waitFor(() => expect(screen.getByAltText('Vista previa de la portada')).toBeInTheDocument())
  type(/DNI/, '12345678')
}

describe('EntrepreneurshipFormPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ session: null })
    useEntrepreneurshipStore.setState({ entrepreneurships: {} })
  })

  afterEach(() => vi.restoreAllMocks())

  it('offers to create an entrepreneurship when the user has none', () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento')

    expect(screen.getByRole('link', { name: 'Crear mi emprendimiento' })).toHaveAttribute(
      'href',
      '/mi-emprendimiento/nuevo',
    )
  })

  it('shows what is missing instead of saving an empty form', () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento/nuevo')

    fireEvent.click(screen.getByRole('button', { name: 'Publicar emprendimiento' }))

    expect(screen.getByText('Ingresa el nombre de tu emprendimiento.')).toBeInTheDocument()
    expect(screen.getByText('Elige una categoría.')).toBeInTheDocument()
    expect(screen.getByText('Agrega al menos un producto o servicio.')).toBeInTheDocument()
    expect(screen.getByText('Sube una foto de portada.')).toBeInTheDocument()
    expect(screen.getByText('El DNI tiene 8 dígitos.')).toBeInTheDocument()
    expect(Object.keys(useEntrepreneurshipStore.getState().entrepreneurships)).toHaveLength(0)
  })

  it('creates an entrepreneurship, persists it in localStorage and opens its detail', async () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento/nuevo')

    await fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar emprendimiento' }))

    const created = Object.values(useEntrepreneurshipStore.getState().entrepreneurships)
    expect(created).toHaveLength(1)
    expect(created[0]).toMatchObject({
      businessName: 'Dulces Pachacámac',
      ownerUserId: 'usr-nuevo',
      categoryId: 'food',
      products: ['Suspiro limeño'],
      location: { district: 'Pachacámac', province: 'Lima', department: 'Lima' },
      rating: 0,
      verified: false,
    })
    expect(created[0].id).toMatch(/^ent-dulces-pachacamac-/)

    const stored = JSON.parse(window.localStorage.getItem(ENTREPRENEURSHIP_STORAGE_KEY) ?? '{}')
    expect(stored.state.entrepreneurships[created[0].id].businessName).toBe('Dulces Pachacámac')

    expect(await screen.findByRole('heading', { level: 1, name: 'Dulces Pachacámac' })).toBeInTheDocument()
    expect(screen.getByText('Nuevo en Chambea Pe')).toBeInTheDocument()
  })

  it('lists the new entrepreneurship under Mi emprendimiento and in the public catalog', async () => {
    useAuthStore.getState().startSession(newUser)
    const form = renderAt('/mi-emprendimiento/nuevo')
    await fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar emprendimiento' }))
    await screen.findByRole('heading', { level: 1, name: 'Dulces Pachacámac' })
    form.unmount()

    const mine = renderAt('/mi-emprendimiento')
    expect(screen.getByRole('heading', { name: 'Dulces Pachacámac' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Editar Dulces Pachacámac' })).toBeInTheDocument()
    mine.unmount()

    renderAt('/home')
    expect(screen.getByRole('heading', { name: 'Dulces Pachacámac' })).toBeInTheDocument()
    expect(screen.getByText(`${localDatabase.entrepreneurships.length + 1} emprendimientos`)).toBeInTheDocument()
  })

  it('rejects links that are not http(s) so they never become clickable scripts', () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento/nuevo')

    type('Facebook', 'javascript:alert(1)')
    type('Instagram', 'https://www.instagram.com/mi.negocio')
    fireEvent.click(screen.getByRole('button', { name: 'Publicar emprendimiento' }))

    expect(screen.getByText('Ingresa un enlace completo que empiece con https://')).toBeInTheDocument()
  })

  it('tells the user when the device storage is full and keeps nothing half saved', async () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento/nuevo')
    await fillValidForm()

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publicar emprendimiento' }))

    expect(screen.getByText(/almacenamiento de este dispositivo está lleno/)).toBeInTheDocument()
    expect(Object.keys(useEntrepreneurshipStore.getState().entrepreneurships)).toHaveLength(0)
  })

  it('edits an existing entrepreneurship and uses the saved version instead of the domain data', async () => {
    useAuthStore.getState().startSession(admin)
    renderAt('/mi-emprendimiento/ent-sabor-andino/editar')

    expect(screen.getByLabelText(/Nombre del emprendimiento/)).toHaveValue('Sabor Andino')
    type(/Nombre del emprendimiento/, 'Sabor Andino Gourmet')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Sabor Andino Gourmet' })).toBeInTheDocument()
    const saved = useEntrepreneurshipStore.getState().entrepreneurships['ent-sabor-andino']
    expect(saved).toMatchObject({ businessName: 'Sabor Andino Gourmet', verified: true, rating: 4.8 })
    expect(saved.ownerUserId).toBe('usr-administrador-sistema')
  })

  it('only lets the owner edit an entrepreneurship', () => {
    useAuthStore.getState().startSession(newUser)
    renderAt('/mi-emprendimiento/ent-sabor-andino/editar')

    expect(screen.getByRole('heading', { name: 'No encontramos ese emprendimiento' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/Nombre del emprendimiento/)).not.toBeInTheDocument()
  })

  it('shows the edit shortcut on the detail only to the owner', () => {
    useAuthStore.getState().startSession(admin)
    const owner = renderAt('/emprendimientos/ent-sabor-andino')
    expect(screen.getByRole('link', { name: 'Editar mi emprendimiento' })).toHaveAttribute(
      'href',
      '/mi-emprendimiento/ent-sabor-andino/editar',
    )
    owner.unmount()

    useAuthStore.getState().startSession(newUser)
    renderAt('/emprendimientos/ent-sabor-andino')
    expect(screen.queryByRole('link', { name: 'Editar mi emprendimiento' })).not.toBeInTheDocument()
  })

  it('puts Mi emprendimiento in the account menu', () => {
    useAuthStore.getState().startSession(admin)
    renderAt('/home')

    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))
    const menu = screen.getByRole('list', { name: 'Opciones de cuenta' })
    expect(within(menu).getByRole('link', { name: 'Mi emprendimiento' })).toHaveAttribute(
      'href',
      '/mi-emprendimiento',
    )
  })
})
