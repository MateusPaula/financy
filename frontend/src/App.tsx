import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from "./components/home"
import { CadastroConta } from './components/cadastro-conta'
import { Dashboard } from './components/dashboard'
import { Transacoes } from './components/transacoes'
import { Categorias } from './components/categorias'
import { Perfil } from './components/perfil'
import { PublicRoute } from './components/public-route'
import { ProtectedRoute } from './components/protected-route'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cadastrar-conta" element={<CadastroConta />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
