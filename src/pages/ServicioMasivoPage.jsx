import { useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    formData.append('cliente', ''); // cliente vacío por defecto

    xmlFiles.forEach((file) => {
      formData.append('xmls', file); // clave: debe coincidir con upload.array('xmls')
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
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl card">
        <h1 className="text-2xl font-bold mb-6">Importación Masiva de Servicios</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-text-secondary">Archivos XML</label>
            <input
              type="file"
              accept=".xml"
              multiple
              onChange={handleFileChange}
              className="input"
              required
            />
            {xmlFiles.length > 0 && (
              <p className="text-sm text-text-secondary mt-1">
                {xmlFiles.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Importar Archivos
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicioMasivoPage;
