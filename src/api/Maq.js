import axios from "./axios";


export const getMaqsRequest = () => axios.get(`/maq`);
export const createMaqsRequest = (maqs) => axios.post(`/maq`, maqs);

