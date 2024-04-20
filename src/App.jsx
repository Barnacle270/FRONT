import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import MaqFormPage from "./pages/MaqFormPage";
import { MaqProvider } from "./context/MaqContext";
import MaqPage from "./pages/MaqPage";

function App() {
  return (
    <AuthProvider>
      <BoletaProvider>
        <MaqProvider>

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

                  <Route path="/add-maq" element={<MaqFormPage />} />
                  <Route path="/maq" element={<MaqPage />} />

                </Route>
              </Routes>
            </main>
          </Router>
        </MaqProvider>
      </BoletaProvider>
    </AuthProvider>
  );
}

export default App;