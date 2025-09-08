// src/context/MantenimientoContext.jsx
import { createContext, useContext, useState } from 'react';
import {
  crearMantenimientoRequest,
  obtenerMantenimientosPorMaquinariaRequest,
  obtenerMantenimientosProximosRequest
} from '../api/mantenimientos';

const MantenimientoContext = createContext();

export const useMantenimiento = () => useContext(MantenimientoContext);

export const MantenimientoProvider = ({ children }) => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [mantenimientosProximos, setMantenimientosProximos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔧 Registrar un nuevo mantenimiento realizado
  const registrarMantenimiento = async (datos) => {
    try {
      setLoading(true);
      const res = await crearMantenimientoRequest(datos);
      setMantenimientos((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error('❌ Error registrando mantenimiento:', error?.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📄 Cargar mantenimientos por maquinaria
  const cargarMantenimientosPorMaquinaria = async (maquinariaId) => {
    try {
      setLoading(true);
      const res = await obtenerMantenimientosPorMaquinariaRequest(maquinariaId);
      setMantenimientos(res.data);
    } catch (error) {
      console.error('❌ Error al obtener mantenimientos por maquinaria:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⏰ Cargar mantenimientos próximos a vencerse
  const cargarMantenimientosProximos = async () => {
    try {
      setLoading(true);
      const res = await obtenerMantenimientosProximosRequest();
      setMantenimientosProximos(res.data);
    } catch (error) {
      console.error('❌ Error al obtener mantenimientos próximos:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantenimientoContext.Provider
      value={{
        mantenimientos,
        mantenimientosProximos,
        loading,
        registrarMantenimiento,
        cargarMantenimientosPorMaquinaria,
        cargarMantenimientosProximos
      }}
    >
      {children}
    </MantenimientoContext.Provider>
  );
};
