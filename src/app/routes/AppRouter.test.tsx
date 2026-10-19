import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '../AppProviders'
import { localDatabase } from '../../data/localDatabase'
import { useAuthStore } from '../../modules/authentication/state/useAuthStore'
import type { User } from '../../modules/users/domain/User'
import { AppRoutes } from './AppRouter'

const user: User = {
  id: 'route-user',
  email: 'route@example.com',
  password: '1234567890',
  firstNames: 'Ruta',
  lastNames: 'Protegida',
}

const admin: User = {
  id: 'usr-administrador-sistema',
  email: 'admin@gmail.com',
  password: '1234567890',
  firstNames: 'Administrador',
  lastNames: 'Del sistema',
}

function renderRoute(route: string) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>
    </AppProviders>,
  )
}

describe('application routes', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('redirects an anonymous visitor from Home to Login', () => {
    renderRoute('/home')
    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
  })

  it('redirects an authenticated visitor away from Login', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/login')
    expect(screen.getByRole('heading', { name: 'Hola, Ruta.' })).toBeInTheDocument()
  })

  it('clears the current session after logout', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))

    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
    expect(window.localStorage.getItem('chambea-pe-auth-session')).toBeNull()
  })

  it('shows profile and settings options in the home drawer', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    expect(screen.getByText('Mi perfil')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
  })

  it('lists entrepreneurships with their categories, image placeholders, and category filters', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByRole('heading', { name: 'Emprendimientos peruanos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Aún no tienes emprendimientos publicados' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.getAllByText('Imagen próximamente')).toHaveLength(5)
    expect(screen.getAllByLabelText('Calificación: 4.8 de 5')).toHaveLength(4)

    fireEvent.click(screen.getByRole('button', { name: 'Artesanía' }))

    expect(screen.getByRole('heading', { name: 'Manitos del Sur' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Sabor Andino' })).not.toBeInTheDocument()
  })

  it('keeps the admin associated with one entrepreneurship while showing the public catalog', () => {
    useAuthStore.getState().startSession(admin)
    renderRoute('/home')

    expect(screen.getByRole('heading', { name: 'Tienes 1 emprendimiento publicado' })).toBeInTheDocument()
    expect(screen.getAllByText('Imagen próximamente')).toHaveLength(5)
  })

  it('allows selecting multiple categories in the mobile filter menu', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Filtrar categorías' }))
    fireEvent.click(screen.getByRole('option', { name: /Alimentos y bebidas/ }))
    fireEvent.click(screen.getByRole('option', { name: /Artesanía/ }))
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' })

    expect(screen.getByRole('heading', { name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Manitos del Sur' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hilo Nativo' })).not.toBeInTheDocument()
  })

  it('shows Sastrería Ríos cover and short description in the catalog', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByRole('img', { name: 'Portada de Sastrería Ríos' }))
      .toHaveAttribute('src', '/emprendimientos/sastreria-rios/sastre.jpg')
    expect(screen.getByText('Sastrería a medida con acabados cuidados para cada ocasión.'))
      .toBeInTheDocument()
  })

  it('shows Sabor Andino cover and gallery in the catalog data', () => {
    const saborAndino = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-sabor-andino',
    )

    expect(saborAndino?.coverImageUrl).toBe('/emprendimientos/sabor-andino/manager.jpg')
    expect(saborAndino?.photoUrls).toEqual([
      '/emprendimientos/sabor-andino/entrada.jpg',
      '/emprendimientos/sabor-andino/restaurante.jpg',
      '/emprendimientos/sabor-andino/sopa.jpg',
    ])
  })

  it('shows Hilo Nativo manager cover and remaining images in the gallery data', () => {
    const hiloNativo = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-hilo-nativo',
    )

    expect(hiloNativo?.coverImageUrl).toBe('/emprendimientos/hilo-nativo/manager.jpg')
    expect(hiloNativo?.photoUrls).toEqual([
      '/emprendimientos/hilo-nativo/pendiente.jpg',
      '/emprendimientos/hilo-nativo/poncho.jpg',
      '/emprendimientos/hilo-nativo/tejido.jpg',
    ])
  })

  it('shows Casa Quinua manager cover and remaining images in the gallery data', () => {
    const casaQuinua = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-casa-quinua',
    )

    expect(casaQuinua?.coverImageUrl).toBe('/emprendimientos/casa-quinua/manager.jpg')
    expect(casaQuinua?.photoUrls).toEqual([
      '/emprendimientos/casa-quinua/cojines.png',
      '/emprendimientos/casa-quinua/platos.jpg',
    ])
  })

  it('shows Manitos del Sur manager cover and remaining images in the gallery data', () => {
    const manitosDelSur = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-manitos-del-sur',
    )

    expect(manitosDelSur?.coverImageUrl).toBe('/emprendimientos/manitos-del-sur/manager.jpg')
    expect(manitosDelSur?.photoUrls).toEqual([
      '/emprendimientos/manitos-del-sur/artesania.jpeg',
      '/emprendimientos/manitos-del-sur/jarrones.jpg',
      '/emprendimientos/manitos-del-sur/manager-2.jpg',
      '/emprendimientos/manitos-del-sur/retablo-arequipa.webp',
    ])
  })

  it('shows Luz de Valle manager cover and remaining images in the gallery data', () => {
    const luzDeValle = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-luz-de-valle',
    )

    expect(luzDeValle?.coverImageUrl).toBe('/emprendimientos/luz-de-valle/manager.jpg')
    expect(luzDeValle?.photoUrls).toEqual([
      '/emprendimientos/luz-de-valle/velas-aromaticas.avif',
      '/emprendimientos/luz-de-valle/velas-collection.jpg',
      '/emprendimientos/luz-de-valle/velas.jpg',
    ])
  })

  it('keeps all entrepreneurship descriptions within their specified limits', () => {
    expect(localDatabase.entrepreneurships).toHaveLength(11)
    for (const entrepreneurship of localDatabase.entrepreneurships) {
      expect(entrepreneurship.shortDescription.length).toBeLessThanOrEqual(100)
      expect(entrepreneurship.longDescription.length).toBeLessThanOrEqual(400)
    }
  })

  it('adds the requested sample businesses with matching categories', () => {
    const newBusinesses = [
      ['ent-luz-de-valle', 'home'],
      ['ent-ferreteria-el-constructor', 'construction'],
      ['ent-emolientes-don-pepe', 'food'],
      ['ent-panaderia-buen-horno', 'food'],
      ['ent-verde-casa', 'home'],
    ]

    for (const [id, categoryId] of newBusinesses) {
      const entrepreneurship = localDatabase.entrepreneurships.find((item) => item.id === id)
      expect(entrepreneurship?.categoryId).toBe(categoryId)
    }
    expect(localDatabase.categories.find((category) => category.id === 'construction')?.icon)
      .toBe('construction')
  })
})
