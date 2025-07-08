import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientes } from '../context/ClienteContext';

function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agregarCliente, editarCliente, obtenerCliente } = useClientes();

  const [cliente, setCliente] = useState({
    razonSocial: '',
    ruc: ''
  });

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await editarCliente(id, cliente);
    } else {
      await agregarCliente(cliente);
    }

    navigate('/clientes');
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (id) {
        const clienteExistente = await obtenerCliente(id);
        if (clienteExistente) {
          setCliente({
            razonSocial: clienteExistente.razonSocial || '',
            ruc: clienteExistente.ruc || ''
          });
        }
      }
    };
    cargarDatos();
  }, [id, obtenerCliente]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl card">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Editar Cliente' : 'Registrar Cliente'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-text-secondary">Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              value={cliente.razonSocial}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-text-secondary">RUC</label>
            <input
              type="text"
              name="ruc"
              value={cliente.ruc}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {id ? 'Actualizar Cliente' : 'Registrar Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClienteForm;
