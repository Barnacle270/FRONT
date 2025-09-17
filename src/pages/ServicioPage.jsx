import { useState } from "react";
import { useServicios } from "../context/ServicioContext";
import { useClientes } from "../context/ClienteContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ServicioPage = () => {
  const { importarXML } = useServicios();
  const { clientes } = useClientes();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipoCarga: "",
    cliente: "",
  });
  const [xmlFile, setXmlFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setXmlFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!xmlFile || !formData.tipoCarga || !formData.cliente) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    const data = new FormData();
    data.append("xml", xmlFile);
    data.append("tipoCarga", formData.tipoCarga);
    data.append("cliente", formData.cliente);

    try {
      setLoading(true);
      await importarXML(data);
      toast.success("Servicio importado correctamente");

      // reset form
      setFormData({ tipoCarga: "", cliente: "" });
      setXmlFile(null);

      navigate("/historial");
    } catch (error) {
      toast.error("Error al importar el servicio");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-card p-6 rounded-lg shadow-lg border border-zinc-800">
        <h1 className="text-2xl font-bold mb-6">Importar Servicio desde XML</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cliente */}
          <div>
            <label
              htmlFor="cliente"
              className="block mb-1 text-text-secondary text-sm"
            >
              Cliente
            </label>
            <select
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c._id} value={c.razonSocial}>
                  {c.razonSocial} ({c.ruc})
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de carga */}
          <div>
            <label
              htmlFor="tipoCarga"
              className="block mb-1 text-text-secondary text-sm"
            >
              Tipo de Carga
            </label>
            <select
              id="tipoCarga"
              name="tipoCarga"
              value={formData.tipoCarga}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="CONTENEDOR">CONTENEDOR</option>
              <option value="CARGA SUELTA">CARGA SUELTA</option>
              <option value="TOLVA">TOLVA</option>
              <option value="OTROS">OTROS</option>
            </select>
          </div>

          {/* Archivo XML */}
          <div>
            <label
              htmlFor="xmlFile"
              className="block mb-1 text-text-secondary text-sm"
            >
              Archivo XML
            </label>
            <input
              id="xmlFile"
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="input w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Importando..." : "Importar Servicio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicioPage;
