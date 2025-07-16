import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RecepcionFacturasPage = () => {
  const {
    noFacturados,
    cargarServiciosSinFacturar,
    recepcionarLote
  } = useServicios();

  const { user } = useAuth();
  const [seleccionados, setSeleccionados] = useState([]);
  const [fechaRecepcion, setFechaRecepcion] = useState('');

  const esAdmin = ["superadministrador", "administrador"].includes(user?.role);

  useEffect(() => {
    cargarServiciosSinFacturar();
  }, []);

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const marcarRecepcion = async () => {
    if (seleccionados.length === 0 || !fechaRecepcion) {
      toast.error('Selecciona al menos un servicio y una fecha');
      return;
    }

    try {
      await recepcionarLote(seleccionados, fechaRecepcion);
      toast.success('Servicios recepcionados correctamente');
      setSeleccionados([]);
      setFechaRecepcion('');
      cargarServiciosSinFacturar();
    } catch (error) {
      console.error('Error al recepcionar servicios:', error);
      toast.error('Hubo un error al recepcionar');
    }
  };

  const noFacturadosOrdenados = [...noFacturados].sort((a, b) => {
    const guiaA = a.numeroGuia?.toUpperCase() || '';
    const guiaB = b.numeroGuia?.toUpperCase() || '';
    return guiaA.localeCompare(guiaB, 'es', { numeric: true });
  });

  return (
    <div className="p-6 text-text-primary bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Recepción de Guías</h1>

      {/* Solo visible para Admin y Superadmin */}
      {esAdmin && (
        <>
          <div className="mb-6">
            <label className="block mb-1 text-text-secondary text-sm">Fecha de Recepción</label>
            <input
              type="date"
              className="input"
              value={fechaRecepcion}
              onChange={(e) => setFechaRecepcion(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <button
              className="btn btn-primary"
              onClick={marcarRecepcion}
            >
              Recepcionar Guías Seleccionadas
            </button>
          </div>
        </>
      )}

      {noFacturadosOrdenados.length === 0 ? (
        <p className="text-text-secondary">No hay servicios pendientes por recepcionar.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-700 shadow-sm">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="table-head">
              <tr>
                {esAdmin && (
                  <th className="p-3 border-b border-gray-700">Seleccionar</th>
                )}
                <th className="p-3 border-b border-gray-700">Guía</th>
                <th className="p-3 border-b border-gray-700">Cliente</th>
                <th className="p-3 border-b border-gray-700">Fecha Traslado</th>
                <th className="p-3 border-b border-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {noFacturadosOrdenados.map((servicio) => (
                <tr
                  key={servicio._id}
                  className="hover:bg-surface transition duration-150"
                >
                  {esAdmin && (
                    <td className="p-3 border-b border-gray-700">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(servicio._id)}
                        onChange={() => toggleSeleccion(servicio._id)}
                        className="scale-110 accent-white"
                      />
                    </td>
                  )}
                  <td className="p-3 border-b border-gray-700">{servicio.numeroGuia}</td>
                  <td className="p-3 border-b border-gray-700">{servicio.cliente}</td>
                  <td className="p-3 border-b border-gray-700">{servicio.fechaTraslado?.slice(0, 10)}</td>
                  <td className="p-3 border-b border-gray-700">{servicio.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecepcionFacturasPage;
