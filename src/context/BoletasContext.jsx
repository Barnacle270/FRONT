import { createContext, useContext, useState } from "react";
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
  const [boletasPerPage] = useState(6); // Puedes cambiar este número

  const getBoletas = async (page = 1) => {
    try {
      const res = await axios.get(`/boletasdni?page=${page}&limit=${boletasPerPage}`);
      setBoletas(res.data.boletas);
      setTotalBoletas(res.data.total);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BoletaContext.Provider value={{
      boletas,
      totalBoletas,
      currentPage,
      boletasPerPage,
      getBoletas,
      setCurrentPage,
    }}>
      {children}
    </BoletaContext.Provider>
  );
}
