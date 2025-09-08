import { useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ServicioMasivoPage = () => {
  const { importarXMLMasivo } = useServicios();
  const navigate = useNavigate();
  const [xmlFiles, setXmlFiles] = useState([]);

  const handleFileChange = (e) => {
    setXmlFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (xmlFiles.length === 0) {
      toast.error('Debes seleccionar al menos un archivo XML.');
      return;
    }

    const formData = new FormData();
    formData.append('cliente', '');

    xmlFiles.forEach((file) => {
      formData.append('xmls', file);
    });

    try {
      await importarXMLMasivo(formData);
      toast.success('Importación masiva completada.');
      navigate('/historial');
    } catch (error) {
      toast.error('Error al importar los archivos.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Importación Masiva</h1>
      </div>

      <div className="bg-surface rounded shadow-md p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Selecciona archivos XML
            </label>
            <input
              type="file"
              accept=".xml"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm bg-background border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {xmlFiles.length > 0 && (
              <p className="text-sm text-neutral-400 mt-1">
                {xmlFiles.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-button-primary hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Importar Archivos
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicioMasivoPage;
