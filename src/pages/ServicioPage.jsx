import { useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useClientes } from '../context/ClienteContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ServicioPage = () => {
  const { importarXML } = useServicios();
  const { clientes } = useClientes();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipoCarga: '',
    cliente: ''
  });
  const [xmlFile, setXmlFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setXmlFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!xmlFile || !formData.tipoCarga || !formData.cliente) {
      toast.error('Todos los campos son obligatorios.');
      return;
    }

    const data = new FormData();
    data.append('xml', xmlFile);
    data.append('tipoCarga', formData.tipoCarga);
    data.append('cliente', formData.cliente);

    try {
      await importarXML(data);
      toast.success('Servicio importado correctamente');
      navigate('/historial');
    } catch (error) {
      toast.error('Error al importar el servicio');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl card">
        <h1 className="text-2xl font-bold mb-6">Importar Servicio desde XML</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de cliente */}
          <div>
            <label className="block mb-1 text-text-secondary">Cliente</label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="input"
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

          {/* Selector de tipo de carga */}
          <div>
            <label className="block mb-1 text-text-secondary">Tipo de Carga</label>
            <select
              name="tipoCarga"
              value={formData.tipoCarga}
              onChange={handleChange}
              className="input"
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
            <label className="block mb-1 text-text-secondary">Archivo XML</label>
            <input
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Importar Servicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicioPage;
