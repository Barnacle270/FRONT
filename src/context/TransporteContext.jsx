import { createContext, useContext,useEffect,useState } from "react";

import {createTransporteRequest, getTransporteRequest, getClienteRequest, getCamionesRequest} from "../api/Transporte.js";

const TransporteContext = createContext();

export const useTransporte = () => {
  const context = useContext(TransporteContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
export function TransporteProvider({ children }) {
  
  const [transporte, setTransporte] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [camiones, setCamiones] = useState([]);

  const [errors2, setErrors2] = useState([]);


  // clear errors after 5 seconds
  useEffect(() => {
    if (errors2.length > 0) {
      const timer = setTimeout(() => {
        setErrors2([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errors2]);


  const createTransporte = async (transporte) => {
    try {
      const res = await createTransporteRequest(transporte);
      console.log(res.data);
    } catch (error) {
      setErrors2(error.response.data);
    }
  }

  const getTransporte = async () => {
    try {
      const res = await getTransporteRequest();
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



  return (
    <TransporteContext.Provider value={{
      transporte,
      cliente,
      camiones,
      errors2,
      createTransporte,
      getTransporte,
      getCliente,
      getCamiones
    }}>
      {children}
    </TransporteContext.Provider>
  );
}

