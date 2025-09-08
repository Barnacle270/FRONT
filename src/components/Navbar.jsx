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
  FaTools,
  FaCogs,
  FaClipboardList,
  FaTachometerAlt

} from "react-icons/fa";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef();

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

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
        className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-highlight hover:text-white transition text-sm"
      >
        {icon}
        {label}
      </Link>
    </li>
  );

  const dropdownMenu = (id, label, items, icon) => (
    <li className="relative group" key={id}>
      <button
        onClick={() => toggleDropdown(id)}
        className={`flex items-center gap-2 font-semibold px-3 py-2 rounded transition text-sm
          ${id === "reportes"
            ? "text-blue-400 hover:bg-blue-700"
            : "text-text-primary hover:bg-surface"
          }
        `}
      >
        {icon}
        {label}
        <ChevronDown
          className={`w-4 h-4 transform transition ${activeDropdown === id ? "rotate-180" : ""
            }`}
        />
      </button>
      {activeDropdown === id && (
        <ul className="absolute left-0 mt-2 w-52 bg-surface border border-gray-700 rounded-md shadow-lg animate-fade-in z-50">
          {items.filter(Boolean)}
        </ul>
      )}
    </li>
  );

  const role = user?.role;

  const canView = {
    servicios: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    devoluciones: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    reportes: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    boletas: ["Superadministrador", "Administrador", "Coordinador", "User"].includes(role),
    datos: ["Superadministrador", "Administrador"].includes(role),
    admin: role === "Superadministrador",
  };

  return (
    <nav ref={navRef} className="bg-navbar sticky top-0 z-50 shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo + Hamburguesa */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" onClick={closeAll}>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                TRANSPORTES J
              </h1>
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menú de navegación */}
          <div className={`${menuOpen ? "block" : "hidden"} mt-4 md:mt-0 md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-x-4">
              {isAuthenticated ? (
                <>
                  {(role === "Superadministrador" || role === "Administrador") &&
                    dropdownMenu("DASHBOARD", "DASHBOARD", [
                      dropdownItem("/home", "Transporte", "home", <FaTruck />),
                    ], <FaTachometerAlt />)}

                  {canView.servicios &&
                    dropdownMenu("servicios", "Servicios", [
                      dropdownItem("/servicios", "Importar XML", "servicios-importar", <FaFileAlt />),
                      dropdownItem("/historial", "Historial de Servicios", "servicios-historial", <FaFileAlt />),
                      dropdownItem("/recepcion-facturas", "Recepción Guías", "recepcion", <FaFileAlt />),
                    ], <FaFileAlt />)}

                  {canView.devoluciones &&
                    dropdownMenu("devoluciones", "Devoluciones", [
                      dropdownItem("/devoluciones", "Ver pendientes", "devoluciones-pendientes", <FaTruck />),
                    ], <FaTruck />)}

                  {canView.reportes &&
                    dropdownMenu("reportes", "Reportes", [
                      dropdownItem("/reportes", "Reporte de Servicios", "reportes-servicios", <FaChartBar />),
                      dropdownItem("/reportes/pendientes-facturar", "Pendientes de Facturar", "reportes-pendientes", <FaFileAlt />),
                    ], <FaChartBar className="text-blue-400" />)}

                  {canView.boletas &&
                    dropdownMenu("boletas", "Boletas", [
                      dropdownItem("/boletas", "Mis Boletas", "boletas-mias", <FaReceipt />),
                      (role === "Superadministrador" || role === "Administrador") &&
                      dropdownItem("/add-boletas", "Agregar Boleta", "boletas-agregar", <FaReceipt />),
                    ], <FaReceipt />)}

                  {canView.datos &&
                    dropdownMenu("datos", "Datos", [
                      dropdownItem("/clientes", "Clientes", "datos-clientes", <FaUsers />),
                      dropdownItem("/conductores", "Conductores", "datos-conductores", <FaUserTie />),
                    ], <FaUsers />)}

                  {(role === "Superadministrador" || role === "Administrador") &&
                    dropdownMenu("mantenimiento", "Mantenimiento", [
                      dropdownItem("/maquinarias", "Maquinarias", "mantenimiento-maquinarias", <FaCogs />),
                      dropdownItem("/lecturas", "Lecturas", "mantenimiento-lecturas", <FaClipboardList />),
                      dropdownItem("/mantenimientos", "Mantenimientos", "mantenimiento-mantenimientos", <FaTools />),
                      dropdownItem("/mantenimiento-pendiente", "Mantenimientos Vencidos", "mantenimiento-vencidos", <FaFileAlt />),
                    ], <FaTools />)}

                  {canView.admin &&
                    dropdownMenu("admin", "Admin", [
                      dropdownItem("/usuarios", "Gestionar Usuarios", "admin-usuarios", <FaUsers />),
                      dropdownItem("/configuracion", "Configuración", "admin-config", <FaChartBar />),
                    ], <FaUserTie />)}

                  <li key="logout">
                    <button
                      onClick={() => {
                        logout();
                        closeAll();
                      }}
                      className="flex items-center gap-2 text-red-500 font-semibold hover:text-white hover:bg-red-600 px-4 py-2 rounded transition text-sm"
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
                    className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-sm"
                  >
                    <FaSignInAlt />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
