import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "/tj.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    await signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => navigate("/"), 1500); // Delay de redirección
    } else {
      setIsSubmitting(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 px-4">
      <div className="bg-zinc-800 w-full max-w-md p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-3xl font-bold text-white">Iniciar sesión</h1>
        </div>

        {signinErrors.length > 0 && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {signinErrors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              {...register("dni", { required: "El DNI es obligatorio" })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="DNI"
              autoComplete="username"
            />
            {errors.dni && <p className="text-red-400 text-sm mt-1">{errors.dni.message}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="w-full bg-zinc-700 text-white px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Contraseña"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-white"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
            } transition-colors text-white py-2 rounded font-semibold`}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
