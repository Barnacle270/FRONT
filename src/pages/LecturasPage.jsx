import { useEffect, useState } from 'react';
import { useLectura } from '../context/LecturaContext';
import { useMaquinaria } from '../context/MaquinariaContext';
import { useAuth } from '../context/AuthContext'; // 👈 importa el contexto de autenticación
import LecturaModal from '../components/modals/LecturaModal';

const LecturasPage = () => {
  const { lecturas, cargarLecturasPorMaquinaria, eliminarLectura } = useLectura();
  const { maquinarias } = useMaquinaria();
  const { user } = useAuth(); // 👈 obtiene el usuario actual

  const [modalAbierto, setModalAbierto] = useState(false);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState('');

  useEffect(() => {
    if (maquinariaSeleccionada) {
      cargarLecturasPorMaquinaria(maquinariaSeleccionada);
    }
  }, [maquinariaSeleccionada]);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '—';
    return new Date(fechaISO).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar esta lectura?');
    if (confirmar) {
      await eliminarLectura(id);
    }
  };

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lecturas Registradas</h1>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-button-primary hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Registrar Lectura
        </button>
      </div>

      <div className="mb-4">
        <label className="font-medium">Selecciona maquinaria:</label>
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

      {lecturas.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay lecturas registradas para esta maquinaria.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-center">Valor</th>
                <th className="p-2 text-center">Unidad</th>
                <th className="p-2 text-left">Observaciones</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lecturas.map((l) => (
                <tr key={l._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                  <td className="p-2">{formatearFecha(l.fecha)}</td>
                  <td className="p-2 text-center">{l.valor}</td>
                  <td className="p-2 text-center">{l.unidad}</td>
                  <td className="p-2">{l.observaciones || '—'}</td>
                  <td className="p-2 text-center">
                    {user?.role === 'Superadministrador' && (
                      <button
                        onClick={() => handleEliminar(l._id)}
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

      <LecturaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        maquinariaIdDefault={maquinariaSeleccionada}
      />
    </div>
  );
};

export default LecturasPage;
