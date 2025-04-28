import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useBoleta } from '../context/BoletasContext';

function BoletasFormPage() {
  const { register, handleSubmit } = useForm();
  const { createBoletas } = useBoleta();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const onSubmit = handleSubmit(async () => {
    if (selectedImages.length === 0) {
      setMessage('Debes seleccionar al menos un archivo.');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setMessage('');

    try {
      let totalImages = selectedImages.length;
      let imagesUploaded = 0;

      for (const image of selectedImages) {
        const [dni, mes, yearWithExt] = image.name.split('-');
        const year = yearWithExt.split('.')[0];

        const formData = new FormData();
        formData.append('dni', dni);
        formData.append('mes', mes);
        formData.append('year', year);
        formData.append('image', image);

        await axios.post('/api/boletas', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const globalProgress = Math.round(((imagesUploaded + percent / 100) / totalImages) * 100);
            setProgress(globalProgress);
          }
        });

        imagesUploaded += 1;
      }

      setMessage('✅ Archivos subidos correctamente.');
      setTimeout(() => {
        navigate('/boletas');
      }, 1500); // Esperar un poco para mostrar mensaje
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error al subir archivos. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  });

  if (user.role !== 'admin') {
    navigate('/boletas');
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md shadow-md">
        <form onSubmit={onSubmit} encType="multipart/form-data">
          
          <label htmlFor="image" className="text-white block mb-2">Archivos (Subida Masiva)</label>
          <input
            type="file"
            name="image"
            multiple
            onChange={handleImageChange}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            disabled={isUploading}
          />

          {/* Previews */}
          <div className="overflow-y-auto max-h-64 grid grid-cols-2 gap-4 my-4">
            {previewImages.map((src, index) => (
              <div key={index} className="border p-2 rounded shadow-md bg-zinc-700">
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs text-center text-white mt-1 break-words">
                  {selectedImages[index]?.name}
                </p>
              </div>
            ))}
          </div>

          {/* Barra de progreso */}
          {progress > 0 && (
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
              <div
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-center text-sm text-white">{progress}%</p>
            </div>
          )}

          {/* Spinner y botón */}
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors px-3 py-2 rounded-md w-full mt-2 flex items-center justify-center gap-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              'Subir'
            )}
          </button>

          {/* Mensaje */}
          {message && (
            <p className={`mt-4 text-center font-semibold ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}

export default BoletasFormPage;
