import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiCheckCircle } from 'react-icons/hi';

const RecepcionFacturasPage = () => {
  const { noFacturados, cargarServiciosSinFacturar, recepcionarLote } = useServicios();
  const { user } = useAuth();

  const [seleccionados, setSeleccionados] = useState([]);
  const [fechaRecepcion, setFechaRecepcion] = useState('');

  const esAdmin = ["Superadministrador", "Administrador"].includes(user?.role);

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

  // 🔹 Normaliza estado (ej: "ANULADA" -> "estado-anulada")
  const getEstadoClass = (estado) => `estado-${estado?.toLowerCase()}`;

  return (
    <div className="p-6 text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Recepción de Guías</h1>

        {esAdmin && (
          <div className="flex items-end gap-2">
            <div className="flex flex-col">
              <label className="text-sm text-text-secondary mb-1">Fecha de Recepción</label>
              <input
                type="date"
                className="bg-background border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fechaRecepcion}
                onChange={(e) => setFechaRecepcion(e.target.value)}
              />
            </div>

            <button
              className={`btn ${seleccionados.length > 0 && fechaRecepcion ? 'btn-success' : 'bg-neutral-600 text-neutral-300 cursor-not-allowed'}`}
              onClick={marcarRecepcion}
              disabled={seleccionados.length === 0 || !fechaRecepcion}
              title="Recepcionar guías seleccionadas"
            >
              <HiCheckCircle className="w-4 h-4" />
              Recepcionar
            </button>
          </div>
        )}
      </div>

      {noFacturadosOrdenados.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios pendientes por recepcionar.</p>
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="hidden md:block overflow-x-auto bg-surface rounded shadow-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-navbar text-text-secondary">
                <tr>
                  {esAdmin && <th className="p-2 text-center">Seleccionar</th>}
                  <th className="p-2 text-center">Guía</th>
                  <th className="p-2 text-center">Cliente</th>
                  <th className="p-2 text-center">N° Contenedor</th>
                  <th className="p-2 text-center">Fecha Traslado</th>
                  <th className="p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {noFacturadosOrdenados.map((servicio) => (
                  <tr key={servicio._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                    {esAdmin && (
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(servicio._id)}
                          onChange={() => toggleSeleccion(servicio._id)}
                          className="accent-white w-4 h-4"
                        />
                      </td>
                    )}
                    <td className="p-2 text-center">{servicio.numeroGuia}</td>
                    <td className="p-2 text-center">{servicio.cliente}</td>
                    <td className="p-2 text-center">{servicio.numeroContenedor}</td>
                    <td className="p-2 text-center">{servicio.fechaTraslado?.slice(0, 10)}</td>
                    <td className="p-2 text-center">
                      <span className={getEstadoClass(servicio.estado)}>
                        {servicio.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="block md:hidden space-y-4">
            {noFacturadosOrdenados.map((servicio) => (
              <div key={servicio._id} className="bg-surface p-4 rounded shadow-md">
                {esAdmin && (
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(servicio._id)}
                      onChange={() => toggleSeleccion(servicio._id)}
                      className="accent-white w-4 h-4 mr-2"
                    />
                    <span className="text-sm">Seleccionar</span>
                  </div>
                )}
                <p><strong>Guía:</strong> {servicio.numeroGuia}</p>
                <p><strong>Cliente:</strong> {servicio.cliente}</p>
                <p><strong>Fecha Traslado:</strong> {servicio.fechaTraslado?.slice(0, 10)}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={getEstadoClass(servicio.estado)}>
                    {servicio.estado}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecepcionFacturasPage;
