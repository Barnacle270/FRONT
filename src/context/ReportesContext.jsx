import { createContext, useContext, useState } from 'react';
import { descargarReporteServicios } from '../api/reportes';
import { toast } from 'react-hot-toast';

const ReportesContext = createContext();

export const ReportesProvider = ({ children }) => {
  const descargarServicios = async (desde, hasta) => {
    try {
      await descargarReporteServicios(desde, hasta);
      toast.success('Reporte descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el reporte');
    }
  };

  return (
    <ReportesContext.Provider value={{ descargarServicios }}>
      {children}
    </ReportesContext.Provider>
  );
};

export const useReportes = () => useContext(ReportesContext);
