import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 👈 import correcto

// 🔹 Helper: loguear en consola cuándo expira el token
const logTokenExp = (token) => {
  try {
    const { exp } = jwtDecode(token); // { exp: timestamp en segundos }
    const ms = exp * 1000 - Date.now();
    console.log(
      `⏳ Nuevo access token expira en ${Math.floor(ms / 60000)}m ${Math.floor(
        (ms / 1000) % 60
      )}s`
    );
  } catch {
    console.warn("No se pudo decodificar el token");
  }
};

// Instancia principal de Axios
const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:4000/api/",
  withCredentials: true,
});

// 🔹 Interceptor de request: agrega token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de respuesta: refresh automático
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/v2/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await instance.get("/v2/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        logTokenExp(newAccessToken); // 👈 log expiración

        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("sessionExpired"));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
