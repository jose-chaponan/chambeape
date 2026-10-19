import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../../modules/authentication/presentation/LoginPage'
import { EntrepreneurshipDetailPage } from '../../modules/entrepreneurships/presentation/EntrepreneurshipDetailPage'
import { HomePage } from '../../modules/entrepreneurships/presentation/HomePage'
import { EntrepreneurshipFormPage } from '../../modules/entrepreneurships/presentation/EntrepreneurshipFormPage'
import { MyEntrepreneurshipsPage } from '../../modules/entrepreneurships/presentation/MyEntrepreneurshipsPage'
import { ProfilePage } from '../../modules/users/presentation/ProfilePage'
import { RedirectAuthenticated } from './RedirectAuthenticated'
import { RequireAuthentication } from './RequireAuthentication'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RedirectAuthenticated />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuthentication />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/mi-emprendimiento" element={<MyEntrepreneurshipsPage />} />
        <Route path="/mi-emprendimiento/nuevo" element={<EntrepreneurshipFormPage mode="create" />} />
        <Route path="/mi-emprendimiento/:entrepreneurshipId/editar" element={<EntrepreneurshipFormPage mode="edit" />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/emprendimientos/:entrepreneurshipId" element={<EntrepreneurshipDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}
