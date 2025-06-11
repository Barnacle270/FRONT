import axios from "./axios";

export const getBoletasRequest = (page = 1, limit = 6) =>
  axios.get(`/boletasdni?page=${page}&limit=${limit}`);

export const createBoletasRequest = (boletas) =>
  axios.post(`/boletas`, boletas, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
