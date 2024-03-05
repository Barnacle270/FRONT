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

function App() {
  return (
    <AuthProvider>
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
                </Route>
              </Routes>
            </main>
          </Router>
      </BoletaProvider>
    </AuthProvider>
  );
}

export default App;