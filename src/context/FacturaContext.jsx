import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  listFacturas as apiListarFacturas,
  createFactura as apiCrearFactura,
  getFactura as apiObtenerFactura,
  pagarFactura as apiPagarFactura
} from '../api/Facturas.js';

const FacturaContext = createContext(null);

export function FacturaProvider({ children }) {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [filtros, setFiltros] = useState({ cliente: '', estadoPago: '', desde: '', hasta: '' });
  const [loading, setLoading] = useState(false);
  const [loadingAccion, setLoadingAccion] = useState(false); // para crear/pagar
  const [error, setError] = useState(null);


  // Listar facturas (con filtros actuales o params explícitos)
  const listar = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = { ...filtros, ...params };
      // Limpia campos vacíos para no ensuciar la query
      Object.keys(query).forEach((k) => (query[k] === '' || query[k] == null) && delete query[k]);
      const data = await apiListarFacturas(query);
      setFacturas(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al listar facturas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Crear factura (payload: ver api)
  const crear = useCallback(async (payload) => {
    setLoadingAccion(true);
    setError(null);
    try {
      const creada = await apiCrearFactura(payload);
      // Opcional: actualizar lista si el filtro aplica
      setFacturas((prev) => [creada, ...prev]);
      setFacturaSeleccionada(creada);
      return creada;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear factura');
      throw err;
    } finally {
      setLoadingAccion(false);
    }
  }, []);

  // Obtener una factura por id o número
  const obtener = useCallback(async (idOrNumero) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiObtenerFactura(idOrNumero);
      setFacturaSeleccionada(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al obtener factura');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagar factura (por id o numero)
  const pagar = useCallback(async (idOrNumero, fechaPago) => {
    setLoadingAccion(true);
    setError(null);
    try {
      const data = await apiPagarFactura(idOrNumero, { fechaPago });
      // Actualizar lista si la tenemos cargada
      setFacturas((prev) =>
        prev.map((f) => (f._id === data._id || f.numero === data.numero ? data : f))
      );
      setFacturaSeleccionada((prev) =>
        prev && (prev._id === data._id || prev.numero === data.numero) ? data : prev
      );
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al pagar factura');
      throw err;
    } finally {
      setLoadingAccion(false);
    }
  }, []);

  // Seleccionar manualmente una factura (p.ej. desde una tabla)
  const seleccionar = useCallback((factura) => {
    setFacturaSeleccionada(factura);
  }, []);

  // Refrescar lista con filtros actuales
  const refrescar = useCallback(async () => {
    return listar();
  }, [listar]);

  const value = useMemo(() => ({
    facturas,
    facturaSeleccionada,
    filtros,
    setFiltros,
    loading,
    loadingAccion,
    error,

    listar,
    crear,
    obtener,
    pagar,
    seleccionar,
    refrescar,
  }), [
    facturas,
    facturaSeleccionada,
    filtros,
    loading,
    loadingAccion,
    error,
    listar,
    crear,
    obtener,
    pagar,
    seleccionar,
    refrescar
  ]);

  return (
    <FacturaContext.Provider value={value}>
      {children}
    </FacturaContext.Provider>
  );
}

export function useFactura() {
  const ctx = useContext(FacturaContext);
  if (!ctx) {
    throw new Error('useFactura debe usarse dentro de <FacturaProvider>');
  }
  return ctx;
}
