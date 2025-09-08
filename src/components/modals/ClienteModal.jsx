import { useEffect, useState } from 'react';
import { useClientes } from '../../context/ClienteContext';
import { HiXCircle } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

function ClienteModal({ id, onClose }) {
  const { agregarCliente, editarCliente, obtenerCliente } = useClientes();
  const [cliente, setCliente] = useState({ razonSocial: '', ruc: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await editarCliente(id, cliente);
        toast.success('Cliente actualizado correctamente');
      } else {
        await agregarCliente(cliente);
        toast.success('Cliente registrado correctamente');
      }
      onClose();
    } catch (error) {
      toast.error('Error al guardar el cliente');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (id) {
        const clienteExistente = await obtenerCliente(id);
        if (clienteExistente) {
          setCliente({
            razonSocial: clienteExistente.razonSocial || '',
            ruc: clienteExistente.ruc || '',
          });
        }
      }
    };
    cargarDatos();
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
          {id ? 'Editar Cliente' : 'Registrar Cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-text-secondary">Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              value={cliente.razonSocial}
              onChange={handleChange}
              className="w-full bg-input p-2 rounded border border-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-text-secondary">RUC</label>
            <input
              type="text"
              name="ruc"
              value={cliente.ruc}
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
              disabled={loading}
            >
              {loading
                ? 'Guardando...'
                : id
                ? 'Actualizar Cliente'
                : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteModal;
