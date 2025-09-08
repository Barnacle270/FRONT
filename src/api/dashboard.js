import axios from './axios';

// period puede ser: '7d', '30d', '90d', 'MTD', 'YTD'
export const getEstadisticas = async (period = '30d') => {
  const res = await axios.get(`dashboard/estadisticas?period=${encodeURIComponent(period)}`);
  return res.data;
};
