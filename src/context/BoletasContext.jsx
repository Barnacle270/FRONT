import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const BoletaContext = createContext();

export const useBoleta = () => {
  const context = useContext(BoletaContext);
  if (!context) throw new Error("useBoleta debe estar dentro de un BoletaProvider");
  return context;
};

export function BoletaProvider({ children }) {
  const [boletas, setBoletas] = useState([]);
  const [totalBoletas, setTotalBoletas] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [boletasPerPage] = useState(6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📌 Obtener boletas con paginación
  const getBoletas = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/boletasdni?page=${page}&limit=${boletasPerPage}`);
      setBoletas(res.data.boletas);
      setTotalBoletas(res.data.total);
      setCurrentPage(res.data.page);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar boletas");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Crear boleta (con imagen)
  const createBoleta = async (boleta) => {
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

      // Actualizar lista automáticamente
      await getBoletas(currentPage);

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear boleta");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Recargar boletas cuando cambie la página
  useEffect(() => {
    getBoletas(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
