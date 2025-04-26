import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api/',
  withCredentials: true, // esto envía cookies automáticamente
});

export default instance;
