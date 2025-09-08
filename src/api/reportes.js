import axios from './axios';

export const descargarReporteServicios = async (desde, hasta) => {
  try {
    const response = await axios.get('reportes/servicios', {
      params: { desde, hasta },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte_servicios.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el reporte:', error);
    throw error;
  }
};

export const obtenerPendientesFacturar = async () => {
  const response = await axios.get('/reportes/pendientes-facturar');
  return response.data;
};

