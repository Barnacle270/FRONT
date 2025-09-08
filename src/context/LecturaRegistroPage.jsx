import { useState } from 'react';
import MaquinariaSelect from '../components/MaquinariaSelect';
import EstadoMantenimientoAlert from '../components/EstadoMantenimientoAlert';
import { useMaquinaria } from '../hooks/useMaquinaria';

const LecturaRegistroPage = () => {
  const { registrarLectura } = useMaquinaria();
  const [form, setForm] = useState({
    maquinaria: '',
    fecha: new Date().toISOString().slice(0, 10),
    lectura: '',
    operador: '',
    observaciones: ''
  });
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registrarLectura(form);
      setResultado(data);
      setMensaje(data.mensaje);
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || 'Error al registrar');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface p-6 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-semibold text-text-primary mb-6">
        Registrar Lectura Diaria
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-text-secondary mb-1">Maquinaria</label>
          <MaquinariaSelect
            value={form.maquinaria}
            onChange={(e) => setForm({ ...form, maquinaria: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-text-secondary mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <div>
          <label className="block text-text-secondary mb-1">Lectura actual</label>
          <input
            type="number"
            name="lectura"
            onChange={handleChange}
            className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <div>
          <label className="block text-text-secondary mb-1">Operador</label>
          <input
            type="text"
            name="operador"
            onChange={handleChange}
            className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <div>
          <label className="block text-text-secondary mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            onChange={handleChange}
            rows={3}
            className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-button-primary hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
        >
          Guardar Lectura
        </button>
      </form>

      {resultado && (
        <EstadoMantenimientoAlert
          estado={resultado.estadoMantenimiento}
          porcentaje={resultado.porcentaje}
        />
      )}

      {mensaje && (
        <p className="mt-4 text-sm text-text-secondary bg-background p-2 rounded">
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default LecturaRegistroPage;
