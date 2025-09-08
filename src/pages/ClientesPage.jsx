import { useEffect, useState } from "react";
import { useClientes } from "../context/ClienteContext";
import { HiPencil } from "react-icons/hi2";
import ClienteModal from "../components/modals/ClienteModal";

function ClientesPage() {
  const { clientes, cargarClientes, loading } = useClientes();
  const [modalId, setModalId] = useState(undefined); // null para nuevo, ID para editar

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="p-6 text-text-primary">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <button
            onClick={() => setModalId(null)}
            className="bg-button-primary hover:brightness-110 text-white px-4 py-2 rounded"
          >
            + Nuevo Cliente
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-text-secondary">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-text-secondary">No hay clientes registrados.</p>
        ) : (
          <div className="overflow-x-auto bg-surface rounded shadow-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-navbar text-text-secondary">
                <tr>
                  <th className="p-2 text-left">Razón Social</th>
                  <th className="p-2 text-left">RUC</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente._id}
                    className="border-t border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <td className="p-2">{cliente.razonSocial}</td>
                    <td className="p-2">{cliente.ruc}</td>
                    <td className="p-2 flex justify-center">
                      <button
                        onClick={() => setModalId(cliente._id)}
                        className="w-8 h-8 bg-highlight text-white rounded hover:brightness-110 flex items-center justify-center"
                        title="Editar cliente"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalId !== undefined && (
        <ClienteModal
          id={modalId}
          onClose={() => {
            setModalId(undefined);
            cargarClientes();
          }}
        />
      )}
    </div>
  );
}

export default ClientesPage;
