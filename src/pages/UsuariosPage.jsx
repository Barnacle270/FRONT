import { useEffect, useState } from "react";
import { useUsuarios } from "../context/UserContext";
import UsuarioForm from "../components/UsuarioForm";

const UsuariosPage = () => {
  const {
    usuarios,
    loading,
    desactivarUsuario,
    activarUsuario,
    cambiarRol,
    cargarUsuarios,
  } = useUsuarios();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleToggleActivo = (usuario) => {
    if (usuario.activo) {
      desactivarUsuario(usuario._id);
    } else {
      activarUsuario(usuario._id);
    }
  };

  const handleCambiarRol = (usuario) => {
    const nuevoRol = prompt(
      "Nuevo rol (usuario / administrador / superadministrador):",
      usuario.role
    );
    if (nuevoRol && nuevoRol !== usuario.role) {
      cambiarRol(usuario._id, nuevoRol);
    }
  };

  const abrirFormulario = (usuario = null) => {
    setUsuarioSeleccionado(usuario);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setUsuarioSeleccionado(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gestión de Usuarios</h1>
        <button
          onClick={() => abrirFormulario()}
          className="bg-button-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border border-gray-600 rounded-md">
            <thead className="bg-navbar text-text-secondary uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-gray-600">DNI</th>
                <th className="px-4 py-3 border-b border-gray-600">Nombre</th>
                <th className="px-4 py-3 border-b border-gray-600">Email</th>
                <th className="px-4 py-3 border-b border-gray-600">Rol</th>
                <th className="px-4 py-3 border-b border-gray-600">Activo</th>
                <th className="px-4 py-3 border-b border-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario._id}
                  className="border-b border-gray-700 hover:bg-[#383838] transition"
                >
                  <td className="px-4 py-2">{usuario.dni}</td>
                  <td className="px-4 py-2">{usuario.name}</td>
                  <td className="px-4 py-2">{usuario.email}</td>
                  <td className="px-4 py-2 capitalize">{usuario.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        usuario.activo
                          ? "bg-button-success text-white"
                          : "bg-button-danger text-white"
                      }`}
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleToggleActivo(usuario)}
                      className={`px-3 py-1 rounded font-medium text-sm text-white ${
                        usuario.activo
                          ? "bg-button-danger hover:opacity-90"
                          : "bg-button-success hover:opacity-90"
                      }`}
                    >
                      {usuario.activo ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      onClick={() => handleCambiarRol(usuario)}
                      className="px-3 py-1 bg-button-secondary text-white rounded font-medium text-sm hover:opacity-90"
                    >
                      Cambiar Rol
                    </button>

                    <button
                      onClick={() => abrirFormulario(usuario)}
                      className="px-3 py-1 bg-button-primary text-white rounded font-medium text-sm hover:opacity-90"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal del Formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in relative">
            <button
              onClick={cerrarFormulario}
              className="absolute top-2 right-3 text-text-secondary hover:text-white text-xl"
            >
              ×
            </button>

            <UsuarioForm
              usuario={usuarioSeleccionado}
              onSuccess={() => {
                cerrarFormulario();
                cargarUsuarios();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
