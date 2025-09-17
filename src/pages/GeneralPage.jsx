import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiDocumentText, HiTruck, HiClipboardList, HiUserGroup } from "react-icons/hi";

function GeneralPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/healthz`);
        if (res.ok) {
          setBackendReady(true);
        }
      } catch (err) {
        console.error("Error conectando al backend:", err);
      } finally {
        setLoading(false);
      }
    };

    pingBackend();
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <p className="animate-pulse">⏳ Despertando servidor, esto puede tardar unos segundos...</p>
      </section>
    );
  }

  if (!backendReady) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gray-950 text-red-400">
        <p>❌ No se pudo conectar al backend. Intenta de nuevo más tarde.</p>
      </section>
    );
  }

  return (
    <section className="p-6 min-h-screen flex flex-col items-center bg-gray-950">
      {/* Bienvenida */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Bienvenido{user ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Accede rápidamente a tus herramientas principales.
        </p>
      </div>

      {/* Menú de atajos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {/* Opción 1 */}
        <Link
          to="/boletas"
          className="group bg-zinc-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition"
        >
          <HiDocumentText className="text-indigo-400 text-5xl group-hover:scale-110 transition" />
          <h3 className="text-lg font-semibold text-white mt-4">Mis boletas</h3>
          <p className="text-sm text-gray-400 mt-2">
            Consulta y descarga tus boletas de pago en un clic.
          </p>
        </Link>

        {/* Opción 2 */}
        <Link
          to="/servicios"
          className="group bg-zinc-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition"
        >
          <HiTruck className="text-green-400 text-5xl group-hover:scale-110 transition" />
          <h3 className="text-lg font-semibold text-white mt-4">Servicios</h3>
          <p className="text-sm text-gray-400 mt-2">
            Gestiona tus servicios, traslados y devoluciones.
          </p>
        </Link>

        {/* Opción 3 */}
        <Link
          to="/reportes"
          className="group bg-zinc-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition"
        >
          <HiClipboardList className="text-yellow-400 text-5xl group-hover:scale-110 transition" />
          <h3 className="text-lg font-semibold text-white mt-4">Reportes</h3>
          <p className="text-sm text-gray-400 mt-2">
            Visualiza reportes y estadísticas en tiempo real.
          </p>
        </Link>

        {/* Opción 4 */}
        <Link
          to="/usuarios"
          className="group bg-zinc-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition"
        >
          <HiUserGroup className="text-pink-400 text-5xl group-hover:scale-110 transition" />
          <h3 className="text-lg font-semibold text-white mt-4">Usuarios</h3>
          <p className="text-sm text-gray-400 mt-2">
            Administra usuarios y roles dentro del sistema.
          </p>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-sm mt-12 animate-fade-in">
      </p>
    </section>
  );
}

export default GeneralPage;
