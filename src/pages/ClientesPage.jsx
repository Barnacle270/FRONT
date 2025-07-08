import { useEffect } from 'react';
import { useClientes } from '../context/ClienteContext';
import { Link } from 'react-router-dom';

function ClientesPage() {
  const { clientes, cargarClientes, loading } = useClientes();

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Lista de Clientes</h2>
        <Link
          to="/clientes/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {loading ? (
        <p className="text-white">Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className="text-white">No hay clientes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-surface text-white rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-2 px-4">Razón Social</th>
                <th className="py-2 px-4">RUC</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente._id} className="border-t border-gray-600">
                  <td className="py-2 px-4">{cliente.razonSocial}</td>
                  <td className="py-2 px-4">{cliente.ruc}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/clientes/editar/${cliente._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientesPage;
