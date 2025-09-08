import { useEffect, useState } from 'react';
import { useLectura } from '../../context/LecturaContext';
import { useMaquinaria } from '../../context/MaquinariaContext';
import { HiXCircle } from 'react-icons/hi2';

const LecturaModal = ({ isOpen, onClose, maquinariaIdDefault = '' }) => {
  const { registrarLectura } = useLectura();
  const { maquinarias } = useMaquinaria();

  const [formData, setFormData] = useState({
    maquinaria: maquinariaIdDefault || '',
    valor: '',
    unidad: '',
    fecha: '',
    observaciones: ''
  });

  useEffect(() => {
    const maquina = maquinarias.find((m) => m._id === formData.maquinaria);
    if (maquina) {
      setFormData((prev) => ({
        ...prev,
        unidad: maquina.unidadMedida
      }));
    }
  }, [formData.maquinaria, maquinarias]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarLectura(formData);
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar lectura');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-surface text-text-primary rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600"
          title="Cerrar"
        >
          <HiXCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Registrar Lectura</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Maquinaria</label>
            <select
              name="maquinaria"
              value={formData.maquinaria}
              onChange={handleChange}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            >
              <option value="">-- Selecciona maquinaria --</option>
              {maquinarias.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.tipo} - {m.placa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Valor</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Unidad</label>
            <input
              type="text"
              name="unidad"
              value={formData.unidad}
              readOnly
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2 text-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-button-secondary text-black px-4 py-2 rounded hover:bg-neutral-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-button-primary text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturaModal;
