import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useBoleta } from '../context/BoletasContext';

function BoletasFormPage() {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Detectar si el usuario no es Superadmin
  if (user.role !== 'Superadministrador') {
    navigate('/boletas');
    return null;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveFile = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
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
        const parts = image.name.split('-');
        if (parts.length !== 3) {
          throw new Error(`El archivo ${image.name} no tiene el formato válido (dni-mes-año.ext).`);
        }

        const [dni, mes, yearWithExt] = parts;
        const year = yearWithExt.split('.')[0];

        const formData = new FormData();
        formData.append('dni', dni);
        formData.append('mes', mes);
        formData.append('year', year);
        formData.append('image', image);

        await axios.post('/api/boletas', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const globalProgress = Math.round(((imagesUploaded + percent / 100) / totalImages) * 100);
            setProgress(globalProgress);
          },
        });

        imagesUploaded += 1;
      }

      setMessage('✅ Archivos subidos correctamente.');
      setTimeout(() => {
        navigate('/boletas');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error al subir archivos. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md shadow-md">
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <label htmlFor="image" className="text-white block mb-2">
            Archivos (Subida Masiva)
          </label>
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
              <div
                key={index}
                className="relative border p-2 rounded shadow-md bg-zinc-700"
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs text-center text-white mt-1 break-words">
                  {selectedImages[index]?.name}
                </p>
                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Resumen de archivos */}
          {selectedImages.length > 0 && (
            <div className="bg-zinc-700 rounded-md p-3 mt-4 text-white">
              <h3 className="font-semibold mb-2">Resumen de boletas</h3>
              <ul className="space-y-1 max-h-32 overflow-y-auto text-sm">
                {selectedImages.map((file, i) => {
                  const parts = file.name.split('-');
                  const valido = parts.length === 3 && parts[2].includes('.');
                  const [dni, mes, yearWithExt] = valido ? parts : ['?', '?', '?'];
                  const year = valido ? yearWithExt.split('.')[0] : '?';

                  return (
                    <li
                      key={i}
                      className={`flex justify-between items-center border-b border-zinc-600 pb-1 ${
                        valido ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      <span>{file.name}</span>
                      {valido ? (
                        <span className="ml-2">📄 DNI: {dni} | {mes} {year}</span>
                      ) : (
                        <span className="ml-2">⚠️ Formato inválido</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-gray-300">
                Total: {selectedImages.length} archivos
              </p>
            </div>
          )}

          {/* Barra de progreso */}
          {progress > 0 && (
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4 mt-4">
              <div
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-center text-sm text-white mt-1">{progress}%</p>
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
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Subiendo...
              </>
            ) : (
              'Subir'
            )}
          </button>

          {/* Mensaje */}
          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.startsWith('✅') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default BoletasFormPage;
