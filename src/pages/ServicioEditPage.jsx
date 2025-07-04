import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServicios } from '../context/ServicioContext';
import toast from 'react-hot-toast';

const ServicioEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerPorId, actualizarServicio, borrarServicio } = useServicios();

  const [form, setForm] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      const servicio = await obtenerPorId(id);
      if (servicio) {
        setForm({
          ...servicio,
          fechaTraslado: servicio.fechaTraslado?.slice(0, 10) || '',
          vencimientoMemo: servicio.vencimientoMemo?.slice(0, 10) || '',
          fechaDevolucion: servicio.fechaDevolucion?.slice(0, 10) || ''
        });
      }
    };
    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarServicio(id, form);
      toast.success('Cambios guardados exitosamente');
      navigate('/historial');
    } catch (error) {
      toast.error('Error al guardar cambios');
    }
  };

  const inputClass = 'w-full bg-input border border-gray-600 px-3 py-2 rounded text-text-primary';
  const readOnlyInput = (label, name) => (
    <div>
      <label className="block mb-1 text-text-secondary">{label}</label>
      <input
        type="text"
        value={form[name] || ''}
        readOnly
        className={inputClass + ' opacity-70 cursor-not-allowed'}
      />
    </div>
  );

  const editableInput = (label, name, type = 'text') => (
    <div>
      <label className="block mb-1 text-text-secondary">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] || ''}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded bg-surface text-text-primary shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Editar Servicio</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 📦 Información del traslado */}
        <section>
          <h2 className="text-lg font-semibold mb-2">📦 Información del traslado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readOnlyInput('Guía de transporte', 'numeroGuia')}
            {readOnlyInput('Fecha de traslado', 'fechaTraslado')}
            {readOnlyInput('Documento relacionado', 'documentoRelacionado')}
            {editableInput('Tipo de carga', 'tipoCarga')}
            {readOnlyInput('Estado', 'estado')}
            {editableInput('Número de contenedor', 'numeroContenedor')}
          </div>
        </section>

        {/* 🧾 Cliente y participantes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">🧾 Cliente y participantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editableInput('Cliente (manual)', 'cliente')}
            <div>
              <label className="block mb-1 text-text-secondary">Remitente</label>
              <input
                type="text"
                value={form.remitente?.razonSocial || ''}
                readOnly
                className={inputClass + ' opacity-70 cursor-not-allowed'}
              />
            </div>
            <div>
              <label className="block mb-1 text-text-secondary">Destinatario</label>
              <input
                type="text"
                value={form.destinatario?.razonSocial || ''}
                readOnly
                className={inputClass + ' opacity-70 cursor-not-allowed'}
              />
            </div>
          </div>
        </section>

        {/* 🗺️ Direcciones */}
        <section>
          <h2 className="text-lg font-semibold mb-2">🗺️ Direcciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readOnlyInput('Dirección partida', 'direccionPartida')}
            {readOnlyInput('Dirección llegada', 'direccionLlegada')}
          </div>
        </section>

        {/* 🚛 Vehículo principal */}
        <section>
          <h2 className="text-lg font-semibold mb-2">🚛 Vehículo principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readOnlyInput('Placa principal', 'placaVehiculoPrincipal')}
            {readOnlyInput('Conductor principal', 'nombreConductor')}
          </div>
        </section>

        {/* 🔁 Devolución */}
        <section>
          <h2 className="text-lg font-semibold mb-2">🔁 Información de devolución</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editableInput('Terminal devolución', 'terminalDevolucion')}
            {editableInput('Vencimiento memo', 'vencimientoMemo', 'date')}
            {editableInput('Fecha de devolución', 'fechaDevolucion', 'date')}
            {editableInput('Placa que devuelve', 'placaDevolucion')}
            {editableInput('Conductor que devuelve', 'conductorDevolucion')}
          </div>
        </section>

        <button
          type="submit"
          className="w-full mt-8 bg-button-primary text-white font-semibold py-2 rounded hover:bg-highlight"
        >
          Guardar Cambios
        </button>

        <button
          type="button"
          onClick={async () => {
            const confirmar = confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.');
            if (!confirmar) return;
            try {
              await borrarServicio(id);
              toast.success('Servicio eliminado correctamente');
              navigate('/historial');
            } catch (error) {
              toast.error('Error al eliminar el servicio');
            }
          }}
          className="w-full bg-button-danger text-white font-semibold py-2 rounded hover:bg-red-700 mt-4"
        >
          Eliminar Servicio
        </button>
      </form>
    </div>
  );
};

export default ServicioEditPage;
