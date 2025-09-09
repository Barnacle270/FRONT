import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const rolesDisponibles = ["usuario", "administrador", "superadministrador"];

const GestionUsuarios = () => {
  const { user, isAuthenticated, users, getAllUsers, updateUserRole } = useAuth();
  const [rolesEditados, setRolesEditados] = useState({});
  const [saving, setSaving] = useState({}); // estado de carga por usuario

  useEffect(() => {
    if (isAuthenticated && ["administrador", "superadministrador"].includes(user.role)) {
      getAllUsers();
    }
  }, [isAuthenticated, user, getAllUsers]);

  const handleRoleChange = (userId, newRole) => {
    setRolesEditados((prev) => ({ ...prev, [userId]: newRole }));
  };

  const guardarCambio = async (userId) => {
    const nuevoRol = rolesEditados[userId];
    if (!nuevoRol) return;

    try {
      setSaving((prev) => ({ ...prev, [userId]: true }));
      await updateUserRole(userId, nuevoRol);
      toast.success("Rol actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      toast.error(error.response?.data?.message || "Error al actualizar rol");
    } finally {
      setSaving((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (!isAuthenticated || !["administrador", "superadministrador"].includes(user.role)) {
    return <div className="text-center mt-10 text-red-500">Acceso denegado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <table className="w-full border rounded overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const rolSeleccionado = rolesEditados[u._id] || u.role;
            const cambioPendiente = rolSeleccionado !== u.role;

            return (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.dni}</td>
                <td className="p-2">
                  <select
                    value={rolSeleccionado}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {rolesDisponibles.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => guardarCambio(u._id)}
                    disabled={!cambioPendiente || saving[u._id]}
                    className={`px-3 py-1 rounded text-white ${
                      cambioPendiente
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {saving[u._id] ? "Guardando..." : "Guardar"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
