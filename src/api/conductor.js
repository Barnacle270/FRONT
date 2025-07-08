import axios from './axios';

export const crearConductor = (data) => axios.post('/conductores', data);
export const listarConductores = () => axios.get('/conductores');
export const obtenerConductorPorId = (id) => axios.get(`/conductores/${id}`);
export const actualizarConductor = (id, data) => axios.put(`/conductores/${id}`, data);
