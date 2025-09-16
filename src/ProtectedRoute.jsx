// ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { canAccess } from "./utils/permissions";

function ProtectedRoute({ roles }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>⏳ Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👇 Ruta raíz (/) siempre permitida
  if (location.pathname === "/") {
    return <Outlet />;
  }

  // 👇 Validar roles solo para otras rutas
  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500">
        🚫 No tienes permisos para acceder a esta página
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
