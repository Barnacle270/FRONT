import { useEffect, useState } from 'react';
import { useMantenimiento } from '../context/MantenimientoContext';
import { useMaquinaria } from '../context/MaquinariaContext';
import MantenimientoModal from '../components/modals/MantenimientoModal';

const MantenimientosPage = () => {
  const { mantenimientos, cargarMantenimientosPorMaquinaria } = useMantenimiento();
  const { maquinarias } = useMaquinaria();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState('');

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  useEffect(() => {
    if (maquinariaSeleccionada) {
      cargarMantenimientosPorMaquinaria(maquinariaSeleccionada);
    }
  }, [maquinariaSeleccionada]);

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mantenimientos Realizados</h1>
        <button
          onClick={abrirModal}
          className="bg-button-primary hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Registrar Mantenimiento
        </button>
      </div>

      <div className="mb-4">
        <label className="font-medium">Filtrar por maquinaria:</label>
        <select
          className="ml-2 border border-neutral-700 bg-surface text-sm rounded px-2 py-1"
          value={maquinariaSeleccionada}
          onChange={(e) => setMaquinariaSeleccionada(e.target.value)}
        >
          <option value="">-- Selecciona una maquinaria --</option>
          {maquinarias.map((m) => (
            <option key={m._id} value={m._id}>
              {m.tipo} - {m.placa}
            </option>
          ))}
        </select>
      </div>

      {mantenimientos.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay mantenimientos registrados.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-center">Lectura</th>
                <th className="p-2 text-center">Unidad</th>
                <th className="p-2 text-center">Realizado por</th>
                <th className="p-2 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((m) => (
                <tr
                  key={m._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="p-2">{new Date(m.fecha).toLocaleDateString()}</td>
                  <td className="p-2">{m.tipoMantenimiento}</td>
                  <td className="p-2 text-center">{m.lectura}</td>
                  <td className="p-2 text-center">{m.unidad}</td>
                  <td className="p-2 text-center">{m.realizadoPor}</td>
                  <td className="p-2">{m.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MantenimientoModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        maquinariaIdDefault={maquinariaSeleccionada}
      />
    </div>
  );
};

export default MantenimientosPage;
