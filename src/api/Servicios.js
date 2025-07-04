import axios from './axios';

// Obtener todos los servicios
export const getServicios = async () => {
  const hoy = new Date().toISOString().split('T')[0];
  const res = await axios.get(`servicios?fecha=${hoy}`);
  return res.data;
};

// Obtener solo los servicios con estado "PENDIENTE"
export const getServiciosPendientes = async () => {
  const res = await axios.get('servicios/pendientes');
  return res.data;
};

// Importar servicio desde XML
export const importarServicioDesdeXML = async (formData) => {
  const res = await axios.post('servicios/importar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// Actualizar campos manuales de un servicio
export const actualizarServicioManual = async (id, data) => {
  const res = await axios.put(`servicios/${id}/manual`, data);
  return res.data;
};

// Marcar servicio como devuelto (estado = CONCLUIDO)
export const marcarServicioComoDevuelto = async (id, data = {}) => {
  const res = await axios.put(`servicios/${id}/devolver`, data);
  return res.data;
};

export const getServiciosPorFecha = async (fecha) => {
  const res = await axios.get(`servicios?fecha=${fecha}`);
  return res.data;
};

// Obtener un servicio por ID
export const getServicioPorId = async (id) => {
  const res = await axios.get(`servicios/${id}`);
  return res.data;
};

// Editar un servicio existente
export const editarServicio = async (id, data) => {
  const res = await axios.put(`servicios/${id}/editar`, data);
  return res.data;
};

// Eliminar un servicio
export const eliminarServicio = async (id) => {
  const res = await axios.delete(`servicios/${id}`);
  return res.data;
};