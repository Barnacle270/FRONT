import { useState, useEffect } from 'react';
import { useConductores } from '../context/ConductorContext';
import ConductorModal from '../components/modals/ConductorModal';
import { HiPencil } from 'react-icons/hi2';

function ConductoresPage() {
  const { conductores, cargarConductores } = useConductores();
  const [modalId, setModalId] = useState(undefined); // null = nuevo, string = editar

  useEffect(() => {
    cargarConductores();
  }, []);

  return (
    <div className="p-6 text-text-primary">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Conductores</h1>
          <button
            onClick={() => setModalId(null)}
            className="bg-button-primary hover:brightness-110 text-white px-4 py-2 rounded"
          >
            + Nuevo Conductor
          </button>
        </div>

        {conductores.length === 0 ? (
          <p className="text-sm text-text-secondary">No hay conductores registrados.</p>
        ) : (
          <div className="overflow-x-auto bg-surface rounded shadow-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-navbar text-text-secondary">
                <tr>
                  <th className="p-2 text-left">Nombres</th>
                  <th className="p-2 text-left">Licencia</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductores.map((conductor) => (
                  <tr
                    key={conductor._id}
                    className="border-t border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <td className="p-2">{conductor.nombres}</td>
                    <td className="p-2">{conductor.licencia}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => setModalId(conductor._id)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-highlight hover:brightness-110 text-white rounded transition"
                        title="Editar conductor"
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

      {/* Modal de conductor */}
      {modalId !== undefined && (
        <ConductorModal
          id={modalId}
          onClose={() => {
            setModalId(undefined);
            cargarConductores();
          }}
        />
      )}
    </div>
  );
}

export default ConductoresPage;
