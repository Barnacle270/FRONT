import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import ProfileTask from "./pages/ProfilePage"
import ProtectedRoute from "./ProtectedRoute"
import BoletasFormPage from "./pages/BoletasFormPage"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import { BoletaProvider } from "./context/BoletasContext"
import BoletasPage from "./pages/BoletasPage"
import RegisterPage from "./pages/RegisterPage"

import ServicioPage from './pages/ServicioPage';
import ServiciosHistorialPage from "./pages/ServiciosHistorialPage";
import ServicioEditPage from "./pages/ServicioEditPage";
import DevolucionesPage from './pages/DevolucionesPage';

import { ReportesProvider } from './context/ReportesContext';
import ReportesPage from "./pages/ReportesPage";
import { DashboardProvider } from './context/DashboardContext';
import GestionUsuarios from "./pages/GestionUsuarios";
import ServicioMasivoPage from "./pages/ServicioMasivoPage";
import ClientesPage from "./pages/ClientesPage";
import { ClienteProvider } from "./context/ClienteContext";
import ClienteForm from "./pages/ClienteForm";




function App() {
  return (
    <AuthProvider>
      <ClienteProvider>
        <DashboardProvider>
          <ReportesProvider>
            <BoletaProvider>
              <Router>
                <main className="container mx-auto px-2">
                  <Navbar />
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />


                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/profile" element={<ProfileTask />} />

                      <Route path="/add-boletas" element={<BoletasFormPage />} />
                      <Route path="/boletas" element={<BoletasPage />} />

                      <Route path="/servicios" element={<ServicioPage />} />
                      <Route path="/historial" element={<ServiciosHistorialPage />} />
                      <Route path="/servicios/editar/:id" element={<ServicioEditPage />} />

                      <Route path="/devoluciones" element={<DevolucionesPage />} />
                      <Route path="/reportes" element={<ReportesPage />} />

                      <Route path="/admin/usuarios" element={<GestionUsuarios />} />

                      <Route path="/importacion-masiva" element={<ServicioMasivoPage />} />


                      <Route path="/clientes" element={<ClientesPage />} />
                      <Route path="/clientes/nuevo" element={<ClienteForm />} />
                      <Route path="/clientes/editar/:id" element={<ClienteForm />} />

                    </Route>
                  </Routes>
                </main>
              </Router>
            </BoletaProvider>
          </ReportesProvider>
        </DashboardProvider>
      </ClienteProvider>
    </AuthProvider>
  );
}

export default App;