import { createContext, useContext,useState } from "react";

import {createTransporteRequest, getTransporteRequest} from "../api/Transporte.js";

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


  const createTransporte = async (maqs) => {
    try {
      const res = await createTransporteRequest(maqs);
      console.log(res);
    } catch (error) {
      console.log(error.response);
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

  return (
    <TransporteContext.Provider value={{
      transporte,
      createTransporte,
      getTransporte,
    
    }}>
      {children}
    </TransporteContext.Provider>
  );
}

