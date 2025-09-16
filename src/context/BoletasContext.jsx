import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "./AuthContext"; // 👈 Importamos autenticación

const BoletaContext = createContext();

export const useBoleta = () => {
  const context = useContext(BoletaContext);
  if (!context) throw new Error("useBoleta debe estar dentro de un BoletaProvider");
  return context;
};

export function BoletaProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth(); // 👈 usamos loading de AuthContext

  const [boletas, setBoletas] = useState([]);
  const [totalBoletas, setTotalBoletas] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [boletasPerPage] = useState(6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📌 Obtener boletas con paginación
  const getBoletas = async (page = 1) => {
    if (!isAuthenticated || authLoading) return; // 👈 evitar si no hay sesión o Auth aún carga
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/boletasdni?page=${page}&limit=${boletasPerPage}`);
      setBoletas(res.data.boletas);
      setTotalBoletas(res.data.total);
      setCurrentPage(res.data.page);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || "Error al cargar boletas");
      }
    } finally {
      setLoading(false);
    }
  };

  // 📌 Crear boleta
  const createBoleta = async (boleta) => {
    if (!isAuthenticated || authLoading) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(boleta).forEach((key) => {
        formData.append(key, boleta[key]);
      });

      const res = await axios.post("/boletas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Recargar lista
      await getBoletas(currentPage);

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear boleta");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Recargar boletas solo si hay sesión y Auth ya terminó de cargar
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      getBoletas(currentPage);
    } else if (!authLoading && !isAuthenticated) {
      setBoletas([]); // limpiar si no hay sesión
      setTotalBoletas(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, currentPage]);

  return (
    <BoletaContext.Provider
      value={{
        boletas,
        totalBoletas,
        currentPage,
        boletasPerPage,
        loading,
        error,
        getBoletas,
        createBoleta,
        setCurrentPage,
      }}
    >
      {children}
    </BoletaContext.Provider>
  );
}
