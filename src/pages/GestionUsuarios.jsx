import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const rolesDisponibles = ["usuario", "administrador", "superadministrador"];

const GestionUsuarios = () => {
  const { user, isAuthenticated, users, getAllUsers, updateUserRole } = useAuth();
  const [rolesEditados, setRolesEditados] = useState({});

  console.log(user)
  useEffect(() => {
    if (isAuthenticated && (user.role === "administrador" || user.role === "superadministrador")) {
      getAllUsers();
    }
  }, [isAuthenticated, user, getAllUsers]);

  const handleRoleChange = (userId, newRole) => {
    setRolesEditados({ ...rolesEditados, [userId]: newRole });
  };

  const guardarCambio = async (userId) => {
    const nuevoRol = rolesEditados[userId];
    if (!nuevoRol) return;

    try {
      await updateUserRole(userId, nuevoRol);
      alert("Rol actualizado con éxito");
    } catch (error) {
      alert("Error al actualizar rol");
    }
  };

  if (!isAuthenticated || !["administrador", "superadministrador"].includes(user.role)) {
    return <div className="text-center mt-10 text-red-500">Acceso denegado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.dni}</td>
              <td className="p-2">
                <select
                  value={rolesEditados[u._id] || u.role}
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
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
