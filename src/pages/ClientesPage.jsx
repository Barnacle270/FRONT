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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold drop-shadow-[0_0_6px_#3B82F6]">
            Clientes
          </h1>
          <button
            onClick={() => setModalId(null)}
            className="btn btn-primary"
          >
            + Nuevo Cliente
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span className="ml-2 text-text-secondary">
              Cargando clientes...
            </span>
          </div>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No hay clientes registrados.
          </p>
        ) : (
          <>
            {/* Vista escritorio */}
            <div className="hidden md:block overflow-x-auto bg-surface rounded shadow-md">
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

            {/* Vista móvil */}
            <div className="block md:hidden space-y-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente._id}
                  className="bg-surface p-4 rounded shadow-md"
                >
                  <p>
                    <strong>Razón Social:</strong> {cliente.razonSocial}
                  </p>
                  <p>
                    <strong>RUC:</strong> {cliente.ruc}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setModalId(cliente._id)}
                      className="w-8 h-8 bg-highlight text-white rounded hover:brightness-110 flex items-center justify-center"
                      title="Editar cliente"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
