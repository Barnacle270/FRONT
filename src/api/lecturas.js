import axios from './axios';

// Crear una nueva lectura
export const crearLecturaRequest = (lectura) =>
  axios.post('/lecturas', lectura);

// Obtener lecturas por maquinaria
export const obtenerLecturasPorMaquinariaRequest = (maquinariaId) =>
  axios.get(`/lecturas/${maquinariaId}`);

// Eliminar una lectura por ID
export const eliminarLecturaRequest = (id) =>
  axios.delete(`/lecturas/${id}`);
