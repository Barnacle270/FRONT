import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <- aquí traes el user
import { useMaquinaria } from '../context/MaquinariaContext';
import MaquinariaModal from '../components/modals/MaquinariaModal';

const MaquinariasPage = () => {
  const { maquinarias, deleteMaquinaria } = useMaquinaria();
  const { user } = useAuth(); // <- acceso al usuario actual
  const [modalAbierto, setModalAbierto] = useState(false);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState(null);

  const abrirModal = (maquinaria = null) => {
    setMaquinariaSeleccionada(maquinaria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setMaquinariaSeleccionada(null);
    setModalAbierto(false);
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar esta maquinaria?');
    if (confirmar) {
      await deleteMaquinaria(id);
    }
  };

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Maquinarias</h1>
        <button
          onClick={() => abrirModal()}
          className="bg-button-primary hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Añadir Maquinaria
        </button>
      </div>

      {maquinarias.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay maquinarias registradas aún.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Modelo</th>
                <th className="p-2">Placa</th>
                <th className="p-2">Unidad</th>
                <th className="p-2">Lectura actual</th>
                <th className="p-2">Estado</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {maquinarias.map((m) => (
                <tr key={m._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                  <td className="p-2">{m.tipo}</td>
                  <td className="p-2 text-center">{m.modelo}</td>
                  <td className="p-2 text-center">{m.placa}</td>
                  <td className="p-2 text-center">{m.unidadMedida}</td>
                  <td className="p-2 text-center">{m.lecturaActual}</td>
                  <td className="p-2 text-center">{m.estado}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal(m)}
                      className="bg-highlight text-white px-3 py-1 rounded text-xs hover:brightness-110"
                      title="Editar"
                    >
                      Editar
                    </button>
                    {user?.role === 'Superadministrador' && (
                      <button
                        onClick={() => handleEliminar(m._id)}
                        className="bg-button-danger text-white px-3 py-1 rounded text-xs hover:brightness-110"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MaquinariaModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        maquinaria={maquinariaSeleccionada}
      />
    </div>
  );
};

export default MaquinariasPage;
