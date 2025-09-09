import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { ChevronDown } from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const role = user?.role;

  const canView = {
    servicios: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    devoluciones: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    reportes: ["Superadministrador", "Administrador", "Coordinador"].includes(role),
    boletas: ["Superadministrador", "Administrador", "Coordinador", "User"].includes(role),
    datos: ["Superadministrador", "Administrador"].includes(role),
    admin: role === "Superadministrador",
  };

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const dropdownItem = (to, label, key, icon) => (
    <li key={key}>
      <Link
        to={to}
        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors text-sm"
        onClick={() => setMobileOpen(false)}
      >
        {icon}
        {!collapsed && label}
      </Link>
    </li>
  );

  const dropdownMenu = (id, label, items, icon) => (
    <li key={id}>
      <button
        onClick={() => toggleDropdown(id)}
        className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors text-sm"
      >
        <span className="flex items-center gap-3">
          {icon}
          {!collapsed && label}
        </span>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              activeDropdown === id ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {activeDropdown === id && !collapsed && (
        <ul className="ml-6 mt-1 space-y-1">{items.filter(Boolean)}</ul>
      )}
    </li>
  );

  return (
    <>
      {/* Botón hamburguesa (solo móvil) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800 shadow-lg transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo + toggle desktop */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h1
            className={`text-xl font-bold text-white tracking-tight transition-all duration-300 ${
              collapsed && "opacity-0 w-0"
            }`}
          >
            TRANSPORTES J
          </h1>
          {/* Botón para colapsar en desktop */}
          <button
            className="hidden md:block text-gray-300 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 text-sm">
          <ul className="space-y-2">
            {isAuthenticated ? (
              <>
                {(role === "Superadministrador" || role === "Administrador") &&
                  dropdownMenu("dashboard", "Dashboard", [
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
                  ], <FaChartBar />)}

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
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-md"
                >
                  <FaSignInAlt /> {!collapsed && "Login"}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer: Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-md transition-colors"
            >
              <FaSignOutAlt /> {!collapsed && "Salir"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
