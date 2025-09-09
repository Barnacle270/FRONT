import { useEffect, useState, useContext, useMemo } from "react";
import { createContext } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persistir user en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Al montar, intentar cargar usuario de localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Borrar errores después de 2 seg
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (formData) => {
    try {
      const res = await registerRequest(formData);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
        toast.success("Usuario registrado con éxito");
      }
    } catch (error) {
      const err = error.response?.data || "Error al registrarse";
      setErrors([err]);
      toast.error(err.message || "Error en registro");
    }
  };

  const signin = async (formData) => {
    try {
      const res = await loginRequest(formData);
      setUser(res.data);
      setIsAuthenticated(true);
      toast.success("¡Bienvenido!");
    } catch (error) {
      const err = error.response?.data || "Error al iniciar sesión";
      setErrors([err]);
      toast.error(err.message || "Error en login");
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("user");
      Cookies.remove("token");
      setUser(null);
      setIsAuthenticated(false);
      toast("Sesión cerrada", { icon: "👋" });
    }
  };

  // Verificar sesión al cargar la app
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest();
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // Renovar token cada 5 min
  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(async () => {
        try {
          await verifyTokenRequest();
        } catch {
          setIsAuthenticated(false);
          setUser(null);
        }
      }, 5 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Memoize value para evitar renders innecesarios
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
