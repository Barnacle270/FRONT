import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { motion } from "framer-motion";

function HomePage() {
  const { user } = useAuth();
  const { stats, loading } = useDashboard();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface text-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center mb-6"
      >
        <h1 className="text-3xl font-bold mb-4">
          ¡Bienvenido, {user?.name || "Usuario"}!
        </h1>
        <p className="text-text-secondary text-lg">
          ¡Nos alegra verte de nuevo!
        </p>
      </motion.div>

      {loading ? (
        <p className="text-white">Cargando estadísticas...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl mt-4">
          <div className="card text-center">
            <h2 className="font-semibold text-white">Total Servicios</h2>
            <p className="text-2xl text-white">{stats.total}</p>
          </div>
          <div className="card text-center">
            <h2 className="font-semibold text-white">Pendientes</h2>
            <p className="text-2xl text-yellow-400">{stats.pendientes}</p>
          </div>
          <div className="card text-center">
            <h2 className="font-semibold text-white">Concluidos</h2>
            <p className="text-2xl text-green-400">{stats.concluidos}</p>
          </div>
          <div className="card text-center">
            <h2 className="font-semibold text-white">Facturados</h2>
            <p className="text-2xl text-purple-400">{stats.facturados}</p>
          </div>
          <div className="card text-center">
            <h2 className="font-semibold text-white">Pend. Facturar</h2>
            <p className="text-2xl text-orange-400">{stats.pendientesFacturar}</p>
          </div>
          <div className="card text-center">
            <h2 className="font-semibold text-white">Últimos 7 días</h2>
            <p className="text-2xl text-blue-400">{stats.ultimos7Dias}</p>
          </div>
        </div>
      ) : (
        <p className="text-red-500 mt-4">No se pudieron cargar estadísticas.</p>
      )}
    </div>
  );
}

export default HomePage;
