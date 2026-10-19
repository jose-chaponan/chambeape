import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('lists entrepreneurships with their categories, cover images, and category filters', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByRole('heading', { name: 'Emprendimientos peruanos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Aún no tienes emprendimientos publicados' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.queryByText('Imagen próximamente')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText('Calificación: 4.8 de 5')).toHaveLength(4)

    fireEvent.click(screen.getByRole('button', { name: 'Artesanía' }))

    expect(screen.getByRole('heading', { name: 'Manitos del Sur' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Sabor Andino' })).not.toBeInTheDocument()
  })

  it('keeps the admin associated with one entrepreneurship while showing the public catalog', () => {
    useAuthStore.getState().startSession(admin)
    renderRoute('/home')

    expect(screen.getByRole('heading', { name: 'Tienes 1 emprendimiento publicado' })).toBeInTheDocument()
    expect(screen.queryByText('Imagen próximamente')).not.toBeInTheDocument()
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

  it('searches the catalog by product and by district', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByText(/Pachamanca · Cuy frito/)).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar producto o servicio' }), {
      target: { value: 'pachamanca' },
    })
    expect(screen.getByRole('heading', { name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hilo Nativo' })).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar producto o servicio' }), {
      target: { value: '' },
    })
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Distrito' }))
    fireEvent.click(screen.getByRole('option', { name: 'Breña' }))

    expect(screen.getByRole('heading', { name: 'Sastrería Ríos' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Sabor Andino' })).not.toBeInTheDocument()
  })

  it('links each catalog card to its detail page', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByRole('link', { name: 'Sabor Andino' })).toHaveAttribute(
      'href',
      '/emprendimientos/ent-sabor-andino',
    )
    expect(screen.queryByText('Tu cuenta está lista')).not.toBeInTheDocument()
  })

  it('shows the entrepreneurship detail with products, location and gallery', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/emprendimientos/ent-sabor-andino')

    expect(screen.getByRole('heading', { level: 1, name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lo que ofrecen' })).toBeInTheDocument()
    expect(screen.getByText('Pachamanca')).toBeInTheDocument()
    expect(screen.getByText('Cuy frito')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ubicación y contacto' })).toBeInTheDocument()
    expect(screen.getAllByText('Jesús María', { exact: false }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /ver zona en el mapa/i })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps'),
    )
    expect(screen.getAllByRole('img', { name: 'Portada de Sabor Andino' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/home')
  })

  it('points each map link to the Lima district where the entrepreneurship is registered', () => {
    useAuthStore.getState().startSession(user)

    localDatabase.entrepreneurships.forEach((entrepreneurship) => {
      const { unmount } = renderRoute(`/emprendimientos/${entrepreneurship.id}`)
      const href = screen.getByRole('link', { name: /ver zona en el mapa/i }).getAttribute('href') ?? ''

      expect(decodeURIComponent(href)).toContain(`query=${entrepreneurship.location.district}, Lima, Perú`)
      expect(screen.getAllByText(entrepreneurship.location.district, { exact: false }).length).toBeGreaterThan(0)
      unmount()
    })
  })

  it('shows the social networks and a WhatsApp contact button on the detail', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/emprendimientos/ent-sabor-andino')

    const contact = screen.getByRole('link', { name: 'Contáctanos por WhatsApp' })
    expect(contact).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/519\d{8}\?text=/))
    expect(decodeURIComponent(contact.getAttribute('href') ?? '')).toContain('Sabor Andino')
    expect(contact).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: /ver zona en el mapa/i })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', expect.stringContaining('facebook.com'))
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', expect.stringContaining('instagram.com'))
    expect(screen.getByRole('link', { name: 'TikTok' })).toHaveAttribute('href', expect.stringContaining('tiktok.com'))
    // Cada red lleva su propio logo dibujado como SVG (el de TikTok no viene en MUI).
    ;['Instagram', 'Facebook', 'TikTok'].forEach((network) => {
      expect(screen.getByRole('link', { name: network }).querySelector('svg path')).not.toBeNull()
    })
  })

  it('has Facebook, Instagram, TikTok and WhatsApp registered for every entrepreneurship', () => {
    localDatabase.entrepreneurships.forEach(({ businessName, socialLinks }) => {
      expect(socialLinks.facebook, businessName).toBeTruthy()
      expect(socialLinks.instagram, businessName).toBeTruthy()
      expect(socialLinks.tiktok, businessName).toBeTruthy()
      expect(socialLinks.whatsapp, businessName).toMatch(/^9\d{8}$/)
    })
  })

  it('opens the photo viewer from the detail gallery', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/emprendimientos/ent-sabor-andino')

    fireEvent.click(screen.getAllByRole('button', { name: /ver foto 2 de 4/i })[0])
    expect(screen.getByRole('button', { name: 'Foto siguiente' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar galería' }))
  })

  it('shows the mobile bottom navigation with Home, Mi emprendimiento and Perfil', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home')
    expect(within(nav).getByRole('link', { name: 'Mi emprendimiento' })).toHaveAttribute('href', '/mi-emprendimiento')
    expect(within(nav).getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/perfil')
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('lists the user entrepreneurships under Mi emprendimiento', () => {
    useAuthStore.getState().startSession(admin)
    renderRoute('/mi-emprendimiento')

    expect(screen.getByRole('heading', { level: 1, name: 'Mi emprendimiento' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sabor Andino' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hilo Nativo' })).not.toBeInTheDocument()
  })

  it('shows an empty state under Mi emprendimiento when the user owns none', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/mi-emprendimiento')

    expect(screen.getByRole('heading', { name: 'Aún no tienes emprendimientos publicados' })).toBeInTheDocument()
  })

  it('shows the profile page with the session user', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/perfil')

    expect(screen.getByRole('heading', { level: 1, name: 'Perfil' })).toBeInTheDocument()
    expect(screen.getByText('route@example.com')).toBeInTheDocument()
  })

  it('marks only verified entrepreneurships with the verified badge in the catalog', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    const verifiedCount = localDatabase.entrepreneurships.filter((entrepreneurship) => entrepreneurship.verified).length
    expect(verifiedCount).toBeGreaterThan(0)
    expect(verifiedCount).toBeLessThan(localDatabase.entrepreneurships.length)
    expect(screen.getAllByRole('img', { name: 'Emprendimiento verificado' })).toHaveLength(verifiedCount)
  })

  it('shows the verified badge once on the detail of a verified entrepreneurship only', () => {
    useAuthStore.getState().startSession(user)
    const verified = renderRoute('/emprendimientos/ent-sabor-andino')
    expect(screen.getByRole('heading', { level: 1, name: 'Sabor Andino' })).toBeInTheDocument()
    // Una sola vez para el propio emprendimiento (los relacionados verificados traen la suya).
    const header = screen.getByRole('heading', { level: 1 }).parentElement as HTMLElement
    expect(within(header).getAllByRole('img', { name: 'Emprendimiento verificado' })).toHaveLength(1)
    expect(screen.queryByText('Emprendimiento verificado', { selector: '.MuiChip-label' })).not.toBeInTheDocument()
    verified.unmount()

    renderRoute('/emprendimientos/ent-ferreteria-el-constructor')
    const plainHeader = screen.getByRole('heading', { level: 1 }).parentElement as HTMLElement
    expect(within(plainHeader).queryByRole('img', { name: 'Emprendimiento verificado' })).not.toBeInTheDocument()
  })

  it('shows breadcrumbs on every inner screen', () => {
    useAuthStore.getState().startSession(admin)

    const crumbs = () => screen.getByRole('navigation', { name: 'Ruta de navegación' })

    const detail = renderRoute('/emprendimientos/ent-sabor-andino')
    expect(within(crumbs()).getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/home')
    expect(within(crumbs()).getByText('Sabor Andino')).toHaveAttribute('aria-current', 'page')
    detail.unmount()

    const mine = renderRoute('/mi-emprendimiento')
    expect(within(crumbs()).getByText('Mi emprendimiento')).toHaveAttribute('aria-current', 'page')
    mine.unmount()

    renderRoute('/perfil')
    expect(within(crumbs()).getByText('Perfil')).toHaveAttribute('aria-current', 'page')
  })

  it('keeps Mi emprendimiento in the breadcrumbs when opening one of your entrepreneurships from there', () => {
    useAuthStore.getState().startSession(admin)
    renderRoute('/mi-emprendimiento')

    fireEvent.click(screen.getByRole('link', { name: 'Sabor Andino' }))

    const crumbs = screen.getByRole('navigation', { name: 'Ruta de navegación' })
    expect(within(crumbs).getByRole('link', { name: 'Mi emprendimiento' })).toHaveAttribute(
      'href',
      '/mi-emprendimiento',
    )
    expect(within(crumbs).getByText('Sabor Andino')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a friendly message when the entrepreneurship does not exist', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/emprendimientos/no-existe')

    expect(screen.getByRole('heading', { name: 'No encontramos este emprendimiento' })).toBeInTheDocument()
  })

  it('redirects an anonymous visitor from a detail page to Login', () => {
    renderRoute('/emprendimientos/ent-sabor-andino')
    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
  })

  it('shows Sastrería Ríos cover and short description in the catalog', () => {
    useAuthStore.getState().startSession(user)
    renderRoute('/home')

    expect(screen.getByRole('img', { name: 'Portada de Sastrería Ríos' }))
      .toHaveAttribute('src', '/emprendimientos/sastreria-rios/sastre.webp')
    expect(screen.getByText('Sastrería a medida con acabados cuidados para cada ocasión.'))
      .toBeInTheDocument()
  })

  it('shows Sabor Andino cover and gallery in the catalog data', () => {
    const saborAndino = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-sabor-andino',
    )

    expect(saborAndino?.coverImageUrl).toBe('/emprendimientos/sabor-andino/manager.webp')
    expect(saborAndino?.photoUrls).toEqual([
      '/emprendimientos/sabor-andino/entrada.webp',
      '/emprendimientos/sabor-andino/restaurante.webp',
      '/emprendimientos/sabor-andino/sopa.webp',
    ])
  })

  it('shows Hilo Nativo manager cover and remaining images in the gallery data', () => {
    const hiloNativo = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-hilo-nativo',
    )

    expect(hiloNativo?.coverImageUrl).toBe('/emprendimientos/hilo-nativo/manager.webp')
    expect(hiloNativo?.photoUrls).toEqual([
      '/emprendimientos/hilo-nativo/pendiente.webp',
      '/emprendimientos/hilo-nativo/poncho.webp',
      '/emprendimientos/hilo-nativo/tejido.webp',
    ])
  })

  it('shows Casa Quinua manager cover and remaining images in the gallery data', () => {
    const casaQuinua = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-casa-quinua',
    )

    expect(casaQuinua?.coverImageUrl).toBe('/emprendimientos/casa-quinua/manager.webp')
    expect(casaQuinua?.photoUrls).toEqual([
      '/emprendimientos/casa-quinua/cojines.webp',
      '/emprendimientos/casa-quinua/platos.webp',
    ])
  })

  it('shows Manitos del Sur manager cover and remaining images in the gallery data', () => {
    const manitosDelSur = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-manitos-del-sur',
    )

    expect(manitosDelSur?.coverImageUrl).toBe('/emprendimientos/manitos-del-sur/manager.webp')
    expect(manitosDelSur?.photoUrls).toEqual([
      '/emprendimientos/manitos-del-sur/artesania.webp',
      '/emprendimientos/manitos-del-sur/jarrones.webp',
      '/emprendimientos/manitos-del-sur/manager-2.webp',
      '/emprendimientos/manitos-del-sur/retablo-arequipa.webp',
    ])
  })

  it('shows Luz de Valle manager cover and remaining images in the gallery data', () => {
    const luzDeValle = localDatabase.entrepreneurships.find(
      (entrepreneurship) => entrepreneurship.id === 'ent-luz-de-valle',
    )

    expect(luzDeValle?.coverImageUrl).toBe('/emprendimientos/luz-de-valle/manager.webp')
    expect(luzDeValle?.photoUrls).toEqual([
      '/emprendimientos/luz-de-valle/velas-aromaticas.webp',
      '/emprendimientos/luz-de-valle/velas-collection.webp',
      '/emprendimientos/luz-de-valle/velas.webp',
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
