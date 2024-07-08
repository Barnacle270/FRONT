import axios from "./axios";

export const createTransporteRequest = (transporte) =>
  axios.post(`/transporte`, transporte);
export const getTransporteRequest = (page = 1) =>
  axios.get(`/transporte?page=${page}`);
export const updateTransporteRequest = (id, transporte) =>
  axios.put(`/transporte/${id}`, transporte);
export const getTransporteByIdRequest = (id) => axios.get(`/transporte/${id}`);
export const deleteTransporteRequest = (id) =>
  axios.delete(`/transporte/${id}`);


export const createClienteRequest = (cliente) =>
  axios.post(`/cliente`, cliente);
export const getClienteRequest = () => axios.get(`/cliente`);

export const createCamionesRequest = (camiones) =>
  axios.post(`/camiones`, camiones);
export const getCamionesRequest = () => axios.get(`/camiones`);

export const createConductoresRequest = (conductor) =>
  axios.post(`/conductor`, conductor);
export const getConductoresRequest = () => axios.get(`/conductor`);
