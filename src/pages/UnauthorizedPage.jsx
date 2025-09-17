import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Icono grande */}
      <div className="text-7xl mb-6 animate-bounce">🚫</div>

      {/* Mensaje principal */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-4">
        Acceso denegado
      </h1>

      {/* Subtexto */}
      <p className="text-gray-400 text-center max-w-md mb-8">
        No tienes permisos para acceder a esta página.  
        Si crees que se trata de un error, comunícate con el administrador.
      </p>

      {/* Botón de regreso */}
      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
      >
        ⬅️ Volver al inicio
      </Link>

      {/* Footer */}
      <p className="text-gray-600 text-sm mt-12">
        🚀 Transportes J •
      </p>
    </section>
  );
}
