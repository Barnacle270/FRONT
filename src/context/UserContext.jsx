import { createContext, useContext, useState, useEffect } from "react";
import {
  crearUsuarioRequest,
  obtenerUsuariosRequest,
  actualizarUsuarioRequest,
  cambiarRolRequest,
  desactivarUsuarioRequest,
  activarUsuarioRequest,
} from "../api/usuarios";

const UserContext = createContext();

// Hook para acceder más fácilmente
export const useUsuarios = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener todos los usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await obtenerUsuariosRequest();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo usuario
  const crearUsuario = async (usuario) => {
    const res = await crearUsuarioRequest(usuario);
    await cargarUsuarios(); // Recargar lista después de crear
    return res;
  };

  // Editar usuario
  const editarUsuario = async (id, datos) => {
    const res = await actualizarUsuarioRequest(id, datos);
    await cargarUsuarios();
    return res;
  };

  // Cambiar rol
  const cambiarRol = async (id, nuevoRol) => {
    const res = await cambiarRolRequest(id, nuevoRol);
    await cargarUsuarios();
    return res;
  };

  // Activar usuario
  const activarUsuario = async (id) => {
    const res = await activarUsuarioRequest(id);
    await cargarUsuarios();
    return res;
  };

  // Desactivar usuario
  const desactivarUsuario = async (id) => {
    const res = await desactivarUsuarioRequest(id);
    await cargarUsuarios();
    return res;
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <UserContext.Provider
      value={{
        usuarios,
        loading,
        crearUsuario,
        editarUsuario,
        cambiarRol,
        activarUsuario,
        desactivarUsuario,
        cargarUsuarios,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
