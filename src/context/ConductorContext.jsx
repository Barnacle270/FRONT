import { createContext, useContext, useState, useEffect } from 'react';
import {
  crearConductor,
  listarConductores,
  obtenerConductorPorId,
  actualizarConductor
} from '../api/conductor';
import { useAuth } from './AuthContext'; // 👈 Importar auth

const ConductorContext = createContext();

export const ConductorProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 👈 Saber si hay sesión
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarConductores = async () => {
    if (!isAuthenticated) return; // 🚨 Evitar llamadas sin sesión
    setLoading(true);
    try {
      const res = await listarConductores();
      setConductores(res.data || []);
    } catch (error) {
      console.error('Error al listar conductores:', error);
      setConductores([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarConductor = async (data) => {
    if (!isAuthenticated) return;
    await crearConductor(data);
    await cargarConductores();
  };

  const obtenerConductor = async (id) => {
    if (!isAuthenticated) return null;
    try {
      const res = await obtenerConductorPorId(id);
      return res.data;
    } catch (error) {
      console.error('Error al obtener conductor:', error);
      return null;
    }
  };

  const editarConductor = async (id, data) => {
    if (!isAuthenticated) return;
    await actualizarConductor(id, data);
    await cargarConductores();
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarConductores();
    } else {
      setConductores([]); // 👈 Limpiar si no hay sesión
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <ConductorContext.Provider
      value={{
        conductores,
        loading,
        agregarConductor,
        obtenerConductor,
        editarConductor,
        cargarConductores
      }}
    >
      {children}
    </ConductorContext.Provider>
  );
};

export const useConductores = () => useContext(ConductorContext);
