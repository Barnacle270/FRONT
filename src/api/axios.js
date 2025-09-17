import axios from "axios";

const instance = axios.create({
  baseURL: "https://back-2vwn.onrender.com/api/",
  withCredentials: true, // necesario para enviar la cookie de refresh
});

// 🔹 Interceptor de request
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

// 🔹 Interceptor de respuesta
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evitar loop infinito
    if (originalRequest.url.includes("/v2/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await instance.get("/v2/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
