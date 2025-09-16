import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { permissions } from "../utils/permissions";
import { ChevronDown } from "lucide-react";
import { FaBars, FaTimes, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

function Sidebar({ collapsed, setCollapsed }) {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const role = user?.role;
  const rolePermissions = permissions[role]?.routes || [];

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

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
              rolePermissions.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => toggleDropdown(menu.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <menu.icon className="h-5 w-5" />
                      {!collapsed && menu.label}
                    </span>
                    {!collapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform ${
                          activeDropdown === menu.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {activeDropdown === menu.id && !collapsed && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {menu.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors text-sm"
                            onClick={() => setMobileOpen(false)}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))
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
