import axios from "./axios";


export const createTransporteRequest = (transporte) => axios.post(`/transporte`, transporte);

export const getTransporteRequest = () => axios.get(`/transporte`);
