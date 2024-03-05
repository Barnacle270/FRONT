import axios from "./axios";


export const getBoletasRequest = () => axios.get(`/boletasdni`);
export const createBoletasRequest = (boletas) => axios.post(`/boletas`, boletas);

