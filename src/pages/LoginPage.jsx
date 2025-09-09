import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "/tj.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await signin(data);
    } finally {
      // 👈 siempre se ejecuta, sea éxito o error
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // redirección inmediata
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 px-4">
      <div className="bg-zinc-800 w-full max-w-md p-8 rounded-lg shadow-md">
        {/* Logo + Título */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-3xl font-bold text-white">Iniciar sesión</h1>
        </div>

        {/* Errores de login */}
        {signinErrors.length > 0 && (
          <p className="text-red-400 text-sm text-center mb-3">
            {signinErrors[0]}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* DNI */}
          <div>
            <input
              type="text"
              {...register("dni", { required: "El DNI es obligatorio" })}
              aria-invalid={!!errors.dni}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="DNI"
              autoComplete="username"
            />
            {errors.dni && (
              <p className="text-red-400 text-sm mt-1">{errors.dni.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              aria-invalid={!!errors.password}
              className="w-full bg-zinc-700 text-white px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Contraseña"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-white"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting
                ? "bg-sky-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700"
            } transition-colors text-white py-2 rounded font-semibold`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Futuro: Recuperación de contraseña */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sky-400 hover:underline text-sm"
            onClick={() => alert("Funcionalidad en desarrollo")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
