import { createContext, useContext, useEffect, useState } from "react";
import { createTransporteRequest, getTransporteRequest, getClienteRequest, getCamionesRequest, getConductoresRequest } from "../api/Transporte.js";

const TransporteContext = createContext();

export const useTransporte = () => {
  const context = useContext(TransporteContext);
  if (!context) {
    throw new Error("useTransporte must be used within a TransporteProvider");
  }
  return context;
}

export function TransporteProvider({ children }) {
  const [transporte, setTransporte] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [errors2, setErrors2] = useState([]);

  // clear errors after 5 seconds
  useEffect(() => {
    if (errors2.length > 0) {
      const timer = setTimeout(() => {
        setErrors2([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errors2]);

  const createTransporte = async (newTransporte) => {
    try {
      const res = await createTransporteRequest(newTransporte);
      if (res.data.savedTransporte) {
        return res.data;
      } else {
        throw new Error('Error al guardar transporte');
      }
    } catch (error) {
      setErrors2(error.response.data.msg);
      throw error;
    }
  };

  const getTransporte = async (page = 1) => {
    try {
      const res = await getTransporteRequest(page);
      setTransporte(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getCliente = async () => {
    try {
      const res = await getClienteRequest();
      setCliente(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getCamiones = async () => {
    try {
      const res = await getCamionesRequest();
      setCamiones(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  const getConductores = async () => {
    try {
      const res = await getConductoresRequest();
      setConductores(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TransporteContext.Provider value={{
      transporte,
      cliente,
      camiones,
      conductores,
      errors2,
      createTransporte,
      getTransporte,
      getCliente,
      getCamiones,
      getConductores
    }}>
      {children}
    </TransporteContext.Provider>
  );
}
