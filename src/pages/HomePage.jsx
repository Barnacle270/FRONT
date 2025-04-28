import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface text-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold mb-4">
          ¡Bienvenido, {user.name}!
        </h1>
        <p className="text-text-secondary text-lg">
          Nos alegra verte de nuevo en el sistema de Transporte J.
        </p>
      </motion.div>
    </div>
  );
}

export default HomePage;
