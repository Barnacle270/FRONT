import { createContext, useContext, useState, useEffect } from 'react';
import {
  crearConductor,
  listarConductores,
  obtenerConductorPorId,
  actualizarConductor
} from '../api/conductor';

const ConductorContext = createContext();

export const ConductorProvider = ({ children }) => {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarConductores = async () => {
    setLoading(true);
    try {
      const res = await listarConductores();
      setConductores(res.data);
    } catch (error) {
      console.error('Error al listar conductores:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarConductor = async (data) => {
    await crearConductor(data);
    await cargarConductores();
  };

  const obtenerConductor = async (id) => {
    const res = await obtenerConductorPorId(id);
    return res.data;
  };

  const editarConductor = async (id, data) => {
    await actualizarConductor(id, data);
    await cargarConductores();
  };

  useEffect(() => {
    cargarConductores();
  }, []);

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
