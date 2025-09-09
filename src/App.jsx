import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
import { ServicioProvider } from "./context/ServicioContext.jsx";

// Componentes
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./ProtectedRoute";

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
import { useState } from "react";

// ✅ Layout con Sidebar colapsable
function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-gray-950 text-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<GeneralPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfileTask />} />

          <Route path="/add-boletas" element={<BoletasFormPage />} />
          <Route path="/boletas" element={<BoletasPage />} />

          <Route path="/servicios" element={<ServicioPage />} />
          <Route path="/historial" element={<ServiciosHistorialPage />} />
          <Route path="/devoluciones" element={<DevolucionesPage />} />

          <Route path="/reportes" element={<ReportesPage />} />
          <Route
            path="/reportes/pendientes-facturar"
            element={<PendientesFacturarPage />}
          />

          <Route path="/admin/usuarios" element={<GestionUsuarios />} />
          <Route path="/usuarios" element={<UsuariosPage />} />

          <Route path="/importacion-masiva" element={<ServicioMasivoPage />} />

          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/conductores" element={<ConductoresPage />} />
          <Route path="/recepcion-facturas" element={<RecepcionFacturasPage />} />

          <Route path="/maquinarias" element={<MaquinariasPage />} />
          <Route path="/mantenimientos" element={<MantenimientosPage />} />
          <Route path="/lecturas" element={<LecturasPage />} />
          <Route
            path="/mantenimiento-pendiente"
            element={<MantenimientosProximosPage />}
          />
        </Routes>
      </main>
    </div>
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
                              {/* Ruta pública */}
                              <Route path="/login" element={<LoginPage />} />

                              {/* Rutas protegidas con Sidebar */}
                              <Route element={<ProtectedRoute />}>
                                <Route path="/*" element={<Layout />} />
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
