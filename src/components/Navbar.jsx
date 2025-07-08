import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Menu, X } from "lucide-react";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const dropdownItem = (to, label, key) => (
    <li key={key}>
      <Link
        to={to}
        onClick={closeAll}
        className="block px-4 py-2 text-text-primary hover:bg-highlight hover:text-white transition"
      >
        {label}
      </Link>
    </li>
  );

  const dropdownMenu = (id, label, items) => {
    const isReportes = id === "reportes";
    return (
      <li className="relative group" key={id}>
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex items-center gap-1 font-semibold px-3 py-2 rounded transition
            ${isReportes
              ? "text-blue-400 hover:bg-blue-700"
              : "text-text-primary hover:bg-surface"
            }
          `}
        >
          {label}
          <ChevronDown
            className={`w-4 h-4 transform transition ${
              activeDropdown === id ? "rotate-180" : ""
            }`}
          />
        </button>
        {activeDropdown === id && (
          <ul className="absolute mt-2 w-48 bg-surface border border-gray-700 rounded-md shadow-lg animate-fade-in z-50">
            {items.filter(Boolean)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="bg-navbar sticky top-0 z-50 shadow-md my-3 py-4 px-6 rounded-lg md:flex md:justify-between md:items-center">
      <div className="flex items-center justify-between">
        <Link to="/" onClick={closeAll}>
          <h1 className="text-2xl font-bold text-white tracking-tight">TRANSPORTE J</h1>
        </Link>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <ul className={`${menuOpen ? "block mt-4" : "hidden"} md:flex md:items-center md:gap-x-6`}>
        {isAuthenticated ? (
          <>
            {dropdownMenu("servicios", "Servicios", [
              dropdownItem("/servicios", "Importar XML", "servicios-importar"),
              dropdownItem("/importacion-masiva", "Importación Masiva", "servicios-masivo"),
              dropdownItem("/historial", "Historial de Servicios", "servicios-historial"),
            ])}

            {dropdownMenu("devoluciones", "Devoluciones", [
              dropdownItem("/devoluciones", "Ver pendientes", "devoluciones-pendientes"),
            ])}

            {dropdownMenu("reportes", (
              <span className="text-blue-400">📊 Reportes</span>
            ), [
              dropdownItem("/reportes", "Reporte de Servicios", "reportes-servicios"),
            ])}

            {dropdownMenu("boletas", "Boletas", [
              dropdownItem("/boletas", "Mis Boletas", "boletas-mias"),
              user?.role === "admin" && dropdownItem("/add-boletas", "Agregar Boleta", "boletas-agregar"),
            ])}

            {dropdownMenu("datos", "Datos", [
              dropdownItem("/clientes", "📁 Clientes", "datos-clientes"),
              dropdownItem("/conductores", "🚛 Conductores", "datos-conductores"), // futura ruta
            ])}

            <li className="mt-2 md:mt-0" key="logout">
              <button
                onClick={() => {
                  logout();
                  closeAll();
                }}
                className="btn btn-danger px-4 py-2 w-full md:w-auto"
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <li key="login">
            <Link
              to="/login"
              onClick={closeAll}
              className="btn btn-primary text-white"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
