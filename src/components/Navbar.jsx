import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-zinc-700 my-3 py-5 px-10 rounded-lg md:flex md:justify-between md:items-center">
      <div className="flex items-center justify-between">
        <Link to={isAuthenticated ? "/" : "/"}>
          <h1 className="text-2xl font-bold">TRANSPORTES J</h1>
        </Link>
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
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
      <ul
        className={`${menuOpen ? "block" : "hidden"
          } md:flex md:gap-x-2 md:items-center md:justify-center`}
      >
        {isAuthenticated ? (

          <>
            <li>
              <Link
                to="/boletas"
                className=" px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base"
              >
                Boletas
              </Link>
            </li>

            {user.role === "admin" && ( // Verificar si el usuario tiene el rol "admin"
              <li>
                <Link
                  to="/add-boletas"
                  className=" px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base"
                >
                  Add Boletas
                </Link>
              </li>
            )}
            <li>
              <Link
                className=" px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base"
                to="/"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className=" px-3 py-2 rounded-sm block md:inline-block text-sm md:text-base"
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