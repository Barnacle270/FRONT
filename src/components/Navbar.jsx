import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [boletasDropdownOpen, setBoletasDropdownOpen] = useState(false);
  const [transporteDropdownOpen, setTransporteDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleBoletasDropdown = () => {
    setBoletasDropdownOpen(!boletasDropdownOpen);
    if (transporteDropdownOpen) {
      setTransporteDropdownOpen(false);
    }
  };

  const toggleTransporteDropdown = () => {
    setTransporteDropdownOpen(!transporteDropdownOpen);
    if (boletasDropdownOpen) {
      setBoletasDropdownOpen(false);
    }
  };

  return (
    <nav className="bg-navbar my-3 py-5 px-10 rounded-lg md:flex md:justify-between md:items-center">
      <div className="flex items-center justify-between">
        <Link to={isAuthenticated ? "/" : "/"}>
          <h1 className="text-2xl font-bold text-white">TRANSPORTE J</h1>
        </Link>
        <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>
      <ul className={`${menuOpen ? "block" : "hidden"} md:flex md:gap-x-2 md:items-center md:justify-center`}>
        {isAuthenticated ? (
          <>
            <li className="relative">
              <button
                onClick={toggleBoletasDropdown}
                className="px-3 py-2 rounded-sm block md:inline-block text-sm font-bold md:text-base text-white focus:outline-none hover:bg-surface"
              >
                Boletas
                <svg
                  className="w-4 h-4 inline-block ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {boletasDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-surface border border-gray-700 rounded-md shadow-lg">
                  <li>
                    <Link
                      to="/boletas"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-700"
                      onClick={() => setBoletasDropdownOpen(false)}
                    >
                      Boletas
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link
                        to="/add-boletas"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-700"
                        onClick={() => setBoletasDropdownOpen(false)}
                      >
                        Agregar Boletas
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
            <li className="relative">
              {user.role === "admin" && (

                <button
                  onClick={toggleTransporteDropdown}
                  className="px-3 py-2 rounded-sm block md:inline-block text-sm font-bold md:text-base text-white focus:outline-none hover:bg-surface"
                >
                  Transporte
                  <svg
                    className="w-4 h-4 inline-block ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                )}
              {transporteDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-surface border border-gray-700 rounded-md shadow-lg">
                  <li>
                    <Link
                      to="/transporte"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-700"
                      onClick={() => setTransporteDropdownOpen(false)}
                    >
                      Servicios
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link
                        to="/add-transporte"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-700"
                        onClick={() => setTransporteDropdownOpen(false)}
                      >
                        Agregar Servicio
                      </Link>
                    </li>
                  )}
                  {user.role === "admin" && (
                    <li>
                      <Link
                        to="/contenedores"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-700"
                        onClick={() => setTransporteDropdownOpen(false)}
                      >
                        Devoluciones
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
            <li>
              <Link
                className="px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base font-bold text-white hover:bg-red-400"
                to="/"
                onClick={() => {
                  logout();
                }}
              >
                Salir
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base font-bold text-white hover:bg-surface"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
