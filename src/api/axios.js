import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backendtjboletas-production.up.railway.app/api/',

  withCredentials: true,
})

export default instance;