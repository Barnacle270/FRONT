import { useState, useEffect } from 'react';
import { useMaquinaria } from '../../context/MaquinariaContext';
import { useMantenimiento } from '../../context/MantenimientoContext';
import { HiXCircle } from 'react-icons/hi2';

const MantenimientoModal = ({ isOpen, onClose, maquinariaIdDefault = '' }) => {
  const { maquinarias } = useMaquinaria();
  const { registrarMantenimiento } = useMantenimiento();

  const [formData, setFormData] = useState({
    maquinaria: maquinariaIdDefault || '',
    tipoMantenimiento: '',
    unidad: '',
    lectura: '',
    fecha: '',
    observaciones: '',
    realizadoPor: ''
  });

  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const maquina = maquinarias.find((m) => m._id === formData.maquinaria);
    setTipos(maquina?.mantenimientos || []);
  }, [formData.maquinaria, maquinarias]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTipo = (e) => {
    const tipo = e.target.value;
    const encontrado = tipos.find((m) => m.nombre === tipo);
    setFormData((prev) => ({
      ...prev,
      tipoMantenimiento: tipo,
      unidad: encontrado?.unidad || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarMantenimiento(formData);
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar mantenimiento');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface text-text-primary rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600"
          title="Cerrar"
        >
          <HiXCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Registrar Mantenimiento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Maquinaria</label>
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
            <label className="text-sm text-text-secondary block mb-1">Tipo de mantenimiento</label>
            <select
              name="tipoMantenimiento"
              value={formData.tipoMantenimiento}
              onChange={handleTipo}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            >
              <option value="">-- Selecciona tipo --</option>
              {tipos.map((m, i) => (
                <option key={i} value={m.nombre}>
                  {m.nombre} ({m.unidad})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">Lectura</label>
            <input
              type="number"
              name="lectura"
              value={formData.lectura}
              onChange={handleChange}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">Unidad</label>
            <input
              type="text"
              value={formData.unidad}
              readOnly
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2 text-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">Fecha</label>
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
            <label className="text-sm text-text-secondary block mb-1">Realizado por</label>
            <input
              type="text"
              name="realizadoPor"
              value={formData.realizadoPor}
              onChange={handleChange}
              required
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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

export default MantenimientoModal;
