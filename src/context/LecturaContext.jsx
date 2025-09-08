import { createContext, useContext, useState } from 'react';
import {
  crearLecturaRequest,
  obtenerLecturasPorMaquinariaRequest,
  eliminarLecturaRequest
} from '../api/lecturas';

const LecturaContext = createContext();

export const useLectura = () => useContext(LecturaContext);

export const LecturaProvider = ({ children }) => {
  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Crear nueva lectura
  const registrarLectura = async (datos) => {
    try {
      setLoading(true);
      const res = await crearLecturaRequest(datos);
      setLecturas((prev) => [res.data, ...prev]); // insertamos al inicio
      return res.data;
    } catch (error) {
      console.error('Error registrando lectura:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener lecturas por maquinaria
  const cargarLecturasPorMaquinaria = async (maquinariaId) => {
    try {
      setLoading(true);
      const res = await obtenerLecturasPorMaquinariaRequest(maquinariaId);
      setLecturas(res.data);
    } catch (error) {
      console.error('Error al cargar lecturas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una lectura
  const eliminarLectura = async (id) => {
    try {
      await eliminarLecturaRequest(id);
      setLecturas((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error('Error al eliminar lectura:', error);
    }
  };

  return (
    <LecturaContext.Provider
      value={{
        lecturas,
        loading,
        registrarLectura,
        cargarLecturasPorMaquinaria,
        eliminarLectura
      }}
    >
      {children}
    </LecturaContext.Provider>
  );
};
