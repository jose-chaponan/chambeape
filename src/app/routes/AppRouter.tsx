import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../../modules/authentication/presentation/LoginPage'
import { HomePage } from '../../modules/entrepreneurships/presentation/HomePage'
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
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}
