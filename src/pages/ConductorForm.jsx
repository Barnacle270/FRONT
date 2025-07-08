import { useState } from 'react';
import { useConductores } from '../context/ConductorContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ConductorForm() {
  const { agregarConductor } = useConductores();
  const [form, setForm] = useState({ nombres: '', licencia: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombres || !form.licencia) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    try {
      await agregarConductor(form);
      toast.success('Conductor registrado exitosamente');
      navigate('/conductores');
    } catch (error) {
      toast.error('Error al crear conductor');
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 card">
      <h1 className="text-2xl font-bold mb-6">Registrar Conductor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombres completos</label>
          <input
            type="text"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block mb-1">Licencia de conducir</label>
          <input
            type="text"
            name="licencia"
            value={form.licencia}
            onChange={handleChange}
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Registrar
        </button>
      </form>
    </div>
  );
}

export default ConductorForm;
