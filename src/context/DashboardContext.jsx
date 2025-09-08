import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getEstadisticas } from '../api/dashboard';

const DashboardContext = createContext(null);

const DEFAULT_PERIOD = '30d'; // '7d' | '30d' | '90d' | 'MTD' | 'YTD'

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  // (Opcional) cache simple por periodo para evitar parpadeos al alternar
  const cacheRef = useRef(new Map());

  const cargarEstadisticas = async (nextPeriod = period) => {
    setLoading(true);
    setError(null);
    try {
      // Si hay cache para ese periodo, úsalo al vuelo (optimista)
      const cached = cacheRef.current.get(nextPeriod);
      if (cached) setStats(cached);

      const data = await getEstadisticas(nextPeriod);
      setStats(data);
      setPeriod(nextPeriod);
      cacheRef.current.set(nextPeriod, data);
    } catch (err) {
      console.error('Error al cargar estadísticas del dashboard:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // alias semántico: refresh({ period })
  const refresh = (opts = {}) => {
    const nextPeriod = typeof opts.period === 'string' ? opts.period : period;
    return cargarEstadisticas(nextPeriod);
  };

  useEffect(() => {
    cargarEstadisticas(DEFAULT_PERIOD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ stats, loading, error, period, setPeriod, cargarEstadisticas, refresh }),
    [stats, loading, error, period]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard debe usarse dentro de DashboardProvider');
  return ctx;
};
