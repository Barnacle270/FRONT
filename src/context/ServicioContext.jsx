import { createContext, useContext, useEffect, useState } from 'react';
import {
  getServicios,
  getServiciosPendientes,
  importarServicioDesdeXML,
  importarServiciosMasivos,
  actualizarServicioManual,
  marcarServicioComoDevuelto,
  getServiciosPorFecha,
  getServicioPorId,
  editarServicio,
  eliminarServicio
} from '../api/Servicios';

const ServicioContext = createContext();

export const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const data = await getServicios();
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPendientes = async () => {
    try {
      const data = await getServiciosPendientes();
      setPendientes(data);
    } catch (error) {
      console.error('Error al cargar pendientes:', error);
    }
  };

  const obtenerPorFecha = async (fecha) => {
    try {
      const data = await getServiciosPorFecha(fecha);
      return data;
    } catch (error) {
      console.error('Error al obtener servicios por fecha:', error);
      return [];
    }
  };

  const importarXML = async (formData) => {
    await importarServicioDesdeXML(formData);
    await cargarServicios();
    await cargarPendientes();
  };

  const importarXMLMasivo = async (formData) => {
    await importarServiciosMasivos(formData);
    await cargarServicios();
    await cargarPendientes();
  };

  const actualizarManual = async (id, data) => {
    await actualizarServicioManual(id, data);
    await cargarServicios();
    await cargarPendientes();
  };

  const marcarDevuelto = async (id, body = {}) => {
    await marcarServicioComoDevuelto(id, body);
    await cargarServicios();
    await cargarPendientes();
  };

  const obtenerPorId = async (id) => {
    try {
      const servicio = await getServicioPorId(id);
      return servicio;
    } catch (error) {
      console.error('Error al obtener servicio por ID:', error);
      return null;
    }
  };

  const actualizarServicio = async (id, data) => {
    try {
      const actualizado = await editarServicio(id, data);
      await cargarServicios();
      return actualizado;
    } catch (error) {
      console.error('Error al editar servicio:', error);
      throw error;
    }
  };

  const borrarServicio = async (id) => {
    try {
      await eliminarServicio(id);
      await cargarServicios();
      await cargarPendientes();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
    }
  };

  useEffect(() => {
    cargarServicios();
    cargarPendientes();
  }, []);

  return (
    <ServicioContext.Provider
      value={{
        servicios,
        pendientes,
        loading,
        cargarServicios,
        cargarPendientes,
        importarXML,
        importarXMLMasivo, // ✅ CORRECTAMENTE EXPUESTO
        actualizarManual,
        marcarDevuelto,
        obtenerPorFecha,
        obtenerPorId,
        actualizarServicio,
        borrarServicio
      }}
    >
      {children}
    </ServicioContext.Provider>
  );
};

export const useServicios = () => useContext(ServicioContext);
