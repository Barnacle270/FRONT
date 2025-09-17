import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí iría tu llamada real al backend
      toast.success("✅ Perfil actualizado correctamente");
    } catch (err) {
      toast.error("❌ No se pudo actualizar el perfil");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl card animate-fade-in">
        <h1 className="card-header">👤 Mi perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-text-secondary">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm text-text-secondary">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              disabled
            />
            <p className="text-xs text-text-secondary mt-1">
              El correo no puede cambiarse.
            </p>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-text-secondary">Nueva contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input"
            />
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-primary w-full">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
