import { createContext, useContext, useState } from 'react';
import { descargarReporteServicios, obtenerPendientesFacturar } from '../api/reportes';
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

  const cargarPendientesFacturar = async () => {
    try {
      const data = await obtenerPendientesFacturar();
      return data;
    } catch (error) {
      toast.error('Error al cargar pendientes de facturación');
      return [];
    }
  };

  return (
    <ReportesContext.Provider value={{ descargarServicios, cargarPendientesFacturar }}>
      {children}
    </ReportesContext.Provider>
  );
};

export const useReportes = () => useContext(ReportesContext);
