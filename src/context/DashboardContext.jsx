import { createContext, useContext, useState, useEffect } from 'react';
import { getEstadisticas } from '../api/dashboard';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarEstadisticas = async () => {
    try {
      const data = await getEstadisticas();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return (
    <DashboardContext.Provider value={{ stats, loading, cargarEstadisticas }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
