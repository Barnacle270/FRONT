import axios from "./axios";

// 📄 Maquinarias generales
export const getMaquinariasRequest = () => axios.get("/maquinarias");

export const getMaquinariaByIdRequest = (id) =>
  axios.get(`/maquinarias/${id}`);

export const createMaquinariaRequest = (data) =>
  axios.post("/maquinarias", data, console.log("Enviando a backend:", data));

export const updateMaquinariaRequest = (id, data) =>
  axios.put(`/maquinarias/${id}`, data);

export const deleteMaquinariaRequest = (id) =>
  axios.delete(`/maquinarias/${id}`);

// 🔧 Mantenimientos definidos en la maquinaria
export const addMantenimientoToMaquinariaRequest = (id, mantenimiento) =>
  axios.post(`/maquinarias/${id}/mantenimientos`, mantenimiento);

export const updateMantenimientoDeMaquinariaRequest = (id, mantenimientoId, data) =>
  axios.put(`/maquinarias/${id}/mantenimientos/${mantenimientoId}`, data);

export const deleteMantenimientoDeMaquinariaRequest = (id, mantenimientoId) =>
  axios.delete(`/maquinarias/${id}/mantenimientos/${mantenimientoId}`);
