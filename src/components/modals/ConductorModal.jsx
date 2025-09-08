import { useState, useEffect } from 'react';
import { useConductores } from '../../context/ConductorContext';
import { toast } from 'react-hot-toast';
import { HiXCircle } from 'react-icons/hi2';

function ConductorModal({ id = null, onClose }) {
  const { agregarConductor, editarConductor, obtenerConductor } = useConductores();
  const [form, setForm] = useState({ nombres: '', licencia: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombres || !form.licencia) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    try {
      if (id) {
        await editarConductor(id, form);
        toast.success('Conductor actualizado');
      } else {
        await agregarConductor(form);
        toast.success('Conductor registrado');
      }
      onClose();
    } catch (error) {
      toast.error('Error al guardar conductor');
      console.error(error);
    }
  };

  useEffect(() => {
    const cargar = async () => {
      if (id) {
        const existente = await obtenerConductor(id);
        if (existente) {
          setForm({
            nombres: existente.nombres || '',
            licencia: existente.licencia || ''
          });
        }
      }
    };
    cargar();
  }, [id]);

  if (!onClose) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-surface text-text-primary rounded-lg p-6 w-full max-w-lg animate-fade-in shadow-lg overflow-y-auto max-h-[95vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600"
          title="Cerrar"
        >
          <HiXCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {id ? 'Editar Conductor' : 'Registrar Conductor'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-text-secondary">
              Nombres completos
            </label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className="w-full bg-input p-2 rounded border border-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-text-secondary">
              Licencia de conducir
            </label>
            <input
              type="text"
              name="licencia"
              value={form.licencia}
              onChange={handleChange}
              className="w-full bg-input p-2 rounded border border-neutral-700"
              required
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
              {id ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConductorModal;
