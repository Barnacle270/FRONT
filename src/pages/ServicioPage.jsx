import { useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ServicioPage = () => {
  const { importarXML } = useServicios();
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
      navigate('/historial'); // ✅ Redirección al historial
    } catch (error) {
      toast.error('Error al importar el servicio');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl p-6 bg-surface rounded shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Importar Servicio desde XML</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-text-secondary">Cliente</label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full bg-input border border-gray-600 text-text-primary px-3 py-2 rounded outline-none focus:ring-2 focus:ring-focus"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-text-secondary">Tipo de Carga</label>
            <select
              name="tipoCarga"
              value={formData.tipoCarga}
              onChange={handleChange}
              className="w-full bg-input border border-gray-600 text-text-primary px-3 py-2 rounded outline-none focus:ring-2 focus:ring-focus"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="CONTENEDOR">CONTENEDOR</option>
              <option value="CARGA SUELTA">CARGA SUELTA</option>
              <option value="TOLVA">TOLVA</option>
              <option value="OTROS">OTROS</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-text-secondary">Archivo XML</label>
            <input
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="w-full text-text-primary bg-input border border-gray-600 px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-button-primary text-white font-semibold py-2 rounded hover:bg-highlight transition"
          >
            Importar Servicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicioPage;
