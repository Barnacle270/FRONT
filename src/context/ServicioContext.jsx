import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getServicios,
  getServiciosPendientes,
  getServiciosSinFacturar,
  importarServicioDesdeXML,
  importarServiciosMasivos,
  actualizarServicioManual,
  marcarServicioComoDevuelto,
  getServiciosPorFecha,
  getServicioPorId,
  editarServicio,
  eliminarServicio,
  actualizarEstadoFacturacion,
  recepcionarServiciosLote,
  anularServicio
} from '../api/Servicios';

const ServicioContext = createContext();

export const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [noFacturados, setNoFacturados] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const data = await getServicios();
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      toast.error('Error al cargar servicios');
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
      toast.error('Error al cargar servicios pendientes');
    }
  };

  const cargarServiciosSinFacturar = async () => {
    try {
      const data = await getServiciosSinFacturar();
      setNoFacturados(data);
    } catch (error) {
      console.error('Error al cargar sin facturar:', error);
      toast.error('Error al cargar servicios sin facturar');
    }
  };

  const importarXML = async (formData) => {
    try {
      await importarServicioDesdeXML(formData);
      toast.success('Servicio importado correctamente');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al importar XML:', error);
      toast.error('Error al importar servicio');
    }
  };

  const importarXMLMasivo = async (formData) => {
    try {
      await importarServiciosMasivos(formData);
      toast.success('Importación masiva completada');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al importar masivo:', error);
      toast.error('Error en la importación masiva');
    }
  };

  const actualizarManual = async (id, data) => {
    try {
      await actualizarServicioManual(id, data);
      toast.success('Servicio actualizado');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al actualizar manual:', error);
      toast.error('Error al actualizar servicio');
    }
  };

  const marcarDevuelto = async (id, body = {}) => {
    try {
      await marcarServicioComoDevuelto(id, body);
      toast.success('Servicio marcado como devuelto');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al marcar devuelto:', error);
      toast.error('Error al marcar como devuelto');
    }
  };

  const obtenerPorFecha = async (fecha) => {
    try {
      return await getServiciosPorFecha(fecha);
    } catch (error) {
      console.error('Error al obtener por fecha:', error);
      toast.error('Error al buscar servicios');
      return [];
    }
  };

  const obtenerPorId = async (id) => {
    try {
      return await getServicioPorId(id);
    } catch (error) {
      console.error('Error al obtener por ID:', error);
      toast.error('Error al buscar servicio');
      return null;
    }
  };

  const actualizarServicio = async (id, data) => {
    try {
      const actualizado = await editarServicio(id, data);
      toast.success('Cambios guardados');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
      return actualizado;
    } catch (error) {
      console.error('Error al editar servicio:', error);
      toast.error('Error al guardar cambios');
      throw error;
    }
  };

  const borrarServicio = async (id) => {
    try {
      await eliminarServicio(id);
      toast.success('Servicio eliminado');
      await cargarServicios();
      await cargarPendientes();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      toast.error('Error al eliminar servicio');
    }
  };

  const actualizarFacturacion = async (items) => {
    try {
      const res = await actualizarEstadoFacturacion(items);
      toast.success('Facturación actualizada');
      await cargarServicios();
      await cargarServiciosSinFacturar();
      return res;
    } catch (error) {
      console.error('Error al actualizar facturación:', error);
      toast.error('Error al actualizar estado de facturación');
      throw error;
    }
  };

  const recepcionarLote = async (ids, fecha) => {
    try {
      await recepcionarServiciosLote({ ids, fechaRecepcion: fecha });
      toast.success('Guías recepcionadas');
      await cargarServicios();
      await cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al recepcionar lote:', error);
      toast.error('Error al recepcionar lote');
    }
  };

  const anular = async (id) => {
    try {
      await anularServicio(id);
      toast.success('Servicio anulado');
      await cargarServicios();
      await cargarPendientes();
    } catch (error) {
      console.error('Error al anular servicio:', error);
      toast.error('Error al anular servicio');
    }
  };

  useEffect(() => {
    cargarServicios();
    cargarPendientes();
    cargarServiciosSinFacturar();
  }, []);

  return (
    <ServicioContext.Provider
      value={{
        servicios,
        pendientes,
        noFacturados,
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
        recepcionarLote,
        anular
      }}
    >
      {children}
    </ServicioContext.Provider>
  );
};

export const useServicios = () => useContext(ServicioContext);
