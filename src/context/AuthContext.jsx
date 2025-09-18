import { useEffect, useState, useContext, useMemo } from "react";
import { createContext } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode"; // 👈 import correcto
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// 👇 función para decodificar y loguear expiración
const decodeAndLogToken = (token) => {
  try {
    const decoded = jwtDecode(token); // { id, dni, role, exp, iat }
    const expMs = decoded.exp * 1000;
    const expiresIn = expMs - Date.now();

    console.log(
      `⏳ El access token expira en ${Math.floor(
        expiresIn / 1000 / 60
      )} min ${Math.floor((expiresIn / 1000) % 60)} seg`
    );

    return expMs;
  } catch (err) {
    console.error("No se pudo decodificar el token:", err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧹 Limpiar errores después de 2 seg
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // 📌 Normalizador de errores
  const normalizeError = (error, fallback) => {
    const err = error.response?.data;
    return Array.isArray(err) ? err[0] : err?.message || fallback;
  };

  // REGISTRO
  const signup = async (formData) => {
    try {
      const res = await registerRequest(formData);
      const { accessToken, user: userData } = res.data;

      setUser(userData);
      setIsAuthenticated(true);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        decodeAndLogToken(accessToken);
      }

      toast.success("Usuario registrado con éxito");
    } catch (error) {
      const msg = normalizeError(error, "Error al registrarse");
      setErrors([msg]);
      toast.error(msg);
    }
  };

  // LOGIN
  const signin = async (formData) => {
    try {
      const res = await loginRequest(formData);
      const { accessToken, user: userData } = res.data;

      setUser(userData);
      setIsAuthenticated(true);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        decodeAndLogToken(accessToken);
      }

      toast.success("¡Bienvenido!");
    } catch (error) {
      const msg = normalizeError(error, "Error al iniciar sesión");
      setErrors([msg]);
      toast.error(msg);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
      toast("Sesión cerrada", { icon: "👋" });
    }
  };

  // 🔐 Verificar sesión al montar
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await verifyTokenRequest();
        setUser(res.data);
        setIsAuthenticated(true);
        decodeAndLogToken(token);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // 🔔 Escuchar expiración de sesión
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common["Authorization"];
      toast.error("Tu sesión ha expirado. Vuelve a iniciar sesión.");
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      signup,
      signin,
      logout,
      isAuthenticated,
      errors,
      loading,
    }),
    [user, isAuthenticated, errors, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
