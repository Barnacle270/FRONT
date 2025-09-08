import axios from "./axios";

// 📌 Obtener boletas del usuario autenticado (paginadas)
export const getBoletasRequest = async (page = 1, limit = 6) => {
  try {
    const res = await axios.get(`/boletasdni?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener boletas:", error.response?.data || error.message);
    throw error;
  }
};

// 📌 Crear boleta con imagen
export const createBoletasRequest = async (boleta) => {
  try {
    const formData = new FormData();
    Object.keys(boleta).forEach((key) => {
      formData.append(key, boleta[key]);
    });

    const res = await axios.post("/boletas", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error al crear boleta:", error.response?.data || error.message);
    throw error;
  }
};
