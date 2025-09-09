import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ServicioEditModal from '../components/ServicioEditModal.jsx';
import { HiPencil, HiBan, HiTrash } from 'react-icons/hi';

const ServiciosHistorialPage = () => {
  const { obtenerPorFecha, borrarServicio, anular } = useServicios();
  const { user } = useAuth();

  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [servicioIdSeleccionado, setServicioIdSeleccionado] = useState(null);

  const cargarServicios = async (f) => {
    setLoading(true);
    try {
      const data = await obtenerPorFecha(f);
      const dataOrdenada = [...data].sort((a, b) => {
        const guiaA = a.numeroGuia?.toUpperCase() || '';
        const guiaB = b.numeroGuia?.toUpperCase() || '';
        return guiaA.localeCompare(guiaB, 'es', { numeric: true });
      });
      setServicios(dataOrdenada);
    } catch (error) {
      console.error('Error al cargar servicios por fecha:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios(fecha);
  }, [fecha]);

  const handleAnular = async (id) => {
    const confirmar = confirm('¿Estás seguro de ANULAR este servicio?');
    if (!confirmar) return;
    try {
      await anular(id);
      await cargarServicios(fecha);
      toast.success('Servicio anulado correctamente');
    } catch (error) {
      toast.error('Error al anular el servicio');
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.');
    if (!confirmar) return;
    try {
      await borrarServicio(id);
      await cargarServicios(fecha);
      toast.success('Servicio eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el servicio');
    }
  };

  // 🔹 Normaliza estado (ej: "ANULADA" -> "estado-anulada")
  const getEstadoClass = (estado) => `estado-${estado?.toLowerCase()}`;

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historial de Servicios</h1>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="bg-background border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
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
          <span className="ml-2 text-text-secondary">Cargando servicios...</span>
        </div>
      ) : servicios.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios para esta fecha.</p>
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="hidden md:block overflow-x-auto bg-surface rounded shadow-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-navbar text-text-secondary">
                <tr>
                  <th className="p-2 text-center">Fecha Traslado</th>
                  <th className="p-2 text-center">Cliente</th>
                  <th className="p-2 text-center">Tipo de Carga</th>
                  <th className="p-2 text-center">Guía Transporte</th>
                  <th className="p-2 text-center">Guía Remitente</th>
                  <th className="p-2 text-center">Placa</th>
                  <th className="p-2 text-center">Conductor</th>
                  <th className="p-2 text-center">Contenedor</th>
                  <th className="p-2 text-center">Estado</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                    <td className="p-2 text-center">{s.fechaTraslado?.slice(0, 10)}</td>
                    <td className="p-2 text-center">{s.cliente}</td>
                    <td className="p-2 text-center">{s.tipoCarga}</td>
                    <td className="p-2 text-center">{s.numeroGuia}</td>
                    <td className="p-2 text-center">{s.documentoRelacionado}</td>
                    <td className="p-2 text-center">{s.placaVehiculoPrincipal}</td>
                    <td className="p-2 text-center">{s.nombreConductor}</td>
                    <td className="p-2 text-center">{s.numeroContenedor}</td>
                    <td className="p-2 text-center">
                      <span className={getEstadoClass(s.estado)}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setServicioIdSeleccionado(s._id);
                            setShowModal(true);
                          }}
                          className="bg-highlight text-white p-2 rounded hover:brightness-110"
                          title="Editar"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>

                        {(user?.role === 'Superadministrador' || user?.role === 'Administrador') && (
                          <button
                            onClick={() => handleAnular(s._id)}
                            disabled={s.estado?.toLowerCase() === 'anulada'}
                            className={`p-2 rounded text-white ${
                              s.estado?.toLowerCase() === 'anulada'
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-yellow-500 hover:brightness-110'
                            }`}
                            title="Anular"
                          >
                            <HiBan className="w-4 h-4" />
                          </button>
                        )}

                        {user?.role === 'Superadministrador' && (
                          <button
                            onClick={() => handleEliminar(s._id)}
                            className="bg-button-danger text-white p-2 rounded hover:brightness-110"
                            title="Eliminar"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="block md:hidden space-y-4">
            {servicios.map((s) => (
              <div key={s._id} className="bg-surface p-4 rounded shadow-md">
                <p><strong>Fecha:</strong> {s.fechaTraslado?.slice(0, 10)}</p>
                <p><strong>Cliente:</strong> {s.cliente}</p>
                <p><strong>Carga:</strong> {s.tipoCarga}</p>
                <p><strong>Guía:</strong> {s.numeroGuia}</p>
                <p><strong>Placa:</strong> {s.placaVehiculoPrincipal}</p>
                <p><strong>Conductor:</strong> {s.nombreConductor}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={getEstadoClass(s.estado)}>
                    {s.estado}
                  </span>
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setServicioIdSeleccionado(s._id);
                      setShowModal(true);
                    }}
                    className="bg-highlight text-white p-2 rounded hover:brightness-110"
                    title="Editar"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>

                  {(user?.role === 'Superadministrador' || user?.role === 'Administrador') && (
                    <button
                      onClick={() => handleAnular(s._id)}
                      disabled={s.estado?.toLowerCase() === 'anulada'}
                      className={`p-2 rounded text-white ${
                        s.estado?.toLowerCase() === 'anulada'
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-yellow-500 hover:brightness-110'
                      }`}
                      title="Anular"
                    >
                      <HiBan className="w-4 h-4" />
                    </button>
                  )}

                  {user?.role === 'Superadministrador' && (
                    <button
                      onClick={() => handleEliminar(s._id)}
                      className="bg-button-danger text-white p-2 rounded hover:brightness-110"
                      title="Eliminar"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && servicioIdSeleccionado && (
        <ServicioEditModal
          id={servicioIdSeleccionado}
          onClose={() => {
            setShowModal(false);
            setServicioIdSeleccionado(null);
            cargarServicios(fecha);
          }}
        />
      )}
    </div>
  );
};

export default ServiciosHistorialPage;
