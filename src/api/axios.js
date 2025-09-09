import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://back-2vwn.onrender.com/api/',
  withCredentials: true, // esto envía cookies automáticamente
});

export default instance;
