import { createContext, useContext,useState } from "react";

import {createMaqsRequest, getMaqsRequest} from "../api/Maq";

const MaqContext = createContext();

export const useMaq = () => {
  const context = useContext(MaqContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
export function MaqProvider({ children }) {
  
  const [maqs, setMaqs] = useState([]);


  const getMaqs = async () => {
    try {
      const res = await getMaqsRequest();
      setMaqs(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const createMaqs = async (maqs) => {
    try {
      const res = await createMaqsRequest(maqs);
      console.log(res);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <MaqContext.Provider value={{
      maqs,
      createMaqs,
      getMaqs,
    }}>
      {children}
    </MaqContext.Provider>
  );
}

