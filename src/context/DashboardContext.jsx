import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getEstadisticas } from '../api/dashboard';
import { useAuth } from './AuthContext'; // 👈 Importamos AuthContext

const DashboardContext = createContext(null);

const DEFAULT_PERIOD = '30d'; // '7d' | '30d' | '90d' | 'MTD' | 'YTD'

export const DashboardProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 👈 Saber si hay sesión
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  // Cache simple por periodo
  const cacheRef = useRef(new Map());

  const cargarEstadisticas = async (nextPeriod = period) => {
    if (!isAuthenticated) return; // 🚨 Evitar llamadas sin sesión

    setLoading(true);
    setError(null);
    try {
      // Si hay cache para ese periodo, úsalo optimistamente
      const cached = cacheRef.current.get(nextPeriod);
      if (cached) setStats(cached);

      const data = await getEstadisticas(nextPeriod);
      setStats(data);
      setPeriod(nextPeriod);
      cacheRef.current.set(nextPeriod, data);
    } catch (err) {
      console.error('Error al cargar estadísticas del dashboard:', err);
      setError(err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // alias semántico: refresh({ period })
  const refresh = (opts = {}) => {
    const nextPeriod = typeof opts.period === 'string' ? opts.period : period;
    return cargarEstadisticas(nextPeriod);
  };

  // 🚨 Solo cargar si hay sesión
  useEffect(() => {
    if (isAuthenticated) {
      cargarEstadisticas(DEFAULT_PERIOD);
    } else {
      setStats(null);
      cacheRef.current.clear(); // limpiar cache al desloguear
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
