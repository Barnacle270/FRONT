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
  anularServicio,
  getServiciosPendientesCarguio,   // 👈 Nuevo
  actualizarEstadoCarguio          // 👈 Nuevo
} from '../api/Servicios';
import { useAuth } from './AuthContext';

const ServicioContext = createContext();

// 🔹 Hook interno para manejar loading y error
const useCargar = (fn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ejecutar = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error en la operación');
      toast.error(err.response?.data?.message || 'Error en la operación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { ejecutar, loading, error };
};

export const ServicioProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [noFacturados, setNoFacturados] = useState([]);
  const [pendientesCarguio, setPendientesCarguio] = useState([]); // 👈 Nuevo
  const [error, setError] = useState(null);

  // 🔹 Cargas iniciales
  const { ejecutar: cargarServiciosBase, loading: loadingServicios } = useCargar(getServicios);
  const { ejecutar: cargarPendientesBase } = useCargar(getServiciosPendientes);
  const { ejecutar: cargarNoFacturadosBase } = useCargar(getServiciosSinFacturar);

  const cargarServicios = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cargarServiciosBase();
      setServicios(data || []);
    } catch (err) {
      setError('Error al cargar servicios');
    }
  };

  const cargarPendientes = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cargarPendientesBase();
      setPendientes(data || []);
    } catch (err) {
      setError('Error al cargar pendientes');
    }
  };

  const cargarServiciosSinFacturar = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cargarNoFacturadosBase();
      setNoFacturados(data || []);
    } catch (err) {
      setError('Error al cargar sin facturar');
    }
  };

  // 🔹 Cargar servicios con carguío pendiente
  const cargarPendientesCarguio = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getServiciosPendientesCarguio();
      setPendientesCarguio(data || []);
    } catch (err) {
      setError('Error al cargar carguíos pendientes');
    }
  };

  // 🔹 Actualizar estado de carguío
  const cambiarEstadoCarguio = async (id, estado) => {
    if (!isAuthenticated) return;
    try {
      const actualizado = await actualizarEstadoCarguio(id, estado);
      toast.success(`Estado de carguío actualizado a ${estado}`);

      // 🔄 Actualizar listas locales
      setPendientesCarguio((prev) => prev.filter((s) => s._id !== id));
      setServicios((prev) => prev.map((s) => (s._id === id ? actualizado.servicio : s)));
      setPendientes((prev) => prev.map((s) => (s._id === id ? actualizado.servicio : s)));

      return actualizado.servicio;
    } catch (err) {
      setError('Error al actualizar estado de carguío');
      throw err;
    }
  };

  // 🔹 Importar XML
  const importarXML = async (formData) => {
    if (!isAuthenticated) return;
    try {
      await importarServicioDesdeXML(formData);
      toast.success('Servicio importado correctamente');
      await Promise.all([cargarServicios(), cargarPendientes(), cargarServiciosSinFacturar()]);
    } catch (err) {
      setError('Error al importar servicio');
    }
  };

  const importarXMLMasivo = async (formData) => {
    if (!isAuthenticated) return;
    try {
      await importarServiciosMasivos(formData);
      toast.success('Importación masiva completada');
      await Promise.all([cargarServicios(), cargarPendientes(), cargarServiciosSinFacturar()]);
    } catch (err) {
      setError('Error en la importación masiva');
    }
  };

  // 🔹 Actualización manual
  const actualizarManual = async (id, data) => {
    if (!isAuthenticated) return;
    try {
      await actualizarServicioManual(id, data);
      toast.success('Servicio actualizado');
      await Promise.all([cargarServicios(), cargarPendientes(), cargarServiciosSinFacturar()]);
    } catch (err) {
      setError('Error al actualizar servicio');
    }
  };

  // 🔹 Marcar devuelto
  const marcarDevuelto = async (id, body = {}) => {
    if (!isAuthenticated) return;
    try {
      await marcarServicioComoDevuelto(id, body);
      toast.success('Servicio marcado como devuelto');
      await Promise.all([cargarServicios(), cargarPendientes(), cargarServiciosSinFacturar()]);
    } catch (err) {
      setError('Error al marcar como devuelto');
    }
  };

  // 🔹 Obtener por fecha / ID
  const obtenerPorFecha = async (fecha) => {
    if (!isAuthenticated) return [];
    try {
      return await getServiciosPorFecha(fecha);
    } catch (err) {
      setError('Error al buscar servicios');
      return [];
    }
  };

  const obtenerPorId = async (id) => {
    if (!isAuthenticated) return null;
    try {
      return await getServicioPorId(id);
    } catch (err) {
      setError('Error al buscar servicio');
      return null;
    }
  };

  // 🔹 Editar servicio
  const actualizarServicio = async (id, data) => {
    if (!isAuthenticated) return null;
    try {
      const actualizado = await editarServicio(id, data);
      toast.success('Cambios guardados');

      // Optimista
      setServicios((prev) => prev.map((s) => (s._id === id ? actualizado : s)));
      setPendientes((prev) => prev.map((s) => (s._id === id ? actualizado : s)));
      setNoFacturados((prev) => prev.map((s) => (s._id === id ? actualizado : s)));

      return actualizado;
    } catch (err) {
      setError('Error al guardar cambios');
      throw err;
    }
  };

  // 🔹 Eliminar servicio
  const borrarServicio = async (id) => {
    if (!isAuthenticated) return;
    try {
      await eliminarServicio(id);
      toast.success('Servicio eliminado');

      setServicios((prev) => prev.filter((s) => s._id !== id));
      setPendientes((prev) => prev.filter((s) => s._id !== id));
      setNoFacturados((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError('Error al eliminar servicio');
    }
  };

  // 🔹 Actualizar facturación
  const actualizarFacturacion = async (items) => {
    if (!isAuthenticated) return;
    try {
      const res = await actualizarEstadoFacturacion(items);
      toast.success('Facturación actualizada');
      await Promise.all([cargarServicios(), cargarServiciosSinFacturar()]);
      return res;
    } catch (err) {
      setError('Error al actualizar facturación');
      throw err;
    }
  };

  // 🔹 Recepcionar lote
  const recepcionarLote = async (ids, fecha) => {
    if (!isAuthenticated) return;
    try {
      await recepcionarServiciosLote({ ids, fechaRecepcion: fecha });
      toast.success('Guías recepcionadas');
      await Promise.all([cargarServicios(), cargarServiciosSinFacturar()]);
    } catch (err) {
      setError('Error al recepcionar lote');
    }
  };

  // 🔹 Anular servicio
  const anular = async (id) => {
    if (!isAuthenticated) return;
    try {
      await anularServicio(id);
      toast.success('Servicio anulado');
      await Promise.all([cargarServicios(), cargarPendientes()]);
    } catch (err) {
      setError('Error al anular servicio');
    }
  };

  // 🔹 Cargar datos iniciales solo si hay sesión
  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        cargarServicios(),
        cargarPendientes(),
        cargarServiciosSinFacturar(),
        cargarPendientesCarguio() // 👈 Ahora también cargamos los de carguío
      ]);
    } else {
      setServicios([]);
      setPendientes([]);
      setNoFacturados([]);
      setPendientesCarguio([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <ServicioContext.Provider
      value={{
        servicios,
        pendientes,
        noFacturados,
        pendientesCarguio,         // 👈 Nuevo
        loading: loadingServicios,
        error,
        cargarServicios,
        cargarPendientes,
        cargarServiciosSinFacturar,
        cargarPendientesCarguio,   // 👈 Nuevo
        cambiarEstadoCarguio,      // 👈 Nuevo
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
