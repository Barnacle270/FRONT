import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useClientes } from '../context/ClienteContext';
import { useConductores } from '../context/ConductorContext';
import toast from 'react-hot-toast';
import { HiXCircle } from 'react-icons/hi2';

const ServicioEditModal = ({ id, onClose }) => {
  const { obtenerPorId, actualizarServicio } = useServicios();
  const { clientes, cargarClientes } = useClientes();
  const { conductores, cargarConductores } = useConductores();

  const [form, setForm] = useState({});
  const [editarCliente, setEditarCliente] = useState(false);
  const [editarConductor, setEditarConductor] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarClientes();
      await cargarConductores();
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
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const readOnlyInput = (label, name) => (
    <div>
      <label className="block mb-1 text-text-secondary">{label}</label>
      <input
        type="text"
        value={form[name] || ''}
        readOnly
        className="w-full bg-input border border-neutral-700 rounded px-3 py-2 opacity-70 cursor-not-allowed"
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
        className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
      />
    </div>
  );

  if (!id) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface text-text-primary p-6 rounded-2xl w-full max-w-5xl shadow-xl relative animate-fade-in max-h-[90vh] overflow-y-auto">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-red-400 hover:text-red-600"
        >
          <HiXCircle className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold mb-6">Editar Servicio</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Información del traslado */}
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

          {/* Cliente y participantes */}
          <section>
            <h2 className="text-lg font-semibold mb-2">🧾 Cliente y participantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-text-secondary">Cliente</label>
                {editarCliente ? (
                  <select
                    name="cliente"
                    value={form.cliente || ''}
                    onChange={handleChange}
                    className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((c) => (
                      <option key={c._id} value={c.razonSocial}>
                        {c.razonSocial} - {c.ruc}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      value={form.cliente || ''}
                      readOnly
                      className="w-full bg-input border border-neutral-700 rounded px-3 py-2 opacity-70 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setEditarCliente(true)}
                      className="mt-2 text-sm text-blue-400 hover:underline"
                    >
                      Cambiar cliente
                    </button>
                  </>
                )}
              </div>

              {readOnlyInput('Remitente', 'remitente.razonSocial')}
              {readOnlyInput('Destinatario', 'destinatario.razonSocial')}
              {editableInput('Observaciones', 'observaciones')}
            </div>
          </section>

          {/* Devolución */}
          <section>
            <h2 className="text-lg font-semibold mb-2">🔁 Información de devolución</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableInput('Terminal devolución', 'terminalDevolucion')}
              {editableInput('Vencimiento memo', 'vencimientoMemo', 'date')}
              {editableInput('Fecha de devolución', 'fechaDevolucion', 'date')}
              {editableInput('Hora de cita', 'horaCita', 'time')}
              {editableInput('Placa que devuelve', 'placaDevolucion')}

              <div>
                <label className="block mb-1 text-text-secondary">Conductor que devuelve</label>
                {editarConductor ? (
                  <select
                    name="conductorDevolucion"
                    value={form.conductorDevolucion || ''}
                    onChange={handleChange}
                    className="w-full bg-input border border-neutral-700 rounded px-3 py-2"
                  >
                    <option value="">Selecciona un conductor</option>
                    {conductores.map((c) => (
                      <option key={c._id} value={c.nombres}>
                        {c.nombres}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      value={form.conductorDevolucion || ''}
                      readOnly
                      className="w-full bg-input border border-neutral-700 rounded px-3 py-2 opacity-70 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setEditarConductor(true)}
                      className="mt-2 text-sm text-blue-400 hover:underline"
                    >
                      Cambiar conductor
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-button-primary text-white px-6 py-2 rounded hover:bg-blue-600">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioEditModal;
