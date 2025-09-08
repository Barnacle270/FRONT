import axios from './axios'; // tu instancia base

// Registrar un mantenimiento
export const crearMantenimientoRequest = (mantenimiento) =>
  axios.post('/mantenimientos', mantenimiento);

// Obtener mantenimientos realizados por maquinaria
export const obtenerMantenimientosPorMaquinariaRequest = (maquinariaId) =>
  axios.get(`/mantenimientos/${maquinariaId}`);

// Obtener mantenimientos próximos
export const obtenerMantenimientosProximosRequest = () =>
  axios.get('/mantenimientos/proximos-mantenimientos'); // ✅ importante que sea exacto
