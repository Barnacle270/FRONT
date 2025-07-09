import { createContext, useContext, useEffect, useState } from 'react';
import {
  getServicios,
  getServiciosPendientes,
  getServiciosSinFacturar, // ✅ NUEVO
  importarServicioDesdeXML,
  importarServiciosMasivos,
  actualizarServicioManual,
  marcarServicioComoDevuelto,
  getServiciosPorFecha,
  getServicioPorId,
  editarServicio,
  eliminarServicio,
  actualizarEstadoFacturacion,
  recepcionarServiciosLote // ✅ NUEVO
} from '../api/Servicios';

const ServicioContext = createContext();

export const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [noFacturados, setNoFacturados] = useState([]); // ✅ NUEVO
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

  const cargarServiciosSinFacturar = async () => {
    try {
      const data = await getServiciosSinFacturar();
      setNoFacturados(data);
    } catch (error) {
      console.error('Error al cargar servicios sin facturar:', error);
    }
  };

  const importarXML = async (formData) => {
    await importarServicioDesdeXML(formData);
    await cargarServicios();
    await cargarPendientes();
    await cargarServiciosSinFacturar(); // ✅ También recargar lista sin facturar
  };

  const importarXMLMasivo = async (formData) => {
    await importarServiciosMasivos(formData);
    await cargarServicios();
    await cargarPendientes();
    await cargarServiciosSinFacturar();
  };

  const actualizarManual = async (id, data) => {
    await actualizarServicioManual(id, data);
    await cargarServicios();
    await cargarPendientes();
    await cargarServiciosSinFacturar();
  };

  const marcarDevuelto = async (id, body = {}) => {
    await marcarServicioComoDevuelto(id, body);
    await cargarServicios();
    await cargarPendientes();
    await cargarServiciosSinFacturar();
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
      await cargarPendientes();
      await cargarServiciosSinFacturar();
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
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
    }
  };

  const actualizarFacturacion = async (items) => {
    try {
      const res = await actualizarEstadoFacturacion(items);
      await cargarServicios();
      await cargarServiciosSinFacturar();
      return res;
    } catch (error) {
      console.error('Error al actualizar facturación:', error);
      throw error;
    }
  };

  const recepcionarLote = async (ids, fecha) => {
    try {
      await recepcionarServiciosLote({ ids, fechaRecepcion: fecha });
      await cargarServiciosSinFacturar();
      await cargarServicios();
    } catch (error) {
      console.error('Error al recepcionar lote:', error);
    }
  };

  useEffect(() => {
    cargarServicios();
    cargarPendientes();
    cargarServiciosSinFacturar(); // ✅ Cargar también al iniciar
  }, []);

  return (
    <ServicioContext.Provider
      value={{
        servicios,
        pendientes,
        noFacturados, // ✅ NUEVO
        loading,
        cargarServicios,
        cargarPendientes,
        cargarServiciosSinFacturar,
        importarXML,
        importarXMLMasivo,
        actualizarManual,
        marcarDevuelto,
        obtenerPorFecha,
        obtenerPorId,
        actualizarServicio,
        borrarServicio,
        actualizarFacturacion,
        recepcionarLote // ✅ NUEVO
      }}
    >
      {children}
    </ServicioContext.Provider>
  );
};

export const useServicios = () => useContext(ServicioContext);
