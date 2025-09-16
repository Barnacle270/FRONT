import { createContext, useContext } from 'react';
import { descargarReporteServicios, obtenerPendientesFacturar } from '../api/reportes';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext'; // 👈 Importar auth

const ReportesContext = createContext();

export const ReportesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const descargarServicios = async (desde, hasta) => {
    if (!isAuthenticated) {
      toast.error('No estás autenticado');
      return;
    }

    try {
      await descargarReporteServicios(desde, hasta);
      toast.success('Reporte descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el reporte');
    }
  };

  const cargarPendientesFacturar = async () => {
    if (!isAuthenticated) {
      toast.error('No estás autenticado');
      return [];
    }

    try {
      const data = await obtenerPendientesFacturar();
      return data || [];
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

export const useReportes = () => {
  const ctx = useContext(ReportesContext);
  if (!ctx) throw new Error('useReportes debe usarse dentro de ReportesProvider');
  return ctx;
};
