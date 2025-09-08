import { createContext, useContext, useState, useEffect } from "react";
import {
  getMaquinariasRequest,
  createMaquinariaRequest,
  updateMaquinariaRequest,
  deleteMaquinariaRequest,
  addMantenimientoToMaquinariaRequest,
  updateMantenimientoDeMaquinariaRequest,
  deleteMantenimientoDeMaquinariaRequest
} from "../api/maquinaria";

// 1. Creamos el contexto
const MaquinariaContext = createContext();

// 2. Hook personalizado
export const useMaquinaria = () => {
  const context = useContext(MaquinariaContext);
  if (!context) {
    throw new Error("useMaquinaria debe usarse dentro de MaquinariaProvider");
  }
  return context;
};

// 3. Proveedor
export const MaquinariaProvider = ({ children }) => {
  const [maquinarias, setMaquinarias] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMaquinarias = async () => {
    try {
      setLoading(true);
      const res = await getMaquinariasRequest();
      setMaquinarias(res.data);
    } catch (error) {
      console.error("Error al cargar maquinarias:", error);
    } finally {
      setLoading(false);
    }
  };

  const createMaquinaria = async (data) => {
    const res = await createMaquinariaRequest(data);
    setMaquinarias((prev) => [...prev, res.data]);
  };

  const updateMaquinaria = async (id, data) => {
    const res = await updateMaquinariaRequest(id, data);
    setMaquinarias((prev) =>
      prev.map((maq) => (maq._id === id ? res.data : maq))
    );
  };

  const deleteMaquinaria = async (id) => {
    await deleteMaquinariaRequest(id);
    setMaquinarias((prev) => prev.filter((maq) => maq._id !== id));
  };

  const addMantenimiento = async (id, mantenimiento) => {
    const res = await addMantenimientoToMaquinariaRequest(id, mantenimiento);
    setMaquinarias((prev) =>
      prev.map((maq) => (maq._id === id ? res.data : maq))
    );
  };

  const updateMantenimiento = async (id, mantenimientoId, data) => {
    const res = await updateMantenimientoDeMaquinariaRequest(id, mantenimientoId, data);
    setMaquinarias((prev) =>
      prev.map((maq) => (maq._id === id ? res.data : maq))
    );
  };

  const deleteMantenimiento = async (id, mantenimientoId) => {
    const res = await deleteMantenimientoDeMaquinariaRequest(id, mantenimientoId);
    setMaquinarias((prev) =>
      prev.map((maq) => (maq._id === id ? res.data : maq))
    );
  };

  useEffect(() => {
    loadMaquinarias();
  }, []);

  return (
    <MaquinariaContext.Provider
      value={{
        maquinarias,
        loading,
        createMaquinaria,
        updateMaquinaria,
        deleteMaquinaria,
        addMantenimiento,
        updateMantenimiento,
        deleteMantenimiento,
        loadMaquinarias
      }}
    >
      {children}
    </MaquinariaContext.Provider>
  );
};

// 👇 Exportar también el contexto base
export { MaquinariaContext };
