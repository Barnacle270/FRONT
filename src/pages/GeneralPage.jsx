import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function GeneralPage() {
  const { user } = useAuth();

  return (
    <section className="p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">

      {/* Bienvenida */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Bienvenido{user ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Aquí encontrarás información general sobre tu trabajo.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-zinc-800/80 backdrop-blur-md rounded-2xl shadow-xl p-10 max-w-lg w-full flex flex-col items-center border border-gray-700 animate-fade-up">
        {/* Gatito animado */}
        <span className="text-7xl animate-bounce">🐱</span>

        {/* Mensaje */}
        <h2 className="text-2xl font-bold text-white mt-6">
          Página en construcción 🚧
        </h2>
        <p className="text-gray-400 text-center mt-3 text-sm leading-relaxed">
          Estamos trabajando para traerte información útil, clara y actualizada.
          <br /> Por el momento, solo está disponible la opción de ver tus boletas.
        </p>

        {/* Botón habilitado */}
        <Link
          to="/boletas"
          className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          Ver mis boletas 🧾
        </Link>
      </div>

      {/* Footer pequeño */}
      <p className="text-gray-600 text-sm mt-10 animate-fade-in">
        🚀 Transportes J • Innovando para ti
      </p>
    </section>
  );
}

export default GeneralPage;
