import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  FaFileAlt,
  FaTruck,
  FaChartBar,
  FaUsers,
  FaUserTie,
  FaReceipt,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(); // Referencia al contenedor del navbar

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  // Detecta clic fuera del navbar y lo cierra
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItem = (to, label, key, icon) => (
    <li key={key}>
      <Link
        to={to}
        onClick={closeAll}
        className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-highlight hover:text-white transition"
      >
        {icon}
        {label}
      </Link>
    </li>
  );

  const dropdownMenu = (id, label, items, icon) => {
    return (
      <li className="relative group" key={id}>
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex items-center gap-2 font-semibold px-3 py-2 rounded transition
            ${id === "reportes"
              ? "text-blue-400 hover:bg-blue-700"
              : "text-text-primary hover:bg-surface"
            }
          `}
        >
          {icon}
          {label}
          <ChevronDown
            className={`w-4 h-4 transform transition ${activeDropdown === id ? "rotate-180" : ""}`}
          />
        </button>
        {activeDropdown === id && (
          <ul className="absolute mt-2 w-52 bg-surface border border-gray-700 rounded-md shadow-lg animate-fade-in z-50">
            {items.filter(Boolean)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav
      ref={navRef}
      className="bg-navbar sticky top-0 z-50 shadow-md my-3 py-4 px-6 rounded-lg md:flex md:justify-between md:items-center"
    >
      <div className="flex items-center justify-between">
        <Link to="/" onClick={closeAll}>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            TRANSPORTES J
          </h1>
        </Link>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <ul className={`${menuOpen ? "block mt-4" : "hidden"} md:flex md:items-center md:gap-x-6`}>
        {isAuthenticated ? (
          <>
            {dropdownMenu("servicios", "Servicios", [
              dropdownItem("/servicios", "Importar XML", "servicios-importar", <FaFileAlt />),
              dropdownItem("/historial", "Historial de Servicios", "servicios-historial", <FaFileAlt />),
              dropdownItem("/recepcion-facturas", "Recepción Guías", "recepcion", <FaFileAlt />),
            ], <FaFileAlt />)}

            {dropdownMenu("devoluciones", "Devoluciones", [
              dropdownItem("/devoluciones", "Ver pendientes", "devoluciones-pendientes", <FaTruck />),
            ], <FaTruck />)}

            {dropdownMenu("reportes", "Reportes", [
              dropdownItem("/reportes", "Reporte de Servicios", "reportes-servicios", <FaChartBar />),
            ], <FaChartBar className="text-blue-400" />)}

            {dropdownMenu("datos", "Datos", [
              dropdownItem("/clientes", "Clientes", "datos-clientes", <FaUsers />),
              dropdownItem("/conductores", "Conductores", "datos-conductores", <FaUserTie />),
            ], <FaUsers />)}

            {dropdownMenu("boletas", "Boletas", [
              dropdownItem("/boletas", "Mis Boletas", "boletas-mias", <FaReceipt />),
              user?.role === "admin" &&
                dropdownItem("/add-boletas", "Agregar Boleta", "boletas-agregar", <FaReceipt />),
            ], <FaReceipt />)}

            <li className="mt-2 md:mt-0" key="logout">
              <button
                onClick={() => {
                  logout();
                  closeAll();
                }}
                className="flex items-center gap-2 text-red-500 font-semibold hover:text-white hover:bg-red-600 px-4 py-2 rounded transition"
              >
                <FaSignOutAlt />
                Salir
              </button>
            </li>
          </>
        ) : (
          <li key="login">
            <Link
              to="/login"
              onClick={closeAll}
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              <FaSignInAlt />
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
