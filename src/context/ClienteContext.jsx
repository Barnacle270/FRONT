import { createContext, useContext, useState, useEffect } from 'react';
import {
  crearCliente,
  listarClientes,
  obtenerClientePorId,
  actualizarCliente
} from '../api/cliente';
import { useAuth } from './AuthContext'; // 👈 Importamos el contexto de auth

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 👈 Saber si el usuario tiene sesión
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los clientes
  const cargarClientes = async () => {
    if (!isAuthenticated) return; // 🚨 Evitar llamadas si no hay sesión

    setLoading(true);
    try {
      const data = await listarClientes();
      setClientes(data || []);
    } catch (error) {
      console.error('Error al listar clientes:', error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo cliente
  const agregarCliente = async (cliente) => {
    if (!isAuthenticated) return;
    await crearCliente(cliente);
    await cargarClientes();
  };

  // Obtener un cliente por ID
  const obtenerCliente = async (id) => {
    if (!isAuthenticated) return null;
    try {
      return await obtenerClientePorId(id);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  };

  // Editar cliente
  const editarCliente = async (id, data) => {
    if (!isAuthenticated) return;
    try {
      await actualizarCliente(id, data);
      await cargarClientes();
    } catch (error) {
      console.error('Error al editar cliente:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarClientes();
    } else {
      setClientes([]); // 👈 Limpiar clientes si no hay sesión
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        loading,
        cargarClientes,
        agregarCliente,
        obtenerCliente,
        editarCliente
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};

export const useClientes = () => useContext(ClienteContext);
