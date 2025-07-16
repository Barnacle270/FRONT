import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaHourglassHalf,
  FaBan,
} from "react-icons/fa";

function HomePage() {
  const { user } = useAuth();
  const { stats, loading } = useDashboard();

  const cards = [
    {
      title: "Total Servicios",
      value: stats?.total,
      color: "bg-blue-600",
      icon: <FaBoxOpen className="text-white text-3xl" />,
    },
    {
      title: "Pendientes",
      value: stats?.pendientes,
      color: "bg-yellow-500",
      icon: <FaClock className="text-white text-3xl" />,
    },
    {
      title: "Concluidos",
      value: stats?.concluidos,
      color: "bg-green-500",
      icon: <FaCheckCircle className="text-white text-3xl" />,
    },
    {
      title: "Facturados",
      value: stats?.facturados,
      color: "bg-purple-600",
      icon: <FaFileInvoiceDollar className="text-white text-3xl" />,
    },
    {
      title: "Pend. Facturar",
      value: stats?.pendientesFacturar,
      color: "bg-orange-500",
      icon: <FaHourglassHalf className="text-white text-3xl" />,
    },
    {
      title: "Anuladas este mes",
      value: stats?.anuladasMesActual,
      color: "bg-red-600",
      icon: <FaBan className="text-white text-3xl" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface text-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">
          ¡Hola, {user?.name || "Usuario"}!
        </h1>
        <p className="text-text-secondary text-lg">
          ¡Nos alegra verte de nuevo!
        </p>
      </motion.div>

      {loading ? (
        <p className="text-white">Cargando estadísticas...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-7xl">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-xl shadow-lg p-4 text-white flex flex-col items-center justify-center ${card.color}`}
            >
              <div className="mb-2">{card.icon}</div>
              <h2 className="font-semibold text-sm">{card.title}</h2>
              <p className="text-3xl font-bold">{card.value}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 mt-4">No se pudieron cargar estadísticas.</p>
      )}
    </div>
  );
}

export default HomePage;
