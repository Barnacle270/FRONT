// src/api/auth.js
import axios from "./axios";

// Helper para incluir el access token del localStorage
const withAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
};

export const registerRequest = (user) =>
  axios.post("/v2/register", user, { withCredentials: true });

export const loginRequest = (user) =>
  axios.post("/v2/login", user, { withCredentials: true });

// Verificar sesión con el access token
export const verifyTokenRequest = () =>
  axios.get("/v2/verify", withAuth());

// Nuevo: pedir un access token nuevo usando la cookie de refresh
export const refreshTokenRequest = () =>
  axios.get("/v2/refresh", { withCredentials: true });

export const logoutRequest = () =>
  axios.post("/v2/logout", {}, { withCredentials: true });
