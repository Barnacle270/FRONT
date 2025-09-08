import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Auth y contextos
import { AuthProvider } from "./context/AuthContext";
import { BoletaProvider } from "./context/BoletasContext";
import { ClienteProvider } from "./context/ClienteContext";
import { ConductorProvider } from "./context/ConductorContext";
import { MaquinariaProvider } from "./context/MaquinariaContext";
import { MantenimientoProvider } from "./context/MantenimientoContext";
import { LecturaProvider } from "./context/LecturaContext";
import { ReportesProvider } from "./context/ReportesContext";
import { DashboardProvider } from "./context/DashboardContext";
import { UserProvider } from "./context/UserContext";
import { ServicioProvider } from './context/ServicioContext.jsx';



// Páginas
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfileTask from "./pages/ProfilePage";
import BoletasFormPage from "./pages/BoletasFormPage";
import BoletasPage from "./pages/BoletasPage";
import ServicioPage from "./pages/ServicioPage";
import ServiciosHistorialPage from "./pages/ServiciosHistorialPage";
import DevolucionesPage from "./pages/DevolucionesPage";
import ReportesPage from "./pages/ReportesPage";
import GestionUsuarios from "./pages/GestionUsuarios";
import ServicioMasivoPage from "./pages/ServicioMasivoPage";
import ClientesPage from "./pages/ClientesPage";
import ConductoresPage from "./pages/ConductoresPage";
import RecepcionFacturasPage from "./pages/RecepcionFacturasPage";
import UsuariosPage from "./pages/UsuariosPage";
import PendientesFacturarPage from "./pages/PendientesFacturarPage";
import MaquinariasPage from "./pages/MaquinariasPage";
import LecturasPage from "./pages/LecturasPage";
import MantenimientosPage from "./pages/MantenimientosPage";
import MantenimientosProximosPage from "./pages/MantenimientosProximosPage";
import GeneralPage from "./pages/GeneralPage.jsx";


// ✅ Layout para rutas protegidas
function Layout() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-2">
        <Toaster position="top-right" reverseOrder={false} />
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ServicioProvider>
        <ClienteProvider>
          <ConductorProvider>
            <MaquinariaProvider>
              <MantenimientoProvider>
                <LecturaProvider>
                  <DashboardProvider>
                    <ReportesProvider>
                      <BoletaProvider>
                        <UserProvider>
                          <Router>
                            <Routes>
                              {/* Públicas */}
                              <Route path="/login" element={<LoginPage />} />
                              {/* Protegidas */}
                              <Route element={<ProtectedRoute />}>
                                <Route element={<Layout />}>

                                  <Route path="/" element={<GeneralPage />} />

                                  <Route path="/home" element={<HomePage />} />
                                  <Route path="/profile" element={<ProfileTask />} />

                                  <Route path="/add-boletas" element={<BoletasFormPage />} />
                                  <Route path="/boletas" element={<BoletasPage />} />

                                  <Route path="/servicios" element={<ServicioPage />} />
                                  <Route path="/historial" element={<ServiciosHistorialPage />} />
                                  <Route path="/devoluciones" element={<DevolucionesPage />} />

                                  <Route path="/reportes" element={<ReportesPage />} />
                                  <Route path="/reportes/pendientes-facturar" element={<PendientesFacturarPage />} />

                                  <Route path="/admin/usuarios" element={<GestionUsuarios />} />
                                  <Route path="/usuarios" element={<UsuariosPage />} />

                                  <Route path="/importacion-masiva" element={<ServicioMasivoPage />} />

                                  <Route path="/clientes" element={<ClientesPage />} />
                                  <Route path="/conductores" element={<ConductoresPage />} />
                                  <Route path="/recepcion-facturas" element={<RecepcionFacturasPage />} />

                                  <Route path="/maquinarias" element={<MaquinariasPage />} />
                                  <Route path="/mantenimientos" element={<MantenimientosPage />} />
                                  <Route path="/lecturas" element={<LecturasPage />} />
                                  <Route path="/mantenimiento-pendiente" element={<MantenimientosProximosPage />} />

                                </Route>
                              </Route>
                            </Routes>
                          </Router>
                        </UserProvider>
                      </BoletaProvider>
                    </ReportesProvider>
                  </DashboardProvider>
                </LecturaProvider>
              </MantenimientoProvider>
            </MaquinariaProvider>
          </ConductorProvider>
        </ClienteProvider>
      </ServicioProvider>
    </AuthProvider>
  );
}

export default App;
