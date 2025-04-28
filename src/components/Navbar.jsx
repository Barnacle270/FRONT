import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Menu, X } from "lucide-react"; // Usar buenos íconos opcionalmente

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

  return (
    <nav className="bg-navbar sticky top-0 z-50 shadow-md my-3 py-4 px-6 rounded-lg md:flex md:justify-between md:items-center">
      <div className="flex items-center justify-between">
        <Link to="/" onClick={closeAll}>
          <h1 className="text-2xl font-bold text-white">TRANSPORTE J</h1>
        </Link>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <ul className={`${menuOpen ? "block" : "hidden"} md:flex md:items-center md:gap-x-6`}>
        {isAuthenticated ? (
          <>
            {/* Boletas */}
            <li className="relative group">
              <button
                onClick={() => toggleDropdown('boletas')}
                className="flex items-center gap-1 text-white font-semibold hover:bg-surface px-3 py-2 rounded transition"
              >
                Boletas <ChevronDown className={`w-4 h-4 transform transition ${activeDropdown === 'boletas' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'boletas' && (
                <ul className="absolute mt-2 w-40 bg-surface border border-gray-600 rounded-md shadow-lg animate-fade-in">
                  <li>
                    <Link to="/boletas" onClick={closeAll} className="block px-4 py-2 text-text-secondary hover:bg-gray-700">Ver Boletas</Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link to="/add-boletas" onClick={closeAll} className="block px-4 py-2 text-text-secondary hover:bg-gray-700">Agregar Boleta</Link>
                    </li>
                  )}
                </ul>
              )}
            </li>

            {/* Transporte */}
            {user.role === "admin" && (
              <li className="relative group">
                <button
                  onClick={() => toggleDropdown('transporte')}
                  className="flex items-center gap-1 text-white font-semibold hover:bg-surface px-3 py-2 rounded transition"
                >
                  Transporte <ChevronDown className={`w-4 h-4 transform transition ${activeDropdown === 'transporte' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'transporte' && (
                  <ul className="absolute mt-2 w-40 bg-surface border border-gray-600 rounded-md shadow-lg animate-fade-in">
                    <li>
                      <Link to="/transporte" onClick={closeAll} className="block px-4 py-2 text-text-secondary hover:bg-gray-700">Servicios</Link>
                    </li>
                    <li>
                      <Link to="/add-transporte" onClick={closeAll} className="block px-4 py-2 text-text-secondary hover:bg-gray-700">Agregar Servicio</Link>
                    </li>
                    <li>
                      <Link to="/contenedores" onClick={closeAll} className="block px-4 py-2 text-text-secondary hover:bg-gray-700">Devoluciones</Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {/* Logout */}
            <li>
              <button
                onClick={() => {
                  logout();
                  closeAll();
                }}
                className="text-white font-bold bg-red-500 hover:bg-red-400 px-4 py-2 rounded transition"
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              onClick={closeAll}
              className="text-white font-bold hover:bg-surface px-4 py-2 rounded transition"
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
