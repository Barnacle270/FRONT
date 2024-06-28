import axios from "./axios";


export const createTransporteRequest = (transporte) => axios.post(`/transporte`, transporte);
export const getTransporteRequest = () => axios.get(`/transporte`);

export const createClienteRequest = (cliente) => axios.post(`/cliente`, cliente); 
export const getClienteRequest = () => axios.get(`/cliente`); 

export const createCamionesRequest = (camiones) => axios.post(`/camiones`, camiones);
export const getCamionesRequest = () => axios.get(`/camiones`);