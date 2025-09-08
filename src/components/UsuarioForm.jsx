import { useState, useEffect } from "react";
import { useUsuarios } from "../context/UserContext";

const rolesDisponibles = ["User", "Administrador", "Superadministrador","Almacen"];

const UsuarioForm = ({ usuario = null, onSuccess }) => {
  const { crearUsuario, editarUsuario } = useUsuarios();

  const [form, setForm] = useState({
    dni: "",
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario) {
      setForm({
        dni: usuario.dni || "",
        name: usuario.name || "",
        email: usuario.email || "",
        password: "",
        role: usuario.role || "User",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (usuario) {
        await editarUsuario(usuario._id, form);
      } else {
        if (!form.password || form.password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        await crearUsuario(form);
      }

      if (onSuccess) onSuccess(); // cerrar modal o recargar lista
      setForm({ dni: "", name: "", email: "", password: "", role: "User" });
    } catch (err) {
      setError("Error al guardar usuario");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface p-6 rounded-lg shadow-md text-text-primary space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {usuario ? "Editar Usuario" : "Crear Usuario"}
      </h2>

      {error && <p className="text-button-danger text-sm">{error}</p>}

      <div>
        <label className="block mb-1 text-sm text-text-secondary">DNI</label>
        <input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          required
          className="w-full bg-input p-2 rounded text-sm outline-none ring-1 ring-transparent focus:ring-focus"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-text-secondary">Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full bg-input p-2 rounded text-sm outline-none ring-1 ring-transparent focus:ring-focus"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-text-secondary">Correo</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full bg-input p-2 rounded text-sm outline-none ring-1 ring-transparent focus:ring-focus"
        />
      </div>

      {!usuario && (
        <div>
          <label className="block mb-1 text-sm text-text-secondary">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-input p-2 rounded text-sm outline-none ring-1 ring-transparent focus:ring-focus"
          />
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm text-text-secondary">Rol</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full bg-input p-2 rounded text-sm text-white outline-none ring-1 ring-transparent focus:ring-focus"
        >
          {rolesDisponibles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-2 bg-button-primary text-white rounded hover:opacity-90"
      >
        {usuario ? "Guardar cambios" : "Crear usuario"}
      </button>
    </form>
  );
};

export default UsuarioForm;
