import axios from './axios';

export const getEstadisticas = async () => {
  const res = await axios.get('dashboard/estadisticas');
  return res.data;
};
