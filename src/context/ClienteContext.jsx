import { createContext, useContext, useState, useEffect } from 'react';
import {
  crearCliente,
  listarClientes,
  obtenerClientePorId,
  actualizarCliente
} from '../api/cliente';

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los clientes
  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await listarClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error al listar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo cliente
  const agregarCliente = async (cliente) => {
    await crearCliente(cliente);
    await cargarClientes();
  };

  // Obtener un cliente por ID
  const obtenerCliente = async (id) => {
    try {
      const cliente = await obtenerClientePorId(id);
      return cliente;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  };

  // Editar cliente
  const editarCliente = async (id, data) => {
    try {
      await actualizarCliente(id, data);
      await cargarClientes();
    } catch (error) {
      console.error('Error al editar cliente:', error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

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
